import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { YStack, Text, Stack, XStack } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviewsPreview } from "@/components/product/ProductReviewsPreview";
import { SkuAccordion } from "@/components/product/SkuAccordion";

import { useMemo, useCallback } from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  withSpring,
  FadeInDown,
  FadeIn,
  Layout,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SimilarProducts } from "@/components/PDP/SimilarProducts";
import { StickyBottomCart } from "@/components/PDP/StickyBottomCart";
import { hp, wp, fp } from "@/utils/responsive";
import { useGetSkuById } from "@/hooks/product/useGetSkuById";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { skuDetailToSKU } from "@/utils/product";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetCurrentUser } from "@/hooks/auth";
import { StickyCartButton } from "@/components/ui/StickyCartButton";
import { SkeletonProductDetails } from "@/components/animations/SkeletonLoader";
import { AnimatedStickyHeader } from "@/components/animations/AnimatedStickyHeader";
import { SPRING_CONFIG, DURATION } from "@/components/animations/constants";
import { ChevronLeft } from "lucide-react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductDetails() {
  const insets = useSafeAreaInsets();
  const { id, from } = useLocalSearchParams();

  // Scroll animation value for parallax and sticky header
  const scrollY = useSharedValue(0);
  const headerVisible = useSharedValue(0);

  const { data: product, isLoading, error } = useGetSkuById(id as string);
  // console.log(product)

  const { data: similarSkusByBrand, isLoading: isLoadingSimilar } = UseGetAllProducts(
    product?.brand
      ? {
        brand: product.brand,
        limit: 50,
        is_active: true,
      }
      : undefined
  );
  console.log(similarSkusByBrand)
  const { data: user } = useGetCurrentUser();
  const { data: cart } = useGetCart();

  const addOns = useMemo(() => {
    if (!similarSkusByBrand?.data || !product?.sku_id || !product?.category_id) return [];

    // Filter: same brand, different category, exclude current product
    return similarSkusByBrand.data
      .filter((item) =>
        item.sku_id !== product?.sku_id &&
        item.category_id !== product?.category_id
      )
      .slice(0, 10);
  }, [similarSkusByBrand?.data, product?.sku_id, product?.category_id]);

  const cartItem = useMemo(() => {
    return cart?.sku_items.find((item) => item.sku_id === product?.sku_id);
  }, [cart?.sku_items, product?.sku_id]);

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  console.log(addOns)

  // Animated header background
  const animatedHeaderBg = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [300, 400],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [300, 400],
      [-56, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Animated header title - show on scroll
  const animatedHeaderTitle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [300, 400],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY: withSpring(opacity === 1 ? 0 : -10) }],
    };
  });

  // Animated header shadow
  const animatedHeaderShadow = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      scrollY.value,
      [100, 150],
      [0, 0.1],
      Extrapolation.CLAMP
    );
    return {
      shadowOpacity,
    };
  });

  // Back button press animation
  const backButtonScale = useSharedValue(1);

  const animatedBackButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonScale.value }],
  }));

  const handleViewAllReviews = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "./reviews",
      params: { id: product?.sku_id },
    });
  }, [product?.sku_id]);

  const handleProductPress = useCallback((productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${productId}`);
  }, []);

  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    backButtonScale.value = withSpring(0.9, SPRING_CONFIG.snappy, () => {
      backButtonScale.value = withSpring(1, SPRING_CONFIG.bouncy);
    });
    if (from === "wishlist") {
      router.replace("/(tabs)/(profile)/wishlist");
    } else {
      router.back();
    }
  }, [from, backButtonScale]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="#FFFFFF">
        <SkeletonProductDetails />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} backgroundColor="#FFFFFF">
        <Animated.View
          entering={FadeIn.duration(DURATION.normal)}
          style={styles.errorContainer}
        >
          <Text color="$color" fontSize="$5">
            {error ? "Error loading product" : "Product not found"}
          </Text>
        </Animated.View>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="#FFFFFF">
      {/* Smooth Scroll Header with Product Name */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            paddingTop: insets.top,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 3,
          },
          animatedHeaderBg,
        ]}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={wp(16)}
          height={hp(56)}
        >
          <Stack width={wp(40)} />
          <Animated.View style={[{ flex: 1, alignItems: "center", paddingHorizontal: wp(12) }, animatedHeaderTitle]}>
            <Text
              fontSize={fp(16)}
              fontWeight="600"
              color="#121217"
              numberOfLines={1}
            >
              {product?.name}
            </Text>
          </Animated.View>
          <Stack width={wp(40)} />
        </XStack>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, hp(16)) + hp(80),
        }}
      >
        {/* Product Info - Staggered entrance */}
        <Animated.View
          entering={FadeInDown.delay(0).springify().damping(18).stiffness(250)}
          layout={Layout.springify()}
        >
          <ProductInfo product={product} />
        </Animated.View>

        {/* Specifications Accordion */}
        <Animated.View
          entering={FadeInDown.delay(DURATION.stagger).springify().damping(18).stiffness(250)}
          layout={Layout.springify()}
        >
          {product && <SkuAccordion product={product} />}
        </Animated.View>

        {/* Add-Ons */}
        {addOns && addOns.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(DURATION.stagger * 2).springify().damping(18).stiffness(250)}
            layout={Layout.springify()}
          >
            <SimilarProducts
              onProductPress={handleProductPress}
              products={addOns}
            />
          </Animated.View>
        )}
      </Animated.ScrollView>

      {/* Fixed/Floating components OUTSIDE ScrollView */}
      {product && (
        <StickyBottomCart product={skuDetailToSKU(product)} />
      )}
      <StickyCartButton />
    </YStack>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
