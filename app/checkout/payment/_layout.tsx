import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="coupons" />
      <Stack.Screen name="payment-options" />
      <Stack.Screen
        name="payment-success"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="payment-failure"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}