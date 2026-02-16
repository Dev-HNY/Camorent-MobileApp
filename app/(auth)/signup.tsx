import React, { useRef, useEffect } from "react";
import { router } from "expo-router";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { BackButton } from "@/components/ui/BackButton";
import { XStack, YStack, Text } from "tamagui";
import { Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignupForm } from "@/components/auth/SignupForm";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { fp, hp, wp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

export default function Signup() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLoginRedirect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      {/* Subtle animated gradient background */}
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#FFFFFF"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: wp(16) }}
        extraScrollHeight={40}
        enableResetScrollToCoords={false}
      >
        <YStack gap={hp(24)}>
          {/* Header with Back Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <XStack justifyContent="flex-start" marginBottom={hp(16)}>
              <BackButton onPress={() => router.back()} />
            </XStack>
          </Animated.View>

          {/* Progress Indicator */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ProgressIndicator
              steps={[
                { label: "Account", status: "active" },
                { label: "Verify", status: "pending" },
                { label: "Profile", status: "pending" },
                { label: "City", status: "pending" },
                { label: "Done", status: "pending" },
              ]}
              currentStep={0}
            />
          </Animated.View>

          {/* Title */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack gap={hp(8)}>
              <Heading1>Hey!</Heading1>
              <Heading1>Let&apos;s get you started.</Heading1>
            </YStack>
          </Animated.View>

          {/* Signup Form */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <SignupForm />
          </Animated.View>

          {/* Login redirect */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              marginTop: hp(16),
            }}
          >
            <XStack justifyContent="center" alignItems="center" gap={wp(6)}>
              <Text fontSize={fp(14)} color="#6B7280">
                Already have an account?
              </Text>
              <Pressable onPress={handleLoginRedirect} hitSlop={10}>
                <Text fontSize={fp(14)} fontWeight="600" color="#8E0FFF">
                  Log In
                </Text>
              </Pressable>
            </XStack>
          </Animated.View>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
