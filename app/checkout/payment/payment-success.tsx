import React, { useEffect } from "react";
import { YStack, XStack, Text } from "tamagui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { SuccessIcon } from "@/components/payment/SuccessIcon";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { hp, wp, fp } from "@/utils/responsive";
import { BodySmall, BodyText } from "@/components/ui/Typography";
import { BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { payment_id, booking_id } = useLocalSearchParams();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const handleGoToShoots = () => {
    router.replace("/(tabs)/(shoots)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F7FF" }}>
      <LinearGradient
        colors={["#EDE0FF", "#F9F7FF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={wp(24)}
          paddingBottom={insets.bottom + hp(60)}
          gap={hp(32)}
        >
          {/* Success icon */}
          <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
            <SuccessIcon />
          </Animated.View>

          {/* Text content */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify().damping(15)}
            style={{ width: "100%", alignItems: "center" }}
          >
            <YStack alignItems="center" gap={hp(10)}>
              <Text
                fontSize={fp(24)}
                fontWeight="700"
                color="#121217"
                textAlign="center"
              >
                Payment Successful!
              </Text>
              <BodyText textAlign="center" color="#6C6C89">
                Your booking is confirmed.{"\n"}We're getting your gear ready.
              </BodyText>

              {/* Booking / Payment ID card */}
              {(booking_id || payment_id) && (
                <YStack
                  marginTop={hp(8)}
                  paddingVertical={hp(12)}
                  paddingHorizontal={wp(16)}
                  backgroundColor="white"
                  borderRadius={wp(12)}
                  borderWidth={1}
                  borderColor="#E8E0FF"
                  width="100%"
                  gap={hp(8)}
                >
                  {booking_id && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <BodySmall color="#6C6C89">Booking ID</BodySmall>
                      <BodySmall color="#121217" fontWeight="600">
                        {String(booking_id)}
                      </BodySmall>
                    </XStack>
                  )}
                  {payment_id && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <BodySmall color="#6C6C89">Payment ID</BodySmall>
                      <BodySmall color="#121217" fontWeight="600">
                        {String(payment_id)}
                      </BodySmall>
                    </XStack>
                  )}
                </YStack>
              )}
            </YStack>
          </Animated.View>

          {/* CTA */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500).springify().damping(15)}
            style={{ width: "100%" }}
          >
            <BottomSheetButton size="lg" onPress={handleGoToShoots}>
              View My Shoots
            </BottomSheetButton>
          </Animated.View>
        </YStack>
      </LinearGradient>
    </SafeAreaView>
  );
}
