/**
 * AnimatedSplashScreen — Jitter-grade motion
 *
 * Motion language:
 * - Dark near-black bg (#0f0a1a) — premium, brand-aligned
 * - Logo: scale(0.92→1) + opacity, spring overshoot easing
 * - "Camorent": each letter staggers in 55ms apart, same spring easing
 * - Fast, confident — total visible time ~2.2s
 * - All on Reanimated UI thread — zero JS jank
 */

import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// ── Brand ─────────────────────────────────────────────────────────────────────
const DARK     = "#0f0a1a";   // near-black with purple tint — premium dark bg
const PURPLE   = "#701ad3";   // brand purple for text on light
const WHITE    = "#ffffff";

const LOGO_SIZE  = 96;
const WORD       = "Camorent";
const FONT_SIZE  = 52;
const STAGGER_MS = 55;        // Jitter-spec stagger between letters

// Jitter's signature spring overshoot easing
const SPRING = Easing.bezier(0.11, 0.89, 0.28, 1.18);
// Clean expo-out for bg transitions
const EXPO   = Easing.bezier(0.16, 1.0, 0.3, 1.0);

const FONT = Platform.select({
  ios:     { fontFamily: "System", fontWeight: "700" as const },
  default: { fontFamily: "Geist-Bold" },
});

// ── Single animated letter ────────────────────────────────────────────────────
function Letter({
  char,
  delayMs,
  color,
}: {
  char: string;
  delayMs: number;
  color: string;
}) {
  const alpha = useSharedValue(0);
  const scale = useSharedValue(0.78);

  useEffect(() => {
    alpha.value = withDelay(delayMs, withTiming(1,   { duration: 420, easing: SPRING }));
    scale.value = withDelay(delayMs, withTiming(1,   { duration: 420, easing: SPRING }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity:   alpha.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[styles.letter, { color }, style]}>
      {char}
    </Animated.Text>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props { onFinish: () => void }

export default function AnimatedSplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState<"logo" | "word" | "out">("logo");
  const [done, setDone]   = useState(false);

  // Logo on dark bg
  const logoAlpha = useSharedValue(0);
  const logoScale = useSharedValue(0.88);

  // Crossfade: dark → light
  const darkBg    = useSharedValue(1);

  // Word container
  const wordAlpha = useSharedValue(0);

  // Whole screen out
  const screenAlpha = useSharedValue(1);

  useEffect(() => {
    // ── Phase 1: Logo appears on dark (500ms) ─────────────────────────────
    logoAlpha.value = withTiming(1, { duration: 460, easing: SPRING });
    logoScale.value = withTiming(1, { duration: 460, easing: SPRING }, () => {

      // ── Phase 2: Hold 500ms, then dark→light crossfade (600ms) ───────────
      darkBg.value    = withDelay(500, withTiming(0, { duration: 600, easing: EXPO }));
      logoAlpha.value = withDelay(500, withTiming(0, { duration: 400, easing: EXPO }));

      // ── Phase 3: Letters stagger in on light bg ───────────────────────────
      // Start 200ms after crossfade begins
      wordAlpha.value = withDelay(650, withTiming(1, { duration: 1, easing: EXPO }, () => {
        runOnJS(setPhase)("word");
      }));

      // ── Phase 4: Screen fades out after all letters + hold ────────────────
      const totalLetterTime = STAGGER_MS * (WORD.length - 1) + 420; // last letter finishes
      const holdAfter       = 900;
      const totalDelay      = 650 + totalLetterTime + holdAfter;

      screenAlpha.value = withDelay(totalDelay, withTiming(0, { duration: 480, easing: EXPO }, () => {
        runOnJS(setDone)(true);
      }));
    });
  }, []);

  useEffect(() => { if (done) onFinish(); }, [done]);

  const darkBgStyle   = useAnimatedStyle(() => ({ opacity: darkBg.value }));
  const logoStyle     = useAnimatedStyle(() => ({
    opacity:   logoAlpha.value,
    transform: [{ scale: logoScale.value }],
  }));
  const wordStyle     = useAnimatedStyle(() => ({ opacity: wordAlpha.value }));
  const screenStyle   = useAnimatedStyle(() => ({ opacity: screenAlpha.value }));

  return (
    <Animated.View style={[styles.root, screenStyle]} pointerEvents="none">

      {/* Light base — always beneath */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#fafafa" }]} />

      {/* Dark bg fades out */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: DARK }, darkBgStyle]}
      />

      {/* Logo — white on dark */}
      <Animated.View style={[styles.center, logoStyle]}>
        <Image
          source={require("../assets/images/android-icon.png")}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Wordmark — staggered letters on light */}
      <Animated.View style={[styles.center, wordStyle]} pointerEvents="none">
        <View style={styles.row}>
          {WORD.split("").map((char, i) => (
            <Letter
              key={i}
              char={char}
              delayMs={i * STAGGER_MS}
              color={PURPLE}
            />
          ))}
        </View>
      </Animated.View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     "center",
    justifyContent: "center",
  },
  row: {
    flexDirection:  "row",
    alignItems:     "baseline",
  },
  letter: {
    ...FONT,
    fontSize:           FONT_SIZE,
    letterSpacing:      -1.5,
    includeFontPadding: false,
  },
});
