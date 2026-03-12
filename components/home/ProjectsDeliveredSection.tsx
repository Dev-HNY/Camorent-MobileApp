import { memo, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Text, YStack } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";

// ─── Images ───────────────────────────────────────────────────────────────────

const IMAGES = [
  { uri: "https://img.camorent.co.in/customer-app/1.webp" },
  { uri: "https://img.camorent.co.in/customer-app/2.webp" },
  { uri: "https://img.camorent.co.in/customer-app/3.webp" },
  { uri: "https://img.camorent.co.in/customer-app/4.webp" },
  { uri: "https://img.camorent.co.in/customer-app/5.webp" },
  { uri: "https://img.camorent.co.in/customer-app/1.webp" },
  { uri: "https://img.camorent.co.in/customer-app/2.webp" },
  { uri: "https://img.camorent.co.in/customer-app/3.webp" },
  { uri: "https://img.camorent.co.in/customer-app/4.webp" }
];

const N = IMAGES.length;

// ─── Layout ───────────────────────────────────────────────────────────────────

const SCREEN_W = Dimensions.get("window").width;
const CARD_W   = wp(155);
const CARD_H   = hp(210);
const CARD_R   = wp(22);
const CARD_MX  = wp(10);
const STEP     = CARD_W + CARD_MX * 2;

// ─── Per-slot coverflow config (matches HTML) ─────────────────────────────────
// d = signed integer distance from center card
// Returns { rotY, tx, sc, frost, op, zIdx } — all inline, no object lookup

type CfgEntry = { rotY: number; tx: number; sc: number; frost: number; op: number; zIdx: number };

// Called on UI thread — must be a worklet with no external object references
function cfgForD(d: number): CfgEntry {
  "worklet";
  const abs = Math.abs(d);
  const sign = d >= 0 ? 1 : -1;
  if (abs === 0) return { rotY:  0,        tx:  0,       sc: 1.00, frost: 0.00, op: 1.00, zIdx: 10 };
  if (abs === 1) return { rotY:  42 * sign, tx: -30 * sign, sc: 0.82, frost: 0.30, op: 0.88, zIdx:  7 };
  if (abs === 2) return { rotY:  58 * sign, tx: -55 * sign, sc: 0.66, frost: 0.55, op: 0.55, zIdx:  4 };
  return              { rotY:  70 * sign, tx: -70 * sign, sc: 0.50, frost: 0.80, op: 0.00, zIdx:  1 };
}

function lerp(a: CfgEntry, b: CfgEntry, t: number): CfgEntry {
  "worklet";
  return {
    rotY:  a.rotY  + (b.rotY  - a.rotY)  * t,
    tx:    a.tx    + (b.tx    - a.tx)    * t,
    sc:    a.sc    + (b.sc    - a.sc)    * t,
    frost: a.frost + (b.frost - a.frost) * t,
    op:    a.op    + (b.op    - a.op)    * t,
    zIdx:  Math.round(a.zIdx + (b.zIdx - a.zIdx) * t),
  };
}

// ─── Single card ──────────────────────────────────────────────────────────────

const CoverCard = memo(({ index, currentIdx }: {
  index: number;
  currentIdx: ReturnType<typeof useSharedValue<number>>;
}) => {
  const animStyle = useAnimatedStyle(() => {
    const cur = currentIdx.value;          // fractional during transition
    const dFloat = index - cur;            // raw fractional distance
    // Wrap to shortest path
    let dWrapped = dFloat;
    const half = Math.floor(N / 2);
    if (dWrapped > half)  dWrapped -= N;
    if (dWrapped < -half) dWrapped += N;

    // Get the two surrounding integer slots and lerp between them
    const dFloor = Math.floor(dWrapped);
    const dCeil  = dFloor + 1;
    const frac   = dWrapped - dFloor;

    const cfgA = cfgForD(dFloor);
    const cfgB = cfgForD(dCeil);
    const cfg  = lerp(cfgA, cfgB, frac);

    return {
      transform: [
        { perspective: 900 },
        { rotateY: `${cfg.rotY}deg` },
        { translateX: cfg.tx },
        { scale: cfg.sc },
      ],
      opacity: cfg.op,
      zIndex:  cfg.zIdx,
    };
  });

  const frostStyle = useAnimatedStyle(() => {
    const cur = currentIdx.value;
    let dWrapped = index - cur;
    const half = Math.floor(N / 2);
    if (dWrapped > half)  dWrapped -= N;
    if (dWrapped < -half) dWrapped += N;

    const dFloor = Math.floor(dWrapped);
    const dCeil  = dFloor + 1;
    const frac   = dWrapped - dFloor;

    const cfgA = cfgForD(dFloor);
    const cfgB = cfgForD(dCeil);
    const frost = cfgA.frost + (cfgB.frost - cfgA.frost) * frac;
    return { opacity: frost };
  });

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <View style={styles.cardInner}>
        <Image source={IMAGES[index]} style={styles.cardImg} resizeMode="cover" />
        <Animated.View style={[StyleSheet.absoluteFill, styles.frosted, frostStyle]} pointerEvents="none" />
      </View>
    </Animated.View>
  );
});
CoverCard.displayName = "CoverCard";

