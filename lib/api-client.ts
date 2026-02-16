import axios from "axios";
import { useAuthStore } from "@/store/auth/auth";
import { router } from "expo-router";

// const BASE_URL = "https://1d2936043394.ngrok-free.app";
const BASE_URL = "https://api.camorent.co.in";
// const BASE_URL = "https://resplendent-chronometric-bridgett.ngrok-free.dev";

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
  router.replace("/(auth)/signup");
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
          phone_number: user?.phone_number,
        });

        // console.log(" Refresh successful, updating tokens");
        useAuthStore.getState().setAuth({
          user,
          id_token: data.id_token,
          refresh_token,
        });

        original.headers.Authorization = `Bearer ${data.id_token}`;
        return apiClient(original);
      } catch (error) {
        handleAuthenticationFailure();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
