import React, { useRef, useEffect } from "react";
import { router } from "expo-router";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { BackButton } from "@/components/ui/BackButton";
import { XStack, YStack, Text } from "tamagui";
import { Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "@/components/auth/LoginForm";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { fp, hp, wp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

export default function Login() {
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

  const handleSignupRedirect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/signup");
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

          {/* Title */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack gap={hp(8)}>
              <Heading1>Welcome Back</Heading1>
              <BodySmall color="#666">
                Log in to your account to continue renting premium gear
              </BodySmall>
            </YStack>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LoginForm />
          </Animated.View>

          {/* Sign up redirect */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              marginTop: hp(16),
            }}
          >
            <XStack justifyContent="center" alignItems="center" gap={wp(6)}>
              <Text fontSize={fp(14)} color="#6B7280">
                Don't have an account?
              </Text>
              <Pressable onPress={handleSignupRedirect} hitSlop={10}>
                <Text fontSize={fp(14)} fontWeight="600" color="#8E0FFF">
                  Sign Up
                </Text>
              </Pressable>
            </XStack>
          </Animated.View>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
