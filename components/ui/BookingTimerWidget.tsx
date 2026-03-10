import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
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
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Rect,
  Defs,
  LinearGradient as SvgGrad,
  Stop,
} from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");
const LOGO = require("@/assets/images/logo.png");

// ─── Dimensions ──────────────────────────────────────────────────────────────
const PILL_W    = SCREEN_W - wp(24);
const NODE_SIZE = wp(44);

// Truck
const TW   = 116;
const TH   = 40;
const TR_W = 72;
const TR_H = 28;

// Scene
const ROAD_H     = hp(22);
const SKY_PAD    = hp(8);
const SCENE_H    = TH + ROAD_H + SKY_PAD;

// Pill heights
const TOP_H      = hp(52); // top info row (fixed)
const EXPANDED_H = TOP_H + SCENE_H;

// ─── Spinning wheel ──────────────────────────────────────────────────────────
const WR = 7;
function SpinWheel({ rot }: { rot: Animated.Value }) {
  const spin = rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const D = WR * 2;
  return (
    <Animated.View style={{ width: D, height: D, transform: [{ rotate: spin }] }}>
      <Svg width={D} height={D} viewBox={`0 0 ${D} ${D}`}>
        <Circle cx={WR} cy={WR} r={WR} fill="#1F2937" />
        <Circle cx={WR} cy={WR} r={WR * 0.56} fill="#374151" />
        <Line x1={WR} y1="1.5" x2={WR} y2={D - 1.5} stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="1.5" y1={WR} x2={D - 1.5} y2={WR} stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
        <Line x1="3" y1="3" x2={D - 3} y2={D - 3} stroke="#6B7280" strokeWidth="1" strokeLinecap="round" />
        <Line x1={D - 3} y1="3" x2="3" y2={D - 3} stroke="#6B7280" strokeWidth="1" strokeLinecap="round" />
        <Circle cx={WR} cy={WR} r={WR * 0.2} fill="#9CA3AF" />
      </Svg>
    </Animated.View>
  );
}

// ─── Scrolling road ───────────────────────────────────────────────────────────
function ScrollingRoad({ height }: { height: number }) {
  const scroll = useRef(new Animated.Value(0)).current;
  const DASH_W  = wp(28);
  const GAP_W   = wp(20);
  const CYCLE   = DASH_W + GAP_W;
  const count   = Math.ceil(PILL_W / CYCLE) + 3;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scroll, {
        toValue: -CYCLE,
        duration: 380,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={{ width: PILL_W, height, overflow: "hidden" }}>
      {/* Road surface */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#4B5563" }]} />
      {/* Dashes */}
      <Animated.View
        style={{
          position: "absolute",
          top: height * 0.42,
          flexDirection: "row",
          transform: [{ translateX: scroll }],
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={{
              width: DASH_W,
              height: hp(2.5),
              backgroundColor: "#F1F5F9",
              borderRadius: 2,
              marginRight: GAP_W,
            }}
          />
        ))}
      </Animated.View>
      {/* Kerb shadow */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: hp(4),
          backgroundColor: "#374151",
        }}
      />
    </View>
  );
}

