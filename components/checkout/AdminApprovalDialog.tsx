import React, { useState, useEffect, useRef } from "react";
import { YStack, XStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { AppState, AppStateStatus, Modal, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";

interface AdminApprovalDialogProps {
  isOpen: boolean;
  onApprovalReceived: () => void;
  isApproved: boolean;
}

export function AdminApprovalDialog({
  isOpen,
  onApprovalReceived,
  isApproved,
}: AdminApprovalDialogProps) {
  const COUNTDOWN_DURATION = 5 * 60;
  const [remainingTime, setRemainingTime] = useState(COUNTDOWN_DURATION);
  const startTimeRef = useRef<number | null>(null);

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.45);

  useEffect(() => {
    if (isOpen) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1200, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.12, { duration: 1200, easing: Easing.out(Easing.ease) }),
          withTiming(0.45, { duration: 1200, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [isOpen]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  useEffect(() => {
    if (!isOpen) {
      setRemainingTime(COUNTDOWN_DURATION);
      startTimeRef.current = null;
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const updateRemainingTime = () => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRemainingTime(Math.max(0, COUNTDOWN_DURATION - elapsed));
      }
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active" && startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setRemainingTime(Math.max(0, COUNTDOWN_DURATION - elapsed));
        }
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isApproved && isOpen) {
      onApprovalReceived();
    }
  }, [isApproved, isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" statusBarTranslucent>
      <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill}>
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.55)" }]}
        />

        <YStack flex={1} justifyContent="flex-end" paddingBottom={hp(40)}>
          <Animated.View entering={FadeInUp.duration(420).springify().damping(18)}>
            <YStack
              marginHorizontal={wp(20)}
              borderRadius={wp(28)}
              backgroundColor="#FFFFFF"
              overflow="hidden"
              style={{
                shadowColor: "#8E0FFF",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 32,
                elevation: 16,
              }}
            >
              {/* Purple accent bar */}
              <LinearGradient
                colors={["#8E0FFF", "#B44FFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: hp(4) }}
              />

              <YStack padding={wp(28)} gap={hp(24)} alignItems="center">
                {/* Pulsing icon */}
                <YStack alignItems="center" justifyContent="center" height={hp(80)}>
                  <Animated.View
                    style={[
                      pulseStyle,
                      {
                        position: "absolute",
                        width: wp(72),
                        height: wp(72),
                        borderRadius: wp(36),
                        backgroundColor: "#8E0FFF",
                      },
                    ]}
                  />
                  <LinearGradient
                    colors={["#8E0FFF", "#B44FFF"]}
                    style={{
                      width: wp(56),
                      height: wp(56),
                      borderRadius: wp(28),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text fontSize={fp(24)}>⏳</Text>
                  </LinearGradient>
                </YStack>

                {/* Heading + body */}
                <YStack gap={hp(8)} alignItems="center">
                  <Text
                    fontSize={fp(18)}
                    fontWeight="700"
                    color="#121217"
                    textAlign="center"
                    letterSpacing={-0.3}
                  >
                    Reviewing Your Booking
                  </Text>
                  <Text
                    fontSize={fp(14)}
                    color="#6C6C89"
                    textAlign="center"
                    lineHeight={hp(20)}
                  >
                    Our team is checking equipment availability. This usually takes just a few minutes.
                  </Text>
                </YStack>

                {/* Timer */}
                <YStack
                  backgroundColor="#F5EDFF"
                  borderRadius={wp(16)}
                  paddingHorizontal={wp(20)}
                  paddingVertical={hp(14)}
                  alignItems="center"
                  gap={hp(4)}
                  width="100%"
                >
                  <Text
                    fontSize={fp(34)}
                    fontWeight="700"
                    color="#8E0FFF"
                    letterSpacing={-1}
                  >
                    {formatTime(remainingTime)}
                  </Text>
                  <Text fontSize={fp(12)} color="#9B7BC8" fontWeight="500">
                    estimated wait time
                  </Text>
                </YStack>

                {/* Tip */}
                <XStack
                  gap={wp(10)}
                  alignItems="center"
                  backgroundColor="#F9F9FB"
                  borderRadius={wp(12)}
                  paddingHorizontal={wp(16)}
                  paddingVertical={hp(12)}
                  width="100%"
                >
                  <Text fontSize={fp(14)}>💡</Text>
                  <Text fontSize={fp(12)} color="#6C6C89" flex={1} lineHeight={hp(18)}>
                    You can minimise the app — we'll notify you once approved.
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Animated.View>
        </YStack>
      </BlurView>
    </Modal>
  );
}
