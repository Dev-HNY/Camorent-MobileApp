import React, { useMemo } from "react";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { useCartStore } from "@/store/cart/cart";
import { useAuthStore } from "@/store/auth/auth";
import { SKU } from "@/types/products/product";
import { wp, hp, fp } from "@/utils/responsive";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import Price from "../ui/Price";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useGetCurrentUser } from "@/hooks/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Counter } from "../ui/Counter";
import { Operation, useModifyQuantity } from "@/hooks/cart/useModifyQuantity";

interface CartSummaryData {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  deliveryFee?: number;
  discount?: number;
}

interface StickyBottomCartProps {
  product?: SKU;
  isAdminApproved?: boolean;
  isCartScreen?: boolean;
  isCrewScreen?: boolean;
  isPaymentScreen?: boolean;
  hasSelectedCrew?: boolean;
  onContinue?: () => void;
  onPartialPayment?: () => void;
  isPartialPaymentLoading?: boolean;
  isSelfPickup?: boolean;
  customAmount?: number;
  cartData?: CartSummaryData;
  amount?: string;
  isLoading?: boolean;
  embedded?: boolean;
  isOrganization?: boolean;
}

export function StickyBottomCart({
  product,
  isAdminApproved = false,
  isCartScreen = false,
  isCrewScreen = false,
  isPaymentScreen = false,
  hasSelectedCrew = false,
  onContinue,
  customAmount,
  cartData,
  amount,
  isLoading = false,
  embedded = false,
  isOrganization = false,
  onPartialPayment,
  isPartialPaymentLoading = false,
  isSelfPickup = false,
}: StickyBottomCartProps) {
  const { summary } = useCartStore();
  const { user } = useAuthStore();

  const { data: currentUser } = useGetCurrentUser();
  const { data: cart } = useGetCart();
  const addToCartMutation = useAddToCart();
  const modifyQuantityMutation = useModifyQuantity();
  const insets = useSafeAreaInsets();

  const cartItem = useMemo(() => {
    if (!product) return null;
    return cart?.sku_items.find((item) => item.sku_id === product.sku_id);
  }, [cart?.sku_items, product]);

  const isInCart = !!cartItem;

  const getProductPrice = () => {
    if (!product) return 0;
    return parseFloat(product.price_per_day);
  };

  const activeSummary = isCartScreen && cartData ? cartData : summary;
  const currentPrice = getProductPrice();
  const quantity = cartItem?.quantity || 1;

  const originalPrice =
    isCrewScreen && customAmount
      ? customAmount / 0.85
      : isCartScreen
      ? activeSummary.subtotal * 1.15
      : isPaymentScreen && amount
      ? parseFloat(amount) * 1.15
      : isPaymentScreen
      ? activeSummary.subtotal
      : (currentPrice + currentPrice * 0.15) * quantity;

  const discountedPrice =
    isCrewScreen && customAmount
      ? customAmount
      : isPaymentScreen && amount
      ? parseFloat(amount)
      : isCartScreen || isPaymentScreen
      ? activeSummary.subtotal
      : currentPrice * quantity;

  const handleCounterIncrement = (e: any) => {
    e.stopPropagation();
    if (!user?.user_id || !product?.sku_id) return;
    modifyQuantityMutation.mutate({
      sku_id: product.sku_id,
      operation: Operation.ADD,
    });
  };

  const handleCounterDecrement = (e: any) => {
    e.stopPropagation();
    if (!user?.user_id || !product?.sku_id) return;
    modifyQuantityMutation.mutate({
      sku_id: product.sku_id,
      operation: Operation.REMOVE,
    });
  };

  const handleCheckout = () => {
    router.push("/checkout/crew");
  };

  const handleAddToCart = () => {
    if (isPaymentScreen && onContinue) {
      onContinue();
    } else if (isCrewScreen && onContinue) {
      onContinue();
    } else if (isCartScreen) {
      if (onContinue) {
        onContinue();
      } else {
        handleCheckout();
      }
    } else if (product) {
      if (isInCart) {
        router.push("/cart");
      } else {
        if (!currentUser?.user_id) return;
        addToCartMutation.mutate({
          item_id: product.sku_id,
          item_quantity: 1,
          itemType: "sku",
        });
      }
    }
  };

  const getButtonText = () => {
    if (isPaymentScreen) return "Pay now";
    if (isCrewScreen) return hasSelectedCrew ? "Continue" : "Kindly Select Crew";
    if (isCartScreen) return isSelfPickup ? "Send for Approval" : "Continue";
    return "Add to cart";
  };

  return (
    <YStack
      {...(!embedded && {
        position: "absolute" as const,
        bottom: insets.bottom,
        left: 0,
        right: 0,
      })}
      backgroundColor="#FFFFFF"
      borderTopWidth={1}
      borderTopColor="#F2F2F7"
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap={wp(16)}
        paddingVertical={hp(18)}
        paddingHorizontal={wp(20)}
        backgroundColor="#FFFFFF"
      >
        <YStack flex={1} gap={hp(4)}>
          <XStack alignItems="baseline" gap={wp(6)}>
            <Price
              value={discountedPrice}
              fontSize={fp(22)}
              fontWeight="700"
              color="#1C1C1E"
              lineHeight={hp(26)}
            />
            <Price
              value={originalPrice}
              fontSize={fp(14)}
              color="#8E8E93"
              textDecorationLine="line-through"
              lineHeight={hp(20)}
            />
          </XStack>
          <Text
            fontSize={fp(12)}
            fontWeight="400"
            lineHeight={hp(16)}
            color="#8E8E93"
          >
            100% refundable deposit
          </Text>
        </YStack>

        {isInCart ? (
          <Counter
            value={cartItem.quantity}
            onIncrement={handleCounterIncrement}
            onDecrement={handleCounterDecrement}
            size="sm"
            variant="primary"
          />
        ) : isPaymentScreen && !isAdminApproved ? (
          <YStack
            flex={1.2}
            backgroundColor="#F3F4F6"
            borderRadius={wp(12)}
            paddingVertical={hp(16)}
            paddingHorizontal={wp(18)}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize={fp(14)}
              fontWeight="500"
              color="#6C6C70"
              textAlign="center"
              lineHeight={hp(20)}
            >
              Awaiting approval
            </Text>
          </YStack>
        ) : (
          <YStack flex={1.2} gap={hp(8)}>
            {isPaymentScreen && isOrganization && (
              <Button
                onPress={() => router.replace("/(tabs)/(shoots)")}
                size="lg"
                variant="outline"
              >
                My Shoots
              </Button>
            )}
            <Button
              onPress={handleAddToCart}
              size="lg"
              rightIcon={
                !isLoading ? <ArrowRightIcon color="#FFF" /> : undefined
              }
              disabled={isLoading}
            >
              {isLoading ? <Spinner color="white" /> : getButtonText()}
            </Button>
            {isPaymentScreen && onPartialPayment && (
              <Pressable
                onPress={onPartialPayment}
                disabled={isPartialPaymentLoading}
                style={{ alignItems: "center", paddingVertical: hp(2) }}
              >
                {isPartialPaymentLoading ? (
                  <Spinner size="small" color="#8E0FFF" />
                ) : (
                  <Text fontSize={fp(12)} fontWeight="500" color="#8E0FFF" textDecorationLine="underline">
                    Want to do partial payment?
                  </Text>
                )}
              </Pressable>
            )}
          </YStack>
        )}
      </XStack>
    </YStack>
  );
}
