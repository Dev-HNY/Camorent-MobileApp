import { YStack, XStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { View, ScrollView } from "react-native";
import { Image } from "expo-image";

const offerCards = [
  require("@/assets/new/footer/offers/1.svg"),
  require("@/assets/new/footer/offers/2.svg"),
  require("@/assets/new/footer/offers/3.svg"),
  require("@/assets/new/footer/offers/4.svg"),
  require("@/assets/new/footer/offers/5.svg"),
];

interface OffersSectionProps {
  onViewAllPress: () => void;
}

export function OffersSection({ onViewAllPress }: OffersSectionProps) {
  return (
    <YStack gap={hp(20)}>
      {/* Centered "Offers" heading with decorative lines */}
      <XStack alignItems="center" paddingHorizontal={wp(16)} gap={wp(12)}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#cbcbcb" }} />
        <Text
          fontSize={fp(16)}
          fontWeight="600"
          color="#121217"
          fontFamily={"Poppins-SemiBold" as any}
        >
          Offers
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#cbcbcb" }} />
      </XStack>

      {/* Horizontal scrollable offer cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          gap: wp(12),
        }}
      >
        {offerCards.map((source, index) => (
          <Image
            key={index}
            source={source}
            contentFit="contain"
            style={{
              width: wp(143),
              height: hp(186),
            }}
            cachePolicy="memory-disk"
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
