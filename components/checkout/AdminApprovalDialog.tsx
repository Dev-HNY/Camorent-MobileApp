import React, { useState, useEffect, useRef } from "react";
import { hp, wp, fp } from "@/utils/responsive";
import {
  AppState,
  AppStateStatus,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useBookingTimerStore } from "@/store/bookingTimer/bookingTimer";

interface AdminApprovalDialogProps {
  isOpen: boolean;
  onApprovalReceived: () => void;
  isApproved: boolean;
  bookingId?: string | null;
}

export function AdminApprovalDialog({
  isOpen,
  onApprovalReceived,
  isApproved,
  bookingId,
}: AdminApprovalDialogProps) {
  const COUNTDOWN_DURATION = 5 * 60;
  const [remainingTime, setRemainingTime] = useState(COUNTDOWN_DURATION);
  const startTimeRef = useRef<number | null>(null);
  const { startTimer } = useBookingTimerStore();

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
      startTimer(bookingId ?? "pending");
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

        <View style={styles.sheet}>
          <Animated.View entering={FadeInUp.duration(420).springify().damping(18)}>
            <View style={styles.card}>
              {/* Purple accent bar */}
              <LinearGradient
                colors={["#8E0FFF", "#B44FFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentBar}
              />

              <View style={styles.cardContent}>
                {/* Pulsing icon */}
                <View style={styles.iconWrap}>
                  <Animated.View style={[pulseStyle, styles.pulseRing]} />
                  <LinearGradient
                    colors={["#8E0FFF", "#B44FFF"]}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconEmoji}>⏳</Text>
                  </LinearGradient>
                </View>

                {/* Heading + body */}
                <View style={styles.textGroup}>
                  <Text style={styles.heading}>Reviewing Your Booking</Text>
                  <Text style={styles.body}>
                    Our team is checking equipment availability. This usually takes just a few minutes.
                  </Text>
                </View>

                {/* Timer */}
                <View style={styles.timerBox}>
                  <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
                  <Text style={styles.timerLabel}>estimated wait time</Text>
                </View>

                {/* Tip */}
                <View style={styles.tipRow}>
                  <Text style={styles.tipEmoji}>💡</Text>
                  <Text style={styles.tipText}>
                    You can explore the app — we'll notify you once approved.
                  </Text>
                </View>

                {/* Explore More CTA */}
                <Pressable
                  style={styles.exploreCta}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.replace("/(tabs)/(home)");
                  }}
                >
                  <View style={styles.exploreBtn}>
                    <Text style={styles.exploreBtnText}>Explore More</Text>
                    <Text style={styles.exploreArrow}>→</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: hp(40),
  },
  card: {
    marginHorizontal: wp(20),
    borderRadius: wp(28),
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#8E0FFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
  },
  accentBar: {
    height: hp(4),
  },
  cardContent: {
    padding: wp(28),
    gap: hp(24),
    alignItems: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(80),
  },
  pulseRing: {
    position: "absolute",
    width: wp(72),
    height: wp(72),
    borderRadius: wp(36),
    backgroundColor: "#8E0FFF",
  },
  iconCircle: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: fp(24),
  },
  textGroup: {
    gap: hp(8),
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: fp(18),
    fontWeight: "700",
    color: "#121217",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  body: {
    fontSize: fp(14),
    color: "#6C6C89",
    textAlign: "center",
    lineHeight: hp(20),
  },
  timerBox: {
    backgroundColor: "#F5EDFF",
    borderRadius: wp(16),
    paddingHorizontal: wp(20),
    paddingVertical: hp(14),
    alignItems: "center",
    gap: hp(4),
    width: "100%",
  },
  timerText: {
    fontSize: fp(34),
    fontWeight: "700",
    color: "#8E0FFF",
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: fp(12),
    color: "#9B7BC8",
    fontWeight: "500",
  },
  tipRow: {
    flexDirection: "row",
    gap: wp(10),
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: wp(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
    width: "100%",
  },
  tipEmoji: {
    fontSize: fp(14),
  },
  tipText: {
    fontSize: fp(12),
    color: "#6C6C89",
    flex: 1,
    lineHeight: hp(18),
  },
  exploreCta: {
    width: "100%",
  },
  exploreBtn: {
    backgroundColor: "#F5EDFF",
    borderRadius: wp(14),
    paddingVertical: hp(14),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(8),
  },
  exploreBtnText: {
    fontSize: fp(15),
    fontWeight: "600",
    color: "#8E0FFF",
  },
  exploreArrow: {
    fontSize: fp(15),
    color: "#8E0FFF",
  },
});
