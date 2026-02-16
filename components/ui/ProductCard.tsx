import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./Button";
import { Counter } from "./Counter";
import { Image } from "expo-image";
import { SKU } from "@/types/products/product";
import { fp, hp, wp } from "@/utils/responsive";
import { HeartIcon } from "./HeartIcon";
import { useWishlistStatus } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useGetCurrentUser } from "@/hooks/auth";
import { formatPrice } from "@/utils/format";
import { Animated, Pressable } from "react-native";

interface ProductCardProps {
  product: SKU;
  onProductPress: () => void;
  onFavoritePress?: () => void;
  onAddToCart?: () => void;
  maxWidth?: number | string;
}

function ProductCardComponent({
  onProductPress,
  product,
  onAddToCart,
  maxWidth = "180",
}: ProductCardProps) {
  const { isInWishlist: isFavorite, toggleWishlist } = useWishlistStatus(
    product.sku_id,
    product.name
  );

  const { data: user } = useGetCurrentUser();
  const { data: cart } = useGetCart();
  const addToCartMutation = useAddToCart();
  const modifyQuantityMutation = useModifyQuantity();
  const currentPrice = product.price_per_day;
  const originalPrice = useMemo(
    () => parseInt(currentPrice) + parseInt(currentPrice) * 0.15,
    [currentPrice]
  );
  const cartItem = useMemo(() => {
    return cart?.sku_items.find((item) => item.sku_id === product.sku_id);
  }, [cart?.sku_items, product.sku_id]);

  const isInCart = !!cartItem;

  const handleCounterIncrement = useCallback((e: any) => {
    e.stopPropagation();
    if (!user?.user_id) return;
    modifyQuantityMutation.mutate({
      sku_id: product.sku_id,
      operation: Operation.ADD,
    });
  }, [user?.user_id, product.sku_id, modifyQuantityMutation]);

  const handleCounterDecrement = useCallback((e: any) => {
    e.stopPropagation();
    if (!user?.user_id) return;
    modifyQuantityMutation.mutate({
      sku_id: product.sku_id,
      operation: Operation.REMOVE,
    });
  }, [user?.user_id, product.sku_id, modifyQuantityMutation]);

  const handleAddToCart = useCallback((e: any) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
      return;
    }
    if (!user?.user_id) return;
    addToCartMutation.mutate({
      item_id: product.sku_id,
      item_quantity: 1,
      itemType: "sku",
    });
  }, [onAddToCart, user?.user_id, product.sku_id, addToCartMutation]);

  const handleFavoritePress = useCallback((e: any) => {
    e.stopPropagation();
    toggleWishlist();
  }, [toggleWishlist]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
        width: wp(162),
        maxWidth: typeof maxWidth === "number" ? maxWidth : undefined,
      }}
    >
      <Pressable
        onPress={onProductPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Card
          width="100%"
          borderRadius={wp(12)}
          backgroundColor="white"
          overflow="visible"
          borderWidth={1}
          borderColor="#FAFAFA"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.06}
          shadowRadius={12}
          elevation={4}
        >
          <YStack flex={1}>
            {/* Image Section with Glassy Purple Gradient */}
            <YStack position="relative" overflow="hidden" borderTopLeftRadius={wp(12)} borderTopRightRadius={wp(12)}>
              <LinearGradient
                colors={[
                  "rgba(142, 15, 255, 0.08)",
                  "rgba(197, 164, 255, 0.12)",
                  "rgba(255, 255, 255, 0.95)",
                  "rgba(142, 15, 255, 0.10)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: wp(12),
                  paddingTop: hp(12),
                  paddingBottom: hp(14),
                }}
              >
                {/* Heart Icon - Top Right */}
                <XStack position="absolute" top={hp(8)} right={wp(8)} zIndex={10}>
                  <Pressable onPress={handleFavoritePress}>
                    <HeartIcon filled={isFavorite} />
                  </Pressable>
                </XStack>

                {/* Product Image */}
                <XStack justifyContent="center" alignItems="center" height={hp(95)}>
                  <Image
                    source={{ uri: product?.primary_image_url }}
                    alt={`${product.brand}`}
                    contentFit="contain"
                    transition={200}
                    cachePolicy="memory-disk"
                    priority="normal"
                    style={{
                      width: wp(75),
                      height: hp(75),
                    }}
                  />
                </XStack>
              </LinearGradient>
            </YStack>

            {/* Exclusive Badge - Straddling the border */}
            <XStack
              position="absolute"
              top={hp(110)}
              left={wp(10)}
              paddingVertical={hp(3)}
              paddingHorizontal={wp(8)}
              backgroundColor="#FFF9EB"
              borderRadius={wp(4)}
              borderColor="#FFE4A0"
              borderWidth={1}
              zIndex={10}
            >
              <Text fontSize={fp(9)} fontWeight="600" color="#8B6914">
                Exclusive
              </Text>
            </XStack>

            {/* Content Section - White Background */}
            <YStack>
              <YStack padding={wp(10)} paddingTop={hp(12)} gap={hp(5)} backgroundColor="white" borderBottomLeftRadius={wp(12)} borderBottomRightRadius={wp(12)} borderTopRightRadius={wp(20)}>
                {/* Product Name */}
                <YStack height={hp(34)}>
                  <Text fontSize={fp(12)} fontWeight="700" lineHeight={hp(16)} color="#121217" numberOfLines={2} ellipsizeMode="tail">
                    {product.name}
                  </Text>
                </YStack>

                {/* Price Section */}
                <YStack gap={hp(3)}>
                  <XStack gap={wp(4)} alignItems="baseline" flexWrap="wrap">
                    <Text fontSize={fp(14)} fontWeight="700" color="#1447BC">
                      {formatPrice(Number(product.price_per_day))}
                    </Text>
                    <Text fontSize={fp(10)} color="#6C6C89" fontWeight="500">
                      per day
                    </Text>
                  </XStack>
                  <XStack alignItems="center" gap={wp(6)}>
                    <Text
                      fontSize={fp(10)}
                      color="#6C6C89"
                      fontWeight="400"
                      textDecorationLine="line-through"
                    >
                      {formatPrice(originalPrice)} per day
                    </Text>
                    <XStack
                      paddingHorizontal={wp(6)}
                      paddingVertical={hp(2)}
                      backgroundColor="#D50B3E"
                      borderRadius={wp(10)}
                    >
                      <Text fontSize={fp(9)} fontWeight="600" color="#FFF">
                        15% Off
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>

                {/* Add to Cart Button */}
                {isInCart ? (
                  <XStack width="100%" alignItems="center" justifyContent="flex-end" marginTop={hp(4)}>
                    <Counter
                      value={cartItem.quantity}
                      onIncrement={handleCounterIncrement}
                      onDecrement={handleCounterDecrement}
                      size="sm"
                      variant="primary"
                    />
                  </XStack>
                ) : (
                  <XStack onPress={(e) => e.stopPropagation()} width="100%" marginTop={hp(4)}>
                    <Button width="100%" size="md" onPress={handleAddToCart} variant="primary">
                      Add to cart
                    </Button>
                  </XStack>
                )}
              </YStack>
            </YStack>
          </YStack>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export const ProductCard = React.memo(ProductCardComponent);
