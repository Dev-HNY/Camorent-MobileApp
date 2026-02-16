import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, XStack, YStack } from "tamagui";
import { Pressable } from "react-native";
import { BodySmall, Heading2 } from "@/components/ui/Typography";
import { wp } from "@/utils/responsive";

export default function AddressModal() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        {/* Header */}
        <YStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          gap="$3"
          borderBottomWidth={1}
          borderBottomColor="$gray5"
        >
          <XStack alignItems="center">
            <Pressable onPress={() => router.back()}>
              <XStack
                borderRadius={28}
                borderWidth={1}
                padding={"$2"}
                borderColor={"$gray7"}
              >
                <ArrowLeft size={18} />
              </XStack>
            </Pressable>
            <Heading2 color="#121217" marginLeft={wp(8)}>
              Select Your Location
            </Heading2>
          </XStack>
        </YStack>

        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
          <BodySmall textAlign="center">
            Location selection is only available on mobile devices.
            Please use the mobile app to select your location.
          </BodySmall>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
