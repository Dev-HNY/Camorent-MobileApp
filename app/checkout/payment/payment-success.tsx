import React, { useEffect, useRef } from "react";
import { YStack, Text, Button } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { SuccessIcon } from "@/components/payment/SuccessIcon";
import { ArrowRight } from "lucide-react-native";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { hp } from "@/utils/responsive";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";

export default function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { payment_id, booking_id } = useLocalSearchParams();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true; // Prevent back navigation
      }
    );

    return () => backHandler.remove();
  }, []);
  // const payment_id = "hii";
  // const booking_id = "byy";
  const handleTrackDetails = () => {
    router.push("/(tabs)/(shoots)");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient
        colors={[
          'rgba(142, 15, 255, 0.03)',
          'rgba(255, 255, 255, 1)',
          'rgba(142, 15, 255, 0.02)',
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
          {/* Success Icon with zoom animation */}
          <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
            <YStack alignItems="center" gap="$4">
              <SuccessIcon />
            </YStack>
          </Animated.View>

          {/* Text content with fade-in animation */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify().damping(15)}
          >
            <YStack alignItems="center" gap="$3">
              <Heading2>Order successful</Heading2>
              <BodyText maxWidth={"60%"} textAlign="center" color={"#6C6C89"}>
                Thank you for patronizing us today. We value you!
              </BodyText>

              {/* Verification Details */}
              {(booking_id || payment_id) && (
                <YStack
                  gap="$2"
                  marginTop="$3"
                  padding="$3"
                  backgroundColor="$gray2"
                  borderRadius="$2"
                  width="100%"
                >
                  {booking_id && (
                    <Text fontSize="$3" color="$color" opacity={0.7}>
                      Booking ID: {booking_id}
                    </Text>
                  )}
                  {payment_id && (
                    <Text fontSize="$3" color="$color" opacity={0.7}>
                      Payment ID: {payment_id}
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>
          </Animated.View>

          {/* Track Details Button with slide-up animation */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500).springify().damping(15)}
            style={{ width: '100%', maxWidth: '80%', marginTop: hp(32) }}
          >
            <BottomSheetButton size="md" onPress={handleTrackDetails}>
              <BodySmall color={"white"}>Track Details</BodySmall>
              {/* <ArrowRight color={"white"} /> */}
            </BottomSheetButton>
          </Animated.View>
        </YStack>
      </LinearGradient>
    </SafeAreaView>
  );
}
