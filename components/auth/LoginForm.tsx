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
  View,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { ChevronDown, X, Eye, EyeOff, Lock, Phone } from "lucide-react-native";
import { router } from "expo-router";
import {
  useLogin,
  useRequestLoginOTP,
  useVerifyLoginOTP,
} from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";
import { AnimatedFormField } from "@/components/ui/AnimatedFormField";
import * as Haptics from "expo-haptics";

const OTP_LENGTH = 4;
const RESEND_COUNTDOWN = 30;

// ─── Schemas ────────────────────────────────────────────────────────────────

const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
});

const PasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type PhoneFormData = z.infer<typeof PhoneSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

// ─── OTP input row ───────────────────────────────────────────────────────────

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

// ─── Main LoginForm ──────────────────────────────────────────────────────────

export function LoginForm() {
  // "otp" | "password"
  const [mode, setMode] = useState<"otp" | "password">("otp");
  // OTP flow steps: "phone" | "otp"
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, setIsCitySelected, setIsVerified, isCitySelected } = useAuthStore();

  const requestOTPMutation = useRequestLoginOTP();
  const verifyOTPMutation = useVerifyLoginOTP();
  const loginMutation = useLogin();

  // Phone-only form (OTP flow step 1 + password flow)
  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isValid: isPhoneValid },
    getValues: getPhoneValues,
    setValue: setPhoneValue,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(PhoneSchema),
    mode: "onChange",
  });

  // Password form
  const {
    control: pwControl,
    handleSubmit: handlePwSubmit,
    formState: { errors: pwErrors, isValid: isPwValid },
    setValue: setPwValue,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
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

  const handleSendOTP = ({ phoneNumber }: PhoneFormData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    requestOTPMutation.mutate(
      { phone_number: `+91${phoneNumber}` },
      {
        onSuccess: () => {
          setOtpDigits(Array(OTP_LENGTH).fill(""));
          setOtpError("");
          setOtpStep("otp");
          startCountdown();
        },
      }
    );
  };

  const handleVerifyOTP = () => {
    const otp = otpDigits.join("");
    if (otp.length !== OTP_LENGTH) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const phone = `+91${getPhoneValues("phoneNumber")}`;
    verifyOTPMutation.mutate(
      { phone_number: phone, otp },
      {
        onSuccess: (data) => {
          setAuth({ user: data.user, id_token: data.id_token, refresh_token: data.refresh_token });
          const hasProfile = Boolean(data.user.first_name);
          if (!hasProfile) { setIsVerified(false); setIsCitySelected(false); router.replace("/(auth)/info"); }
          else if (!isCitySelected) { setIsVerified(true); router.replace("/(auth)/city-page"); }
          else { setIsVerified(true); router.replace("/(tabs)/(home)"); }
        },
        onError: () => setOtpError("Invalid or expired OTP. Please try again."),
      }
    );
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    const phone = getPhoneValues("phoneNumber");
    requestOTPMutation.mutate(
      { phone_number: `+91${phone}` },
      {
        onSuccess: () => { setOtpDigits(Array(OTP_LENGTH).fill("")); setOtpError(""); startCountdown(); },
      }
    );
  };

  const handlePasswordLogin = ({ phoneNumber, password }: PasswordFormData) => {
    loginMutation.mutate(
      { phone_number: `+91${phoneNumber}`, password },
      {
        onSuccess: (data) => {
          setAuth({ user: data.user, id_token: data.id_token, refresh_token: data.refresh_token });
          const hasProfile = Boolean(data.user.first_name);
          if (!hasProfile) { setIsVerified(false); setIsCitySelected(false); router.replace("/(auth)/info"); }
          else if (!isCitySelected) { setIsVerified(true); router.replace("/(auth)/city-page"); }
          else { setIsVerified(true); router.replace("/(tabs)/(home)"); }
        },
      }
    );
  };

  const getApiError = () => {
    const err = (requestOTPMutation.error || verifyOTPMutation.error || loginMutation.error) as any;
    if (!err) return null;
    const detail = err?.response?.data?.detail;
    if (detail?.message) {
      if (detail.message.includes("No account found")) return "No account found with this number. Please sign up.";
      if (detail.message.includes("Incorrect username or password")) return "Incorrect phone number or password.";
      return detail.message;
    }
    if (err?.message === "Network Error") return "Network error. Please check your connection.";
    return "Something went wrong. Please try again.";
  };

  const apiError = getApiError();

  // ── Phone input (shared) ──
  const PhoneInput = ({ fieldName, control, errors, focused, setFocused, onClear }: any) => (
    <YStack gap="$2">
      <Text fontSize={fp(14)} fontWeight="500" color="#121217" lineHeight={hp(19)}>
        Mobile Number <Text color="#FF4444">*</Text>
      </Text>
      <XStack gap={wp(12)}>
        <XStack
          alignItems="center"
          borderWidth={1}
          borderColor={focused ? "#6D00DA" : "#d1d1db"}
          borderRadius={wp(8)}
          padding={wp(8)}
          paddingVertical={hp(8)}
          backgroundColor="white"
        >
          <Image source={require("@/assets/images/Flags.png")} style={{ height: hp(16), width: wp(16), borderRadius: wp(20) }} />
          <BodySmall color="#121217" marginLeft="$2">+91</BodySmall>
          <ChevronDown color="#8A8AA3" height={hp(18)} width={wp(18)} />
        </XStack>
        <Controller
          control={control}
          name={fieldName}
          render={({ field: { onChange, onBlur, value } }) => (
            <XStack
              flex={1}
              borderWidth={1}
              borderColor={focused ? "#6D00DA" : "#d1d1db"}
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
                onFocus={() => setFocused(true)}
                onBlur={() => { setFocused(false); onBlur(); }}
                placeholderTextColor="#8A8AA3"
                style={{ flex: 1, padding: wp(8), paddingVertical: hp(10), fontSize: fp(14), color: "#121217" }}
              />
              {value ? (
                <TouchableOpacity onPress={() => { onClear(); onChange(""); }} style={{ padding: wp(4) }}>
                  <X color="#999" size={hp(16)} />
                </TouchableOpacity>
              ) : null}
            </XStack>
          )}
        />
      </XStack>
      {errors[fieldName] && <BodySmall color="#ef4444">{errors[fieldName]?.message}</BodySmall>}
    </YStack>
  );

  // ─── OTP Mode ──────────────────────────────────────────────────────────────
  if (mode === "otp") {
    if (otpStep === "phone") {
      return (
        <YStack gap="$5">
          <YStack gap="$4" paddingBottom="$2">
            <PhoneInput
              fieldName="phoneNumber"
              control={phoneControl}
              errors={phoneErrors}
              focused={isPhoneFocused}
              setFocused={setIsPhoneFocused}
              onClear={() => setPhoneValue("phoneNumber", "")}
            />
            {apiError && (
              <YStack backgroundColor="#FEE2E2" borderColor="#EF4444" borderWidth={0.5} borderRadius={wp(8)} padding={wp(12)}>
                <BodySmall color="#DC2626" textAlign="center">{apiError}</BodySmall>
              </YStack>
            )}
          </YStack>

          <Button
            size="lg"
            width="100%"
            onPress={handlePhoneSubmit(handleSendOTP)}
            backgroundColor="#7B2CBF"
            borderRadius={wp(12)}
            disabled={!isPhoneValid || requestOTPMutation.isPending}
            opacity={requestOTPMutation.isPending || !isPhoneValid ? 0.7 : 1}
          >
            <XStack alignItems="center" gap="$2" justifyContent="center">
              {requestOTPMutation.isPending ? <Spinner color="white" /> : <Text fontSize={16} fontWeight="600" color="#FFF">Send OTP</Text>}
            </XStack>
          </Button>

          <Pressable onPress={() => { setMode("password"); setOtpStep("phone"); }} style={{ alignItems: "center" }}>
            <Text fontSize={fp(13)} color="#6C6C89">
              Use password instead{" "}
              <Text color="#6D00DA" fontWeight="600">Login with password</Text>
            </Text>
          </Pressable>
        </YStack>
      );
    }

    // OTP step 2 — enter code
    const phone = getPhoneValues("phoneNumber");
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
              onPress={() => { setOtpStep("phone"); setOtpDigits(Array(OTP_LENGTH).fill("")); setOtpError(""); requestOTPMutation.reset(); verifyOTPMutation.reset(); }}
            >
              Change
            </Text>
          </Text>
        </YStack>

        <OTPRow value={otpDigits} onChange={(v) => { setOtpDigits(v); setOtpError(""); }} hasError={!!otpError} />

        {otpError ? (
          <BodySmall color="#EF4444">{otpError}</BodySmall>
        ) : null}

        {/* Resend */}
        <XStack alignItems="center" gap={wp(4)}>
          <BodySmall color="#6C6C89">Didn't get the OTP?</BodySmall>
          {countdown > 0 ? (
            <BodySmall color="#9CA3AF">Resend in {countdown}s</BodySmall>
          ) : (
            <TouchableOpacity onPress={handleResendOTP} disabled={requestOTPMutation.isPending}>
              <BodySmall color="#6D00DA" fontWeight="$600">
                {requestOTPMutation.isPending ? "Sending…" : "Resend OTP"}
              </BodySmall>
            </TouchableOpacity>
          )}
        </XStack>

        {apiError && !otpError && (
          <YStack backgroundColor="#FEE2E2" borderColor="#EF4444" borderWidth={0.5} borderRadius={wp(8)} padding={wp(12)}>
            <BodySmall color="#DC2626" textAlign="center">{apiError}</BodySmall>
          </YStack>
        )}

        <Button
          size="lg"
          width="100%"
          onPress={handleVerifyOTP}
          backgroundColor="#7B2CBF"
          borderRadius={wp(12)}
          disabled={otpDigits.join("").length !== OTP_LENGTH || verifyOTPMutation.isPending}
          opacity={otpDigits.join("").length !== OTP_LENGTH || verifyOTPMutation.isPending ? 0.7 : 1}
        >
          <XStack alignItems="center" gap="$2" justifyContent="center">
            {verifyOTPMutation.isPending ? <Spinner color="white" /> : <Text fontSize={16} fontWeight="600" color="#FFF">Verify & Login</Text>}
          </XStack>
        </Button>

        <Pressable onPress={() => setMode("password")} style={{ alignItems: "center" }}>
          <Text fontSize={fp(13)} color="#6C6C89">
            Use password instead{" "}
            <Text color="#6D00DA" fontWeight="600">Login with password</Text>
          </Text>
        </Pressable>
      </YStack>
    );
  }

  // ─── Password Mode ─────────────────────────────────────────────────────────
  return (
    <YStack gap="$5">
      <YStack gap="$4" paddingBottom="$3">
        <PhoneInput
          fieldName="phoneNumber"
          control={pwControl}
          errors={pwErrors}
          focused={isPhoneFocused}
          setFocused={setIsPhoneFocused}
          onClear={() => setPwValue("phoneNumber", "")}
        />
        <YStack gap="$2">
          <Controller
            control={pwControl}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AnimatedFormField
                label="Password *"
                value={value || ""}
                onChangeText={onChange}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                error={pwErrors.password?.message}
                leftIcon={<Lock size={hp(20)} color="#9E9E9E" />}
                rightIcon={showPassword ? <EyeOff size={hp(20)} color="#9E9E9E" /> : <Eye size={hp(20)} color="#9E9E9E" />}
                onRightIconPress={() => { setShowPassword(!showPassword); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              />
            )}
          />
        </YStack>
        {apiError && (
          <YStack backgroundColor="#FEE2E2" borderColor="#EF4444" borderWidth={0.5} borderRadius={wp(8)} padding={wp(12)} marginTop={hp(4)}>
            <BodySmall color="#DC2626" textAlign="center">{apiError}</BodySmall>
          </YStack>
        )}
      </YStack>

      <Button
        size="lg"
        width="100%"
        onPress={handlePwSubmit(handlePasswordLogin)}
        backgroundColor="#7B2CBF"
        borderRadius={wp(12)}
        disabled={!isPwValid || loginMutation.isPending}
        opacity={loginMutation.isPending || !isPwValid ? 0.7 : 1}
      >
        <XStack alignItems="center" gap="$2" justifyContent="center">
          {loginMutation.isPending ? <Spinner color="white" /> : <Text fontSize={16} fontWeight="600" color="#FFF">Login</Text>}
        </XStack>
      </Button>

      <Pressable onPress={() => { setMode("otp"); setOtpStep("phone"); loginMutation.reset(); }} style={{ alignItems: "center" }}>
        <Text fontSize={fp(13)} color="#6C6C89">
          Login faster with{" "}
          <Text color="#6D00DA" fontWeight="600">OTP instead</Text>
        </Text>
      </Pressable>
    </YStack>
  );
}
