import React, { useEffect, useRef } from "react";
import { hp, wp, fp } from "@/utils/responsive";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useBookingTimerStore } from "@/store/bookingTimer/bookingTimer";
import Svg, { Circle, Path } from "react-native-svg";

// ── Typing dots ────────────────────────────────────────────────────────────
function TypingDots({ color = "#8E0FFF" }: { color?: string }) {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const cfg = { duration: 400, easing: Easing.inOut(Easing.ease) };
    dot1.value = withRepeat(withSequence(withTiming(1, cfg), withTiming(0.3, cfg)), -1, false);
    dot2.value = withRepeat(withDelay(160, withSequence(withTiming(1, cfg), withTiming(0.3, cfg))), -1, false);
    dot3.value = withRepeat(withDelay(320, withSequence(withTiming(1, cfg), withTiming(0.3, cfg))), -1, false);
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  const dotStyle = { width: wp(7), height: wp(7), borderRadius: wp(4), backgroundColor: color };

  return (
    <View style={{ flexDirection: "row", gap: wp(5), alignItems: "center" }}>
      <Animated.View style={[dotStyle, s1]} />
      <Animated.View style={[dotStyle, s2]} />
      <Animated.View style={[dotStyle, s3]} />
    </View>
  );
}

// ── Hourglass SVG icon ─────────────────────────────────────────────────────
function HourglassIcon() {
  return (
    <Svg width={wp(28)} height={wp(28)} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 2h12M6 22h12M7 2v5l5 5-5 5v5M17 2v5l-5 5 5 5v5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Main approval dialog ───────────────────────────────────────────────────
interface AdminApprovalDialogProps {
  isOpen: boolean;
  onApprovalReceived: () => void;
  onClose: () => void;
  isApproved: boolean;
  bookingId?: string | null;
}

export function AdminApprovalDialog({
  isOpen,
  onApprovalReceived,
  onClose,
  isApproved,
  bookingId,
}: AdminApprovalDialogProps) {
  const { startTimer } = useBookingTimerStore();
  const startedRef = useRef(false);

  // Gentle pulsing for the icon ring
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.35);

  useEffect(() => {
    if (isOpen) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 1400, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1400, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.1, { duration: 1400, easing: Easing.out(Easing.ease) }),
          withTiming(0.35, { duration: 1400, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );

      if (!startedRef.current) {
        startedRef.current = true;
        startTimer(bookingId ?? "pending");
      }
    } else {
      startedRef.current = false;
    }
  }, [isOpen]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  useEffect(() => {
    if (isApproved && isOpen) {
      onApprovalReceived();
    }
  }, [isApproved, isOpen]);

  return (
    <Modal visible={isOpen} transparent animationType="slide" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(280)}
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,0,30,0.55)" }]}
      />

      {/* Sheet */}
      <View style={styles.sheetContainer}>
        <Animated.View
          entering={FadeInUp.duration(420).springify().damping(20).stiffness(120)}
          style={styles.sheet}
        >
          {/* Top handle */}
          <View style={styles.handle} />

          {/* Icon row */}
          <View style={styles.iconRow}>
            <View style={styles.iconWrap}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <LinearGradient
                colors={["#8E0FFF", "#6D00DA"]}
                style={styles.iconCircle}
              >
                <HourglassIcon />
              </LinearGradient>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Booking{"\n"}Approval</Text>

          {/* Sub-label */}
          <Text style={styles.subtitle}>
            Our team is reviewing your booking and checking equipment availability.
          </Text>

          {/* Dots + "may take" */}
          <View style={styles.waitRow}>
            <TypingDots color="#8E0FFF" />
            <Text style={styles.waitText}>It may take a few minutes</Text>
          </View>

          {/* Info card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrap}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#8E0FFF" strokeWidth="2" />
                <Path d="M12 8v4M12 16h.01" stroke="#8E0FFF" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={styles.infoText}>
              You can explore the app while we review — we'll notify you once approved.
            </Text>
          </View>

          {/* CTA buttons */}
          <View style={styles.ctaGroup}>
            {/* Primary — purple pill */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
                router.replace("/(tabs)/(home)");
              }}
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
            >
              <LinearGradient
                colors={["#8E0FFF", "#6D00DA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryText}>Explore More</Text>
              </LinearGradient>
            </Pressable>

            {/* Ghost pill — dismiss dialog, stay on payment page */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.ghostInner}>
                <Text style={styles.ghostText}>View Booking Status</Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Rejected dialog ────────────────────────────────────────────────────────
interface BookingRejectedDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingRejectedDialog({ isOpen, onClose }: BookingRejectedDialogProps) {
  const handleGoHome = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onClose();
    router.replace("/(tabs)/(home)");
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" statusBarTranslucent>
      <Animated.View
        entering={FadeIn.duration(280)}
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,0,30,0.55)" }]}
      />

      <View style={styles.sheetContainer}>
        <Animated.View
          entering={FadeInUp.duration(420).springify().damping(20).stiffness(120)}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#EF4444", width: wp(64), height: wp(64), borderRadius: wp(32), alignItems: "center", justifyContent: "center" }]}>
              <Text style={{ fontSize: fp(26), color: "#fff" }}>✕</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: "#EF4444" }]}>Booking{"\n"}Rejected</Text>

          <Text style={styles.subtitle}>
            Your booking request was not approved. This may be due to equipment unavailability.
          </Text>

          <View style={[styles.infoCard, { backgroundColor: "#FEF2F2" }]}>
            <View style={styles.infoIconWrap}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
                <Path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.infoText, { color: "#EF4444" }]}>
              No charges have been made. Please try again with different dates or items.
            </Text>
          </View>

          <View style={styles.ctaGroup}>
            <Pressable
              onPress={handleGoHome}
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
            >
              <LinearGradient
                colors={["#EF4444", "#DC2626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryText}>Back to Home</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(28),
    borderTopRightRadius: wp(28),
    paddingHorizontal: wp(24),
    paddingBottom: hp(48),
    paddingTop: hp(12),
    gap: hp(20),
    shadowColor: "#6D00DA",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 20,
  },
  handle: {
    alignSelf: "center",
    width: wp(40),
    height: hp(4),
    borderRadius: hp(2),
    backgroundColor: "#E5E7EB",
    marginBottom: hp(4),
  },
  iconRow: {
    alignItems: "center",
    paddingTop: hp(8),
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(80),
    height: wp(80),
  },
  pulseRing: {
    position: "absolute",
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    backgroundColor: "#8E0FFF",
  },
  iconCircle: {
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fp(32),
    fontWeight: "800",
    color: "#121217",
    letterSpacing: -1,
    lineHeight: hp(38),
    textAlign: "left",
  },
  subtitle: {
    fontSize: fp(14),
    color: "#6C6C89",
    lineHeight: hp(22),
    textAlign: "left",
    marginTop: -hp(4),
  },
  waitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    backgroundColor: "#F5EDFF",
    borderRadius: wp(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
  },
  waitText: {
    fontSize: fp(13),
    color: "#7B3FBF",
    fontWeight: "500",
  },
  infoCard: {
    flexDirection: "row",
    gap: wp(10),
    alignItems: "flex-start",
    backgroundColor: "#F5F3FF",
    borderRadius: wp(14),
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
  },
  infoIconWrap: {
    marginTop: hp(1),
  },
  infoText: {
    fontSize: fp(13),
    color: "#6C6C89",
    flex: 1,
    lineHeight: hp(19),
  },
  ctaGroup: {
    gap: hp(10),
    marginTop: hp(4),
  },
  primaryBtn: {
    borderRadius: wp(30),
    overflow: "hidden",
  },
  primaryGradient: {
    paddingVertical: hp(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(30),
  },
  primaryText: {
    fontSize: fp(16),
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  ghostBtn: {
    borderRadius: wp(30),
    overflow: "hidden",
  },
  ghostInner: {
    paddingVertical: hp(14),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(30),
    borderWidth: 1.5,
    borderColor: "rgba(142,15,255,0.2)",
    backgroundColor: "rgba(142,15,255,0.05)",
  },
  ghostText: {
    fontSize: fp(15),
    fontWeight: "600",
    color: "#8E0FFF",
  },
});
