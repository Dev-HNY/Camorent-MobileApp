import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import { WarehouseIcon } from "@/components/icons/WarehouseIcon";
import { wp, hp, fp } from "@/utils/responsive";

interface AddressDetailsCardProps {
  address: string;
  city: string;
  state: string;
  pinCode: string;
  onEdit: () => void;
  isSelfPickup?: boolean;
}

export const AddressDetailsCard = ({
  address,
  city,
  state,
  pinCode,
  isSelfPickup = false,
}: AddressDetailsCardProps) => {
  return (
    <LinearGradient
      colors={["#FFFDE8", "#FFFFFF"]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F9DF7B",
        shadowColor: "#F9DF7B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Top section: icon + label + badge */}
      <XStack
        alignItems="center"
        gap={wp(8)}
        paddingHorizontal={wp(14)}
        paddingTop={hp(12)}
        paddingBottom={hp(12)}
      >
        <XStack
          width={28}
          height={28}
          borderRadius={7}
          backgroundColor="rgba(249,223,123,0.25)"
          alignItems="center"
          justifyContent="center"
        >
          {isSelfPickup
            ? <WarehouseIcon size={15} color="#B8860B" strokeWidth={2} />
            : <MapPin size={15} color="#B8860B" strokeWidth={2} />
          }
        </XStack>
        <Text fontSize={fp(14)} fontWeight="600" color="#121217" flex={1}>
          {isSelfPickup ? "Pickup details" : "Address details"}
        </Text>
        {isSelfPickup && (
          <XStack
            backgroundColor="rgba(249,223,123,0.3)"
            borderRadius={20}
            paddingHorizontal={wp(10)}
            paddingVertical={hp(4)}
          >
            <Text fontSize={fp(11)} fontWeight="600" color="#B8860B">Self Pickup</Text>
          </XStack>
        )}
      </XStack>

      {/* Divider */}
      <YStack height={1} backgroundColor="#F9DF7B" />

      {/* Bottom: details */}
      <YStack
        paddingHorizontal={wp(14)}
        paddingTop={hp(10)}
        paddingBottom={hp(12)}
        gap={hp(8)}
      >
        {isSelfPickup && (
          <Text fontSize={fp(12)} color="#92754A" fontWeight="600" marginBottom={hp(2)}>
            Camorent Warehouse
          </Text>
        )}
        {[
          { label: "Address", value: address },
          { label: "City", value: city },
          { label: "State", value: state },
          { label: "Pin code", value: pinCode },
        ].map(({ label, value }) => (
          <XStack key={label} justifyContent="space-between" alignItems="flex-start" gap={wp(16)}>
            <Text fontSize={fp(12)} color="#92754A" fontWeight="500" flexShrink={0}>{label}</Text>
            <Text fontSize={fp(13)} color="#121217" fontWeight="600" textAlign="right" flex={1}>{value}</Text>
          </XStack>
        ))}
      </YStack>
    </LinearGradient>
  );
};
