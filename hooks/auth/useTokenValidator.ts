import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth/auth";
import { apiClient } from "@/lib/api-client";
import { AppState, AppStateStatus } from "react-native";

/**
 * Hook to validate token on app launch and when app comes to foreground
 * Automatically triggers logout if token is expired
 */
export const useTokenValidator = () => {
  const { id_token } = useAuthStore();
  const appState = useRef(AppState.currentState);

  const validateToken = async () => {
    // Skip validation for ... or if no token
    if (!id_token) return;

    try {
      // Make a lightweight API call to check if token is valid
      await apiClient.get("/auth/me");
      console.log("✅ Token is valid");
    } catch (error: any) {
      // Error will be handled by interceptor (auto-logout on 401/403)
      console.log("Token validation failed");
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.message);
      console.log("Error details:", error.response?.data);
    }
  };

  useEffect(() => {
    // Validate token on mount (app launch)
    validateToken();

    // Listen to app state changes
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // When app comes to foreground from background
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          validateToken();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [id_token]);
};
