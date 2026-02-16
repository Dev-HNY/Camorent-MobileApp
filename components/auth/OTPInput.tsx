import React, { useState, useRef, useEffect } from "react";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { Button } from "@/components/ui/Button";
import { BodySmall, Heading2 } from "@/components/ui/Typography";
import {
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
  Animated,
} from "react-native";
import { hp, wp, fp } from "@/utils/responsive";
import RNOtpVerify from "react-native-otp-verify";
import * as Haptics from "expo-haptics";

const OTP_LENGTH = 6;

const COLORS = {
  primary: "#6D00DA",
  error: "#f44336",
  border: "#e0e0e0",
  focusedBackground: "#F8F9FA",
  background: "#fff",
  success: "#17663A",
  placeholder: "#999",
} as const;

interface OTPInputProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string | undefined;
  resendError?: string;
  countdown: number;
  canResend: boolean;
}

export function OTPInput({
  onSubmit,
  onResend,
  isLoading = false,
  isResending = false,
  error,
  resendError,
  countdown,
  canResend,
}: OTPInputProps) {
  const [otpFields, setOtpFields] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animation refs for each input field
  const scaleAnims = useRef(
    Array(OTP_LENGTH)
      .fill(0)
      .map(() => new Animated.Value(1))
  ).current;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const errorOpacityAnim = useRef(new Animated.Value(0)).current;

  const handlePaste = (text: string, index: number) => {
    const pastedDigits = text.replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (pastedDigits.length === 0) return;

    const newOtpFields = [...otpFields];

    for (let i = 0; i < pastedDigits.length && index + i < OTP_LENGTH; i++) {
      newOtpFields[index + i] = pastedDigits[i];
    }

    setOtpFields(newOtpFields);

    const nextEmptyIndex = newOtpFields.findIndex(
      (digit, idx) => idx > index && !digit
    );
    const focusIndex =
      nextEmptyIndex !== -1
        ? nextEmptyIndex
        : Math.min(index + pastedDigits.length, OTP_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  };

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      handlePaste(text, index);
      return;
    }

    if (text && !/^\d$/.test(text)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const newOtpFields = [...otpFields];
    newOtpFields[index] = text;
    setOtpFields(newOtpFields);

    // Haptic feedback and scale animation
    if (text) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    if (text && index + 1 < OTP_LENGTH) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const key = e.nativeEvent.key;

    if (key === "Backspace") {
      const newOtpFields = [...otpFields];
      newOtpFields[index] = "";
      setOtpFields(newOtpFields);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }
  };

  const handleVerify = () => {
    const otp = otpFields.join("");
    if (otp.length === OTP_LENGTH) {
      onSubmit(otp);
    }
  };

  const formatTime = (sec: number) => `${sec < 10 ? `0${sec}` : sec}`;

  const isVerifyDisabled =
    otpFields.join("").length !== OTP_LENGTH || isLoading;

  // Error shake animation
  useEffect(() => {
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(errorOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(errorOpacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  useEffect(() => {
    inputRefs.current[0]?.focus();

    if (Platform.OS === "android") {
      RNOtpVerify.getHash()
        .then((hash) => {
          console.log("SMS Hash:", hash);
        })
        .catch((error) => console.log("Error getting hash:", error));

      RNOtpVerify.getOtp()
        .then(() => {
          RNOtpVerify.addListener(handleSmsReceived);
        })
        .catch((error) => console.log("Error starting OTP listener:", error));

      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, []);

  const handleSmsReceived = (message: string) => {
    try {
      const otpMatch = /(\d{6})/g.exec(message);

      if (otpMatch && otpMatch[1]) {
        const otp = otpMatch[1];
        const newOtpFields = otp.split("");
        setOtpFields(newOtpFields);

        // Auto-submit after filling
        // onSubmit(otp);
      }

      RNOtpVerify.removeListener();
    } catch (error) {
      console.log("Error processing SMS:", error);
    }
  };

  return (
    <YStack gap="$5">
      <YStack gap="$3">
        <XStack>
          <Heading2 lineHeight={25}>Enter OTP</Heading2>
        </XStack>
        <BodySmall color="$textSecondary">
          We&apos;ve sent a {OTP_LENGTH}-digit code to your email
        </BodySmall>
      </YStack>

      <YStack gap="$3">
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <XStack justifyContent="flex-start" alignItems="center" gap="$2">
            {otpFields.map((value, index) => {
              const isFocused = focusedIndex === index;
              return (
                <Animated.View
                  key={index}
                  style={{
                    transform: [{ scale: scaleAnims[index] }],
                  }}
                >
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={value}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => {
                      setFocusedIndex(index);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="numeric"
                    maxLength={OTP_LENGTH}
                    style={{
                      borderWidth: isFocused ? 2 : 1,
                      borderColor: error
                        ? COLORS.error
                        : isFocused
                        ? COLORS.primary
                        : COLORS.border,
                      borderRadius: wp(8),
                      width: wp(48),
                      height: hp(48),
                      textAlign: "center",
                      fontSize: fp(14),
                      fontWeight: "500",
                      backgroundColor: isFocused
                        ? COLORS.focusedBackground
                        : COLORS.background,
                    }}
                    placeholderTextColor={COLORS.placeholder}
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                  />
                </Animated.View>
              );
            })}
          </XStack>
        </Animated.View>

        {error && (
          <Animated.View style={{ opacity: errorOpacityAnim }}>
            <BodySmall color="$error" textAlign="left">
              {error}
            </BodySmall>
          </Animated.View>
        )}

        {canResend ? (
          <XStack justifyContent="flex-start" alignItems="center" gap="$2">
            <BodySmall color="$textSecondary">
              Didn&apos;t get an OTP?
            </BodySmall>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onResend();
              }}
              disabled={!canResend || isResending}
              style={{ opacity: !canResend || isResending ? 0.5 : 1 }}
            >
              <BodySmall fontWeight="$600" color={COLORS.primary}>
                {isResending ? "Resending..." : "Resend OTP"}
              </BodySmall>
            </TouchableOpacity>
          </XStack>
        ) : (
          <BodySmall color="$textSecondary" textAlign="left">
            OTP Sent. Retry in{" "}
            <Text color={COLORS.success}>{formatTime(countdown)} seconds</Text>
          </BodySmall>
        )}

        {resendError && (
          <BodySmall color="$error" textAlign="left">
            {resendError}
          </BodySmall>
        )}
      </YStack>

      <XStack>
        <Button
          size="lg"
          width="100%"
          onPress={handleVerify}
          disabled={isVerifyDisabled}
          opacity={isVerifyDisabled ? 0.8 : 1}
        >
          {isLoading ? <Spinner color="white" /> : "Verify & Continue"}
        </Button>
      </XStack>
    </YStack>
  );
}
