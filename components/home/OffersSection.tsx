import { YStack, XStack, Spinner, Text } from "tamagui";
import { Heading2 } from "../ui/Typography";
import { hp, wp, fp } from "@/utils/responsive";
import { ScrollView, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { OfferCard } from "../ui/OfferCard";
import { useGetAllOffers } from "@/hooks/offers/useGetAllOffers";
import { useState } from "react";

interface OffersSectionProps {
  onViewAllPress: () => void;
}

export function OffersSection({ onViewAllPress }: OffersSectionProps) {
  const { data: offers, isLoading } = useGetAllOffers();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = wp(263) + wp(16);
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <YStack alignItems="center" justifyContent="center" paddingVertical={hp(32)}>
        <Spinner size="small" color="#8E0FFF" />
      </YStack>
    );
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <YStack gap={hp(16)}>
      {/* Offers Header with decorative lines */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        gap={wp(12)}
      >
        {/* Left decorative line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#121217",
          }}
        />

        {/* Offers Title */}
        <Text
          fontSize={fp(22)}
          fontWeight="600"
          color="#121217"
          fontFamily="PlayfairDisplay-Bold"
          fontStyle="italic"
        >
          Offers
        </Text>

        {/* Right decorative line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#121217",
          }}
        />
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingBottom: hp(8),
          paddingTop: hp(8),
        }}
        snapToInterval={wp(263) + wp(16)}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {offers.map((offer) => (
          <YStack
            key={offer.offer_id}
            marginRight={wp(16)}
            style={{
              transform: [{ rotate: "-2deg" }],
            }}
          >
            <OfferCard offer={offer} />
          </YStack>
        ))}
      </ScrollView>

      {/* Carousel Dots */}
      {offers && offers.length > 1 && (
        <XStack justifyContent="center" alignItems="center" gap={wp(8)} marginTop={hp(12)}>
          {offers.map((offer, index) => (
            <YStack
              key={`dot-${offer.offer_id}`}
              width={index === activeIndex ? wp(40) : wp(8)}
              height={hp(8)}
              borderRadius={wp(4)}
              backgroundColor={index === activeIndex ? "#8E0FFF" : "#D1D1DB"}
              animation="quick"
            />
          ))}
        </XStack>
      )}
    </YStack>
  );
}
