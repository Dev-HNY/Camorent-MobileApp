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
import { ChevronDown, X, Eye, EyeOff, Lock, Phone } from "lucide-react-native";
import { router } from "expo-router";
import { useLogin } from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";
import { AnimatedFormField } from "@/components/ui/AnimatedFormField";
import * as Haptics from "expo-haptics";

type LoginFormData = {
  password: string;
  phoneNumber: string;
};

const LoginSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
});

export function LoginForm() {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, setIsCitySelected, setIsVerified, isCitySelected } = useAuthStore();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const handleFormSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      {
        password: data.password,
        phone_number: `+91${data.phoneNumber}`,
      },
      {
        onSuccess: (responseData) => {
          setAuth({
            user: responseData.user,
            id_token: responseData.id_token,
            refresh_token: responseData.refresh_token,
          });

          // Check if profile is complete (has first_name which is required in /info)
          const hasCompletedProfile = Boolean(responseData.user.first_name);

          if (!hasCompletedProfile) {
            // Profile not complete - route to profile completion
            setIsVerified(false);
            setIsCitySelected(false);
            router.replace("/(auth)/info");
          } else if (!isCitySelected) {
            // Profile complete but city not selected - route to city selection
            setIsVerified(true);
            router.replace("/(auth)/city-page");
          } else {
            // Everything complete - route to home
            setIsVerified(true);
            router.replace("/(tabs)/(home)");
          }
        },
        onError: (error: any) => {
          console.log("Login error:", error.response?.data || error.message);
        },
      }
    );
  };

  const getErrorMessage = () => {
    if (!loginMutation.error) return null;

    const error = loginMutation.error as any;
    const detail = error?.response?.data?.detail;

    // Handle different error structures
    if (detail?.message) {
      // Clean up the error message
      const message = detail.message;
      if (message.includes("Incorrect username or password")) {
        return "Incorrect phone number or password. Please try again.";
      }
      if (message.includes("NotAuthorizedException")) {
        return "Invalid credentials. Please check your phone number and password.";
      }
      return message;
    }

    if (error?.message === "Network Error") {
      return "Network error. Please check your internet connection.";
    }

    return "Failed to login. Please try again.";
  };

  const apiError = getErrorMessage();

  return (
    <YStack gap="$5">
      <YStack gap="$4" paddingBottom="$3">
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
              <AnimatedFormField
                label="Password *"
                value={value || ""}
                onChangeText={onChange}
                placeholder="Enter your password"
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
            )}
          />
          <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(17)} marginTop={hp(8)}>
            We will send an OTP to the given email.
          </Text>
          {/* API Error Display */}
          {apiError && (
            <YStack
              backgroundColor="#FEE2E2"
              borderColor="#EF4444"
              borderWidth={0.5}
              borderRadius={wp(8)}
              padding={wp(12)}
              marginTop={hp(8)}
            >
              <BodySmall color="#DC2626" textAlign="center">
                {apiError}
              </BodySmall>
            </YStack>
          )}
        </YStack>
      </YStack>

      {/* Submit Button */}
      <YStack>
        <Button
          size="lg"
          width="100%"
          onPress={handleSubmit(handleFormSubmit)}
          backgroundColor="#7B2CBF"
          borderRadius={wp(12)}
          disabled={!isValid || loginMutation.isPending}
          opacity={loginMutation.isPending || !isValid ? 0.7 : 1}
        >
          <XStack alignItems="center" gap="$2" justifyContent="center">
            {loginMutation.isPending ? (
              <Spinner color={"white"} />
            ) : (
              <Text fontSize={16} fontWeight="600" color="#FFF">
                Login
              </Text>
            )}
          </XStack>
        </Button>
      </YStack>
    </YStack>
  );
}
