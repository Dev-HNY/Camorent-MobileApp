import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { Button } from "./Button";
import { Counter } from "./Counter";
import { Image } from "expo-image";
import { SKU } from "@/types/products/product";
import { fp, hp, wp } from "@/utils/responsive";
import { useWishlistStatus } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useGetCurrentUser } from "@/hooks/auth";
import { formatPrice } from "@/utils/format";
import { Animated, Pressable, View } from "react-native";
import { Heart } from "lucide-react-native";

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
          backgroundColor="#F8F9FA"
          overflow="hidden"
          borderWidth={1}
          borderColor="#EBEBEF"
        >
          <YStack flex={1}>
            {/* Image Section — plain gray background */}
            <View
              style={{
                backgroundColor: "#F8F9FA",
                height: hp(128),
                borderBottomLeftRadius:wp(0),
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Exclusive tag — top left */}
              <View
                style={{
                  position: "absolute",
                  top: hp(-1),
                  left: wp(-2),
                  backgroundColor: "#F4EAFE",
                  borderBottomRightRadius: wp(5),
                  // borderBottomLeftRadius:0,
                  // borderTopRightRadius:5,
                  paddingVertical: hp(3),
                  paddingHorizontal: wp(8),
                  zIndex: 10,
                }}
              >
                <Text fontSize={fp(9)} fontWeight="700" color="#500696">
                  Exclusive
                </Text>
              </View>

              {/* Heart icon — top right, circle bg */}
              <Pressable
                onPress={handleFavoritePress}
                style={{
                  position: "absolute",
                  top: hp(8),
                  right: wp(8),
                  width: wp(28),
                  height: wp(28),
                  borderRadius: wp(14),
                  backgroundColor: "#F3F0F0",
                  borderWidth: 1,
                  borderColor: "#EEEEEE",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <Heart
                  size={14}
                  color={isFavorite ? "#D50B3E" : "#7E7E7E"}
                  fill={isFavorite ? "#D50B3E" : "none"}
                  strokeWidth={1.8}
                />
              </Pressable>

              {/* Product Image */}
              <Image
                source={{ uri: product?.primary_image_url }}
                alt={`${product.brand}`}
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
                priority="normal"
                style={{
                  width: wp(100),
                  height: hp(100),
                }}
              />

              {/* Shadow ellipse under product
              <View
                style={{
                  position: "absolute",
                  bottom: hp(6),
                  left: "50%",
                  marginLeft: -wp(22),
                  width: wp(44),
                  height: hp(6),
                  borderRadius: wp(22),
                  backgroundColor: "rgba(0,0,0,0.12)",
                }}
              /> */}
            </View>

            {/* Content Section */}
            <YStack
              padding={wp(10)}
              paddingTop={hp(5)}
              borderTopRightRadius={wp(20)}
              borderTopLeftRadius={wp(20)}
              gap={hp(5)}
              backgroundColor="white"
            >
              {/* Product Name */}
              <View style={{ height: hp(34) }}>
                <Text
                  fontSize={fp(10)}
                  fontWeight="700"
                  lineHeight={hp(14)}
                  color="#121217"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {product.name}
                </Text>
              </View>

              {/* Price Section */}
              <YStack gap={hp(2)}>
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
                <XStack
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                  marginTop={hp(4)}
                >
                  <Counter
                    value={cartItem.quantity}
                    onIncrement={handleCounterIncrement}
                    onDecrement={handleCounterDecrement}
                    size="sm"
                    variant="primary"
                  />
                </XStack>
              ) : (
                <XStack
                  onPress={(e) => e.stopPropagation()}
                  width="100%"
                  marginTop={hp(4)}
                >
                  <Button
                    width="100%"
                    size="md"
                    onPress={handleAddToCart}
                    variant="primary"
                  >
                    Add to cart
                  </Button>
                </XStack>
              )}
            </YStack>
          </YStack>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export const ProductCard = React.memo(ProductCardComponent);
