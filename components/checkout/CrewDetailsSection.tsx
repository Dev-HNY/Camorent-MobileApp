import React from "react";
import { YStack, XStack, Stack, Separator, Text } from "tamagui";
import { Image } from "expo-image";
import { Plus, User } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp, fp } from "@/utils/responsive";
import { BodyText, BodySmall, Heading2 } from "@/components/ui/Typography";
import { formatPrice } from "@/utils/format";

interface CrewItem {
  id: string;
  name: string;
  quantity: number;
  days: number;
  price: number;
  image: string;
}

interface CrewDetailsSectionProps {
  crew: CrewItem[];
  deliveryDate: string;
  onAddMore: () => void;
}

export const CrewDetailsSection = ({
  crew,
  deliveryDate,
  onAddMore,
}: CrewDetailsSectionProps) => {
  return (
    <YStack gap={hp(12)}>
      <Heading2 color="#1C1C1E">Crew details</Heading2>

      <Stack
        borderColor={"#E5E7EB"}
        borderWidth={1}
        borderRadius={wp(12)}
        paddingHorizontal={wp(16)}
        paddingVertical={hp(16)}
        gap={hp(16)}
        backgroundColor="#FFFFFF"
      >
        {/* Header row */}
        <XStack justifyContent="space-between" alignItems="center">
          <YStack gap={hp(2)}>
            <BodySmall color={"#8E8E93"} fontWeight="500">Delivery scheduled on</BodySmall>
            <BodyText color={"#1C1C1E"} fontWeight="600">{deliveryDate}</BodyText>
          </YStack>
          <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">
            Total: {crew.length} crew
          </Text>
        </XStack>

        {crew.length > 0 && <Separator borderStyle="dashed" borderColor={"#E5E7EB"} />}

        {/* Crew rows */}
        {crew.length > 0 && (
          <YStack gap={hp(14)}>
            {crew.map((member) => (
              <XStack key={member.id} alignItems="center" gap={wp(12)}>
                {/* Crew image with gradient */}
                <LinearGradient
                  colors={["#F5EDFF", "#FDFBFF", "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: wp(52),
                    height: hp(52),
                    borderRadius: wp(26),
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {member.image ? (
                    <Image
                      source={{ uri: member.image }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      style={{ width: wp(52), height: hp(52) }}
                    />
                  ) : (
                    <User size={wp(24)} color="#8E0FFF" strokeWidth={1.5} />
                  )}
                </LinearGradient>

                {/* Crew info */}
                <YStack flex={1} gap={hp(4)}>
                  <Text
                    fontSize={fp(14)}
                    fontWeight="600"
                    color="#1C1C1E"
                    lineHeight={hp(19)}
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>
                  <XStack justifyContent="space-between" alignItems="center">
                    <BodySmall color={"#8E8E93"}>
                      Qty: {member.quantity} · {member.days} {member.days === 1 ? "day" : "days"}
                    </BodySmall>
                    <Text
                      fontSize={fp(15)}
                      fontWeight="600"
                      color="#1C1C1E"
                    >
                      {formatPrice(member.price)}
                    </Text>
                  </XStack>
                </YStack>
              </XStack>
            ))}
          </YStack>
        )}

        {/* Add more button */}
        <XStack
          borderWidth={1}
          borderColor="#8E0FFF"
          borderRadius={wp(10)}
          paddingVertical={hp(11)}
          paddingHorizontal={wp(16)}
          justifyContent="center"
          alignItems="center"
          gap={wp(6)}
          onPress={onAddMore}
          backgroundColor="#FAFAFF"
        >
          <Plus size={fp(16)} color="#8E0FFF" strokeWidth={2.5} />
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#8E0FFF"
          >
            Add more items
          </Text>
        </XStack>
      </Stack>
    </YStack>
  );
};
