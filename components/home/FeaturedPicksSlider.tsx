import { memo, useEffect, useRef } from "react";
import { Image, ScrollView, StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface SliderCard {
  id: string;
  image: { uri: string };
}

const CARDS: SliderCard[] = [
  { id: "1",  image: { uri: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=360&h=520&fit=crop" } },
  { id: "2",  image: { uri: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=360&h=520&fit=crop" } },
  { id: "3",  image: { uri: "https://images.unsplash.com/photo-1452457750107-be84244be493?w=360&h=520&fit=crop" } },
  { id: "4",  image: { uri: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=360&h=520&fit=crop" } },
  { id: "5",  image: { uri: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=360&h=520&fit=crop" } },
  { id: "6",  image: { uri: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=360&h=520&fit=crop" } },
  { id: "7",  image: { uri: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=360&h=520&fit=crop" } },
  { id: "8",  image: { uri: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=360&h=520&fit=crop" } },
  { id: "9",  image: { uri: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=360&h=520&fit=crop" } },
  { id: "10", image: { uri: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=360&h=520&fit=crop" } },
];

const LOOPED = [...CARDS, ...CARDS, ...CARDS];

// ─── Layout ───────────────────────────────────────────────────────────────────

const SCREEN_W = Dimensions.get("window").width;
const CW   = Math.round(SCREEN_W / 4 * 0.88);
const CH   = Math.round(CW * 2.3);
const CR   = Math.round(CW * 0.11);
const GAP  = Math.round(SCREEN_W / 12 * 0.12);
const STEP = CW + GAP;
const SET_W = CARDS.length * STEP;
const INIT_OFFSET = SET_W + (SCREEN_W - CW) / 2 - GAP;

// ─── Card ─────────────────────────────────────────────────────────────────────

const ConvexCard = memo(({ card, cardIndex, scrollX }: {
  card: SliderCard;
  cardIndex: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
}) => {
  const cardCenter = (SCREEN_W - CW) / 2 + cardIndex * STEP + CW / 2;

  const animStyle = useAnimatedStyle(() => {
    const viewportCenter = scrollX.value + SCREEN_W / 2;
    const dist  = Math.abs(viewportCenter - cardCenter);
    const t     = Math.min(dist / (SCREEN_W / 2), 1);
    const scale = 0.65 + (t * t) * 0.35;
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <Image source={card.image} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );
});
ConvexCard.displayName = "ConvexCard";

// ─── Container ────────────────────────────────────────────────────────────────

export const FeaturedPicksSlider = memo(() => {
  const scrollRef  = useRef<ScrollView>(null);
  const scrollX    = useSharedValue(INIT_OFFSET);
  const liveOffset = useRef(INIT_OFFSET);
  const paused     = useRef(false);
  const tickRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: INIT_OFFSET, animated: false });

    tickRef.current = setInterval(() => {
      if (paused.current) return;

      let next = liveOffset.current + 2.1;
      if (next >= SET_W * 2 + (SCREEN_W - CW) / 2) next -= SET_W;

      liveOffset.current = next;
      scrollX.value      = next;
      scrollRef.current?.scrollTo({ x: next, animated: false });
    }, 16);

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  return (
    <View style={styles.stage}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => { paused.current = true; }}
        onScrollEndDrag={() => { paused.current = false; }}
        onMomentumScrollEnd={() => { paused.current = false; }}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          scrollX.value      = x;
          liveOffset.current = x;
        }}
        contentContainerStyle={styles.track}
      >
        {LOOPED.map((card, i) => (
          <ConvexCard
            key={`${card.id}-${i}`}
            card={card}
            cardIndex={i}
            scrollX={scrollX}
          />
        ))}
      </ScrollView>

      <LinearGradient
        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={styles.edgeFadeLeft}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={styles.edgeFadeRight}
        pointerEvents="none"
      />
    </View>
  );
});
FeaturedPicksSlider.displayName = "FeaturedPicksSlider";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    height: CH + 20,
    overflow: "hidden",
  },
  track: {
    alignItems: "center",
    gap: GAP,
    paddingHorizontal: (SCREEN_W - CW) / 2,
  },
  card: {
    width: CW,
    height: CH,
    borderRadius: CR,
    overflow: "hidden",
  },
  image: {
    width: CW,
    height: CH,
  },
  edgeFadeLeft: {
    position: "absolute",
    top: 0, bottom: 0, left: 0,
    width: 80,
  },
  edgeFadeRight: {
    position: "absolute",
    top: 0, bottom: 0, right: 0,
    width: 80,
  },
});
