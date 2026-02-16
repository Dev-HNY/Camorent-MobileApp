import { Sheet, YStack, XStack, Text, Separator } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp, fp } from "@/utils/responsive";
import { Heading2, BodyText } from "@/components/ui/Typography";
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

export function PriceBreakdownSheet({
  open,
  onOpenChange,
  itemsCount,
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

  // Show only IGST if IGST > 0, otherwise show CGST and SGST
  const igstValue = igstAmount ? parseFloat(igstAmount) : 0;
  const cgstValue = cgstAmount ? parseFloat(cgstAmount) : 0;
  const sgstValue = sgstAmount ? parseFloat(sgstAmount) : 0;
  const showIGST = igstValue > 0;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="percent"
      snapPoints={[35]}
      dismissOnSnapToBottom
      modal
      animation="quick"
    >
      <Sheet.Overlay
        backgroundColor="rgba(0, 0, 0, 0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="white"
        borderTopLeftRadius={wp(24)}
        borderTopRightRadius={wp(24)}
        paddingHorizontal={wp(16)}
        paddingTop={hp(24)}
        paddingBottom={Math.max(insets.bottom + hp(10), hp(30))}
      >
        <YStack gap={hp(16)}>
          <Heading2>Order Summary</Heading2>

          <YStack gap={hp(12)}>
            <XStack justifyContent="space-between" alignItems="center">
              <BodyText color="#6C6C89">Item Total</BodyText>
              <Price
                value={parseFloat(itemsAmount)}
                fontSize={fp(14)}
                fontWeight="500"
                lineHeight={hp(20)}
                color="black"
              />
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <BodyText color="#6C6C89">Crew Total</BodyText>
              <Price
                value={parseFloat(crewAmount)}
                fontSize={fp(14)}
                fontWeight="500"
                lineHeight={hp(20)}
                color="black"
              />
            </XStack>

            {parseFloat(discountAmount) > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <BodyText color="#6C6C89">Discount</BodyText>
                <XStack alignItems="center">
                  <Text
                    fontSize={fp(14)}
                    fontWeight="500"
                    lineHeight={hp(20)}
                    color="green"
                  >
                    -{" "}
                  </Text>
                  <Price
                    value={parseFloat(discountAmount)}
                    fontSize={fp(14)}
                    fontWeight="500"
                    lineHeight={hp(20)}
                    color="green"
                  />
                </XStack>
              </XStack>
            )}

            {parseFloat(couponDiscountAmount) > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <BodyText color="#6C6C89">Coupon Discount</BodyText>
                <XStack alignItems="center">
                  <Text
                    fontSize={fp(14)}
                    fontWeight="500"
                    lineHeight={hp(20)}
                    color="green"
                  >
                    -{" "}
                  </Text>
                  <Price
                    value={parseFloat(couponDiscountAmount)}
                    fontSize={fp(14)}
                    fontWeight="500"
                    lineHeight={hp(20)}
                    color="green"
                  />
                </XStack>
              </XStack>
            )}

            {showIGST ? (
              <XStack justifyContent="space-between" alignItems="center">
                <BodyText color="#6C6C89">IGST</BodyText>
                <Price
                  value={igstValue}
                  fontSize={fp(14)}
                  fontWeight="500"
                  lineHeight={hp(20)}
                  color="black"
                />
              </XStack>
            ) : (
              <>
                {cgstValue > 0 && (
                  <XStack justifyContent="space-between" alignItems="center">
                    <BodyText color="#6C6C89">CGST</BodyText>
                    <Price
                      value={cgstValue}
                      fontSize={fp(14)}
                      fontWeight="500"
                      lineHeight={hp(20)}
                      color="black"
                    />
                  </XStack>
                )}
                {sgstValue > 0 && (
                  <XStack justifyContent="space-between" alignItems="center">
                    <BodyText color="#6C6C89">SGST</BodyText>
                    <Price
                      value={sgstValue}
                      fontSize={fp(14)}
                      fontWeight="500"
                      lineHeight={hp(20)}
                      color="black"
                    />
                  </XStack>
                )}
              </>
            )}

            <XStack justifyContent="space-between" alignItems="center">
              <BodyText color="#6C6C89">Total Rental Days</BodyText>
              <Text
                fontSize={fp(14)}
                fontWeight="500"
                lineHeight={hp(20)}
                color="black"
              >
                {rentalDays} days
              </Text>
            </XStack>
          </YStack>

          <Separator borderColor="#EBEBEF" />

          <XStack justifyContent="space-between" alignItems="center">
            <Heading2>Total</Heading2>
            <Price
              value={parseFloat(totalAmount)}
              fontSize={fp(20)}
              fontWeight="700"
              lineHeight={hp(24)}
              color="black"
            />
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
