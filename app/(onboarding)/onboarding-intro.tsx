import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { BackButton } from "@/components/ui/BackButton";
import { ImageBackgroundScreen } from "@/components/layouts/ImageBackgroundScreen";
import { fp, hp } from "@/utils/responsive";

export default function OnboardingIntro() {
  return (
    <ImageBackgroundScreen
      source="https://picsum.photos/seed/696/600/400"
      gradient={undefined}
    >
      <YStack padding={"$4"} flex={1} justifyContent="space-between">
        <XStack justifyContent="flex-start">
          <BackButton />
        </XStack>

        {/* This space can be used for additional content if needed */}
        <YStack flex={1} />
        <YStack gap={"$4"}>
          <XStack>
            <Text
              fontSize={fp(14)}
              fontWeight={"500"}
              lineHeight={hp(19)}
              color={"white"}
            >
              Trusted by filmmakers and creators worldwide, his vision powers
              Camorent to support every storyteller.
            </Text>
          </XStack>
          <XStack justifyContent="center">
            <Button
              size="lg"
              onPress={() => router.push("/(auth)/signup")}
              width="100%"
            >
              Continue
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </ImageBackgroundScreen>
  );
}
