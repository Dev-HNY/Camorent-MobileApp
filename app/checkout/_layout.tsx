import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="crew" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="inventory-unavailable" />
    </Stack>
  );
}
