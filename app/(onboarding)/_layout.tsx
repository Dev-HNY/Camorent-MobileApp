import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "flip" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding-intro" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="auth-choice" />
    </Stack>
  );
}
