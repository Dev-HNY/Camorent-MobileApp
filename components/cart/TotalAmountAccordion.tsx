import React, { useState } from "react";
import { XStack, YStack, Text, Separator, useTheme } from "tamagui";
import { useCartStore } from "@/store/cart/cart";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { Pressable } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import Price from "@/components/ui/Price";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { formatPrice } from "@/utils/format";

interface CartSummaryData {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  deliveryFee?: number;
  discount?: number;
  // camocarePrice?: number;
}

interface TotalAmountAccordionProps {
  cartData?: CartSummaryData;
  rentalDays?: number;
}

export function TotalAmountAccordion({
  cartData,
  rentalDays,
}: TotalAmountAccordionProps) {
  const { summary, calculateRentalDays } = useCartStore();
  const { data: cart } = useGetCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();

  // Use cartData from API when available, otherwise use local summary
  const activeSummary = cartData || summary;
  const totalDays = rentalDays || calculateRentalDays() || 0;
  const items = cart?.sku_items || [];

  if (activeSummary.itemCount === 0) {
    return null;
  }

  return (
    <YStack>
      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        <XStack
          backgroundColor="#FFFFFF"
          borderRadius={wp(12)}
          borderWidth={1}
          borderColor="#E5E7EB"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(12)}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.04}
          shadowRadius={4}
          elevation={2}
        >
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#121217"
            lineHeight={hp(20)}
          >
            Price Details
          </Text>
          <XStack alignItems="center" gap={wp(8)}>
            <Price
              value={activeSummary.total}
              fontSize={fp(16)}
              fontWeight="700"
              color="#121217"
              lineHeight={hp(20)}
            />
            {isExpanded ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </XStack>
        </XStack>
      </Pressable>

      {isExpanded && (
        <YStack
          backgroundColor="#FFFFFF"
          borderRadius={wp(12)}
          borderWidth={1}
          borderColor="#E5E7EB"
          padding={wp(16)}
          marginTop={hp(8)}
          gap={hp(16)}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.04}
          shadowRadius={4}
          elevation={2}
        >
          {/* Item-wise breakdown */}
          <YStack gap={hp(12)}>
            <Text fontSize={fp(14)} fontWeight="600" color="#121217">
              Items ({activeSummary.itemCount})
            </Text>
            {items.map((item, index) => {
              const pricePerDay = parseFloat(item.price_per_day.replace(/[^0-9.]/g, ""));
              const itemTotal = pricePerDay * item.quantity * (totalDays || 1);

              return (
                <YStack key={item.sku_id} gap={hp(4)}>
                  <Text fontSize={fp(13)} color="#6B7280" numberOfLines={1}>
                    {item.sku_name || `Item ${index + 1}`}
                  </Text>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={fp(12)} color="#9CA3AF">
                      {formatPrice(pricePerDay)}/day × {item.quantity} × {totalDays || 1} days
                    </Text>
                    <Text fontSize={fp(13)} fontWeight="600" color="#121217">
                      {formatPrice(Math.round(itemTotal))}
                    </Text>
                  </XStack>
                </YStack>
              );
            })}
          </YStack>

          <Separator backgroundColor="#E5E7EB" />

          {/* Summary section */}
          <YStack gap={hp(10)}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={fp(14)} color="#6B7280">
                Subtotal
              </Text>
              <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                {formatPrice(Math.round(activeSummary.subtotal))}
              </Text>
            </XStack>

            {totalDays > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={fp(14)} color="#6B7280">
                  Rental Duration
                </Text>
                <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                  {totalDays} {totalDays === 1 ? "day" : "days"}
                </Text>
              </XStack>
            )}
          </YStack>

          <Separator backgroundColor="#E5E7EB" />

          {/* Total */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={fp(16)} fontWeight="700" color="#121217">
              Total Amount
            </Text>
            <Text fontSize={fp(20)} fontWeight="700" color="#8E0FFF">
              {formatPrice(Math.round(activeSummary.total))}
            </Text>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
