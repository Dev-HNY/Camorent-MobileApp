import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="info" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="confirm-signup" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="city-page" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
