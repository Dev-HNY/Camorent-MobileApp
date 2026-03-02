import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider } from "tamagui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import config from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { Platform, LogBox } from "react-native";
import * as ExpoDevice from "expo-device";
import { storage } from "@/lib/mmkv";
import Constants from "expo-constants";
import { useTokenValidator } from "@/hooks/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BookingTimerWidget } from "@/components/ui/BookingTimerWidget";
import { useBookingTimerStore } from "@/store/bookingTimer/bookingTimer";
import { useGetBookingById } from "@/hooks/shoots/useGetBookingById";

// Suppress known RN New Architecture / Tamagui false-positive warnings
LogBox.ignoreLogs([
  "Text strings must be rendered within a <Text> component",
  "Can't find Tamagui configuration",
]);

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

// Polls booking status in background while timer is active (even when payment page is unmounted)
function BookingStatusPoller() {
  const { isActive, isApproved, bookingId, approveTimer, stopTimer } = useBookingTimerStore();
  const shouldPoll = isActive && !isApproved && !!bookingId;

  const { data: bookingDetails } = useGetBookingById(bookingId ?? "", shouldPoll);

  useEffect(() => {
    if (!bookingDetails || !isActive) return;
    const approval = bookingDetails.admin_approval;
    if (approval === "True") {
      approveTimer();
    } else if (approval && approval !== "pending" && approval !== "" && approval !== "True") {
      // Rejected — stop timer silently (payment page Alert handles it if mounted)
      stopTimer();
    }
  }, [bookingDetails?.admin_approval, isActive]);

  return null;
}

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
      <BookingStatusPoller />
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'ios_from_right',
          animationDuration: 250,
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
      <BookingTimerWidget />
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
    "PlayfairDisplay-SemiBoldItalic": require("../assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf"),
  });

  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <TamaguiProvider config={config}>
        <ToastProvider swipeDirection="up" native>
          <SafeAreaProvider style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ErrorBoundary>
              <QueryClientProvider client={queryClient}>
                <AppContent />
                {!splashDone && (
                  <AnimatedSplashScreen onFinish={() => setSplashDone(true)} />
                )}
              </QueryClientProvider>
            </ErrorBoundary>
          </SafeAreaProvider>
        </ToastProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
