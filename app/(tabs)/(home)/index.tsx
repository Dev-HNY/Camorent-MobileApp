import { YStack, View, Spinner, Text, XStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, Pressable, Animated, ScrollView as RNScrollView, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuthStore } from "@/store/auth/auth";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { ProductListSection } from "@/components/home/ProductListSection";
import { OffersSection } from "@/components/home/OffersSection";
import { Footer } from "@/components/home/Footer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { HowDoIRollSection } from "@/components/home/HowDoIRollSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { ClientTestimonialsSection } from "@/components/home/ClientTestimonialsSection";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { RentNowCards } from "@/components/home/RentNowCards";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { StickyCartButton } from "@/components/ui/StickyCartButton";
import { ChevronDown, Search, Heart, ShoppingCart, Mic } from "lucide-react-native";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { TextInput } from "react-native";
import { CitySelectionModal } from "@/components/city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

// Extracted carousel item — each item owns its own animation ref (fixes hooks-in-loop)
const CarouselItem = memo(({ image, index, screenWidth }: {
  image: number;
  index: number;
  screenWidth: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          width: screenWidth,
          height: 200,
          overflow: "hidden",
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={image}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
          transition={300}
        />
      </Animated.View>
    </Pressable>
  );
});

const CAROUSEL_IMAGES = [
  require("@/assets/new/icons/hero-1.png"),
  require("@/assets/new/icons/hero-2.png"),
  require("@/assets/new/icons/hero-3.png"),
  require("@/assets/new/icons/hero-4.png"),
  require("@/assets/new/icons/hero-5.png")
];

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

  // Premium Continuous Typewriter Animation for Search Keywords
  const SEARCH_KEYWORDS = ["cameras", "lights", "audio", "gimbals", "lenses"];
  const [activeKeywordIndex, setActiveKeywordIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  const animationStateRef = useRef<{
    isTyping: boolean;
    charIndex: number;
    timeoutId: ReturnType<typeof setTimeout> | null;
  }>({
    isTyping: true,
    charIndex: 0,
    timeoutId: null,
  });

  // Continuous, elegant typewriter loop - Apple/Airbnb level
  useEffect(() => {
    if (isSearchFocused) {
      // Pause animation when focused
      if (animationStateRef.current.timeoutId) {
        clearTimeout(animationStateRef.current.timeoutId);
        animationStateRef.current.timeoutId = null;
      }
      return;
    }

    const currentKeyword = SEARCH_KEYWORDS[activeKeywordIndex];
    const state = animationStateRef.current;

    const runAnimation = () => {
      if (state.isTyping) {
        // TYPING PHASE
        if (state.charIndex <= currentKeyword.length) {
          setDisplayedText(currentKeyword.slice(0, state.charIndex));
          state.charIndex++;
          state.timeoutId = setTimeout(runAnimation, 60); // Calm 80ms per char
        } else {
          // Full word displayed - pause before erasing
          state.timeoutId = setTimeout(() => {
            state.isTyping = false;
            state.charIndex = currentKeyword.length;
            runAnimation();
          }, 500); // 2s pause to read
        }
      } else {
        // ERASING PHASE
        if (state.charIndex > 0) {
          state.charIndex--;
          setDisplayedText(currentKeyword.slice(0, state.charIndex));
          state.timeoutId = setTimeout(runAnimation, 50); // Faster erase 50ms
        } else {
          // Fully erased - brief pause, then next word
          state.timeoutId = setTimeout(() => {
            setActiveKeywordIndex((prev) => (prev + 1) % SEARCH_KEYWORDS.length);
            state.isTyping = true;
            state.charIndex = 0;
          }, 400); // 400ms pause before next word
        }
      }
    };

    // Start the animation loop
    runAnimation();

    return () => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
      }
    };
  }, [activeKeywordIndex, isSearchFocused]);

  // Scroll tracking
  const scrollY = useRef(new Animated.Value(0)).current;

  // Premium Carousel state with swipeable ScrollView
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<RNScrollView>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // Auto-scroll carousel with pause on user interaction
  useEffect(() => {
    if (!isUserInteracting) {
      autoScrollTimer.current = setInterval(() => {
        setActiveSlide((prev) => {
          const nextSlide = (prev + 1) % CAROUSEL_IMAGES.length;
          const slideWidth = SCREEN_WIDTH - 32 + 16; // Card width + gap
          carouselRef.current?.scrollTo({
            x: nextSlide * slideWidth,
            animated: true,
          });
          return nextSlide;
        });
      }, 4000); // 4 seconds per slide
    }

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [isUserInteracting, SCREEN_WIDTH]);

  // Handle scroll events to update active indicator
  const handleCarouselScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const slideWidth = SCREEN_WIDTH - 32 + 16; // Card width + gap
    const slideIndex = Math.round(scrollPosition / slideWidth);

    if (slideIndex !== activeSlide && slideIndex >= 0 && slideIndex < CAROUSEL_IMAGES.length) {
      setActiveSlide(slideIndex);
    }
  }, [SCREEN_WIDTH, activeSlide]);

  // Pause auto-scroll when user swipes
  const handleScrollBeginDrag = useCallback(() => {
    setIsUserInteracting(true);
  }, []);

  // Resume auto-scroll after 3 seconds of no interaction
  const handleScrollEndDrag = useCallback(() => {
    setTimeout(() => {
      setIsUserInteracting(false);
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

  const handleDiscoverPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("./categories");
  }, []);

  const handleCloseCityModal = useCallback(() => setShowCityModal(false), []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    router.push("/search");
  }, []);

  const handleSearchBlur = useCallback(() => setIsSearchFocused(false), []);

  const handleSearchPress = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleDotPress = useCallback((index: number) => {
    setActiveSlide(index);
    setIsUserInteracting(true);
    const slideWidth = SCREEN_WIDTH - 32 + 16;
    carouselRef.current?.scrollTo({ x: index * slideWidth, animated: true });
    setTimeout(() => setIsUserInteracting(false), 3000);
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
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: tabHeight + insets.bottom + hp(40),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Full header: transparent-to-lavender gradient wrapping top bar + search + carousel */}
        <LinearGradient
          colors={["rgba(160,162,227,0)", "rgba(160,162,227,0.45)", "#A1A0E1"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
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

          {/* Search row: Search+Mic box + Promo badge */}
          <XStack
            alignItems="center"
            gap={wp(8)}
            paddingHorizontal={wp(16)}
            paddingBottom={hp(14)}
          >
            {/* Search + Mic in one box with divider */}
            <Pressable onPress={handleSearchPress} style={{ flex: 1 }}>
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
                  <TextInput
                    ref={searchInputRef}
                    placeholder=""
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    style={{ flex: 1, fontSize: 14, color: "#1C1C1E", padding: 0, margin: 0 }}
                    placeholderTextColor="#9CA3AF"
                    editable={false}
                    pointerEvents="none"
                  />
                  <XStack position="absolute" left={0} alignItems="baseline" pointerEvents="none">
                    <Text fontSize={14} fontWeight="400" color="#9CA3AF">Search "Camera Gear"....</Text>
                  </XStack>
                </XStack>
                {/* Divider + Mic */}
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
              <YStack>
                {/* <Text fontSize={fp(9)} fontWeight="500" color="#9CA3AF" letterSpacing={0.3}>
                  SAVE UP TO
                </Text> */}
                <Text fontSize={fp(14)} fontWeight="800" color="#5F00BA">₹ 200</Text>
              </YStack>
            </XStack>
          </XStack>

          {/* Hero Carousel - full width, edge to edge */}
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
        </YStack>
        </LinearGradient>

        <YStack
          backgroundColor={"white"}
          gap={hp(32)}
          paddingVertical={hp(22)}
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
          <AnimatedSection delay={100}>
            <CategoriesSection onCategoryPress={handleCategories} />
          </AnimatedSection>

          <AnimatedSection delay={300}>
            {isLoadingTopPicks ? (
              <Spinner color="#8E0FFF" />
            ) : (
              <ProductListSection
                title="Top Picks For you"
                products={topPicks?.data}
                onViewAllPress={() => router.push("./selections")}
                onProductPress={handleProductPress}
              />
            )}
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <DiscoverSection onItemPress={handleDiscoverPress} />
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <BrandsSection
              onBrandPress={handleBrandPress}
              onViewAllPress={handleViewAllBrands}
            />
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <OffersSection onViewAllPress={() => router.push("./offers")} />
          </AnimatedSection>
        </YStack>
        <Image
          source={require("@/assets/images/home/home-banner2.png")}
          contentFit="cover"
          style={{
            height: 400,
            width: "100%",
          }}
        />

        <YStack
          borderTopLeftRadius={wp(24)}
          borderTopRightRadius={wp(24)}
          backgroundColor={"white"}
          marginTop={-20}
          zIndex={1000}
          gap={hp(32)}
          paddingTop={hp(32)}
        >
          <AnimatedSection delay={100}>
            <ClientTestimonialsSection />
          </AnimatedSection>

          {/* <AnimatedSection delay={200}>
            <InfiniteCarouselSection />
          </AnimatedSection> */}

          <AnimatedSection delay={300}>
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
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <RentNowCards />
          </AnimatedSection>

          <AnimatedSection delay={450}>
            <HowDoIRollSection />
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <Footer />
          </AnimatedSection>
        </YStack>
      </Animated.ScrollView>
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
