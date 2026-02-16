import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { wp, hp, fp } from "@/utils/responsive";

interface Step {
  label: string;
  status: "completed" | "active" | "pending";
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const animations = useRef(
    steps.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.3),
      lineWidth: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    steps.forEach((step, index) => {
      // Animate completed steps
      if (index < currentStep) {
        Animated.parallel([
          Animated.spring(animations[index].scale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index].opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(animations[index].lineWidth, {
            toValue: 1,
            friction: 10,
            tension: 50,
            useNativeDriver: false,
          }),
        ]).start();
      }
      // Animate current step
      else if (index === currentStep) {
        Animated.parallel([
          Animated.sequence([
            Animated.spring(animations[index].scale, {
              toValue: 1.15,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(animations[index].scale, {
              toValue: 1,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(animations[index].opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }
      // Reset pending steps
      else {
        Animated.parallel([
          Animated.spring(animations[index].scale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index].opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index].lineWidth, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }
    });
  }, [currentStep]);

  return (
    <YStack width="100%" paddingHorizontal={wp(20)} paddingVertical={hp(24)}>
      <XStack justifyContent="space-between" alignItems="center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <YStack alignItems="center" flex={index < steps.length - 1 ? 0 : undefined}>
              <Animated.View
                style={[
                  styles.stepCircle,
                  {
                    transform: [{ scale: animations[index].scale }],
                    opacity: animations[index].opacity,
                    backgroundColor:
                      index <= currentStep
                        ? "#8E0FFF"
                        : index === currentStep
                        ? "#8E0FFF"
                        : "#E0E0E0",
                  },
                ]}
              >
                {index < currentStep ? (
                  <Text color="#FFFFFF" fontSize={fp(12)} fontWeight="600">
                    ✓
                  </Text>
                ) : (
                  <Text
                    color={index === currentStep ? "#FFFFFF" : "#9E9E9E"}
                    fontSize={fp(11)}
                    fontWeight="600"
                  >
                    {index + 1}
                  </Text>
                )}
              </Animated.View>
              <Text
                color={index <= currentStep ? "#121217" : "#9E9E9E"}
                fontSize={fp(10)}
                fontWeight={index === currentStep ? "600" : "400"}
                marginTop={hp(6)}
                textAlign="center"
                maxWidth={wp(60)}
              >
                {step.label}
              </Text>
            </YStack>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <YStack flex={1} paddingHorizontal={wp(8)} marginBottom={hp(20)}>
                <YStack
                  height={2}
                  backgroundColor="#E0E0E0"
                  borderRadius={1}
                  overflow="hidden"
                >
                  <Animated.View
                    style={[
                      styles.progressLine,
                      {
                        width: animations[index].lineWidth.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </YStack>
              </YStack>
            )}
          </React.Fragment>
        ))}
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  stepCircle: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    justifyContent: "center",
    alignItems: "center",
  },
  progressLine: {
    height: "100%",
    backgroundColor: "#8E0FFF",
  },
});
