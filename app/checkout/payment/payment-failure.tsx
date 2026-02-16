import React from "react";
import { YStack, Text, Button, Card, XStack } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { ArrowRight } from "lucide-react-native";
import { FailureIcon } from "@/components/payment/FailureIcon";
import { Heading2 } from "@/components/ui/Typography";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function PaymentFailureScreen() {
  const insets = useSafeAreaInsets();

  const handleRentNowPayLater = () => {
    // Handle BNPL option
    router.back(); // Go back to payment options or process BNPL
  };

  const handleTryAgainLater = () => {
    router.push("/checkout/payment");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient
        colors={[
          'rgba(245, 61, 107, 0.03)',
          'rgba(255, 255, 255, 1)',
          'rgba(245, 61, 107, 0.02)',
        ]}
        style={{ flex: 1 }}
      >
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          padding="$4"
          paddingBottom={insets.bottom + 40}
          gap="$6"
        >
          {/* Failure Icon with zoom animation */}
          <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
            <YStack alignItems="center" gap="$4">
              <FailureIcon />
            </YStack>
          </Animated.View>

          {/* Heading with fade-in animation */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify().damping(15)}
          >
            <YStack alignItems="center" gap="$3">
              <Heading2 color={"#F53D6B"}>Payment failed !</Heading2>
            </YStack>
          </Animated.View>

          {/* Action buttons with staggered animations */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500).springify().damping(15)}
            style={{ width: '100%', maxWidth: 320, marginTop: hp(32) }}
          >
            <YStack gap="$3" width="100%">
              <BottomSheetButton
                size="md"
                onPress={() => {
                  router.dismiss();
                }}
              >
                <Text fontSize="$4" fontWeight="500" color="white">
                  Try Again
                </Text>
                <ArrowRight color={"white"} />
              </BottomSheetButton>
              <BottomSheetButton
                size="sm"
                variant="outline"
                onPress={() => {
                  router.push("/(tabs)/(home)");
                }}
              >
                <Text fontSize="$4" fontWeight="500">
                  Go To Home
                </Text>
                <ArrowRight color={"#121217"} />
              </BottomSheetButton>
            </YStack>
          </Animated.View>
        </YStack>
      </LinearGradient>
    </SafeAreaView>
  );
}
