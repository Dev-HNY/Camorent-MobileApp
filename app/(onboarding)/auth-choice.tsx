import React, { useEffect, useRef } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Button } from "@/components/ui/Button";
import { Redirect, router } from "expo-router";
import { useAuthStore } from "@/store/auth/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { fp, hp, wp } from "@/utils/responsive";
import { Animated, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function AuthChoice() {
  const { user, isCitySelected } = useAuthStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const welcomeSlide = useRef(new Animated.Value(30)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(welcomeSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Redirect if already logged in
  if (user) {
    const hasCompletedProfile = Boolean(user.first_name);

    if (!hasCompletedProfile) {
      return <Redirect href="/(auth)/info" />;
    }

    if (!isCitySelected) {
      return <Redirect href="/(auth)/city-page" />;
    }

    return <Redirect href="/(tabs)/(home)" />;
  }

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(auth)/login");
  };

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(auth)/signup");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Subtle gradient background */}
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#FAFAFF", "#FFFFFF"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <YStack flex={1} paddingHorizontal={wp(24)} justifyContent="space-between">
        {/* Logo Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: logoScale }],
            alignItems: "center",
            marginTop: hp(60),
          }}
        >
          <YStack alignItems="center" gap={hp(16)}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{
                width: wp(200),
                height: hp(80),
              }}
              contentFit="contain"
            />
            <Text
              fontSize={fp(15)}
              fontWeight="500"
              color="#6B7280"
              letterSpacing={0.2}
            >
              Rent Premium Camera Gear
            </Text>
          </YStack>
        </Animated.View>

        {/* Welcome Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: welcomeSlide }],
          }}
        >
          <YStack alignItems="center" gap={hp(10)} marginTop={hp(20)}>
            <Text
              fontSize={fp(26)}
              fontWeight="700"
              color="#1C1C1E"
              textAlign="center"
              lineHeight={fp(32)}
              letterSpacing={-0.5}
            >
              Welcome Back!
            </Text>
            <Text
              fontSize={fp(15)}
              fontWeight="400"
              color="#6B7280"
              textAlign="center"
              lineHeight={fp(22)}
              paddingHorizontal={wp(20)}
            >
              Get access to India's largest camera rental marketplace
            </Text>
          </YStack>
        </Animated.View>

        {/* Buttons Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: buttonSlide }],
            marginBottom: hp(40),
          }}
        >
          <YStack gap={hp(16)}>
            <Button
              size="lg"
              width="100%"
              onPress={handleLogin}
              backgroundColor="#8E0FFF"
              borderRadius={wp(12)}
            >
              <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF">
                Log In
              </Text>
            </Button>

            {/* Divider */}
            <XStack alignItems="center" gap={wp(16)} paddingVertical={hp(8)}>
              <YStack flex={1} height={1} backgroundColor="#E5E7EB" />
              <Text fontSize={fp(14)} fontWeight="500" color="#9CA3AF">
                or
              </Text>
              <YStack flex={1} height={1} backgroundColor="#E5E7EB" />
            </XStack>

            <Button
              size="lg"
              width="100%"
              onPress={handleSignUp}
              backgroundColor="#8E0FFF"
              borderWidth={1.5}
              borderRadius={wp(12)}
            >
              <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF">
                Create Account
              </Text>
            </Button>

            {/* Footer */}
            <YStack alignItems="center" marginTop={hp(24)}>
              <Text
                fontSize={fp(12)}
                color="#9CA3AF"
                textAlign="center"
                lineHeight={fp(18)}
              >
                By continuing, you agree to our{"\n"}
                <Text fontWeight="600" color="#8E0FFF">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text fontWeight="600" color="#8E0FFF">
                  Privacy Policy
                </Text>
              </Text>
            </YStack>
          </YStack>
        </Animated.View>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
