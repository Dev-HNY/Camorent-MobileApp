import axios from "axios";
import { useAuthStore } from "@/store/auth/auth";
import { router } from "expo-router";

// const BASE_URL = "https://1d2936043394.ngrok-free.app";
const BASE_URL = "https://resplendent-chronometric-bridgett.ngrok-free.dev";
// const BASE_URL = "https://api.camorent.co.in";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const authEndpoints = [
    "/auth/signup",
    "/auth/confirm-signup",
    "/auth/refresh-token",
    "/auth/login",
    "/auth/login-otp",
    "/auth/verify-login-otp",
    "/auth/signup-sms-otp",
    "/auth/verify-signup-otp",
  ];
  const isAuthEndpoint = authEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (!isAuthEndpoint) {
    const token = useAuthStore.getState().id_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const handleAuthenticationFailure = () => {
  useAuthStore.getState().clearAuth();
  router.replace("/(auth)/login");
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Don't intercept auth-related endpoints (signup, login, confirm-signup)
    const authEndpoints = [
      "/auth/signup",
      "/auth/login",
      "/auth/confirm-signup",
      "/auth/resend-code",
      "/auth/login-otp",
      "/auth/verify-login-otp",
      "/auth/signup-sms-otp",
      "/auth/verify-signup-otp",
    ];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      original?.url?.includes(endpoint)
    );

    // Only try token refresh for protected endpoints
    if (
      (status === 401 || status === 403) &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;

      try {
        const { refresh_token, user } = useAuthStore.getState();

        if (!refresh_token) throw new Error("No refresh token");

        // console.log(" Calling refresh token endpoint...");
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refresh_token: refresh_token,
        });

        // new backend returns access_token; normalize to id_token for store
        const newToken = data.access_token ?? data.id_token;
        useAuthStore.getState().setAuth({
          user: user!,
          id_token: newToken,
          refresh_token: data.refresh_token ?? refresh_token,
        });

        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch (error) {
        handleAuthenticationFailure();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
