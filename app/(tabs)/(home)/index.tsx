import { YStack, View, Spinner, Text, XStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  Easing,
  Dimensions,
  Pressable,
  ScrollView as RNScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from "react-native";
import { Redirect, router } from "expo-router";
import { useAuthStore } from "@/store/auth/auth";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductListSection } from "@/components/home/ProductListSection";
import { OffersSection } from "@/components/home/OffersSection";
import { Footer } from "@/components/home/Footer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { HowDoIRollSection } from "@/components/home/HowDoIRollSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { ClientTestimonialsSection } from "@/components/home/ClientTestimonialsSection";
import { RentNowCards } from "@/components/home/RentNowCards";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { StickyCartButton } from "@/components/ui/StickyCartButton";
import { ChevronDown, Search, Heart, ShoppingCart, Mic } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, Text as RNText } from "react-native";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { CitySelectionModal } from "@/components/city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

// Static white→transparent overlay
const GradientFade = () => (
  <LinearGradient
    colors={["#ffffff", "rgba(255,255,255,0.82)", "rgba(255,255,255,0.30)", "rgba(255,255,255,0)"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    pointerEvents="none"
    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
  />
);

const SEARCH_HINTS = [
  "Camera & Lights",
  "Gimbles, Go Pro's",
  "Movie Grade Lenses",
  "Other accessories",
];

const SLOT_H = fp(19);

// Glassmorphic search bar — full width, reduced height, animated placeholder
function SearchBar() {
  // Track which slot (A=0, B=1) shows which hint index
  const slotHint = useRef([0, 1]);        // slotHint[slot] = hint index shown in that slot
  const activeSlot = useRef(0);           // slot currently visible (resting position)
  const [, forceRender] = useState(0);    // trigger re-read of slotHint refs after swap

  // Each slot gets its own Animated.Value, starts at resting Y
  // Slot A rests at y=0, Slot B rests at y=+SLOT_H (off-screen below)
  const slotY = useRef([
    new Animated.Value(0),       // Slot A — visible
    new Animated.Value(SLOT_H),  // Slot B — hidden below
  ]).current;
  const slotOpacity = useRef([
    new Animated.Value(1),       // Slot A — fully visible
    new Animated.Value(0),       // Slot B — hidden
  ]).current;

  const animating = useRef(false);

  const tick = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const curr = activeSlot.current;
    const next = 1 - curr;

    // Load next hint into the incoming slot (it's off-screen, no visual change)
    slotHint.current[next] = (slotHint.current[curr] + 1) % SEARCH_HINTS.length;
    forceRender((n) => n + 1);

    // Animate both slots simultaneously
    Animated.parallel([
      // Outgoing slot: slide up and fade out
      Animated.timing(slotY[curr], {
        toValue: -SLOT_H,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slotOpacity[curr], {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      // Incoming slot: slide in from below and fade in
      Animated.timing(slotY[next], {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slotOpacity[next], {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) { animating.current = false; return; }
      // Instantly reset outgoing slot to below (off-screen) without any visual jump
      slotY[curr].setValue(SLOT_H);
      slotOpacity[curr].setValue(0);
      activeSlot.current = next;
      animating.current = false;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 2800);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <View style={sbStyles.shadow}>
      <View style={sbStyles.inner}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={55} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, sbStyles.androidBg]} />
        )}
        <Search size={17} color="#8E0FFF" strokeWidth={2.2} />
        {/* Fixed prefix + simultaneous ticker animation */}
        <View style={sbStyles.placeholderRow}>
          <RNText style={sbStyles.prefix}>Search for  </RNText>
          <View style={sbStyles.hintClip}>
            {/* Slot A */}
            <Animated.Text
              style={[sbStyles.hint, sbStyles.hintAbsolute, {
                transform: [{ translateY: slotY[0] }],
                opacity: slotOpacity[0],
              }]}
            >
              {SEARCH_HINTS[slotHint.current[0]]}
            </Animated.Text>
            {/* Slot B */}
            <Animated.Text
              style={[sbStyles.hint, sbStyles.hintAbsolute, {
                transform: [{ translateY: slotY[1] }],
                opacity: slotOpacity[1],
              }]}
            >
              {SEARCH_HINTS[slotHint.current[1]]}
            </Animated.Text>
          </View>
        </View>
        <View style={sbStyles.divider} />
        <Mic size={17} color="#8E0FFF" strokeWidth={2} />
      </View>
    </View>
  );
}

const sbStyles = StyleSheet.create({
  // Outer wrapper: just shadow, transparent, no bg, no overflow clip
  shadow: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android: elevation needs a background to cast shadow — use transparent workaround
    backgroundColor: "transparent",
  },
  // Inner: clips children (incl. BlurView) to rounded rect
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.60)",
    gap: wp(9),
    // No backgroundColor — blur/androidBg absoluteFill handles it
  },
  androidBg: {
    backgroundColor: "rgba(255,255,255,0.50)",
  },
  divider: {
    width: 1,
    height: hp(16),
    backgroundColor: "rgba(180,160,220,0.40)",
  },
  placeholderRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  prefix: {
    fontSize: fp(13.5),
    color: "rgba(80,60,110,0.65)",
    fontWeight: "400",
  },
  hintClip: {
    flex: 1,
    overflow: "hidden",
    height: fp(20),
    justifyContent: "center",
  },
  hint: {
    fontSize: fp(13.5),
    color: "#8E0FFF",
    fontWeight: "500",
  },
  hintAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});