// ─── Track — shifts left/right to keep current card centered ─────────────────

const Track = memo(({ currentIdx, children }: {
  currentIdx: ReturnType<typeof useSharedValue<number>>;
  children: React.ReactNode;
}) => {
  // Center of the track = SCREEN_W/2 − current * STEP − STEP/2
  // but since we lay cards absolutely we just shift them together via translateX
  const trackStyle = useAnimatedStyle(() => {
    const offset = SCREEN_W / 2 - currentIdx.value * STEP - STEP / 2;
    return { transform: [{ translateX: offset }] };
  });

  return (
    <Animated.View style={[styles.track, trackStyle]}>
      {children}
    </Animated.View>
  );
});
Track.displayName = "Track";

// ─── Container ────────────────────────────────────────────────────────────────

const TIMING_CFG = { duration: 550, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) };

export const ProjectsDeliveredSection = memo(() => {
  const currentIdx = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      currentIdx.value = withTiming(
        (Math.round(currentIdx.value) + 1) % N,
        TIMING_CFG,
      );
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.root}>
      {/* Cream SVG background */}
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 358 269"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d="M182.762 19.113C82.3431 19.113 40.1674 5.8047 0 0V253.991C135.766 281.174 296.569 265.317 360 253.991V0C318.828 0 283.18 19.113 182.762 19.113Z"
          fill="#FFF9EB"
        />
      </Svg>

      {/* Header */}
      <YStack alignItems="center" paddingHorizontal={wp(16)} marginBottom={hp(20)} marginTop={hp(44)}>
        <Text fontSize={fp(20)} fontWeight="400" color="#1a1a1a" textAlign="center">
          Over <Text fontSize={fp(20)} fontWeight="800" color="#1a1a1a">500</Text> projects delivered
        </Text>
        <Text
          fontSize={fp(20)}
          color="#b8860b"
          style={{ fontFamily: "PlayfairDisplay-SemiBoldItalic" }}
        >
          Successfully
        </Text>
      </YStack>

      {/* Coverflow stage */}
      <View style={styles.stage}>
        <Track currentIdx={currentIdx}>
          {IMAGES.map((_, i) => (
            <CoverCard key={i} index={i} currentIdx={currentIdx} />
          ))}
        </Track>

        {/* Edge fades */}
        <LinearGradient
          colors={["#FFF9EB", "rgba(255,249,235,0)"]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={styles.fadeLeft}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["rgba(255,249,235,0)", "#FFF9EB"]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={styles.fadeRight}
          pointerEvents="none"
        />
      </View>

      <View style={{ height: hp(28) }} />
    </View>
  );
});
ProjectsDeliveredSection.displayName = "ProjectsDeliveredSection";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  stage: {
    width: "100%",
    height: CARD_H + hp(30),
    overflow: "hidden",
    position: "relative",
  },
  track: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    marginHorizontal: CARD_MX,
  },
  cardInner: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: CARD_R,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImg: {
    width: CARD_W,
    height: CARD_H,
  },
  frosted: {
    borderRadius: CARD_R,
    backgroundColor: "#fff",
  },
  fadeLeft: {
    position: "absolute",
    top: 0, bottom: 0, left: 0,
    width: wp(80),
  },
  fadeRight: {
    position: "absolute",
    top: 0, bottom: 0, right: 0,
    width: wp(80),
  },
});
