import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { StyleSheet } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
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

function BillRow({
  label,
  value,
  valueColor,
  isTotal,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  isTotal?: boolean;
}) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingVertical={hp(12)}>
      <Text
        fontSize={isTotal ? fp(15) : fp(14)}
        fontWeight={isTotal ? "600" : "400"}
        color={isTotal ? "#1C1C1E" : "#6C6C70"}
      >
        {label}
      </Text>
      {typeof value === "string" ? (
        <Text
          fontSize={isTotal ? fp(16) : fp(14)}
          fontWeight={isTotal ? "700" : "500"}
          color={valueColor ?? (isTotal ? "#1C1C1E" : "#1C1C1E")}
          letterSpacing={isTotal ? -0.3 : 0}
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </XStack>
  );
}

export const RentCostBreakdown = ({
  itemTotal,
  crewTotal,
  couponDiscount = 0,
  cgstAmount,
  sgstAmount,
  igstAmount,
  camocareAmount = 0,
  totalAmount,
}: RentCostBreakdownProps) => {
  const igstValue = igstAmount ?? 0;
  const cgstValue = cgstAmount ?? 0;
  const sgstValue = sgstAmount ?? 0;
  const showIGST = igstValue > 0;

  const rows: { label: string; value: React.ReactNode; valueColor?: string }[] = [
    {
      label: "Equipment total",
      value: (
        <Price value={itemTotal} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#1C1C1E" />
      ),
    },
  ];

  if (crewTotal > 0) {
    rows.push({
      label: "Crew total",
      value: (
        <Price value={crewTotal} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#1C1C1E" />
      ),
    });
  }

  if (couponDiscount > 0) {
    rows.push({
      label: "Coupon discount",
      value: (
        <XStack alignItems="center" gap={wp(1)}>
          <Text fontSize={fp(14)} fontWeight="500" color="#34C759">−</Text>
          <Price value={couponDiscount} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#34C759" />
        </XStack>
      ),
    });
  }

  rows.push({ label: "Delivery", value: "Free", valueColor: "#34C759" });

  if (camocareAmount > 0) {
    rows.push({
      label: "Camocare",
      value: (
        <Price value={camocareAmount} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#1C1C1E" />
      ),
    });
  }

  if (showIGST) {
    rows.push({
      label: "IGST",
      value: (
        <Price value={igstValue} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#6C6C70" />
      ),
    });
  } else {
    if (cgstValue > 0) {
      rows.push({
        label: "CGST",
        value: (
          <Price value={cgstValue} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#6C6C70" />
        ),
      });
    }
    if (sgstValue > 0) {
      rows.push({
        label: "SGST",
        value: (
          <Price value={sgstValue} fontSize={fp(14)} fontWeight="500" lineHeight={hp(20)} color="#6C6C70" />
        ),
      });
    }
  }

  return (
    <YStack style={styles.card}>
      <YStack paddingHorizontal={wp(16)}>
        {rows.map((row, i) => (
          <React.Fragment key={row.label}>
            <BillRow label={row.label} value={row.value} valueColor={row.valueColor} />
            {i < rows.length - 1 && <YStack height={1} backgroundColor="#F2F2F7" />}
          </React.Fragment>
        ))}
      </YStack>

      {/* Total */}
      <YStack height={1} backgroundColor="#F2F2F7" />
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={wp(16)}
        paddingVertical={hp(14)}
      >
        <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E">Total</Text>
        <Price
          value={totalAmount}
          fontSize={fp(20)}
          fontWeight="700"
          color="#1C1C1E"
          lineHeight={hp(24)}
        />
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
