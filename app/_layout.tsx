import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import config from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import { storage } from "@/lib/mmkv";
import Constants from "expo-constants";
import { useTokenValidator } from "@/hooks/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Enhanced Query Client with better error handling and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in React Query v5)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const insets = useSafeAreaInsets();

  useTokenValidator();

  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831",
    deviceName: Platform.OS,
    platform: Platform.OS,
    deviceId: Constants.sessionId || Platform.OS,
    isDevice: ExpoDevice.isDevice ?? false,
    extraDeviceInfo: {
      appVersion: Constants.expoConfig?.version ?? "1.0.0",
    },
    enableLogs: false,
    mmkvStorage: storage,
  });

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'ios_from_right',
          animationDuration: 350,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
      </Stack>
      <ToastViewport
        name="my-shoots"
        flexDirection="column-reverse"
        top={insets.top}
        left={0}
        right={0}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    "PlayfairDisplay-Italic": require("../assets/fonts/PlayfairDisplay-Italic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <TamaguiProvider config={config}>
          <ToastProvider swipeDirection="up" native>
            <SafeAreaProvider style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <QueryClientProvider client={queryClient}>
                <AppContent />
              </QueryClientProvider>
            </SafeAreaProvider>
          </ToastProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
