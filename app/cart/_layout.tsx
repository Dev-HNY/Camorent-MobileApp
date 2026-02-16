import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="choose-address"
        options={{
          presentation: "containedTransparentModal",
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="address-details"
        options={{
          presentation: "containedTransparentModal",
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
