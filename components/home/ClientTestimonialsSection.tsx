import { YStack, XStack, Text, Card } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import { memo, useEffect, useRef, useState } from "react";
import { ScrollView, Animated, Easing, NativeScrollEvent, NativeSyntheticEvent, Dimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import bannerImage from "@/assets/images/testimoni-1.png";
import clientImage from "@/assets/images/client-1.png";

// Banner images — extracted PNGs from the SVG files (avoids SVG transformer overhead)
const banner1 = require("@/assets/images/brands/banners/1.png");
const banner2 = require("@/assets/images/brands/banners/2.png");
const banner3 = require("@/assets/images/brands/banners/3.png");
const banner4 = require("@/assets/images/brands/banners/4.png");

const SCREEN_W = Dimensions.get("window").width;
const BANNER_H_PX = hp(110);
const BANNER_PAD = wp(2);
const BANNER_W = SCREEN_W - BANNER_PAD * 2;

// --- Static data ---

// Banner carousel items — PNG images
const BANNERS = [
  { id: "b1", src: banner1 },
  { id: "b2", src: banner2 },
  { id: "b3", src: banner3 },
  { id: "b4", src: banner4 },
];

// Brand rows using SVG files. Duplicated for seamless infinite loop.
const BRAND_ROW1 = [
  { id: "amazon",        src: require("@/assets/images/brands/new/amazon.svg") },
  { id: "netflix",       src: require("@/assets/images/brands/new/netflix.svg") },
  { id: "apple",         src: require("@/assets/images/brands/new/apple.svg") },
  { id: "prime-video",   src: require("@/assets/images/brands/new/prime-video.svg") },
  { id: "zoho",          src: require("@/assets/images/brands/new/zoho.svg") },
  { id: "amazon2",       src: require("@/assets/images/brands/new/amazon.svg") },
  { id: "netflix2",      src: require("@/assets/images/brands/new/netflix.svg") },
  { id: "apple2",        src: require("@/assets/images/brands/new/apple.svg") },
  { id: "prime-video2",  src: require("@/assets/images/brands/new/prime-video.svg") },
  { id: "zoho2",         src: require("@/assets/images/brands/new/zoho.svg") },
];

const BRAND_ROW2 = [
  { id: "urban",    src: require("@/assets/images/brands/new/urban-company.svg") },
  { id: "odoo",     src: require("@/assets/images/brands/new/odoo.svg") },
  { id: "amazon3",  src: require("@/assets/images/brands/new/amazon.svg") },
  { id: "zoho3",    src: require("@/assets/images/brands/new/zoho.svg") },
  { id: "netflix3", src: require("@/assets/images/brands/new/netflix.svg") },
  { id: "urban2",   src: require("@/assets/images/brands/new/urban-company.svg") },
  { id: "odoo2",    src: require("@/assets/images/brands/new/odoo.svg") },
  { id: "amazon4",  src: require("@/assets/images/brands/new/amazon.svg") },
  { id: "zoho4",    src: require("@/assets/images/brands/new/zoho.svg") },
  { id: "netflix4", src: require("@/assets/images/brands/new/netflix.svg") },
];

const TESTIMONIALS = [
  {
    id: "1",
    quote: '"Camorent has been a game-changer for our productions. The quality of equipment and timely delivery has never let us down. Highly recommended for any serious filmmaker."',
    name: "Rajesh Sharma",
    role: "Director of Photography",
    company: "Dharma Productions",
    avatar: clientImage,
    bannerImage: bannerImage,
    movieLabel: "Brahmastra",
    rating: 5,
  },
  {
    id: "2",
    quote: '"Outstanding camera rental experience! The gear was in perfect condition and the support team was incredibly helpful throughout our shoot."',
    name: "Priya Mehta",
    role: "Cinematographer",
    company: "Yash Raj Films",
    avatar: clientImage,
    bannerImage: bannerImage,
    movieLabel: "Film 2",
    rating: 5,
  },
  {
    id: "3",
    quote: '"Professional service with top-of-the-line equipment. Camorent made our entire production seamless from start to finish."',
    name: "Vikram Kapoor",
    role: "Film Director",
    company: "T-Series Films",
    avatar: clientImage,
    bannerImage: bannerImage,
    movieLabel: "Film 3",
    rating: 5,
  },
];

// Logo card dimensions (smaller)
const LOGO_W = wp(76);
const LOGO_H = hp(40);
const LOGO_GAP = wp(8);
const ROW1_LOOP_W = (LOGO_W + LOGO_GAP) * 5;
const ROW2_LOOP_W = (LOGO_W + LOGO_GAP) * 5;

// ─── StarIcon ───────────────────────────────────────────────────────────────
function StarIcon() {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
      <Path
        d="M5.53313 0.582102C5.43477 0.377957 5.22691 0.248047 4.99864 0.248047C4.77037 0.248047 4.56437 0.377957 4.46415 0.582102L3.27084 3.03741L0.605818 3.43085C0.383115 3.46426 0.197528 3.62015 0.128861 3.83357C0.0601943 4.047 0.11587 4.28269 0.275474 4.44044L2.20928 6.35383L1.75274 9.05782C1.71562 9.28053 1.80842 9.50694 1.99215 9.63871C2.17587 9.77048 2.41899 9.78718 2.61943 9.68139L5.0005 8.41013L7.38157 9.68139C7.582 9.78718 7.82512 9.77233 8.00885 9.63871C8.19258 9.50509 8.28537 9.28053 8.24826 9.05782L7.78986 6.35383L9.72367 4.44044C9.88327 4.28269 9.9408 4.047 9.87028 3.83357C9.79976 3.62015 9.61603 3.46426 9.39332 3.43085L6.72645 3.03741L5.53313 0.582102Z"
        fill="#FFB304"
      />
    </Svg>
  );
}