// ─── Truck ────────────────────────────────────────────────────────────────────
function Truck({ rot }: { rot: Animated.Value }) {
  return (
    <View style={{ width: TW, height: TH }}>
      <Svg width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`}>
        <Defs>
          <SvgGrad id="cab" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7C3AED" />
            <Stop offset="1" stopColor="#4C1D95" />
          </SvgGrad>
          <SvgGrad id="roof" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6D28D9" />
            <Stop offset="1" stopColor="#5B21B6" />
          </SvgGrad>
        </Defs>

        {/* Trailer white body */}
        <Rect x="0" y="5" width={TR_W} height={TR_H} rx="3" fill="white" />
        {/* Brand stripes */}
        <Rect x="0" y="5" width={TR_W} height="3" rx="1.5" fill="#7C3AED" />
        <Rect x="0" y={5 + TR_H - 3} width={TR_W} height="3" rx="1.5" fill="#7C3AED" />

        {/* Hitch */}
        <Rect x={TR_W} y="16" width="7" height="5" rx="2" fill="#3B0764" />

        {/* Cab body */}
        <Rect x="81" y="7" width="35" height="25" rx="3" fill="url(#cab)" />
        {/* Roof deflector */}
        <Rect x="84" y="1" width="25" height="8" rx="3" fill="url(#roof)" />
        <Rect x="84" y="1" width="25" height="3" rx="2" fill="rgba(255,255,255,0.14)" />

        {/* Windshield */}
        <Rect x="85" y="10" width="20" height="14" rx="2.5" fill="#BAE6FD" opacity="0.9" />
        <Rect x="86" y="11" width="5" height="4" rx="1.5" fill="white" opacity="0.45" />

        {/* Exhaust pipe */}
        <Rect x="107" y="0" width="2.5" height="8" rx="1.2" fill="#3B0764" />

        {/* Front grill */}
        <Rect x="111" y="19" width="5" height="9" rx="1.5" fill="#2E1065" />
        <Line x1="111" y1="22" x2="116" y2="22" stroke="#4C1D95" strokeWidth="0.8" />
        <Line x1="111" y1="25" x2="116" y2="25" stroke="#4C1D95" strokeWidth="0.8" />

        {/* Headlight */}
        <Rect x="111" y="11" width="5" height="5" rx="1.5" fill="#FEF3C7" />
        <Rect x="112" y="12" width="3" height="3" rx="1" fill="white" opacity="0.7" />

        {/* Shadow under truck */}
        <Rect x="1" y={5 + TR_H} width={TW - 1} height="3" rx="1" fill="#1E1B4B" opacity="0.22" />
      </Svg>

      {/* Logo overlay on trailer */}
      <View
        style={{
          position: "absolute",
          left: 1,
          top: 8,
          width: TR_W - 2,
          height: TR_H - 6,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={LOGO}
          style={{ width: TR_W - 10, height: TR_H - 10 }}
          resizeMode="contain"
        />
      </View>

      {/* Wheels — 2 axles */}
      {[16, 88].map((left) => (
        <View key={left} style={{ position: "absolute", left, bottom: 0 }}>
          <SpinWheel rot={rot} />
        </View>
      ))}
    </View>
  );
}

// ─── Truck scene ──────────────────────────────────────────────────────────────
function TruckScene() {
  const truckX   = useRef(new Animated.Value(-TW - 10)).current;
  const wheelRot = useRef(new Animated.Value(0)).current;
  const exhaustO = useRef(new Animated.Value(0.1)).current;
  const cloud1X  = useRef(new Animated.Value(PILL_W * 0.1)).current;
  const cloud2X  = useRef(new Animated.Value(PILL_W * 0.55)).current;

  useEffect(() => {
    // Truck drives across — linear so it's constant speed
    Animated.loop(
      Animated.timing(truckX, {
        toValue: PILL_W + TW + 10,
        duration: 3800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Wheel spin
    Animated.loop(
      Animated.timing(wheelRot, {
        toValue: 1,
        duration: 650,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Exhaust puff
    Animated.loop(
      Animated.sequence([
        Animated.timing(exhaustO, { toValue: 0.7, duration: 500, useNativeDriver: true }),
        Animated.timing(exhaustO, { toValue: 0.1, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    // Clouds drift slowly
    Animated.loop(
      Animated.timing(cloud1X, { toValue: -120, duration: 14000, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(cloud2X, { toValue: -120, duration: 20000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const ROAD_TOP  = SKY_PAD + TH;
  const TRUCK_TOP = SKY_PAD;

  return (
    <View style={{ width: PILL_W, height: SCENE_H, overflow: "hidden" }}>
      {/* Sky gradient */}
      <LinearGradient
        colors={["#EFF6FF", "#BFDBFE"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Cloud 1 */}
      <Animated.View
        style={{
          position: "absolute",
          top: hp(4),
          left: 0,
          transform: [{ translateX: cloud1X }],
        }}
      >
        <Svg width={72} height={24} viewBox="0 0 72 24">
          <Ellipse cx="36" cy="18" rx="34" ry="9" fill="white" opacity="0.9" />
          <Ellipse cx="22" cy="14" rx="20" ry="13" fill="white" opacity="0.9" />
          <Ellipse cx="54" cy="15" rx="17" ry="10" fill="white" opacity="0.9" />
        </Svg>
      </Animated.View>

      {/* Cloud 2 */}
      <Animated.View
        style={{
          position: "absolute",
          top: hp(1),
          left: 0,
          transform: [{ translateX: cloud2X }],
        }}
      >
        <Svg width={50} height={20} viewBox="0 0 50 20">
          <Ellipse cx="25" cy="15" rx="23" ry="8" fill="white" opacity="0.8" />
          <Ellipse cx="14" cy="12" rx="14" ry="10" fill="white" opacity="0.8" />
          <Ellipse cx="38" cy="13" rx="12" ry="8" fill="white" opacity="0.8" />
        </Svg>
      </Animated.View>

      {/* Road */}
      <View style={{ position: "absolute", top: ROAD_TOP, left: 0 }}>
        <ScrollingRoad height={ROAD_H} />
      </View>

      {/* Exhaust puffs above truck */}
      <Animated.View
        style={{
          position: "absolute",
          top: TRUCK_TOP - hp(18),
          opacity: exhaustO,
          transform: [{ translateX: truckX }],
        }}
      >
        <View style={{ marginLeft: 107 }}>
          <Svg width={18} height={26} viewBox="0 0 18 26">
            <Ellipse cx="9" cy="23" rx="6" ry="4.5" fill="#C4B5FD" />
            <Ellipse cx="8" cy="15" rx="5" ry="4.5" fill="#C4B5FD" opacity="0.6" />
            <Ellipse cx="9" cy="7"  rx="4" ry="4" fill="#C4B5FD" opacity="0.35" />
            <Ellipse cx="9" cy="1"  rx="2.5" ry="2.5" fill="#C4B5FD" opacity="0.15" />
          </Svg>
        </View>
      </Animated.View>

      {/* Truck */}
      <Animated.View
        style={{
          position: "absolute",
          top: TRUCK_TOP,
          transform: [{ translateX: truckX }],
        }}
      >
        <Truck rot={wheelRot} />
      </Animated.View>
    </View>
  );
}

// ─── Congrats modal ──────────────────────────────────────────────────────────
function CongratsModal({ onDismiss }: { onDismiss: () => void }) {
  const scale   = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.48)", opacity }]} />
        <View style={cm.sheet}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <View style={cm.card}>
              <LinearGradient colors={["#7C3AED", "#A855F7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={cm.bar} />
              <View style={cm.content}>
                <View style={cm.iconWrap}>
                  <LinearGradient colors={["#7C3AED", "#A855F7"]} style={cm.iconGrad}>
                    <Text style={cm.check}>✓</Text>
                  </LinearGradient>
                </View>
                <View style={cm.textGroup}>
                  <Text style={cm.title}>Booking Approved!</Text>
                  <Text style={cm.body}>Your booking has been approved. Proceed to pay and confirm your shoot.</Text>
                </View>
                <Pressable
                  style={cm.btn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onDismiss();
                  }}
                >
                  <LinearGradient
                    colors={["#7C3AED", "#A855F7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={cm.btnGrad}
                  >
                    <Text style={cm.btnText}>Continue to Pay</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable onPress={onDismiss}>
                  <Text style={cm.later}>I'll pay later</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}

// ─── Widget ──────────────────────────────────────────────────────────────────
// DRIVER RULES:
//   useNativeDriver: true  → slideY, entryOp, nodePulse   (transform / opacity)
//   useNativeDriver: false → expand                        (width / height / borderRadius)
// Values are NEVER shared between the two driver types.

export function BookingTimerWidget() {
  const { isActive, isApproved, stopTimer } = useBookingTimerStore();
  const insets = useSafeAreaInsets();
  const [collapsed, setCollapsed] = useState(false);

  // Native-driver values
  const slideY     = useRef(new Animated.Value(-(EXPANDED_H + 60))).current;
  const entryOp    = useRef(new Animated.Value(0)).current;
  const nodePulse  = useRef(new Animated.Value(1)).current;
  const nodePulseRef = useRef<Animated.CompositeAnimation | null>(null);

  // JS-driver value (layout)
  const expand = useRef(new Animated.Value(1)).current; // 1 = pill, 0 = node

  // Derived — JS driver
  const pillW = expand.interpolate({ inputRange: [0, 1], outputRange: [NODE_SIZE, PILL_W] });
  const pillH = expand.interpolate({ inputRange: [0, 1], outputRange: [NODE_SIZE, EXPANDED_H] });
  const pillR = expand.interpolate({ inputRange: [0, 1], outputRange: [NODE_SIZE / 2, wp(18)] });
  const contentOp = expand; // 0→1 as pill opens
  const nodeOp    = expand.interpolate({ inputRange: [0, 0.3, 1], outputRange: [1, 0, 0] });

  // Entry / exit animation
  useEffect(() => {
    if (isActive && !isApproved) {
      setCollapsed(false);
      expand.setValue(1);
      slideY.setValue(-(EXPANDED_H + 60));
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          friction: 9,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(entryOp, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isActive) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: -(EXPANDED_H + 60),
          friction: 9,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(entryOp, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, isApproved]);

  // Node pulse
  useEffect(() => {
    if (collapsed) {
      nodePulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(nodePulse, { toValue: 1.18, duration: 800, useNativeDriver: true }),
          Animated.timing(nodePulse, { toValue: 1,    duration: 800, useNativeDriver: true }),
        ])
      );
      nodePulseRef.current.start();
    } else {
      nodePulseRef.current?.stop();
      nodePulse.setValue(1);
    }
  }, [collapsed]);

  const handleCollapse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCollapsed(true);
    Animated.spring(expand, {
      toValue: 0,
      friction: 10,
      tension: 80,
      useNativeDriver: false,
    }).start();
  };

  const handleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCollapsed(false);
    Animated.spring(expand, {
      toValue: 1,
      friction: 9,
      tension: 65,
      useNativeDriver: false,
    }).start();
  };

  if (!isActive && !isApproved) return null;
  if (isApproved) return <CongratsModal onDismiss={stopTimer} />;

  const TOP = insets.top + hp(10);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: TOP,
        right: wp(12),
        zIndex: 9999,
        elevation: 20,
        transform: [{ translateY: slideY }],
        opacity: entryOp,
        alignItems: "flex-end",
      }}
    >
      {/* Drop shadow layer (JS driver) */}
      <Animated.View
        style={{
          position: "absolute",
          top: hp(5),
          right: 0,
          width: pillW,
          height: pillH,
          borderRadius: pillR,
          shadowColor: "#7C3AED",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 16,
          backgroundColor: "transparent",
        }}
      />

      {/* Pill container (JS driver) */}
      <Animated.View
        style={{
          width: pillW,
          height: pillH,
          borderRadius: pillR,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(124,58,237,0.2)",
        }}
      >
        {/* Background */}
        {Platform.OS === "ios" ? (
          <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.97)" }]} />
        )}

        {/* ── Collapsed node ── */}
        <Animated.View
          pointerEvents={collapsed ? "auto" : "none"}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: nodeOp,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Pressable
            onPress={handleExpand}
            style={{ alignItems: "center", justifyContent: "center", flex: 1, width: "100%" }}
          >
            <Animated.View style={{ transform: [{ scale: nodePulse }] }}>
              <LinearGradient
                colors={["#7C3AED", "#A855F7"]}
                style={{
                  width: wp(28),
                  height: wp(28),
                  borderRadius: wp(14),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                  <Path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </Svg>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* ── Expanded pill content ── */}
        <Animated.View
          pointerEvents={collapsed ? "none" : "auto"}
          style={{ flex: 1, opacity: contentOp }}
        >
          {/* Left accent stripe */}
          <LinearGradient
            colors={["#7C3AED", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: wp(3.5) }}
          />

          {/* Top info row */}
          <View style={bw.topRow}>
            <View style={bw.liveDot} />
            <View style={bw.textCol}>
              <Text style={bw.title} numberOfLines={1}>Booking under review</Text>
              <Text style={bw.sub} numberOfLines={1}>May take a few minutes</Text>
            </View>
            <Pressable onPress={handleCollapse} hitSlop={12} style={bw.closeBtn}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke="#7C3AED" strokeWidth="2.8" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* Truck scene — tappable */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.replace("/checkout/payment");
            }}
            style={{
              overflow: "hidden",
              borderBottomLeftRadius: wp(18),
              borderBottomRightRadius: wp(18),
            }}
          >
            <TruckScene />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const bw = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(14),
    paddingRight: wp(10),
    paddingVertical: hp(10),
    height: TOP_H,
    gap: wp(8),
  },
  liveDot: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: "#7C3AED",
  },
  textCol: { flex: 1, gap: hp(2) },
  title: { fontSize: fp(12.5), fontWeight: "700", color: "#1E1B4B", letterSpacing: -0.2 },
  sub:   { fontSize: fp(10.5), color: "#6B7280" },
  closeBtn: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: "rgba(124,58,237,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});

const cm = StyleSheet.create({
  sheet: { flex: 1, justifyContent: "flex-end", paddingBottom: hp(44) },
  card: {
    marginHorizontal: wp(20),
    borderRadius: wp(24),
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 18,
  },
  bar:     { height: hp(4) },
  content: { padding: wp(28), gap: hp(20), alignItems: "center" },
  iconWrap:  { width: wp(64), height: wp(64), borderRadius: wp(32), overflow: "hidden" },
  iconGrad:  { width: wp(64), height: wp(64), borderRadius: wp(32), alignItems: "center", justifyContent: "center" },
  check:     { fontSize: fp(28), color: "#FFFFFF", fontWeight: "700" },
  textGroup: { gap: hp(8), alignItems: "center", width: "100%" },
  title:     { fontSize: fp(20), fontWeight: "700", color: "#121217", textAlign: "center", letterSpacing: -0.4 },
  body:      { fontSize: fp(14), color: "#6C6C89", textAlign: "center", lineHeight: hp(20) },
  btn:       { width: "100%" },
  btnGrad:   { borderRadius: wp(14), paddingVertical: hp(16), alignItems: "center" },
  btnText:   { fontSize: fp(16), fontWeight: "700", color: "#FFFFFF" },
  later:     { fontSize: fp(13), color: "#9CA3AF", fontWeight: "500" },
});
