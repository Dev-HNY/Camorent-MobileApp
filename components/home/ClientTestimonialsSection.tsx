import { YStack, XStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Animated, Easing, NativeScrollEvent, NativeSyntheticEvent, Dimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const banner1 = require("@/assets/images/brands/banners/Home-1.png");
const banner2 = require("@/assets/images/brands/banners/Home-2.png");
const banner3 = require("@/assets/images/brands/banners/Home-3.png");

const SCREEN_W = Dimensions.get("window").width;
const BANNER_H_PX = hp(140);
const BANNER_PAD = wp(16);
const BANNER_W = SCREEN_W - BANNER_PAD * 2;

const BANNERS = [
  { id: "b1", src: banner1 },
  { id: "b2", src: banner2 },
  { id: "b3", src: banner3 },
];

// Marquee rows — duplicated for seamless infinite loop
const TILE_W = wp(90);
const TILE_H = wp(58);
const TILE_GAP = wp(10);

const ROW1_BASE = [
  { id: "amazon",     src: require("@/assets/images/brands/new/amazon.png") },
  { id: "zoho",       src: require("@/assets/images/brands/new/zoho.png") },
  { id: "netflix",    src: require("@/assets/images/brands/new/netflix.png") },
  { id: "primevideo", src: require("@/assets/images/brands/new/primevideo.png") },
  { id: "apple",      src: require("@/assets/images/brands/new/apple.png") },
  { id: "hyundai",    src: require("@/assets/images/brands/new/hyundai.png") },
  { id: "zomato",     src: require("@/assets/images/brands/new/zomato.png") },
  { id: "unacademy",  src: require("@/assets/images/brands/new/unacademy.png") },
  { id: "ms",         src: require("@/assets/images/brands/new/ms.png") },
];
const ROW2_BASE = [
  { id: "urban",      src: require("@/assets/images/brands/new/urban-company.png") },
  { id: "odoo",       src: require("@/assets/images/brands/new/odoo.png") },
  { id: "bsc",        src: require("@/assets/images/brands/new/bsc.png") },
  { id: "cn",         src: require("@/assets/images/brands/new/cn.png") },
  { id: "growster",   src: require("@/assets/images/brands/new/growster.png") },
  { id: "gullylabs",  src: require("@/assets/images/brands/new/gullylabs.png") },
  { id: "kabuta",     src: require("@/assets/images/brands/new/kabuta.png") },
];

// Duplicate each row so the loop is seamless
const ROW1 = [...ROW1_BASE, ...ROW1_BASE.map(i => ({ ...i, id: i.id + "_b" }))];
const ROW2 = [...ROW2_BASE, ...ROW2_BASE.map(i => ({ ...i, id: i.id + "_b" }))];
const LOOP_W_R1 = (TILE_W + TILE_GAP) * ROW1_BASE.length;
const LOOP_W_R2 = (TILE_W + TILE_GAP) * ROW2_BASE.length;

// ─── MarqueeRow ───────────────────────────────────────────────────────────────
function MarqueeRow({ items, loopW, reverse = false }: { items: typeof ROW1; loopW: number; reverse?: boolean }) {
  const translateX = useRef(new Animated.Value(reverse ? -loopW : 0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const duration = (loopW / 28) * 1000;
    const runLoop = () => {
      translateX.setValue(reverse ? -loopW : 0);
      animRef.current = Animated.timing(translateX, {
        toValue: reverse ? 0 : -loopW,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      animRef.current.start(({ finished }) => { if (finished) runLoop(); });
    };
    runLoop();
    return () => { animRef.current?.stop(); };
  }, []);

  return (
    <Animated.View style={{ flexDirection: "row", transform: [{ translateX }] }}>
      {items.map(({ id, src }) => (
        <View
          key={id}
          style={{
            width: TILE_W,
            height: TILE_H,
            marginRight: TILE_GAP,
            backgroundColor: "#FAFBFF",
            borderRadius: wp(4),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={src}
            contentFit="contain"
            style={{ width: TILE_W * 0.65, height: TILE_H * 0.6 }}
            cachePolicy="memory-disk"
          />
        </View>
      ))}
    </Animated.View>
  );
}

// ─── BrandMarquee ─────────────────────────────────────────────────────────────
function BrandMarquee() {
  return (
    // Outer view has vertical padding so card shadows aren't clipped
    <View style={{ paddingVertical: hp(6) }}>
      {/* Inner view clips only horizontally via negative margins trick */}
      <View style={{ overflow: "hidden" }}>
        <YStack gap={wp(10)} paddingVertical={hp(4)}>
          <MarqueeRow items={ROW1} loopW={LOOP_W_R1} reverse={false} />
          <MarqueeRow items={ROW2} loopW={LOOP_W_R2} reverse={true} />
        </YStack>
        {/* Left fade */}
        <LinearGradient
          colors={["#F2F2F7", "rgba(242,242,247,0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: wp(56), pointerEvents: "none" }}
        />
        {/* Right fade */}
        <LinearGradient
          colors={["rgba(242,242,247,0)", "#F2F2F7"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: wp(56), pointerEvents: "none" }}
        />
      </View>
    </View>
  );
}

// ─── BannerCarousel ──────────────────────────────────────────────────────────
function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        scrollRef.current?.scrollTo({ x: next * BANNER_W, animated: true });
        return next;
      });
    }, 3000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
    if (idx >= 0 && idx < BANNERS.length) setActiveIndex(idx);
  };

  return (
    <YStack gap={hp(10)} paddingHorizontal={BANNER_PAD}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={BANNER_W}
        decelerationRate="fast"
        style={{ borderRadius: wp(14), overflow: "hidden" }}
      >
        {BANNERS.map(({ id, src }) => (
          <View
            key={id}
            style={{
              width: BANNER_W,
              height: BANNER_H_PX,
              borderRadius: wp(14),
              overflow: "hidden",
            }}
          >
            <Image
              source={src}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
              cachePolicy="memory-disk"
            />
          </View>
        ))}
      </ScrollView>

      <XStack justifyContent="center" alignItems="center" gap={6}>
        {BANNERS.map((_, i) => (
          <YStack
            key={i}
            width={i === activeIndex ? wp(24) : wp(6)}
            height={4}
            borderRadius={2}
            backgroundColor={i === activeIndex ? "#8E0FFF" : "#D1D5DB"}
            animation="quick"
          />
        ))}
      </XStack>
    </YStack>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function ClientTestimonialsSection() {
  return (
    <YStack gap={hp(28)}>
      <BannerCarousel />

      <YStack paddingHorizontal={wp(16)} alignItems="center" gap={hp(4)}>
        <Text fontSize={fp(16)} fontWeight="600" color="#121217">
          Our clients
        </Text>
        <Text fontSize={fp(12)} color="#6c6c89" textAlign="center">
          We have served almost every biggest client in India.
        </Text>
      </YStack>

      <BrandMarquee />
    </YStack>
  );
}
