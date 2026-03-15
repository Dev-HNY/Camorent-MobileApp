import React, { useState, useRef, useEffect } from "react";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { Button } from "@/components/ui/Button";
import { BodySmall } from "@/components/ui/Typography";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { ChevronDown, X } from "lucide-react-native";
import { router } from "expo-router";
import {
  useRequestLoginOTP,
  useVerifyLoginOTP,
  useSignupWithSMS,
  useVerifySignupOTP,
} from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";
import * as Haptics from "expo-haptics";

const OTP_LENGTH = 4;
const RESEND_COUNTDOWN = 30;

// ─── Schema ──────────────────────────────────────────────────────────────────

const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
});

type PhoneFormData = z.infer<typeof PhoneSchema>;

// Generate a stable throwaway password for new-user signup
const makeSignupPassword = (phone: string) =>
  `Cam@${phone.slice(-4)}!2024`;

// ─── OTP input row ────────────────────────────────────────────────────────────

function OTPRow({
  value,
  onChange,
  hasError,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
}) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [hasError]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleChange = (text: string, idx: number) => {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!digits.length) return;
      const next = [...value];
      for (let i = 0; i < digits.length && idx + i < OTP_LENGTH; i++) next[idx + i] = digits[i];
      onChange(next);
      const focusIdx = Math.min(idx + digits.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }
    if (text && !/^\d$/.test(text)) return;
    const next = [...value];
    next[idx] = text;
    onChange(next);
    if (text && idx + 1 < OTP_LENGTH) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === "Backspace") {
      const next = [...value];
      next[idx] = "";
      onChange(next);
      if (idx > 0) inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <XStack gap={wp(10)} justifyContent="flex-start">
        {value.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(r) => { inputRefs.current[idx] = r; }}
            value={digit}
            onChangeText={(t) => handleChange(t, idx)}
            onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, idx)}
            keyboardType="numeric"
            maxLength={OTP_LENGTH}
            autoComplete="sms-otp"
            textContentType="oneTimeCode"
            style={{
              width: wp(54),
              height: hp(54),
              borderRadius: wp(12),
              borderWidth: hasError ? 2 : 1.5,
              borderColor: hasError ? "#EF4444" : digit ? "#6D00DA" : "#D1D1DB",
              textAlign: "center",
              fontSize: fp(18),
              fontWeight: "700",
              color: "#121217",
              backgroundColor: digit ? "#F5EDFF" : "#FAFAFA",
            }}
          />
        ))}
      </XStack>
    </Animated.View>
  );
}

// ─── Main LoginForm ───────────────────────────────────────────────────────────

