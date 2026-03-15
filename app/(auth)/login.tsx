import React, { useRef, useEffect } from "react";
import { router } from "expo-router";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { BackButton } from "@/components/ui/BackButton";
import { XStack, YStack } from "tamagui";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "@/components/auth/LoginForm";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { hp, wp } from "@/utils/responsive";

export default function Login() {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#FFFFFF"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
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
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <XStack justifyContent="flex-start" marginBottom={hp(16)}>
              <BackButton onPress={() => router.back()} />
            </XStack>
          </Animated.View>

          {/* Title */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <YStack gap={hp(8)}>
              <Heading1>Welcome</Heading1>
              <BodySmall color="#666">
                Enter your phone number to log in or create an account
              </BodySmall>
            </YStack>
          </Animated.View>

          {/* Login / Signup Form */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <LoginForm />
          </Animated.View>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
