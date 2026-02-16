import React, { useMemo, useRef, useEffect } from "react";
import { XStack, YStack, Text } from "tamagui";
import { Image } from "expo-image";
import { Counter } from "@/components/ui/Counter";
import { APICartSkuItem } from "@/types/cart/cart";
import { useCartStore } from "@/store/cart/cart";
import { LinearGradient } from "expo-linear-gradient";
import { VerifiedIcon } from "../ui/VerifiedIcon";
import { hp, wp, fp } from "@/utils/responsive";
import { BodyText, Heading2 } from "../ui/Typography";
import { useDeleteItem } from "@/hooks/cart/useDeleteItem";
import { useGetCurrentUser } from "@/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useGetSkuById } from "@/hooks/product/useGetSkuById";
import { DeleteIcon } from "../ui/DeleteIcon";
import { formatPrice } from "@/utils/format";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";

interface CartItemProps {
  item: APICartSkuItem;
}

export function CartItem({ item }: CartItemProps) {
  const { calculateRentalDays } = useCartStore();
  const queryClient = useQueryClient();
  const rentalDays = calculateRentalDays();
  const deleteMutation = useDeleteItem();
  const { data: user } = useGetCurrentUser();
  const { data: sku } = useGetSkuById(item.sku_id);
  const modifyQuantityMutation = useModifyQuantity();

  // Premium animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const imageUrl = useMemo(
    () => `https://img.camorent.co.in/skus/images/${sku?.id}/primary.webp`,
    [sku?.id]
  );

  const handleQuantityChange = (increment: boolean) => {
    if (!user?.user_id) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const operation = increment ? Operation.ADD : Operation.REMOVE;

    modifyQuantityMutation.mutate(
      {
        sku_id: item.sku_id,
        operation,
      },
      {
        onError: (error) => {
          console.error("Failed to update quantity:", error);
        },
      }
    );
  };

  const handleRemoveItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      deleteMutation.mutate(
        { sku_id: item?.sku_id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          },
          onError: (error) => {
            console.error(error.message);
          },
        }
      );
    });
  };

  // item.price_per_day is price per day per unit
  const pricePerDayPerUnit = parseFloat(
    item.price_per_day.replace(/[^0-9.]/g, "")
  );

  // Calculate total price
  const totalPrice = pricePerDayPerUnit * item.quantity * (rentalDays || 1);
  const perDayPrice = pricePerDayPerUnit;

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <YStack
        backgroundColor="#FFFFFF"
        borderRadius={wp(14)}
        borderWidth={1}
        borderColor="#F3F4F6"
        marginBottom={hp(12)}
        padding={wp(14)}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.04}
        shadowRadius={4}
        elevation={2}
      >
        <XStack gap={wp(14)} alignItems="center">
          <LinearGradient
            colors={["#F5EDFF", "#FDFBFF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: hp(80),
              width: wp(80),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: wp(10),
              padding: wp(6),
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
              style={{ width: wp(68), height: wp(68) }}
            />
          </LinearGradient>

          <YStack flex={1} gap={hp(8)}>
            <YStack gap={hp(4)} alignItems="flex-start">
              <XStack alignItems="center" justifyContent="space-between" width="100%">
                <XStack alignItems="center" gap={wp(6)} flex={1}>
                  <XStack maxWidth={"75%"}>
                    <Text
                      fontSize={fp(15)}
                      fontWeight="600"
                      color="#1C1C1E"
                      numberOfLines={1}
                    >
                      {sku?.name}
                    </Text>
                  </XStack>
                  <VerifiedIcon />
                </XStack>
                <XStack onPress={handleRemoveItem}>
                  <DeleteIcon />
                </XStack>
              </XStack>

              <Text fontSize={fp(12)} color="#6B7280" numberOfLines={1}>
                {formatPrice(perDayPrice)}/day × {item.quantity} qty × {rentalDays || 1} days
              </Text>
            </YStack>

            <XStack alignItems="flex-end" justifyContent="space-between">
              <Text fontSize={fp(18)} fontWeight="700" color="#8E0FFF">
                {formatPrice(Math.round(totalPrice))}
              </Text>
              <Counter
                value={item.quantity}
                onIncrement={() => handleQuantityChange(true)}
                onDecrement={() => handleQuantityChange(false)}
                size="sm"
                variant="outline"
              />
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </Animated.View>
  );
}
