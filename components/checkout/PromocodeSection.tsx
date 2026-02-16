import React from "react";
import { YStack, XStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Percent, Check, ChevronRight } from "lucide-react-native";
import { wp, hp } from "@/utils/responsive";
import { BodyText, Heading2 } from "@/components/ui/Typography";

interface PromocodeSectionProps {
  isApplied: boolean;
  code: string;
  discount: string;
  discountAmount: number;
  cartTotal: number;
  minAmount: number;
  onApply: () => void;
  onRemove: () => void;
  onViewAll: () => void;
}

export const PromocodeSection = ({
  isApplied,
  code,
  discount,
  discountAmount,
  cartTotal,
  minAmount,
  onApply,
  onRemove,
  onViewAll,
}: PromocodeSectionProps) => {
  const PromoCard = (
    <XStack
      paddingHorizontal={wp(12)}
      paddingVertical={hp(12)}
      justifyContent="space-between"
      alignItems="center"
      borderRadius={wp(12)}
      borderWidth={wp(1)}
      borderColor={!isApplied ? "#EBEBEF" : "transparent"}
      backgroundColor={isApplied ? undefined : "#FFFFFF"}
    >
      <YStack flex={1}>
        <XStack alignItems="flex-start" gap={wp(8)}>
          {isApplied ? (
            <Check
              size={wp(20)}
              color="#FFFFFF"
              strokeWidth={wp(1.2)}
              style={{
                backgroundColor: "#5F00BA",
                borderRadius: wp(4),
                padding: wp(2),
              }}
            />
          ) : (
            <Percent size={wp(16)} color="#8A8AA3" />
          )}
          <YStack gap={hp(4)} flex={1}>
            <BodyText fontWeight={"600"} color={"#141414"}>
              {isApplied
                ? `${code} applied!`
                : `Get flat ${discount}% off with ${code}`}
            </BodyText>
            {isApplied ? (
              <BodyText fontWeight={"500"} color="#141414">
                You saved ₹{discountAmount}
              </BodyText>
            ) : (
              cartTotal < minAmount && (
                <XStack gap={wp(4)} alignItems="center">
                  <BodyText fontWeight={"500"}>
                    Add items worth ₹{minAmount - cartTotal} more
                  </BodyText>
                  <ChevronRight size={wp(14)} color={"#A9A9BC"} />
                </XStack>
              )
            )}
          </YStack>
        </XStack>
      </YStack>
      <XStack
        borderWidth={1}
        borderColor="#8E0FFF"
        borderRadius={wp(8)}
        paddingHorizontal={wp(12)}
        paddingVertical={hp(6)}
        onPress={isApplied ? onRemove : onApply}
      >
        <BodyText color="#8E0FFF" fontWeight="500">
          {isApplied ? "Remove" : "Apply"}
        </BodyText>
      </XStack>
    </XStack>
  );

  return (
    <YStack gap={hp(12)}>
      <Heading2>Promocode</Heading2>

      {isApplied ? (
        <LinearGradient
          colors={["#F0FAFF", "#F0FAFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: wp(12),
            borderWidth: wp(1),
            borderColor: "#EBEBEF",
            overflow: "hidden",
          }}
        >
          {PromoCard}
        </LinearGradient>
      ) : (
        PromoCard
      )}

      <XStack
        justifyContent="center"
        alignItems="center"
        gap={wp(4)}
        paddingHorizontal={wp(2)}
        paddingVertical={wp(4)}
        onPress={onViewAll}
      >
        <BodyText fontWeight={"500"}>View all coupons</BodyText>
        <ChevronRight size={wp(14)} color={"#A9A9BC"} />
      </XStack>
    </YStack>
  );
};
