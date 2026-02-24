import React from "react";
import { XStack, Text } from "tamagui";
import { Zap } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { StyleSheet } from "react-native";

interface PromoBannerProps {
  message?: string;
}

export const PromoBanner = ({
  message = "Add rentals worth ₹2500 to get 20% off.",
}: PromoBannerProps) => {
  return (
    <XStack style={styles.banner} alignItems="center" gap={wp(10)}>
      <XStack style={styles.iconBox}>
        <Zap size={hp(14)} color="#D97706" fill="#D97706" strokeWidth={2} />
      </XStack>
      <Text fontSize={fp(13)} fontWeight="500" color="#92400E" flex={1} lineHeight={fp(18)}>
        {message}
      </Text>
    </XStack>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFFBEB",
    borderRadius: wp(12),
    marginHorizontal: wp(16),
    marginBottom: hp(8),
    paddingVertical: hp(11),
    paddingHorizontal: wp(14),
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  iconBox: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
});
