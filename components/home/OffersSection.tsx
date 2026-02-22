import { YStack, XStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";

const giftsImg = require("@/assets/images/brands/banners/gifts.png");

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
          fontFamily={"PlayfairDisplay-Bold" as any}
          fontStyle="italic"
        >
          Offers
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#cbcbcb" }} />
      </XStack>

      {/* Purple 25%-off banner */}
      <YStack paddingHorizontal={wp(16)}>
        <LinearGradient
          colors={["#7B3FFF", "#9B59FF", "#B87FFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: wp(16),
            overflow: "hidden",
            minHeight: hp(130),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: wp(20),
            paddingVertical: hp(20),
          }}
        >
          {/* Decorative circles */}
          <View
            style={{
              position: "absolute",
              top: -hp(32),
              right: -wp(32),
              width: wp(128),
              height: wp(128),
              borderRadius: wp(64),
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -hp(24),
              left: -wp(24),
              width: wp(96),
              height: wp(96),
              borderRadius: wp(48),
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />

          {/* Left content */}
          <YStack gap={hp(4)} flex={1} zIndex={1}>
            <Text fontSize={fp(11)} color="rgba(255,255,255,0.8)">Limited time offer</Text>
            <XStack alignItems="baseline" gap={wp(4)}>
              <Text fontSize={fp(42)} fontWeight="800" color="white" lineHeight={fp(46)}>25%</Text>
              <Text fontSize={fp(22)} fontWeight="700" color="white" lineHeight={fp(26)}>off</Text>
            </XStack>
            <Text fontSize={fp(10)} color="rgba(255,255,255,0.8)" marginBottom={hp(4)}>
              On your first rental order
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/(home)/offers")}
              style={{
                backgroundColor: "white",
                borderRadius: wp(8),
                paddingVertical: hp(7),
                paddingHorizontal: wp(16),
                alignSelf: "flex-start",
              }}
            >
              <Text fontSize={fp(11)} fontWeight="600" color="#6C4EFF">Redeem Coupon</Text>
            </Pressable>
          </YStack>

          {/* Right — gifts image, absolute so it never wraps below */}
          <View
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              top: 40,
              width: wp(140),
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <Image
              source={giftsImg}
              contentFit="cover"
              style={{ width: "80%", height: "60%" }}
              cachePolicy="memory-disk"
            />
          </View>
        </LinearGradient>
      </YStack>

      {/*
        Offer cards removed — replaced by DiscountBanner (discount.svg).
        Restore by uncommenting the block below and re-adding imports:
        Spinner, ScrollView, OfferCard, useGetAllOffers, useState, handleScroll
      */}
    </YStack>
  );
}
