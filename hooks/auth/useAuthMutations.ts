import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useSignup() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      email,
      password,
    }: {
      phone_number: string;
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post("/auth/signup", {
        phone_number,
        email,
        password,
      });
      return data;
    },
  });
}
// export function useResendCode(){
//   return useMutation({

//   })
// }
export function useConfirmSignup() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      confirmation_code,
    }: {
      phone_number: string;
      confirmation_code: string;
    }) => {
      const res = await apiClient.post("/auth/confirm-signup", {
        phone_number,
        confirmation_code,
      });
      // console.log(res.data);
      return res.data;
    },
  });
}
export function useLogin() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      password,
    }: {
      phone_number: string;
      password: string;
    }) => {
      const res = await apiClient.post("/auth/login", {
        phone_number,
        password,
      });
      // console.log(res.data);
      return res.data;
    },
  });
}
export function useResendCode() {
  return useMutation({
    mutationFn: async ({ phone_number }: { phone_number: string }) => {
      const res = await apiClient.post("/auth/resend-code", {
        phone_number,
      });
      return res.data;
    },
  });
}

// ==================== SMS OTP HOOKS ====================

export function useSignupWithSMS() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      password,
      email,
    }: {
      phone_number: string;
      password: string;
      email: string;
    }) => {
      const res = await apiClient.post("/auth/signup-sms-otp", {
        phone_number,
        password,
        email,
      });
      return res.data;
    },
  });
}

export function useVerifySignupOTP() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      password,
      email,
      otp,
    }: {
      phone_number: string;
      password: string;
      email: string;
      otp: string;
    }) => {
      const res = await apiClient.post("/auth/verify-signup-otp", {
        phone_number,
        password,
        email,
        otp,
      });
      return res.data;
    },
  });
}

// ==================== LOGIN OTP HOOKS ====================

export function useRequestLoginOTP() {
  return useMutation({
    mutationFn: async ({ phone_number }: { phone_number: string }) => {
      const res = await apiClient.post("/auth/login-otp", { phone_number });
      return res.data as { success: boolean; message: string; phone_number: string };
    },
  });
}

export function useVerifyLoginOTP() {
  return useMutation({
    mutationFn: async ({ phone_number, otp }: { phone_number: string; otp: string }) => {
      const res = await apiClient.post("/auth/verify-login-otp", { phone_number, otp });
      return res.data as { user: any; id_token: string; access_token: string; refresh_token: string; expires_in: number };
    },
  });
}

export function useResendSMSOTP() {
  return useMutation({
    mutationFn: async ({
      phone_number,
      password,
      email,
    }: {
      phone_number: string;
      password: string;
      email: string;
    }) => {
      const res = await apiClient.post("/auth/signup-sms-otp", {
        phone_number,
        password,
        email,
      });
      return res.data;
    },
  });
}
