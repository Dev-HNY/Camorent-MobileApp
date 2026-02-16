import React, { useState } from "react";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { Button } from "@/components/ui/Button";
import { BodySmall, BodyText } from "@/components/ui/Typography";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { ChevronDown, X, Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import { useSignupWithSMS } from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";
import { AnimatedFormField } from "@/components/ui/AnimatedFormField";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import * as Haptics from "expo-haptics";

type SignupFormData = {
  email: string;
  password: string;
  phoneNumber: string;
};

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, "Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
});

export function SignupForm() {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const singupMutation = useSignupWithSMS();
  const { setTempSignupData } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const handleFormSubmit = (data: SignupFormData) => {
    singupMutation.mutate(
      {
        email: data.email,
        password: data.password,
        phone_number: data.phoneNumber, // Just 10 digits, backend will normalize
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          // Store signup data for OTP verification
          setTempSignupData({
            phone_number: data.phoneNumber,
            password: data.password,
            email: data.email,
          });

          // Navigate to OTP verification screen
          router.push("/(auth)/otp-verification");
        },
        onError: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
      }
    );
  };

  const apiError = singupMutation.error
    ? (singupMutation.error as any)?.response?.data?.detail?.message ||
      singupMutation.error.message ||
      "Failed to send OTP. Please try again."
    : null;

  return (
    <YStack gap="$5">
      <YStack>
        <BodyText color="#666" textAlign="left">
          Enter your details to create your account and keep your rentals
          secure.
        </BodyText>
      </YStack>

      <YStack gap="$4" paddingBottom="$3">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AnimatedFormField
              label="Email *"
              value={value || ""}
              onChangeText={onChange}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon={<Mail size={hp(20)} color="#9E9E9E" />}
            />
          )}
        />

        <YStack gap="$2">
          <Text
            fontSize={fp(14)}
            fontWeight="500"
            color="#121217"
            lineHeight={hp(19)}
          >
            Mobile Number <Text color="#FF4444">*</Text>
          </Text>
          <XStack gap={wp(12)}>
            <XStack
              alignItems="center"
              borderWidth={1}
              borderColor={isPhoneFocused ? "#6D00DA" : "#d1d1db"}
              borderRadius={wp(8)}
              padding={wp(8)}
              paddingVertical={hp(8)}
              backgroundColor="white"
              boxShadow={"0 1px 2px 0 rgba(18, 18, 23, 0.05)"}
            >
              <Image
                source={require("@/assets/images/Flags.png")}
                style={{
                  height: hp(16),
                  width: wp(16),
                  borderRadius: wp(20),
                }}
              />
              <BodySmall color="#121217" marginLeft="$2">
                +91
              </BodySmall>
              <ChevronDown color="#8A8AA3" height={hp(18)} width={wp(18)} />
            </XStack>

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
                  boxShadow={"0 1px 2px 0 rgba(18, 18, 23, 0.05)"}
                  alignItems="center"
                  paddingRight={value ? wp(8) : 0}
                >
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="99998 99999"
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setIsPhoneFocused(true)}
                    onBlur={() => {
                      setIsPhoneFocused(false);
                      onBlur();
                    }}
                    placeholderTextColor="#8A8AA3"
                    style={{
                      flex: 1,
                      padding: wp(8),
                      paddingVertical: hp(10),
                      fontSize: fp(14),
                      color: "#121217",
                      fontWeight: "400",
                      backgroundColor: "transparent",
                    }}
                  />
                  {value && (
                    <TouchableOpacity
                      onPress={() => {
                        setValue("phoneNumber", "");
                        onChange("");
                      }}
                      style={{
                        padding: wp(4),
                      }}
                    >
                      <X color="#999" size={hp(16)} />
                    </TouchableOpacity>
                  )}
                </XStack>
              )}
            />
          </XStack>

          {errors.phoneNumber && (
            <BodySmall color="#ef4444">{errors.phoneNumber.message}</BodySmall>
          )}
        </YStack>
        <YStack gap="$2">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <YStack gap={hp(4)}>
                <AnimatedFormField
                  label="Password *"
                  value={value || ""}
                  onChangeText={onChange}
                  placeholder="Create a strong password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={errors.password?.message}
                  leftIcon={<Lock size={hp(20)} color="#9E9E9E" />}
                  rightIcon={
                    showPassword ? (
                      <EyeOff size={hp(20)} color="#9E9E9E" />
                    ) : (
                      <Eye size={hp(20)} color="#9E9E9E" />
                    )
                  }
                  onRightIconPress={() => {
                    setShowPassword(!showPassword);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                />
                <PasswordStrengthMeter password={value || ""} />
              </YStack>
            )}
          />
          <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(17)} marginTop={hp(8)}>
            We will send a 4-digit OTP to your phone number via SMS.
          </Text>
        </YStack>
      </YStack>

      {/* API Error Display */}
      {apiError && (
        <YStack
          backgroundColor="#FEE2E2"
          borderColor="#EF4444"
          borderWidth={0.5}
          borderRadius={wp(8)}
          padding={wp(12)}
        >
          <BodySmall color="#DC2626" textAlign="center">
            {apiError}
          </BodySmall>
        </YStack>
      )}

      {/* Submit Button */}
      <YStack>
        <Button
          size="lg"
          width="100%"
          onPress={handleSubmit(handleFormSubmit)}
          backgroundColor="#7B2CBF"
          borderRadius={wp(12)}
          disabled={!isValid || singupMutation.isPending}
          opacity={singupMutation.isPending || !isValid ? 0.7 : 1}
        >
          <XStack alignItems="center" gap="$2" justifyContent="center">
            {singupMutation.isPending ? (
              <Spinner color={"white"} />
            ) : (
              <Text fontSize={16} fontWeight="600" color="#FFF">
                Get OTP
              </Text>
            )}
          </XStack>
        </Button>
      </YStack>
    </YStack>
  );
}
