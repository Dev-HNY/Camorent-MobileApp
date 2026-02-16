import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="similar-products" />
    </Stack>
  );
}
