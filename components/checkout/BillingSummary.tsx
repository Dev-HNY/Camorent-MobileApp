import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { RentCostBreakdown } from "@/components/checkout/RentCostBreakdown";
import { hp, fp, wp } from "@/utils/responsive";

interface BillingSummaryProps {
  itemTotal: number;
  crewTotal: number;
  gstCharges: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  couponDiscount?: number;
  camocareAmount?: number;
  totalAmount: number;
  invoiceId?: string;
  isLoadingInvoice?: boolean;
  invoiceUrl?: string;
  onDownloadInvoice?: () => void;
}

export function BillingSummary({
  itemTotal,
  crewTotal,
  gstCharges,
  cgstAmount,
  sgstAmount,
  igstAmount,
  couponDiscount = 0,
  camocareAmount = 0,
  totalAmount,
  invoiceId,
  isLoadingInvoice = false,
  invoiceUrl,
  onDownloadInvoice,
}: BillingSummaryProps) {
  const hasInvoice = invoiceId && invoiceId !== "";
  const canDownload = hasInvoice && !isLoadingInvoice && invoiceUrl;

  return (
    <YStack gap={hp(10)}>
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={wp(4)}>
        <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4}>
          BILL DETAILS
        </Text>
        {hasInvoice && (
          <Pressable onPress={onDownloadInvoice} disabled={!canDownload} hitSlop={8}>
            <Text
              fontSize={fp(13)}
              fontWeight="600"
              color={canDownload ? "#8E0FFF" : "#C7C7CC"}
            >
              {isLoadingInvoice ? "Loading..." : "Invoice"}
            </Text>
          </Pressable>
        )}
      </XStack>
      <RentCostBreakdown
        itemTotal={itemTotal}
        gstCharges={gstCharges}
        cgstAmount={cgstAmount}
        sgstAmount={sgstAmount}
        igstAmount={igstAmount}
        crewTotal={crewTotal}
        couponDiscount={couponDiscount}
        camocareAmount={camocareAmount}
        totalAmount={totalAmount}
      />
    </YStack>
  );
}
