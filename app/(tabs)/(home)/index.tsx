import { YStack, View, Spinner, Text, XStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, Pressable, Animated, ScrollView as RNScrollView, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
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
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { CitySelectionModal } from "@/components/city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

// Extracted carousel item — each item owns its own animation ref (fixes hooks-in-loop)
// Hero images are 750×313 — maintain exact aspect ratio so nothing is cropped
const HERO_ASPECT_RATIO = 313 / 750;

const CarouselItem = memo(({ image, index, screenWidth }: {
  image: number;
  index: number;
  screenWidth: number;
}) => {
  const itemHeight = screenWidth * HERO_ASPECT_RATIO;

  return (
    <View style={{ width: screenWidth, height: itemHeight }}>
      <Image
        source={image}
        contentFit="contain"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
});

const CAROUSEL_IMAGES = [
  require("@/assets/new/icons/hero-1.png"),
  require("@/assets/new/icons/hero-2.png"),
  require("@/assets/new/icons/hero-3.png"),
  require("@/assets/new/icons/hero-4.png"),
];

// Per-slide gradient: header fades transparent→solid (covers only the header/search row)
const SLIDE_GRADIENTS: [string, string][] = [
  ["rgba(71,13,126,0)", "#470D7E"],
  ["rgba(114,94,227,0)", "#725EE3"],
  ["rgba(224,217,255,0)", "#E0D9FF"],
  ["rgba(48,121,192,0)", "#3079C0"],
];
// Solid colors for the carousel background block (same hues, no gradient)
const SLIDE_SOLID_COLORS = ["#470D7E", "#725EE3", "#E0D9FF", "#3079C0"];

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

  // Premium Carousel state with swipeable ScrollView
  const [activeSlide, setActiveSlide] = useState(0);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  // scrollX drives all color transitions directly — no JS hop, perfectly in sync with finger
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<RNScrollView>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserInteracting = useRef(false);

  // Auto-scroll carousel with pause on user interaction
  useEffect(() => {
    autoScrollTimer.current = setInterval(() => {
      if (!isUserInteracting.current) {
        setActiveSlide((prev) => {
          const next = (prev + 1) % CAROUSEL_IMAGES.length;
          carouselRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
          return next;
        });
      }
    }, 4000);
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [SCREEN_WIDTH]);

  // scrollX → slide index (0-based float) for interpolation
  const animatedSlideIndex = scrollX.interpolate({
    inputRange: CAROUSEL_IMAGES.map((_, i) => i * SCREEN_WIDTH),
    outputRange: CAROUSEL_IMAGES.map((_, i) => i),
    extrapolate: "clamp",
  });

  // Driven directly by the ScrollView's scroll position — zero lag
  const handleCarouselScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const slideIndex = Math.round(x / SCREEN_WIDTH);
        if (slideIndex >= 0 && slideIndex < CAROUSEL_IMAGES.length) {
          setActiveSlide(slideIndex);
        }
      },
    }
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserInteracting.current = true;
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    setTimeout(() => {
      isUserInteracting.current = false;
    }, 3000);
  }, []);

  const { data: dop, isLoading: isLoadingDop } = UseGetAllProducts({
    selection: "dop",
    limit: 6,
    is_active: true,
  });
  const { data: topPicks, isLoading: isLoadingTopPicks } = UseGetAllProducts({
    selection: "top_picks",
    limit: 6,
    is_active: true,
  });
  // const { data: topDeals, isLoading: isLoadingTopDeals } = UseGetAllProducts({
  //   selection: "top_deals",
  //   limit: 6,
  //   is_active: true,
  // });

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
    router.push({
      pathname: "./categories",
      params: { brand: brandId },
    });
  }, []);

  const handleViewAllBrands = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "./categories",
      params: { openFilters: "true", filterCategory: "brands" },
    });
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

  const handleSearchFocus = useCallback(() => {
    router.push("/search");
  }, []);

  const handleDotPress = useCallback((index: number) => {
    setActiveSlide(index);
    isUserInteracting.current = true;
    carouselRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setTimeout(() => { isUserInteracting.current = false; }, 3000);
  }, [SCREEN_WIDTH]);

  if (!user) {
    return <Redirect href={"/(auth)/signup"} />;
  }

  if (!isVerified) {
    return <Redirect href={"/(auth)/info"} />;
  }

  if (!isCitySelected) {
    return <Redirect href={"/(auth)/city-page"} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <RNScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: tabHeight + insets.bottom + hp(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header area: transparent→solid gradient (covers nav + search only) ── */}
        <View style={{ position: "relative" }}>
          {/* Base gradient layer: slide 0 */}
          <LinearGradient
            colors={SLIDE_GRADIENTS[0]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Remaining slides fade in as carousel scrolls */}
          {SLIDE_GRADIENTS.slice(1).map((colors, idx) => {
            const i = idx + 1;
            return (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  opacity: animatedSlideIndex.interpolate({
                    inputRange: [i - 1, i, i + 1],
                    outputRange: [0, 1, 0],
                    extrapolate: "clamp",
                  }),
                }}
              >
                <LinearGradient
                  colors={colors}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            );
          })}

          {/* Nav + Search content */}
          <YStack>
            <YStack height={insets.top} />
            <XStack
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal={wp(16)}
              paddingVertical={hp(10)}
            >
              {/* Left: Avatar + Home + City */}
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
                    <Text fontSize={fp(13)} fontWeight="400" color="#6B7280">Home</Text>
                    <Text fontSize={fp(14)} fontWeight="700" color="#1C1C1E">{city}</Text>
                    <ChevronDown size={14} color="#6B7280" strokeWidth={2.5} />
                  </XStack>
                </XStack>
              </Pressable>

              {/* Right: Wishlist + Cart */}
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

            {/* Search row */}
            <XStack
              alignItems="center"
              gap={wp(8)}
              paddingHorizontal={wp(16)}
              paddingBottom={hp(14)}
            >
              <Pressable onPress={handleSearchFocus} style={{ flex: 1 }}>
                <XStack
                  flex={1}
                  paddingLeft={wp(14)}
                  paddingVertical={hp(11)}
                  alignItems="center"
                  backgroundColor="#FFFFFF"
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="#EBEBEF"
                >
                  <Search size={18} color="#8E0FFF" strokeWidth={2.2} />
                  <XStack flex={1} alignItems="center" height={20} marginLeft={wp(10)}>
                    <Text fontSize={14} fontWeight="400" color="#9CA3AF">Search "Camera Gear"....</Text>
                  </XStack>
                  <YStack width={1} height={20} backgroundColor="#EBEBEF" marginHorizontal={wp(10)} />
                  <YStack paddingRight={wp(12)}>
                    <Mic size={18} color="#8E0FFF" strokeWidth={2} />
                  </YStack>
                </XStack>
              </Pressable>

              {/* Promo badge */}
              <XStack
                backgroundColor="#FFFFFF"
                borderRadius={10}
                borderWidth={1}
                borderColor="#EBEBEF"
                paddingHorizontal={wp(10)}
                height={wp(44)}
                alignItems="center"
                gap={wp(8)}
              >
                <Image
                  source={require("@/assets/images/waller.svg")}
                  style={{ width: wp(26), height: wp(26) }}
                  contentFit="contain"
                />
                <Text fontSize={fp(14)} fontWeight="800" color="#5F00BA">₹ 200</Text>
              </XStack>
            </XStack>
          </YStack>
        </View>

        {/* ── Carousel area: solid color background (same hue as gradient end) ── */}
        <View style={{ position: "relative" }}>
          {/* Base solid: slide 0 */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: SLIDE_SOLID_COLORS[0] }} />
          {/* Remaining slides solid layers */}
          {SLIDE_SOLID_COLORS.slice(1).map((color, idx) => {
            const i = idx + 1;
            return (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: color,
                  opacity: animatedSlideIndex.interpolate({
                    inputRange: [i - 1, i, i + 1],
                    outputRange: [0, 1, 0],
                    extrapolate: "clamp",
                  }),
                }}
              />
            );
          })}
          {/* Carousel */}
          <RNScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleCarouselScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="start"
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {CAROUSEL_IMAGES.map((image, index) => (
              <CarouselItem
                key={index}
                image={image}
                index={index}
                screenWidth={SCREEN_WIDTH}
              />
            ))}
          </RNScrollView>
        </View>

        <YStack
          backgroundColor={"white"}
          gap={hp(52)}
          paddingTop={hp(20)}
          paddingBottom={hp(22)}
        >
          {/* Carousel dots on white background */}
          <XStack justifyContent="center" alignItems="center" gap={6} marginTop={hp(-16)}>
            {CAROUSEL_IMAGES.map((_, index) => {
              const isActive = activeSlide === index;
              return (
                <Pressable key={index} onPress={() => handleDotPress(index)}>
                  <Animated.View
                    style={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: isActive ? "#8E0FFF" : "#D1D5DB",
                      width: isActive ? 24 : 8,
                    }}
                  />
                </Pressable>
              );
            })}
          </XStack>

          {/* 1. Crafted for Creators — category grid */}
          <CategoriesSection onCategoryPress={handleCategories} />

          {/* 2. Deals of the day */}
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

          {/* 4. Our clients + testimonials */}
          <ClientTestimonialsSection />

          {/* 5. Search by Brands (3-col grid + projects delivered) */}
          <BrandsSection
            onBrandPress={handleBrandPress}
            onViewAllPress={handleViewAllBrands}
          />

          {/* 6. Offers — purple 25%-off banner + offer cards */}
          <OffersSection onViewAllPress={() => router.push("./offers")} />

          {/* 7. DOP's First Choice */}
          {isLoadingDop ? (
            <Spinner color="#8E0FFF" />
          ) : (
            <ProductListSection
              title="DOP's First Choice"
              products={dop?.data}
              onViewAllPress={() => router.push("./selections")}
              onProductPress={handleProductPress}
            />
          )}

          {/* 9. Rent Now cards */}
          <RentNowCards />

          {/* 10. How Do I Roll */}
          <HowDoIRollSection />

          <Footer />
        </YStack>
      </RNScrollView>
      <StickyCartButton />

      {/* City Selection Modal */}
      <CitySelectionModal
        isOpen={showCityModal}
        onClose={handleCloseCityModal}
        mode="change"
      />
    </View>
  );
}