const HERO_ASPECT_RATIO = 313 / 750;

const CarouselItem = memo(({ image, screenWidth }: {
  image: number;
  screenWidth: number;
}) => {
  const itemHeight = screenWidth * HERO_ASPECT_RATIO;
  return (
    <View style={{ width: screenWidth, height: itemHeight }}>
      <Image
        source={image}
        contentFit="fill"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
});
CarouselItem.displayName = "CarouselItem";

const CAROUSEL_IMAGES = [
  require("@/assets/new/icons/hero-1.png"),
  require("@/assets/new/icons/hero-2.png"),
  require("@/assets/new/icons/hero-3.png"),
];

const SLIDES_META = [
  { gradientBot: "#470D7E", solid: "#470D7E", dot: "#C084FC" },
  { gradientBot: "#725EE3", solid: "#725EE3", dot: "#A5B4FC" },
  { gradientBot: "#E0D9FF", solid: "#E0D9FF", dot: "#7C3AED" },
];

const BEZIER = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const SCROLL_DUR = 520;
const N = CAROUSEL_IMAGES.length;

export default function Home() {
  const { user, isVerified, isCitySelected } = useAuthStore();
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const [showCityModal, setShowCityModal] = useState(false);
  const { count: wishlistCount } = useWishlistCount();
  const { data: cart } = useGetCart();
  const { data: userPreferencesData } = useGetUserPreferences();

  const city = userPreferencesData?.preferred_city || "Gurugram";
  const cartItemCount = cart?.total_items || 0;

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const xRange = CAROUSEL_IMAGES.map((_, i) => i * SCREEN_WIDTH);

  // ── JS Animated.Value — drives both ScrollView position and color shared value ──
  // scrollPos: frame-by-frame pixel offset, used to:
  //   1. call carouselRef.scrollTo() each frame (moves the ScrollView)
  //   2. update colorX shared value (drives Reanimated colors on UI thread)
  const scrollPos   = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<RNScrollView>(null);
  const autoTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeSlide = useRef(0);
  const isUserDrag  = useRef(false);
  const currentAnim = useRef<Animated.CompositeAnimation | null>(null);

  // Reanimated shared value — receives updates from the Animated.Value listener
  const colorX = useSharedValue(0);

  // Sync JS Animated.Value → Reanimated shared value + ScrollView position
  useEffect(() => {
    const id = scrollPos.addListener(({ value }) => {
      // Push pixel offset to Reanimated for color interpolation
      colorX.value = value;
      // Also drive the ScrollView to this exact position (no OS snap interference)
      carouselRef.current?.scrollTo({ x: value, animated: false });
    });
    return () => scrollPos.removeListener(id);
  }, [scrollPos, colorX]);

  // ── Smooth programmatic scroll ────────────────────────────────────────────
  const smoothScrollTo = useCallback((targetSlide: number) => {
    const currentSlide = activeSlide.current;
    const targetX = targetSlide * SCREEN_WIDTH;

    // Stop any in-flight animation
    currentAnim.current?.stop();

    // Wrap-around (4→1 or 1→4): jump both immediately — no cross-slide color travel
    const isWrapping =
      (currentSlide === N - 1 && targetSlide === 0) ||
      (currentSlide === 0 && targetSlide === N - 1);

    if (isWrapping) {
      scrollPos.setValue(targetX);
      // colorX updated via listener, ScrollView jumped via listener
      activeSlide.current = targetSlide;
      return;
    }

    // Normal: animate scrollPos with our cubic-bezier easing
    // The listener fires every frame → moves ScrollView + updates color in lockstep
    activeSlide.current = targetSlide;
    const anim = Animated.timing(scrollPos, {
      toValue: targetX,
      duration: SCROLL_DUR,
      easing: BEZIER,
      useNativeDriver: false, // must be false — we read .value each frame
    });
    currentAnim.current = anim;
    anim.start();
  }, [SCREEN_WIDTH, scrollPos]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    autoTimer.current = setInterval(() => {
      if (!isUserDrag.current) {
        const next = (activeSlide.current + 1) % N;
        smoothScrollTo(next);
      }
    }, 4000);
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [smoothScrollTo]);

  // ── Handle finger scroll — update activeSlide and colorX on settle ────────
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isUserDrag.current) {
      const x = e.nativeEvent.contentOffset.x;
      colorX.value = x;
    }
  }, [colorX]);

  const handleScrollBeginDrag = useCallback(() => {
    isUserDrag.current = true;
    currentAnim.current?.stop();
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    setTimeout(() => { isUserDrag.current = false; }, 400);
  }, []);

  const handleMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const slide = Math.round(x / SCREEN_WIDTH);
    activeSlide.current = slide;
    // Snap scrollPos to final position so next programmatic scroll starts correctly
    scrollPos.setValue(x);
    colorX.value = x;
    isUserDrag.current = false;
  }, [SCREEN_WIDTH, scrollPos, colorX]);

  // ── Reanimated color styles (UI thread) ──────────────────────────────────
  const headerBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorX.value,
      xRange,
      SLIDES_META.map((s) => s.gradientBot),
    ),
  }));

  const carouselBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorX.value,
      xRange,
      SLIDES_META.map((s) => s.solid),
    ),
  }));

  const handleDotPress = useCallback((index: number) => {
    smoothScrollTo(index);
  }, [smoothScrollTo]);

  const { data: dop, isLoading: isLoadingDop, refetch: refetchDop } = UseGetAllProducts({
    selection: "dop",
    limit: 6,
    is_active: true,
  });
  const { data: topPicks, isLoading: isLoadingTopPicks, refetch: refetchTopPicks } = UseGetAllProducts({
    selection: "top_picks",
    limit: 6,
    is_active: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([refetchDop(), refetchTopPicks()]);
    setRefreshing(false);
  };

  const handleCategories = useCallback((category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "./categories", params: { category } });
  }, []);

  const handleProductPress = useCallback((productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${productId}`);
  }, []);

  const handleBrandPress = useCallback((brandId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "./categories", params: { brand: brandId } });
  }, []);

  const handleViewAllBrands = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "./categories", params: { openFilters: "true", filterCategory: "brands" } });
  }, []);

  const handleOpenCityModal = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCityModal(true);
  }, []);

  const handleWishlistPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/(tabs)/(profile)/wishlist" as any, params: { from: "home" } });
  }, []);

  const handleCartPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/cart");
  }, []);

  const handleCloseCityModal = useCallback(() => setShowCityModal(false), []);
  const handleSearchFocus    = useCallback(() => { router.push("/search"); }, []);

  if (!user) return <Redirect href={"/(auth)/signup"} />;
  if (!isVerified) return <Redirect href={"/(auth)/info"} />;
  if (!isCitySelected) return <Redirect href={"/(auth)/city-page"} />;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <RNScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: tabHeight + insets.bottom + hp(40) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8E0FFF"
            colors={["#8E0FFF"]}
          />
        }
      >
        {/* ── Header: white → slide color ── */}
        <View style={{ position: "relative" }}>
          <ReAnimated.View
            pointerEvents="none"
            style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, headerBgStyle]}
          />
          <GradientFade />

          <YStack>
            <YStack height={insets.top} />
            <XStack
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal={wp(16)}
              paddingVertical={hp(10)}
            >
              <Pressable onPress={handleOpenCityModal}>
                <XStack alignItems="center" gap={wp(10)}>
                  <YStack
                    width={wp(34)}
                    height={wp(34)}
                    borderRadius={wp(17)}
                    backgroundColor="rgba(209, 217, 230, 0.67)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={fp(15)} fontWeight="700" color="#320163">
                      {(user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </Text>
                  </YStack>
                  <XStack alignItems="center" gap={wp(4)}>
                    <Text fontSize={fp(14)} fontWeight="700" color="#1C1C1E">{city}</Text>
                    <ChevronDown size={14} color="#6B7280" strokeWidth={2.5} />
                  </XStack>
                </XStack>
              </Pressable>

              <XStack alignItems="center" gap={wp(18)}>
                <Pressable onPress={handleWishlistPress}>
                  <YStack position="relative">
                    <Heart size={22} color="#1C1C1E" strokeWidth={1.8} />
                    {wishlistCount > 0 && (
                      <XStack
                        position="absolute" top={-6} right={-6}
                        backgroundColor="#FF3B30" borderRadius={8}
                        minWidth={16} height={16}
                        alignItems="center" justifyContent="center" paddingHorizontal={3}
                      >
                        <Text color="white" fontSize={10} fontWeight="600">
                          {wishlistCount > 9 ? "9+" : wishlistCount}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Pressable>
                <Pressable onPress={handleCartPress}>
                  <YStack position="relative">
                    <ShoppingCart size={22} color="#1C1C1E" strokeWidth={1.8} />
                    {cartItemCount > 0 && (
                      <XStack
                        position="absolute" top={-6} right={-6}
                        backgroundColor="#FF3B30" borderRadius={8}
                        minWidth={16} height={16}
                        alignItems="center" justifyContent="center" paddingHorizontal={3}
                      >
                        <Text color="white" fontSize={10} fontWeight="600">
                          {cartItemCount > 9 ? "9+" : cartItemCount}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Pressable>
              </XStack>
            </XStack>

            {/* Search row — glassmorphic, full width */}
            <XStack paddingHorizontal={wp(16)} paddingBottom={hp(14)}>
              <Pressable onPress={handleSearchFocus} style={{ flex: 1 }}>
                <SearchBar />
              </Pressable>
            </XStack>
          </YStack>
        </View>

        {/* ── Carousel ── */}
        <View style={{ position: "relative" }}>
          <ReAnimated.View
            pointerEvents="none"
            style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, carouselBgStyle]}
          />
          {/*
            Plain RNScrollView — no pagingEnabled, no snapToInterval fighting us.
            We control scrolling 100% via scrollTo() called from the Animated.Value listener.
            scrollEventThrottle=16 keeps colorX in sync while the user drags.
          */}
          <RNScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="start"
            disableIntervalMomentum
          >
            {CAROUSEL_IMAGES.map((image, index) => (
              <CarouselItem
                key={index}
                image={image}
                screenWidth={SCREEN_WIDTH}
              />
            ))}
          </RNScrollView>
        </View>

        <YStack
          backgroundColor="white"
          gap={hp(52)}
          paddingTop={hp(20)}
          paddingBottom={hp(22)}
        >
          {/* Dots */}
          <XStack justifyContent="center" alignItems="center" gap={6} marginTop={hp(-16)}>
            {CAROUSEL_IMAGES.map((_, index) => (
              <AnimatedDot
                key={index}
                index={index}
                colorX={colorX}
                xRange={xRange}
                screenWidth={SCREEN_WIDTH}
                onPress={handleDotPress}
              />
            ))}
          </XStack>

          <CategoriesSection onCategoryPress={handleCategories} />

          {/* <FeaturedPicksSlider /> */}

          {/* <ImageGrid /> */}

          {isLoadingTopPicks ? (
            <Spinner color="#8E0FFF" />
          ) : (
            <ProductListSection
              title="Deals of the day"
              products={topPicks?.data}
              onViewAllPress={() => router.push("./selections")}
              onProductPress={handleProductPress}
            />
          )}

          <OffersSection onViewAllPress={() => router.push("./offers")} />

          {/* <FanCarouselSection /> */}

          <ClientTestimonialsSection />

          <BrandsSection
            onBrandPress={handleBrandPress}
            onViewAllPress={handleViewAllBrands}
          />

          {/* <ProjectsDeliveredSection /> */}

          {/* {isLoadingDop ? (
            <Spinner color="#8E0FFF" />
          ) : (
            <ProductListSection
              title="DOP's First Choice"
              products={dop?.data}
              onViewAllPress={() => router.push("./selections")}
              onProductPress={handleProductPress}
            />
          )} */}

          {/* <RentNowCards /> */}

          <HowDoIRollSection />

          <Footer />
        </YStack>
      </RNScrollView>
      <StickyCartButton />

      <CitySelectionModal
        isOpen={showCityModal}
        onClose={handleCloseCityModal}
        mode="change"
      />
    </View>
  );
}

// ─── AnimatedDot ──────────────────────────────────────────────────────────────

interface AnimatedDotProps {
  index: number;
  colorX: ReturnType<typeof useSharedValue<number>>;
  xRange: number[];
  screenWidth: number;
  onPress: (index: number) => void;
}

const AnimatedDot = memo(({ index, colorX, xRange, screenWidth, onPress }: AnimatedDotProps) => {
  const dotStyle = useAnimatedStyle(() => {
    const progress = Math.max(0, Math.min(1,
      1 - Math.abs(colorX.value - index * screenWidth) / screenWidth
    ));
    const width   = 6 + 18 * progress;
    const opacity = 0.45 + 0.55 * progress;
    const color   = interpolateColor(
      colorX.value,
      xRange,
      SLIDES_META.map((s, i) => (i === index ? s.dot : "#D1D5DB")),
    );
    return { width, opacity, backgroundColor: color };
  });

  return (
    <Pressable onPress={() => onPress(index)} hitSlop={8}>
      <ReAnimated.View style={[{ height: 4, borderRadius: 2 }, dotStyle]} />
    </Pressable>
  );
});
AnimatedDot.displayName = "AnimatedDot";
