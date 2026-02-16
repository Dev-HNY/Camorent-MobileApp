import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="faqs" />
    </Stack>
  );
}
