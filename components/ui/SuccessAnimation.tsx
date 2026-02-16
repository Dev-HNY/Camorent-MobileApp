import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { YStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
}

export function SuccessAnimation({
  message = "Success!",
  onComplete,
}: SuccessAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkScaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate the success checkmark
    Animated.sequence([
      // Scale up the circle
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      // Fade in and scale the checkmark
      Animated.parallel([
        Animated.spring(checkScaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Subtle rotation for polish
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call onComplete after animation finishes
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    });
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <YStack alignItems="center" justifyContent="center" gap={hp(16)}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: checkScaleAnim }, { rotate: rotation }],
            opacity: opacityAnim,
          }}
        >
          <Text fontSize={fp(40)} color="#FFFFFF">
            ✓
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [
            {
              translateY: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Text
          fontSize={fp(18)}
          fontWeight="600"
          color="#4CAF50"
          textAlign="center"
        >
          {message}
        </Text>
      </Animated.View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(50),
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
