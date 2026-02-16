import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { useAuthStore } from "@/store/auth/auth";
import { useVerifySignupOTP, useResendSMSOTP } from "@/hooks/auth/useAuthMutations";
import { router, Redirect } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Keyboard, TextInput, Animated, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack, Spinner } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";

export default function OTPVerification() {
  const { tempSignupData, setAuth, clearTempSignupData, user, isCitySelected } = useAuthStore();
  const verifyOTPMutation = useVerifySignupOTP();
  const resendOTPMutation = useResendSMSOTP();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Redirect if no temp data
  if (!tempSignupData) {
    return <Redirect href="/(auth)/signup" />;
  }

  // If user is already logged in, route based on profile completion
  if (user) {
    const hasCompletedProfile = Boolean(user.first_name);

    if (!hasCompletedProfile) {
      return <Redirect href="/(auth)/info" />;
    } else if (!isCitySelected) {
      return <Redirect href="/(auth)/city-page" />;
    } else {
      return <Redirect href="/(tabs)/(home)" />;
    }
  }

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error on input

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 4 digits entered
    if (index === 3 && value) {
      const completeOtp = [...newOtp];
      completeOtp[3] = value;
      if (completeOtp.every((digit) => digit !== "")) {
        Keyboard.dismiss();
        handleVerify(completeOtp.join(""));
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = () => {
    return otp.every((digit) => digit !== "");
  };

  const handleVerify = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join("");

    if (otpCode.length !== 4) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Please enter complete OTP");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    verifyOTPMutation.mutate(
      {
        phone_number: tempSignupData.phone_number,
        password: tempSignupData.password,
        email: tempSignupData.email,
        otp: otpCode,
      },
      {
        onSuccess: (data) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Store auth tokens and user
          setAuth({
            user: data.user,
            id_token: data.id_token,
            refresh_token: data.refresh_token,
          });

          // Clear temp signup data
          clearTempSignupData();

          // Navigate to info screen
          router.replace("/(auth)/info");
        },
        onError: (error: any) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

          // Clear OTP on error
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();

          const errorMessage =
            error?.response?.data?.detail?.message ||
            error?.message ||
            "Invalid OTP. Please try again.";
          setError(errorMessage);
        },
      }
    );
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    resendOTPMutation.mutate(
      {
        phone_number: tempSignupData.phone_number,
        password: tempSignupData.password,
        email: tempSignupData.email,
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setResendTimer(60);
          setOtp(["", "", "", ""]);
          setError("");
          inputRefs.current[0]?.focus();
        },
        onError: (error: any) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          const errorMessage =
            error?.response?.data?.detail?.message ||
            error?.message ||
            "Failed to resend OTP";
          setError(errorMessage);
        },
      }
    );
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    // Remove +91 if present
    const cleaned = phone.replace("+91", "");
    // Format as XXXXX XXXXX
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#FFFFFF"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <YStack flex={1}>
        <XStack
          justifyContent="space-between"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(16)}
        >
          <BackButton onPress={() => router.back()} />
        </XStack>

        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingHorizontal: wp(16), paddingTop: hp(24) }}
          extraScrollHeight={60}
          enableResetScrollToCoords={false}
        >
          <YStack gap={hp(32)}>
              {/* Header */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <YStack gap={hp(8)}>
                  <Heading1>Enter OTP</Heading1>
                  <Text fontSize={fp(14)} color="#6C6C89" lineHeight={hp(20)}>
                    We've sent a 4-digit code to {"\n"}
                    <Text fontWeight="600" color="#121217">
                      +91 {formatPhoneNumber(tempSignupData.phone_number)}
                    </Text>
                  </Text>
                </YStack>
              </Animated.View>

              {/* OTP Input */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <YStack gap={hp(16)}>
                  <XStack gap={wp(12)} justifyContent="center">
                    {otp.map((digit, index) => (
                      <YStack
                        key={index}
                        backgroundColor="#FFFFFF"
                        borderWidth={1.5}
                        borderColor={
                          error
                            ? "#F44336"
                            : digit
                            ? "#121217"
                            : "#E5E7EB"
                        }
                        borderRadius={hp(12)}
                        width={wp(64)}
                        height={hp(64)}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <TextInput
                          ref={(ref) => {
                            inputRefs.current[index] = ref;
                          }}
                          style={{
                            fontSize: fp(24),
                            fontWeight: "600",
                            color: "#121217",
                            textAlign: "center",
                            width: "100%",
                            height: "100%",
                          }}
                          value={digit}
                          onChangeText={(value) => handleOtpChange(value, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                        />
                      </YStack>
                    ))}
                  </XStack>

                  {error && (
                    <Animated.View>
                      <Text
                        fontSize={fp(13)}
                        color="#F44336"
                        textAlign="center"
                      >
                        {error}
                      </Text>
                    </Animated.View>
                  )}
                </YStack>
              </Animated.View>

              {/* Resend OTP */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                }}
              >
                <XStack justifyContent="center" alignItems="center" gap={wp(4)}>
                  <Text fontSize={fp(14)} color="#6C6C89">
                    Didn't receive the code?
                  </Text>
                  {resendTimer > 0 ? (
                    <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                      Resend in {resendTimer}s
                    </Text>
                  ) : (
                    <TouchableWithoutFeedback onPress={handleResendOTP}>
                      <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                        {resendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
                      </Text>
                    </TouchableWithoutFeedback>
                  )}
                </XStack>
              </Animated.View>

              {/* Verify Button */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  marginTop: "auto",
                  paddingBottom: hp(24),
                }}
              >
                <Button
                  size="lg"
                  width="100%"
                  onPress={() => handleVerify()}
                  disabled={!isOtpComplete() || verifyOTPMutation.isPending}
                  opacity={!isOtpComplete() || verifyOTPMutation.isPending ? 0.5 : 1}
                >
                  <XStack alignItems="center" gap={wp(8)} justifyContent="center">
                    {verifyOTPMutation.isPending ? (
                      <Spinner color="white" />
                    ) : (
                      <Text fontSize={fp(16)} fontWeight="600" color="#FFF">
                        Verify & Continue
                      </Text>
                    )}
                  </XStack>
                </Button>
              </Animated.View>
        </YStack>
        </KeyboardAwareScrollView>
      </YStack>
    </SafeAreaView>
  );
}