export function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  // "login" = existing user OTP flow, "signup" = new user signup OTP flow
  const [flowType, setFlowType] = useState<"login" | "signup">("login");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { setAuth, setIsCitySelected, setIsVerified, isCitySelected } = useAuthStore();
  const requestOTPMutation = useRequestLoginOTP();
  const verifyOTPMutation = useVerifyLoginOTP();
  const signupMutation = useSignupWithSMS();
  const verifySignupMutation = useVerifySignupOTP();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(PhoneSchema),
    mode: "onChange",
  });

  const startCountdown = () => {
    setCountdown(RESEND_COUNTDOWN);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(countdownRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const goToOTPStep = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setStep("otp");
    startCountdown();
  };

  const handleSendOTP = ({ phoneNumber }: PhoneFormData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const phone = `+91${phoneNumber}`;

    // Try login-otp first; if user not found (404), fall back to signup-sms-otp
    requestOTPMutation.mutate(
      { phone_number: phone },
      {
        onSuccess: () => {
          setFlowType("login");
          goToOTPStep();
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const errorCode = err?.response?.data?.detail?.error;
          if (status === 404 || errorCode === "user_not_found") {
            // New user — use signup flow with generated credentials
            const password = makeSignupPassword(phoneNumber);
            const email = `${phoneNumber}@camorent.app`;
            signupMutation.mutate(
              { phone_number: phone, password, email },
              {
                onSuccess: () => {
                  setFlowType("signup");
                  goToOTPStep();
                },
              }
            );
          }
        },
      }
    );
  };

  const handleVerifyOTP = () => {
    const otp = otpDigits.join("");
    if (otp.length !== OTP_LENGTH) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const phoneNumber = getValues("phoneNumber");
    const phone = `+91${phoneNumber}`;

    const onSuccess = (data: any) => {
      setAuth({ user: data.user, id_token: data.id_token, refresh_token: data.refresh_token });
      const hasProfile = Boolean(data.user?.first_name);
      if (!hasProfile) {
        setIsVerified(false);
        setIsCitySelected(false);
        router.replace("/(auth)/info");
      } else if (!isCitySelected) {
        setIsVerified(true);
        router.replace("/(auth)/city-page");
      } else {
        setIsVerified(true);
        router.replace("/(tabs)/(home)");
      }
    };

    const onError = () => setOtpError("Invalid or expired OTP. Please try again.");

    if (flowType === "login") {
      verifyOTPMutation.mutate({ phone_number: phone, otp }, { onSuccess, onError });
    } else {
      const password = makeSignupPassword(phoneNumber);
      const email = `${phoneNumber}@camorent.app`;
      verifySignupMutation.mutate({ phone_number: phone, otp, password, email }, { onSuccess, onError });
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    const phoneNumber = getValues("phoneNumber");
    const phone = `+91${phoneNumber}`;
    if (flowType === "login") {
      requestOTPMutation.mutate(
        { phone_number: phone },
        { onSuccess: () => { setOtpDigits(Array(OTP_LENGTH).fill("")); setOtpError(""); startCountdown(); } }
      );
    } else {
      const password = makeSignupPassword(phoneNumber);
      const email = `${phoneNumber}@camorent.app`;
      signupMutation.mutate(
        { phone_number: phone, password, email },
        { onSuccess: () => { setOtpDigits(Array(OTP_LENGTH).fill("")); setOtpError(""); startCountdown(); } }
      );
    }
  };

  const isSendingOTP = requestOTPMutation.isPending || signupMutation.isPending;
  const isVerifying = verifyOTPMutation.isPending || verifySignupMutation.isPending;

  const getApiError = () => {
    const err = (signupMutation.error || verifyOTPMutation.error || verifySignupMutation.error) as any;
    // Don't show requestOTP errors — 404 is handled silently via signup fallback
    if (!err) return null;
    const detail = err?.response?.data?.detail;
    if (detail?.message) return detail.message;
    if (err?.message === "Network Error") return "Network error. Please check your connection.";
    return "Something went wrong. Please try again.";
  };

  const apiError = getApiError();

  // ── Step 1: Phone input ──
  if (step === "phone") {
    return (
      <YStack gap="$5">
        <YStack gap="$4" paddingBottom="$2">
          <YStack gap="$2">
            <Text fontSize={fp(14)} fontWeight="500" color="#121217" lineHeight={hp(19)}>
              Mobile Number <Text color="#FF4444">*</Text>
            </Text>
            <XStack gap={wp(12)}>
              {/* Country code */}
              <XStack
                alignItems="center"
                borderWidth={1}
                borderColor={isPhoneFocused ? "#6D00DA" : "#d1d1db"}
                borderRadius={wp(8)}
                padding={wp(8)}
                paddingVertical={hp(8)}
                backgroundColor="white"
              >
                <Image
                  source={require("@/assets/images/Flags.png")}
                  style={{ height: hp(16), width: wp(16), borderRadius: wp(20) }}
                />
                <BodySmall color="#121217" marginLeft="$2">+91</BodySmall>
                <ChevronDown color="#8A8AA3" height={hp(18)} width={wp(18)} />
              </XStack>

              {/* Phone input */}
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <XStack
                    flex={1}
                    borderWidth={1}
                    borderColor={isPhoneFocused ? "#6D00DA" : "#d1d1db"}
                    borderRadius={wp(8)}
                    backgroundColor="white"
                    alignItems="center"
                    paddingRight={value ? wp(8) : 0}
                  >
                    <TextInput
                      keyboardType="phone-pad"
                      placeholder="99998 99999"
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => { setIsPhoneFocused(false); onBlur(); }}
                      placeholderTextColor="#8A8AA3"
                      style={{
                        flex: 1,
                        padding: wp(8),
                        paddingVertical: hp(10),
                        fontSize: fp(14),
                        color: "#121217",
                      }}
                    />
                    {value ? (
                      <TouchableOpacity
                        onPress={() => { setValue("phoneNumber", ""); onChange(""); }}
                        style={{ padding: wp(4) }}
                      >
                        <X color="#999" size={hp(16)} />
                      </TouchableOpacity>
                    ) : null}
                  </XStack>
                )}
              />
            </XStack>
            {errors.phoneNumber && (
              <BodySmall color="#ef4444">{errors.phoneNumber.message}</BodySmall>
            )}
            <BodySmall color="#8A8AA3">We will send an OTP to this number</BodySmall>
          </YStack>

          {apiError && (
            <YStack
              backgroundColor="#FEE2E2"
              borderColor="#EF4444"
              borderWidth={0.5}
              borderRadius={wp(8)}
              padding={wp(12)}
            >
              <BodySmall color="#DC2626" textAlign="center">{apiError}</BodySmall>
            </YStack>
          )}
        </YStack>

        <Button
          size="lg"
          width="100%"
          onPress={handleSubmit(handleSendOTP)}
          backgroundColor="#7B2CBF"
          borderRadius={wp(12)}
          disabled={!isValid || isSendingOTP}
          opacity={isSendingOTP || !isValid ? 0.7 : 1}
        >
          <XStack alignItems="center" gap="$2" justifyContent="center">
            {isSendingOTP
              ? <Spinner color="white" />
              : <Text fontSize={16} fontWeight="600" color="#FFF">Get OTP</Text>
            }
          </XStack>
        </Button>
      </YStack>
    );
  }

  // ── Step 2: OTP entry ──
  const phone = getValues("phoneNumber");
  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <Text fontSize={fp(14)} fontWeight="600" color="#121217">Enter OTP</Text>
        <Text fontSize={fp(13)} color="#6C6C89">
          We sent a {OTP_LENGTH}-digit code to{" "}
          <Text color="#121217" fontWeight="600">+91 {phone}</Text>
          {"  "}
          <Text
            color="#6D00DA"
            fontWeight="500"
            onPress={() => {
              setStep("phone");
              setOtpDigits(Array(OTP_LENGTH).fill(""));
              setOtpError("");
              requestOTPMutation.reset();
              verifyOTPMutation.reset();
              signupMutation.reset();
              verifySignupMutation.reset();
            }}
          >
            Change
          </Text>
        </Text>
      </YStack>

      <OTPRow
        value={otpDigits}
        onChange={(v) => { setOtpDigits(v); setOtpError(""); }}
        hasError={!!otpError}
      />

      {otpError ? <BodySmall color="#EF4444">{otpError}</BodySmall> : null}

      {/* Resend */}
      <XStack alignItems="center" gap={wp(4)}>
        <BodySmall color="#6C6C89">Didn't get the OTP?</BodySmall>
        {countdown > 0 ? (
          <BodySmall color="#9CA3AF">Resend in {countdown}s</BodySmall>
        ) : (
          <TouchableOpacity onPress={handleResendOTP} disabled={isSendingOTP}>
            <BodySmall color="#6D00DA" fontWeight="$600">
              {isSendingOTP ? "Sending…" : "Resend OTP"}
            </BodySmall>
          </TouchableOpacity>
        )}
      </XStack>

      {apiError && !otpError && (
        <YStack
          backgroundColor="#FEE2E2"
          borderColor="#EF4444"
          borderWidth={0.5}
          borderRadius={wp(8)}
          padding={wp(12)}
        >
          <BodySmall color="#DC2626" textAlign="center">{apiError}</BodySmall>
        </YStack>
      )}

      <Button
        size="lg"
        width="100%"
        onPress={handleVerifyOTP}
        backgroundColor="#7B2CBF"
        borderRadius={wp(12)}
        disabled={otpDigits.join("").length !== OTP_LENGTH || isVerifying}
        opacity={otpDigits.join("").length !== OTP_LENGTH || isVerifying ? 0.7 : 1}
      >
        <XStack alignItems="center" gap="$2" justifyContent="center">
          {isVerifying
            ? <Spinner color="white" />
            : <Text fontSize={16} fontWeight="600" color="#FFF">Verify & Continue</Text>
          }
        </XStack>
      </Button>
    </YStack>
  );
}
