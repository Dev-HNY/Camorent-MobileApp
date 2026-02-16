import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="selections" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="categories" />
      <Stack.Screen
        name="search"
        options={{
          presentation: "containedTransparentModal",
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