// ─── QuoteIcon ──────────────────────────────────────────────────────────────
const QuoteIcon = () => (
  <Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
    <Path
      d="M14.2844 14.2841C14.7053 14.2841 15.109 14.1169 15.4066 13.8192C15.7043 13.5216 15.8715 13.1179 15.8715 12.6969V8.82121C15.8715 8.40028 15.7043 7.99659 15.4066 7.69894C15.109 7.4013 14.7053 7.23409 14.2844 7.23409H12.0815C12.0815 6.67648 12.1143 6.11887 12.1799 5.56126C12.2783 4.97086 12.4423 4.44605 12.6719 3.98684C12.9015 3.52764 13.1972 3.1663 13.5591 2.90284C13.9188 2.60764 14.378 2.46003 14.9367 2.46003V0C14.0183 0 13.2141 0.196803 12.5243 0.590408C11.8392 0.979054 11.2506 1.51721 10.8022 2.16483C10.3509 2.87768 10.0185 3.65924 9.81822 4.47885C9.61568 5.3831 9.51664 6.30745 9.52302 7.23409V12.6969C9.52302 13.1179 9.69023 13.5216 9.98788 13.8192C10.2855 14.1169 10.6892 14.2841 11.1101 14.2841H14.2844ZM4.76166 14.2841C5.18259 14.2841 5.58628 14.1169 5.88393 13.8192C6.18157 13.5216 6.34878 13.1179 6.34878 12.6969V8.82121C6.34878 8.40028 6.18157 7.99659 5.88393 7.69894C5.58628 7.4013 5.18259 7.23409 4.76166 7.23409H2.55874C2.55874 6.67648 2.59154 6.11887 2.65714 5.56126C2.7566 4.97086 2.92061 4.44605 3.14915 3.98684C3.37875 3.52764 3.67449 3.1663 4.03635 2.90284C4.3961 2.60764 4.8553 2.46003 5.41397 2.46003V0C4.49556 0 3.69142 0.196803 3.00155 0.590408C2.31646 0.979054 1.72784 1.51721 1.27952 2.16483C0.828165 2.87768 0.495817 3.65924 0.295511 4.47885C0.0929689 5.3831 -0.00606915 6.30745 0.000307187 7.23409V12.6969C0.000307187 13.1179 0.167521 13.5216 0.465163 13.8192C0.762806 14.1169 1.1665 14.2841 1.58743 14.2841H4.76166Z"
      fill="white"
    />
  </Svg>
);

