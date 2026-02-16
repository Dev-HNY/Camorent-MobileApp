import React from "react";
import { XStack, Text } from "tamagui";
import { Zap } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";

interface PromoBannerProps {
  message?: string;
}

export const PromoBanner = ({
  message = "Add rentals worth ₹2500 to get 20% off .",
}: PromoBannerProps) => {
  return (
    <LinearGradient
      colors={["#FFF3D6", "#FFE8A8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: wp(12),
        marginHorizontal: wp(16),
        marginBottom: hp(8),
      }}
    >
      <XStack
        paddingVertical={hp(12)}
        paddingHorizontal={wp(16)}
        alignItems="center"
        gap={wp(8)}
      >
        <Zap size={wp(18)} color="#D97706" fill="#D97706" strokeWidth={2} />
        <Text
          fontSize={fp(13)}
          fontWeight="500"
          color="#92400E"
          flex={1}
          lineHeight={fp(18)}
        >
          {message}
        </Text>
      </XStack>
    </LinearGradient>
  );
};
