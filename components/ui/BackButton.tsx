import { router } from "expo-router";
import { Text, XStack } from "tamagui";
import { ArrowLeft } from "lucide-react-native";
import { fp, hp, wp } from "@/utils/responsive";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const handlePress = onPress || (() => router.back());

  return (
    <XStack onPress={handlePress} alignItems="center" gap={wp(6)}>
      <ArrowLeft size={wp(14)} />
      <Text fontSize={fp(12)} fontWeight={"500"} lineHeight={hp(16)}>
        Back
      </Text>
    </XStack>
  );
}
