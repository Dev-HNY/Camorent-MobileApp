import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";

interface AddressDetailsCardProps {
  address: string;
  city: string;
  state: string;
  pinCode: string;
  onEdit: () => void;
}

export const AddressDetailsCard = ({
  address,
  city,
  state,
  pinCode,
}: AddressDetailsCardProps) => {
  return (
    <LinearGradient
      colors={["#FFFBF0", "#FFF8E7", "#FFFFFF"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#FFE08A",
        shadowColor: "#F59E0B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <YStack padding={wp(16)} gap={hp(14)}>
        {/* Header */}
        <XStack alignItems="center" gap={wp(8)}>
          <XStack
            width={32}
            height={32}
            borderRadius={8}
            backgroundColor="rgba(245, 158, 11, 0.12)"
            alignItems="center"
            justifyContent="center"
          >
            <MapPin size={16} color="#D97706" strokeWidth={2} />
          </XStack>
          <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E">
            Address details
          </Text>
        </XStack>

        {/* Divider */}
        <YStack height={1} backgroundColor="rgba(255, 218, 133, 0.5)" />

        {/* Details */}
        <YStack gap={hp(10)}>
          {[
            { label: "Address", value: address },
            { label: "City", value: city },
            { label: "State", value: state },
            { label: "Pin code", value: pinCode },
          ].map(({ label, value }) => (
            <XStack key={label} justifyContent="space-between" alignItems="flex-start" gap={wp(16)}>
              <Text fontSize={fp(13)} color="#92754A" fontWeight="500" flexShrink={0}>
                {label}
              </Text>
              <Text fontSize={fp(14)} color="#1C1C1E" fontWeight="600" textAlign="right" flex={1}>
                {value}
              </Text>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </LinearGradient>
  );
};
