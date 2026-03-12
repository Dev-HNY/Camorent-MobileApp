import { memo, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { wp, hp } from "@/utils/responsive";

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
const CARD_W   = wp(112);
const CARD_H   = Math.round(CARD_W * (270 / 190));
const CARD_R   = wp(16);

// ─── Slot config — worklet-safe ───────────────────────────────────────────────

type SlotCfg = { tx: number; ty: number; sc: number; ry: number; op: number; zIdx: number };

function slotForD(d: number): SlotCfg {
  "worklet";
  const abs  = Math.abs(d);
  const sign = d >= 0 ? 1 : -1;
  const S    = SCREEN_W / 420;
  if (abs === 0) return { tx: 0,              ty: 0,      sc: 1.00, ry:  0,         op: 1.00, zIdx: 10 };
  if (abs === 1) return { tx: 148 * sign * S, ty: 14 * S, sc: 0.84, ry: -18 * sign, op: 0.90, zIdx:  8 };
  if (abs === 2) return { tx: 252 * sign * S, ty: 34 * S, sc: 0.68, ry: -30 * sign, op: 0.65, zIdx:  6 };
  return              { tx: 0,              ty: 0,      sc: 0.40, ry:  0,         op: 0.00, zIdx:  0 };
}

function lerpSlot(a: SlotCfg, b: SlotCfg, t: number): SlotCfg {
  "worklet";
  return {
    tx:   a.tx   + (b.tx   - a.tx)   * t,
    ty:   a.ty   + (b.ty   - a.ty)   * t,
    sc:   a.sc   + (b.sc   - a.sc)   * t,
    ry:   a.ry   + (b.ry   - a.ry)   * t,
    op:   a.op   + (b.op   - a.op)   * t,
    zIdx: Math.round(a.zIdx + (b.zIdx - a.zIdx) * t),
  };
}

// ─── Single fan card ──────────────────────────────────────────────────────────

const FanCard = memo(({ index, currentIdx }: {
  index: number;
  currentIdx: ReturnType<typeof useSharedValue<number>>;
}) => {
  const animStyle = useAnimatedStyle(() => {
    const cur = currentIdx.value;
    let dFloat = index - cur;
    const half = Math.floor(N / 2);
    if (dFloat >  half) dFloat -= N;
    if (dFloat < -half) dFloat += N;

    const dFloor = Math.floor(dFloat);
    const dCeil  = dFloor + 1;
    const frac   = dFloat - dFloor;
    const cfg    = lerpSlot(slotForD(dFloor), slotForD(dCeil), frac);

    return {
      transform: [
        { translateX: cfg.tx },
        { translateY: cfg.ty },
        { scale: cfg.sc },
        { perspective: 900 },
        { rotateY: `${cfg.ry}deg` },
      ],
      opacity: cfg.op,
      zIndex:  cfg.zIdx,
    };
  });

  // Green glow border — full strength at center (absDist=0), gone at absDist≥0.6
  const glowStyle = useAnimatedStyle(() => {
    const cur = currentIdx.value;
    let dFloat = index - cur;
    const half = Math.floor(N / 2);
    if (dFloat >  half) dFloat -= N;
    if (dFloat < -half) dFloat += N;

    const absDist = Math.abs(dFloat);
    const glow = interpolate(absDist, [0, 0.6], [1, 0], Extrapolation.CLAMP);

    return {
      borderWidth:   glow * 2.5,
      borderColor:   `rgba(0,255,136,${glow})`,
      // shadowOffset must stay in StyleSheet — only shadowColor/Opacity/Radius here
      shadowColor:   "#00ff88",
      shadowOpacity: glow * 0.55,
      shadowRadius:  glow * 20,
    };
  });

  return (
    <Animated.View style={[styles.card, animStyle, glowStyle]}>
      <Image source={IMAGES[index]} style={styles.cardImg} resizeMode="cover" />
    </Animated.View>
  );
});
FanCard.displayName = "FanCard";

// ─── Container ────────────────────────────────────────────────────────────────

const TIMING_CFG = { duration: 550, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) };
// Extra vertical room: card drop at ±2 slot + padding top/bottom
const SCENE_H    = CARD_H + Math.round((34 * SCREEN_W / 420) * 2) + hp(32);

export const FanCarouselSection = memo(() => {
  const currentIdx = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      currentIdx.value = withTiming(
        (Math.round(currentIdx.value) + 1) % N,
        TIMING_CFG,
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.root}>
      {/* PNG background — stretched to fill */}
      <Image
        source={require("@/assets/new/fav-background.png")}
        style={styles.bg}
        resizeMode="cover"
      />

      {/* Fan scene — centered inside the full section height */}
      <View style={styles.scene}>
        {IMAGES.map((_, i) => (
          <FanCard key={i} index={i} currentIdx={currentIdx} />
        ))}
      </View>
    </View>
  );
});
FanCarouselSection.displayName = "FanCarouselSection";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    width: "100%",
    overflow: "hidden",
    paddingVertical: hp(20),
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scene: {
    width: SCREEN_W,
    height: SCENE_H,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    borderRadius: CARD_R,
    overflow: "hidden",
  },
  cardImg: {
    width: CARD_W,
    height: CARD_H,
  },
});