// ─── TestimonialCard ─────────────────────────────────────────────────────────
const TestimonialCard = memo(({ t }: { t: typeof TESTIMONIALS[0] }) => (
  <Card
    width={wp(250)}
    backgroundColor="white"
    borderRadius={wp(12)}
    padding={wp(16)}
    marginRight={wp(16)}
    shadowColor="rgba(0,0,0,0.08)"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={1}
    shadowRadius={12}
    elevation={3}
  >
    <YStack gap={hp(6)}>
      <YStack
        width={wp(25)}
        height={wp(25)}
        borderRadius={wp(16.5)}
        backgroundColor="#0548FF"
        alignItems="center"
        justifyContent="center"
        alignSelf="flex-start"
      >
        <QuoteIcon />
      </YStack>

      <YStack borderRadius={wp(10)} overflow="hidden" height={hp(96)} position="relative">
        <Image
          source={t.bannerImage}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
          cachePolicy="memory-disk"
        />
        <YStack
          position="absolute"
          bottom={hp(6)}
          left={wp(6)}
          backgroundColor="rgba(0,0,0,0.45)"
          borderRadius={wp(8)}
          paddingHorizontal={wp(8)}
          paddingVertical={hp(2)}
        >
          <Text fontSize={fp(8)} color="#f2f2f7">{t.movieLabel}</Text>
        </YStack>
      </YStack>

      <Text fontSize={fp(8.5)} color="#6c6c89" lineHeight={fp(13)} numberOfLines={4}>
        {t.quote}
      </Text>

      <XStack alignItems="center" gap={wp(8)}>
        <Image
          source={t.avatar}
          contentFit="cover"
          style={{ width: wp(43), height: wp(43), borderRadius: wp(21.5) }}
          cachePolicy="memory-disk"
        />
        <YStack gap={hp(2)}>
          <Text fontSize={fp(9)} fontWeight="600" color="#121217">{t.name}</Text>
          <Text fontSize={fp(8)} color="#6c6c89">{t.role}</Text>
          <Text fontSize={fp(7)} color="#0548ff">{t.company}</Text>
        </YStack>
      </XStack>

      <XStack gap={wp(2)}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </XStack>
    </YStack>
  </Card>
));

TestimonialCard.displayName = "TestimonialCard";

// ─── MarqueeRow ──────────────────────────────────────────────────────────────
function MarqueeRow({
  items,
  loopWidth,
  speed = 30,
  startOffset = 0,
}: {
  items: { id: string; src: any }[];
  loopWidth: number;
  speed?: number;
  startOffset?: number;
}) {
  const translateX = useRef(new Animated.Value(startOffset)).current;

  useEffect(() => {
    const duration = (loopWidth / speed) * 1000;
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: startOffset - loopWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={{ flexDirection: "row", transform: [{ translateX }] }}>
      {items.map(({ id, src }) => (
        <YStack
          key={id}
          width={LOGO_W}
          height={LOGO_H}
          borderRadius={wp(8)}
          backgroundColor="#FAFBFF"
          borderWidth={1}
          borderColor="#ebebef"
          alignItems="center"
          justifyContent="center"
          marginRight={LOGO_GAP}
          padding={wp(10)}
        >
          <Image
            source={src}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
            cachePolicy="memory-disk"
          />
        </YStack>
      ))}
    </Animated.View>
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

      {/* Dot indicators */}
      <XStack justifyContent="center" alignItems="center" gap={wp(6)}>
        {BANNERS.map((_, i) => (
          <YStack
            key={i}
            width={i === activeIndex ? wp(24) : wp(6)}
            height={hp(6)}
            borderRadius={wp(3)}
            backgroundColor={i === activeIndex ? "#8E0FFF" : "#D1D1DB"}
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

      {/* 1. "Our clients" heading */}
      <YStack paddingHorizontal={wp(16)} alignItems="center">
        <Text fontSize={fp(16)} fontWeight="600" color="#121217" marginBottom={hp(4)}>
          Our clients
        </Text>
        <Text fontSize={fp(12)} color="#6c6c89" textAlign="center">
          We have served almost every biggest client in India.
        </Text>
      </YStack>

      {/* 2. Infinite auto-scroll brand rows — fade left edge in, fade right edge out */}
      <View style={{ overflow: "hidden" }}>
        <YStack gap={hp(8)}>
          <MarqueeRow items={BRAND_ROW1} loopWidth={ROW1_LOOP_W} speed={30} startOffset={0} />
          <MarqueeRow items={BRAND_ROW2} loopWidth={ROW2_LOOP_W} speed={25} startOffset={-(LOGO_W + LOGO_GAP) * 0.5} />
        </YStack>
        {/* Left: white → transparent (logos fade in from left edge to center) */}
        <LinearGradient
          colors={["#ffffff", "rgba(255,255,255,0.6)", "rgba(255,255,255,0)"]}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: wp(72), pointerEvents: "none" }}
        />
        {/* Right: transparent → white (logos fade out toward right edge) */}
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.7)", "#ffffff"]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: wp(96), pointerEvents: "none" }}
        />
      </View>

      {/* 3. Banner carousel (brands/banners/1–4.svg) */}
      <BannerCarousel />

      {/* 4. "What DOPs Say" title */}
      <YStack gap={hp(10)} paddingHorizontal={wp(16)}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={fp(16)} fontWeight="600" color="#121217">What DOPs Say About Us</Text>
        </XStack>
      </YStack>

      {/* 5. Testimonial cards horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: wp(16), paddingBottom: hp(8) }}
        snapToInterval={wp(250) + wp(16)}
        decelerationRate="fast"
      >
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </ScrollView>

    </YStack>
  );
}
