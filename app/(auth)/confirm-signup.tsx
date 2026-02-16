import { useLocalSearchParams, router } from "expo-router";
import { YStack, XStack } from "tamagui";
import { BackButton } from "@/components/ui/BackButton";
import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OTPInput } from "@/components/auth/OTPInput";
import { useConfirmSignup, useLogin, useResendCode } from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";

export default function VerifyOtp() {
  const params = useLocalSearchParams<{
    phone: string;
    name?: string;
    profession?: string;
  }>();

  const { tempSignupData, setAuth, clearTempSignupData } = useAuthStore();
  const confirmSignupMutation = useConfirmSignup();
  const loginMutation = useLogin();
  const resendCodeMutation = useResendCode();

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOtp = (otp: string) => {
    if (!params.phone) return;

    confirmSignupMutation.mutate(
      {
        phone_number: params.phone,
        confirmation_code: otp,
      },
      {
        onSuccess: () => {
          if (!tempSignupData?.password) {
            router.replace("/(auth)/signup");
            return;
          }

          loginMutation.mutate(
            {
              phone_number: params.phone,
              password: tempSignupData.password,
            },
            {
              onSuccess: (data) => {
                setAuth({
                  user: data.user,
                  id_token: data.id_token,
                  refresh_token: data.refresh_token,
                });
                clearTempSignupData();
                router.replace("/(auth)/info");
              },
            }
          );
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!params.phone) return;

    resendCodeMutation.mutate(
      {
        phone_number: params.phone,
      },
      {
        onSuccess: () => {
          setCountdown(30);
          setCanResend(false);
        },
      }
    );
  };

  const getErrorMessage = (): string | undefined => {
    if (confirmSignupMutation.error) {
      const error = confirmSignupMutation.error as any;
      return (
        error.response?.data?.detail?.message ||
        error.message ||
        "Invalid OTP. Please try again."
      );
    }
    if (loginMutation.error) {
      const error = loginMutation.error as any;
      return (
        error.response?.data?.detail?.message ||
        error.message ||
        "Login failed. Please try again."
      );
    }
    if (!tempSignupData?.password && confirmSignupMutation.isSuccess) {
      return "Password not found. Please try again.";
    }
    return undefined;
  };

  const getResendErrorMessage = (): string | undefined => {
    if (resendCodeMutation.error) {
      const error = resendCodeMutation.error as any;
      return (
        error.response?.data?.detail?.message ||
        error.message ||
        "Failed to resend code. Please try again."
      );
    }
    return undefined;
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Initial fade in animation
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
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Subtle animated gradient background */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F7FF', '#FFFFFF']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={{
              flex: 1,
              padding: 16,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <XStack justifyContent="space-between" marginBottom={20}>
              <BackButton onPress={() => router.back()} />
            </XStack>

            {/* Progress Indicator */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <ProgressIndicator
                steps={[
                  { label: "Account", status: "completed" },
                  { label: "Verify", status: "active" },
                  { label: "Profile", status: "pending" },
                  { label: "City", status: "pending" },
                  { label: "Done", status: "pending" },
                ]}
                currentStep={1}
              />
            </Animated.View>

            <OTPInput
              onSubmit={handleVerifyOtp}
              onResend={handleResendOtp}
              isLoading={
                confirmSignupMutation.isPending || loginMutation.isPending
              }
              isResending={resendCodeMutation.isPending}
              error={getErrorMessage()}
              resendError={getResendErrorMessage()}
              countdown={countdown}
              canResend={canResend}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
