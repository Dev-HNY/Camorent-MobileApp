import React, { useState } from "react";
import { YStack, Text, Sheet } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Heading1, Heading2 } from "@/components/ui/Typography";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SignupForm } from "@/components/auth/SignupForm";
import { OTPInput } from "@/components/auth/OTPInput";
import { useAuthFlow } from "@/hooks/auth/useAuthFlow";
import { hp, wp } from "@/utils/responsive";

interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export function AuthSheet({ isOpen, onClose, onAuthSuccess }: AuthSheetProps) {
  const [step, setStep] = useState<"signup" | "otp">("signup");

  const {
    sendOtp,
    verifyOtp,
    resendOtp,
    reset,
    isSendingOtp,
    isVerifying,
    isResending,
    sendOtpError,
    verifyOtpError,
    resendOtpError,
    hasSendOtpError,
    hasVerifyOtpError,
    hasResendOtpError,
    countdown,
    canResend,
  } = useAuthFlow({
    onOtpSent: () => {
      setStep("otp");
    },
    onVerifySuccess: () => {
      onAuthSuccess();
      handleClose();
    },
  });

  const handleClose = () => {
    setStep("signup");
    reset();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoints={[50]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack
          flex={1}
          gap={wp(4)}
          paddingHorizontal={wp(16)}
          paddingVertical={hp(24)}
        >
          {step === "signup" ? (
            <>
              <YStack gap="$3">
                <YStack>
                  <Heading2>Please login to continue</Heading2>
                </YStack>
              </YStack>

              <SignupForm />
            </>
          ) : (
            <OTPInput
              onSubmit={verifyOtp}
              onResend={() => resendOtp("")}
              isLoading={isVerifying}
              isResending={isResending}
              error={
                hasVerifyOtpError
                  ? (verifyOtpError as any)?.response?.data?.message ||
                    "Invalid OTP"
                  : undefined
              }
              resendError={
                hasResendOtpError
                  ? (resendOtpError as any)?.response?.data?.message ||
                    "Failed to resend OTP"
                  : undefined
              }
              countdown={countdown}
              canResend={canResend}
            />
          )}
        </YStack>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
