import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { wp, hp, fp } from "@/utils/responsive";

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const calculateStrength = (pwd: string): StrengthResult => {
    if (!pwd) {
      return { score: 0, label: "", color: "#E0E0E0", feedback: [] };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (pwd.length >= 8) {
      score++;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(pwd)) {
      score++;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(pwd)) {
      score++;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(pwd)) {
      score++;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      score++;
    } else {
      feedback.push("One special character");
    }

    // Determine label and color
    let label = "";
    let color = "#E0E0E0";

    if (score === 0) {
      label = "";
      color = "#E0E0E0";
    } else if (score <= 2) {
      label = "Weak";
      color = "#F44336";
    } else if (score === 3) {
      label = "Fair";
      color = "#FF9800";
    } else if (score === 4) {
      label = "Good";
      color = "#4CAF50";
    } else if (score === 5) {
      label = "Strong";
      color = "#4CAF50";
    }

    return { score: Math.min(score, 4), label, color, feedback };
  };

  const strength = calculateStrength(password);
  const targetWidth = password ? (strength.score / 4) * 100 : 0;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: targetWidth,
        friction: 10,
        tension: 50,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: password ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [password, targetWidth]);

  if (!password) {
    return null;
  }

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <YStack gap={hp(8)} marginTop={hp(8)}>
        {/* Strength Bar */}
        <YStack height={hp(4)} backgroundColor="#F5F5F5" borderRadius={hp(2)} overflow="hidden">
          <Animated.View
            style={[
              styles.strengthBar,
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: strength.color,
              },
            ]}
          />
        </YStack>

        {/* Strength Label */}
        {strength.label && (
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={fp(12)} fontWeight="500" color={strength.color}>
              {strength.label}
            </Text>
            {strength.score >= 4 && (
              <Text fontSize={fp(11)} color="#4CAF50">
                ✓ Password is strong
              </Text>
            )}
          </XStack>
        )}

        {/* Feedback */}
        {strength.feedback.length > 0 && strength.score < 4 && (
          <YStack gap={hp(4)} marginTop={hp(4)}>
            <Text fontSize={fp(11)} color="#757575">
              Password must contain:
            </Text>
            <YStack gap={hp(2)} paddingLeft={wp(8)}>
              {strength.feedback.map((item, index) => (
                <Text key={index} fontSize={fp(10)} color="#9E9E9E">
                  • {item}
                </Text>
              ))}
            </YStack>
          </YStack>
        )}
      </YStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strengthBar: {
    height: "100%",
    borderRadius: hp(2),
  },
});
