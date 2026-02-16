import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/ui/CustomTabBar";

export default function HomeLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
    >
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="(shoots)" />
      <Tabs.Screen name="(profile)" />
    </Tabs>
  );
}
