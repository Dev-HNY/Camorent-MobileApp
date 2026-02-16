import React from "react";
import { YStack, XStack, Stack, Separator, Text } from "tamagui";
import { Package, Users, Percent, Truck, Shield } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { BillDetailRow } from "./BillDetailRow";
import { formatPrice } from "@/utils/format";
import Price from "@/components/ui/Price";

interface RentCostBreakdownProps {
  itemTotal: number;
  crewTotal: number;
  couponDiscount?: number;
  deliveryFees?: number;
  gstCharges?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  camocareAmount?: number;
  totalAmount: number;
}

export const RentCostBreakdown = ({
  itemTotal,
  crewTotal,
  couponDiscount = 0,
  camocareAmount = 0,
  totalAmount,
}: RentCostBreakdownProps) => {

  return (
    <Stack
      paddingVertical={hp(14)}
      paddingHorizontal={wp(14)}
      borderRadius={wp(12)}
      borderWidth={1}
      borderColor={"#E5E7EB"}
      backgroundColor="#FFFFFF"
    >
      <YStack gap={hp(12)}>
        <YStack gap={hp(10)}>
            <BillDetailRow
              icon={Package}
              label="Item Total"
              value={formatPrice(itemTotal)}
            />
            {crewTotal > 0 && (
              <BillDetailRow
                icon={Users}
                label="Crew Total"
                value={formatPrice(crewTotal)}
              />
            )}
            {couponDiscount > 0 && (
              <BillDetailRow
                icon={Percent}
                label="Coupon Discount"
                value={`-${formatPrice(couponDiscount)}`}
                valueColor="#17663A"
              />
            )}
            <BillDetailRow
              icon={Truck}
              label="Delivery fees"
              value="Free"
              valueColor="#17663A"
            />
            {camocareAmount > 0 && (
              <BillDetailRow
                icon={Shield}
                label="Camocare"
                value={formatPrice(camocareAmount)}
              />
            )}
          </YStack>

          <Separator borderColor="#E5E7EB" marginVertical={hp(4)} />

          <XStack alignItems="center" justifyContent="space-between" paddingTop={hp(2)}>
            <Text fontSize={fp(14)} fontWeight="600" color="#8E0FFF">
              Total amount
            </Text>
            <Price
              value={totalAmount}
              fontSize={fp(17)}
              fontWeight="700"
              color="#1C1C1E"
              lineHeight={hp(22)}
            />
          </XStack>
        </YStack>
    </Stack>
  );
};
