import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { Heading2 } from "@/components/ui/Typography";
import { RentCostBreakdown } from "@/components/checkout/RentCostBreakdown";
import { hp, fp } from "@/utils/responsive";

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
    <YStack gap={hp(8)}>
      <XStack alignItems="center" justifyContent="space-between">
        <Heading2>Bill Details</Heading2>
        {hasInvoice && (
          <Pressable onPress={onDownloadInvoice} disabled={!canDownload}>
            <Text
              fontSize={fp(12)}
              lineHeight={hp(16)}
              fontWeight="500"
              color={canDownload ? "#6D00DA" : "#B8B8C7"}
            >
              {isLoadingInvoice ? "Loading..." : "Download Invoice"}
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
