import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Percent, Check, ChevronRight, Tag } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

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
  return (
    <YStack gap={hp(10)}>
      {/* Section label */}
      <Text style={styles.sectionLabel}>PROMO CODE</Text>

      {/* Card */}
      <YStack style={[styles.card, isApplied && styles.cardApplied]}>
        <XStack alignItems="center" gap={wp(12)}>
          {/* Icon */}
          <YStack style={[styles.iconCircle, isApplied && styles.iconCircleApplied]}>
            {isApplied ? (
              <Check size={hp(16)} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Percent size={hp(16)} color="#8E0FFF" strokeWidth={2} />
            )}
          </YStack>

          {/* Text */}
          <YStack flex={1} gap={hp(3)}>
            <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
              {isApplied
                ? `${code} applied`
                : `Get ${discount}% off with ${code}`}
            </Text>
            {isApplied ? (
              <XStack alignItems="center" gap={wp(4)}>
                <Text fontSize={fp(12)} color="#34C759" fontWeight="500">
                  You saved ₹{discountAmount}
                </Text>
              </XStack>
            ) : (
              cartTotal < minAmount && (
                <Text fontSize={fp(12)} color="#8E8E93">
                  Add ₹{minAmount - cartTotal} more to unlock
                </Text>
              )
            )}
          </YStack>

          {/* Action button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              isApplied ? onRemove() : onApply();
            }}
            style={[styles.actionBtn, isApplied && styles.actionBtnRemove]}
          >
            <Text
              fontSize={fp(12)}
              fontWeight="600"
              color={isApplied ? "#FF3B30" : "#8E0FFF"}
            >
              {isApplied ? "Remove" : "Apply"}
            </Text>
          </Pressable>
        </XStack>
      </YStack>

      {/* View all link */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onViewAll();
        }}
        style={styles.viewAllRow}
      >
        <Tag size={hp(13)} color="#8E0FFF" strokeWidth={2} />
        <Text fontSize={fp(13)} fontWeight="500" color="#8E0FFF">
          View all coupons
        </Text>
        <ChevronRight size={hp(14)} color="#8E0FFF" strokeWidth={2.5} />
      </Pressable>
    </YStack>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardApplied: {
    backgroundColor: "#F5EEFF",
    shadowColor: "#8E0FFF",
    shadowOpacity: 0.08,
  },
  iconCircle: {
    width: wp(34),
    height: wp(34),
    borderRadius: wp(17),
    backgroundColor: "#F5EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleApplied: {
    backgroundColor: "#8E0FFF",
  },
  actionBtn: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(7),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#8E0FFF",
  },
  actionBtnRemove: {
    borderColor: "#FF3B30",
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(5),
    paddingVertical: hp(4),
  },
});
