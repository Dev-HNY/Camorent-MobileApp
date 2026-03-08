import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
  View,
  Text,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useBookingTimerStore } from "@/store/bookingTimer/bookingTimer";
import { hp, wp, fp } from "@/utils/responsive";

const COUNTDOWN_DURATION = 5 * 60;
const WIDGET_W = wp(210);
const WIDGET_H = hp(64);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ── Congrats modal shown when booking is approved ──────────────────────────
function CongratsModal({ onDismiss }: { onDismiss: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGoToPay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDismiss();
    // User is already on the payment page — dismiss so Pay Now button becomes active
  };

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.55)", opacity: opacityAnim }]}
        />
        <View style={styles.modalSheet}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
            <View style={styles.congratsCard}>
              {/* Purple accent bar */}
              <LinearGradient
                colors={["#8E0FFF", "#B44FFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentBar}
              />

              <View style={styles.congratsContent}>
                {/* Check icon — purple brand */}
                <View style={styles.checkIconWrap}>
                  <LinearGradient
                    colors={["#8E0FFF", "#B44FFF"]}
                    style={styles.checkIconGradient}
                  >
                    <Text style={styles.checkEmoji}>✓</Text>
                  </LinearGradient>
                </View>

                <View style={styles.congratsTextGroup}>
                  <Text style={styles.congratsTitle}>Booking Approved!</Text>
                  <Text style={styles.congratsBody}>
                    Great news! Your booking has been approved by our team. Proceed to pay and confirm your shoot.
                  </Text>
                </View>

                {/* Pay Now CTA — purple */}
                <Pressable style={styles.payNowBtn} onPress={handleGoToPay}>
                  <LinearGradient
                    colors={["#8E0FFF", "#B44FFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.payNowGradient}
                  >
                    <Text style={styles.payNowText}>Continue</Text>
                  </LinearGradient>
                </Pressable>

                {/* Later link */}
                <Pressable onPress={onDismiss}>
                  <Text style={styles.laterText}>I'll pay later</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}

// ── Main floating widget ───────────────────────────────────────────────────
export function BookingTimerWidget() {
  const { isActive, isApproved, startTimestamp, stopTimer } = useBookingTimerStore();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [remainingTime, setRemainingTime] = useState(COUNTDOWN_DURATION);

  const initialX = SCREEN_W - WIDGET_W - wp(12);
  const initialY = insets.top + hp(80);

  // pan — useNativeDriver: false (position must go through JS for layout)
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const posRef = useRef({ x: initialX, y: initialY });

  // pulse — separate value, useNativeDriver: true (only scale, no layout)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!isActive || isApproved) {
      pulseLoopRef.current?.stop();
      pulseAnim.setValue(1);
      return;
    }
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulseLoopRef.current.start();
    return () => { pulseLoopRef.current?.stop(); };
  }, [isActive, isApproved]);

  // Countdown
  useEffect(() => {
    if (!isActive || startTimestamp === null) return;
    const update = () => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setRemainingTime(Math.max(0, COUNTDOWN_DURATION - elapsed));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [isActive, startTimestamp]);

  // Reset position on activation
  useEffect(() => {
    if (isActive) {
      const newX = SCREEN_W - WIDGET_W - wp(12);
      const newY = insets.top + hp(80);
      pan.setValue({ x: newX, y: newY });
      posRef.current = { x: newX, y: newY };
    }
  }, [isActive]);

  // Track position via listeners for clamping
  useEffect(() => {
    const xId = pan.x.addListener(({ value }) => { posRef.current.x = value; });
    const yId = pan.y.addListener(({ value }) => { posRef.current.y = value; });
    return () => { pan.x.removeListener(xId); pan.y.removeListener(yId); };
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 4 || Math.abs(gs.dy) > 4,
      onPanResponderGrant: () => {
        pan.setOffset({ x: posRef.current.x, y: posRef.current.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const clampedX = Math.max(wp(8), Math.min(SCREEN_W - WIDGET_W - wp(8), posRef.current.x));
        const clampedY = Math.max(insets.top + hp(8), Math.min(SCREEN_H - WIDGET_H - hp(100), posRef.current.y));
        const snapX = clampedX < SCREEN_W / 2 - WIDGET_W / 2 ? wp(8) : SCREEN_W - WIDGET_W - wp(8);
        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          useNativeDriver: false,
          friction: 7,
          tension: 60,
        }).start();
        posRef.current = { x: snapX, y: clampedY };
      },
    })
  ).current;

  if (!isActive && !isApproved) return null;

  // Show congrats modal when approved
  if (isApproved) {
    return <CongratsModal onDismiss={() => stopTimer()} />;
  }

  const isUrgent = remainingTime <= 60;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/checkout/payment");
  };

  return (
    // Outer view: pan only (useNativeDriver: false for position)
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Inner view: pulse only (useNativeDriver: true for scale) */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable onPress={handlePress} style={styles.pressable}>
          {/* Glassmorphic background */}
          {Platform.OS === "ios" ? (
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
          )}

          {/* Subtle tinted overlay */}
          <LinearGradient
            colors={
              isUrgent
                ? ["rgba(255,68,68,0.75)", "rgba(204,0,0,0.80)"]
                : ["rgba(142,15,255,0.72)", "rgba(106,0,224,0.80)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.widgetRow}>
            {/* Live dot */}
            <View
              style={[
                styles.liveDot,
                { backgroundColor: isUrgent ? "#FFD700" : "rgba(255,255,255,0.85)" },
              ]}
            />

            <View style={styles.widgetInfo}>
              <Text style={styles.widgetLabel} numberOfLines={1}>
                Booking pending approval
              </Text>
              <Text style={styles.widgetTimer}>{formatTime(remainingTime)}</Text>
            </View>

            <Text style={styles.widgetCameraEmoji}>📷</Text>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Floating widget
  container: {
    position: "absolute",
    width: WIDGET_W,
    zIndex: 9999,
    elevation: 20,
    shadowColor: "#8E0FFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  pressable: {
    borderRadius: wp(18),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
  },
  androidGlass: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  widgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    paddingHorizontal: wp(14),
    paddingVertical: hp(11),
  },
  liveDot: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
  },
  widgetInfo: {
    flex: 1,
    gap: hp(1),
  },
  widgetLabel: {
    fontSize: fp(9.5),
    color: "rgba(255,255,255,0.80)",
    fontWeight: "500",
  },
  widgetTimer: {
    fontSize: fp(17),
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  widgetCameraEmoji: {
    fontSize: fp(18),
  },
  // Congrats modal
  modalSheet: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: hp(44),
  },
  congratsCard: {
    marginHorizontal: wp(20),
    borderRadius: wp(28),
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#8E0FFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 18,
  },
  accentBar: {
    height: hp(4),
  },
  congratsContent: {
    padding: wp(28),
    gap: hp(20),
    alignItems: "center",
  },
  checkIconWrap: {
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  checkIconGradient: {
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
    alignItems: "center",
    justifyContent: "center",
  },
  checkEmoji: {
    fontSize: fp(28),
    color: "#FFFFFF",
    fontWeight: "700",
  },
  congratsTextGroup: {
    gap: hp(8),
    alignItems: "center",
    width: "100%",
  },
  congratsTitle: {
    fontSize: fp(20),
    fontWeight: "700",
    color: "#121217",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  congratsBody: {
    fontSize: fp(14),
    color: "#6C6C89",
    textAlign: "center",
    lineHeight: hp(20),
  },
  payNowBtn: {
    width: "100%",
  },
  payNowGradient: {
    borderRadius: wp(14),
    paddingVertical: hp(16),
    alignItems: "center",
  },
  payNowText: {
    fontSize: fp(16),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  laterText: {
    fontSize: fp(13),
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
