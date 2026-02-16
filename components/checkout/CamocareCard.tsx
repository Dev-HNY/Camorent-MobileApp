import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { wp, hp, fp } from "@/utils/responsive";

interface CamocareCardProps {
  pricePerShoot?: number;
}

export const CamocareCard = ({
  pricePerShoot = 64,
}: CamocareCardProps) => {
  return (
    <LinearGradient
      colors={["#E8F8F0", "#FFFFFF"]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: "#B2EECC",
      }}
    >
      <XStack
        padding={wp(14)}
        alignItems="center"
        justifyContent="space-between"
        gap={wp(12)}
      >
        <Image
          source={require("../../assets/images/camocare.png")}
          style={{ width: wp(36), height: wp(36) }}
          contentFit="contain"
        />

        <YStack flex={1} gap={hp(2)}>
          <XStack alignItems="center" gap={wp(6)}>
            <Text fontSize={fp(15)} fontWeight="700" color="#121217">
              Camo Care
            </Text>
          </XStack>
          <Text fontSize={fp(12)} fontWeight="400" color="#6B7280" lineHeight={fp(16)}>
            Secure this product at{" "}
            <Text fontSize={fp(12)} fontWeight="700" color="#121217">
              Rs {pricePerShoot}
            </Text>
            {"\n"}Get 100% damage waiver
          </Text>
        </YStack>

        <XStack
          backgroundColor="#F3F4F6"
          paddingHorizontal={wp(14)}
          paddingVertical={hp(8)}
          borderRadius={wp(8)}
          opacity={0.6}
        >
          <Text
            fontSize={fp(13)}
            fontWeight="600"
            color="#9CA3AF"
          >
            Coming Soon
          </Text>
        </XStack>
      </XStack>
    </LinearGradient>
  );
};
