import { Sheet, YStack, XStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp, fp } from "@/utils/responsive";
import Price from "@/components/ui/Price";

interface PriceBreakdownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemsCount: number;
  itemsAmount: string;
  crewAmount: string;
  discountAmount: string;
  couponDiscountAmount: string;
  cgstAmount?: string;
  sgstAmount?: string;
  igstAmount?: string;
  rentalDays: number;
  totalAmount: string;
}

function Row({
  label,
  value,
  valueColor,
  prefix,
}: {
  label: string;
  value: number;
  valueColor?: string;
  prefix?: string;
}) {
  return (
    <XStack justifyContent="space-between" alignItems="center" paddingVertical={hp(11)}>
      <Text fontSize={fp(14)} color="#6C6C70">{label}</Text>
      <XStack alignItems="center" gap={wp(2)}>
        {prefix && (
          <Text fontSize={fp(14)} fontWeight="500" color={valueColor ?? "#1C1C1E"}>{prefix}</Text>
        )}
        <Price
          value={value}
          fontSize={fp(14)}
          fontWeight="500"
          lineHeight={hp(20)}
          color={valueColor ?? "#1C1C1E"}
        />
      </XStack>
    </XStack>
  );
}

export function PriceBreakdownSheet({
  open,
  onOpenChange,
  itemsAmount,
  crewAmount,
  discountAmount,
  couponDiscountAmount,
  cgstAmount,
  sgstAmount,
  igstAmount,
  rentalDays,
  totalAmount,
}: PriceBreakdownSheetProps) {
  const insets = useSafeAreaInsets();

  const igstValue = igstAmount ? parseFloat(igstAmount) : 0;
  const cgstValue = cgstAmount ? parseFloat(cgstAmount) : 0;
  const sgstValue = sgstAmount ? parseFloat(sgstAmount) : 0;
  const showIGST = igstValue > 0;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      modal
      animation="quick"
    >
      <Sheet.Overlay
        backgroundColor="rgba(0,0,0,0.4)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="#FFFFFF"
        borderTopLeftRadius={wp(24)}
        borderTopRightRadius={wp(24)}
        paddingBottom={Math.max(insets.bottom + hp(8), hp(28))}
      >
        {/* Handle */}
        <YStack alignItems="center" paddingTop={hp(12)} paddingBottom={hp(4)}>
          <YStack width={36} height={4} borderRadius={2} backgroundColor="#E5E5EA" />
        </YStack>

        {/* Title */}
        <XStack
          paddingHorizontal={wp(20)}
          paddingTop={hp(16)}
          paddingBottom={hp(12)}
        >
          <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.4}>
            Price Breakdown
          </Text>
        </XStack>

        {/* Rows */}
        <YStack paddingHorizontal={wp(20)}>

          <Row label="Equipment total" value={parseFloat(itemsAmount)} />
          <YStack height={1} backgroundColor="#F2F2F7" />

          <Row label="Crew total" value={parseFloat(crewAmount)} />

          {parseFloat(discountAmount) > 0 && (
            <>
              <YStack height={1} backgroundColor="#F2F2F7" />
              <Row label="Discount" value={parseFloat(discountAmount)} valueColor="#34C759" prefix="−" />
            </>
          )}

          {parseFloat(couponDiscountAmount) > 0 && (
            <>
              <YStack height={1} backgroundColor="#F2F2F7" />
              <Row label="Coupon discount" value={parseFloat(couponDiscountAmount)} valueColor="#34C759" prefix="−" />
            </>
          )}

          {showIGST ? (
            <>
              <YStack height={1} backgroundColor="#F2F2F7" />
              <Row label="IGST" value={igstValue} valueColor="#6C6C70" />
            </>
          ) : (
            <>
              {cgstValue > 0 && (
                <>
                  <YStack height={1} backgroundColor="#F2F2F7" />
                  <Row label="CGST" value={cgstValue} valueColor="#6C6C70" />
                </>
              )}
              {sgstValue > 0 && (
                <>
                  <YStack height={1} backgroundColor="#F2F2F7" />
                  <Row label="SGST" value={sgstValue} valueColor="#6C6C70" />
                </>
              )}
            </>
          )}

          <YStack height={1} backgroundColor="#F2F2F7" />
          <XStack justifyContent="space-between" alignItems="center" paddingVertical={hp(11)}>
            <Text fontSize={fp(14)} color="#6C6C70">Rental duration</Text>
            <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
              {rentalDays} {rentalDays === 1 ? "day" : "days"}
            </Text>
          </XStack>
        </YStack>

        {/* Total */}
        <YStack height={1} backgroundColor="#F2F2F7" marginHorizontal={wp(20)} />
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={wp(20)}
          paddingTop={hp(14)}
          paddingBottom={hp(4)}
        >
          <Text fontSize={fp(16)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
            Total
          </Text>
          <Price
            value={parseFloat(totalAmount)}
            fontSize={fp(20)}
            fontWeight="700"
            lineHeight={hp(24)}
            color="#1C1C1E"
          />
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
}
