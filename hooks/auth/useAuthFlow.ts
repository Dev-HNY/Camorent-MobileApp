import { useState, useEffect } from "react";
import {
  useConfirmSignup,
  useResendCode,
  useSignup,
} from "@/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/store/auth/auth";

interface UseAuthFlowOptions {
  onOtpSent?: (phoneNumber: string) => void;
  onVerifySuccess?: (data: any) => void;
  initialCountdown?: number;
}

export function useAuthFlow(options: UseAuthFlowOptions = {}) {
  const { onOtpSent, onVerifySuccess, initialCountdown = 30 } = options;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countdown, setCountdown] = useState(initialCountdown);
  const [canResend, setCanResend] = useState(false);

  const { setAuth } = useAuthStore();

  const singupMutation = useSignup();
  const confirmSignupMutation = useConfirmSignup();
  const resendOtpMutation = useResendCode();

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = (phone: string, email: string, password: string) => {
    singupMutation.mutate(
      { phone_number: phone, email, password },
      {
        onSuccess: (_, variables) => {
          setPhoneNumber(variables.phone_number);
          setCountdown(initialCountdown);
          setCanResend(false);
          onOtpSent?.(variables.phone_number);
        },
        onError: (err) => {
        },
      }
    );
  };

  const verifyOtp = (otp: string, phone?: string) => {
    confirmSignupMutation.mutate(
      {
        phone_number: phone || phoneNumber,
        confirmation_code: otp,
      },
      {
        onSuccess: (data) => {
          setAuth({
            user: data.user,
            id_token: data.id_token,
            refresh_token: data.refresh_token,
          });

          onVerifySuccess?.(data);
        },
      }
    );
  };

  const resendOtp = (phone: string) => {
    resendOtpMutation.mutate(
      { phone_number: phone },
      {
        onSuccess: () => {
          setCountdown(initialCountdown);
          setCanResend(false);
        },
      }
    );
  };

  const reset = () => {
    setPhoneNumber("");
    setCountdown(initialCountdown);
    setCanResend(false);
  };

  return {
    // State
    phoneNumber,
    countdown,
    canResend,

    // Mutations
    singupMutation,
    useConfirmSignup,
    resendOtpMutation,

    // Actions
    sendOtp,
    verifyOtp,
    resendOtp,
    reset,

    // Loading states
    isSendingOtp: singupMutation.isPending,
    isVerifying: confirmSignupMutation.isPending,
    isResending: resendOtpMutation.isPending,

    // Errors
    sendOtpError: singupMutation.error,
    verifyOtpError: confirmSignupMutation.error,
    resendOtpError: resendOtpMutation.error,

    // Error flags
    hasSendOtpError: singupMutation.isError,
    hasVerifyOtpError: confirmSignupMutation.isError,
    hasResendOtpError: resendOtpMutation.isError,
  };
}
