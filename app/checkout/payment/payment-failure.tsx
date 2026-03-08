import React, { useEffect } from "react";
import { YStack, Text } from "tamagui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { BackHandler, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Image as ExpoImage } from "expo-image";

export default function PaymentFailureScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const handleContinue = () => {
    router.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Main content — vertically centered */}
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={wp(32)}
      >
        {/* Illustration */}
        <Animated.View entering={FadeInUp.delay(80).duration(500).springify().damping(18).stiffness(200)}>
          <ExpoImage
            source={require("@/assets/new/icons/payment-failed.svg")}
            contentFit="contain"
            style={{ width: wp(260), height: wp(260) }}
            cachePolicy="memory-disk"
          />
        </Animated.View>

        {/* Text */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400).springify().damping(20).stiffness(240)}
          style={{ alignItems: "center", gap: hp(10), marginTop: hp(8) }}
        >
          <Text
            fontSize={fp(26)}
            fontWeight="800"
            color="#1C1C1E"
            textAlign="center"
            letterSpacing={-0.5}
          >
            Payment Failed
          </Text>
          <Text
            fontSize={fp(14)}
            fontWeight="400"
            color="#6B7280"
            textAlign="center"
            lineHeight={hp(22)}
          >
            Something went wrong with your payment.{"\n"}Please try again.
          </Text>
        </Animated.View>
      </YStack>

      {/* Continue button pinned to bottom */}
      <Animated.View
        entering={FadeInUp.delay(340).duration(400).springify().damping(20).stiffness(240)}
        style={{
          paddingHorizontal: wp(20),
          paddingBottom: insets.bottom > 0 ? insets.bottom + hp(12) : hp(24),
          paddingTop: hp(12),
        }}
      >
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1, borderRadius: wp(16), overflow: "hidden" })}
        >
          <LinearGradient
            colors={["#7B2FFF", "#9B51E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: hp(18), alignItems: "center", borderRadius: wp(16) }}
          >
            <Text fontSize={fp(17)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.2}>
              Try Again
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
