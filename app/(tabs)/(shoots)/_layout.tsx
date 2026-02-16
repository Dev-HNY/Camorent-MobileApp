import { Stack } from "expo-router";

export default function ShootsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="order-details" />
      <Stack.Screen name="rating" />
      {/* <Stack.Screen name="replace-item" /> */}
      <Stack.Screen name="track-order" />
      <Stack.Screen name="report-issue" />
      <Stack.Screen name="reorder" />
      <Stack.Screen name="reschedule" />
    </Stack>
  );
}
