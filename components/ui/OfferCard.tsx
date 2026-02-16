import { YStack, XStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, Copy, Gift } from "lucide-react-native";
import { fp, hp, wp } from "@/utils/responsive";
import { Offer } from "@/hooks/offers/useGetAllOffers";
import { useState } from "react";
import { TouchableOpacity, Clipboard, View } from "react-native";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const couponCode = offer.offer_id.slice(-3).toUpperCase();
    await Clipboard.setString(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDiscountText = () => {
    if (offer.discount_type === "percentage") {
      return `${offer.discount_value}% Off`;
    }
    return `₹${offer.discount_value} Off`;
  };

  const couponCode = offer.offer_id.slice(-3).toUpperCase();

  return (
    <YStack
      width={wp(263)}
      borderRadius={wp(20)}
      overflow="hidden"
      backgroundColor="white"
    >
      {/* Main gradient background */}
      <LinearGradient
        colors={["#FAF4FE", "#F9F3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: hp(16),
          paddingBottom: hp(16),
          paddingHorizontal: wp(16),
        }}
      >
        {/* Top Section - Icon, Discount, Badge */}
        <XStack alignItems="flex-start" justifyContent="space-between" marginBottom={hp(8)}>
          <XStack alignItems="center" gap={wp(10)}>
            {/* Gift Icon Box */}
            <LinearGradient
              colors={["#8437EE", "#B22AD8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: wp(16),
                width: wp(48),
                height: wp(48),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gift size={wp(24)} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>

            {/* Discount and Description */}
            <YStack gap={hp(2)}>
              <Text
                fontSize={fp(22)}
                fontWeight="700"
                color="#8E0FFF"
                lineHeight={fp(28)}
                letterSpacing={-0.3}
              >
                {getDiscountText()}
              </Text>
              <Text
                fontSize={fp(12)}
                color="#8E8E93"
                lineHeight={fp(16)}
                maxWidth={wp(140)}
              >
                {offer.title}
              </Text>
            </YStack>
          </XStack>

          {/* NEW Badge */}
          <YStack
            backgroundColor="#34C759"
            paddingHorizontal={wp(10)}
            paddingVertical={hp(4)}
            borderRadius={wp(10)}
            alignSelf="flex-start"
          >
            <Text fontSize={fp(10)} fontWeight="700" color="#FFFFFF" letterSpacing={0.3}>
              NEW
            </Text>
          </YStack>
        </XStack>

        {/* Dashed Divider with Notches */}
        <XStack alignItems="center" marginVertical={hp(12)} position="relative">
          {/* Left Notch */}
          <View
            style={{
              position: "absolute",
              left: -wp(32),
              width: wp(32),
              height: wp(32),
              borderRadius: wp(18),
              backgroundColor: "#FFFFFF",
              zIndex: 10,
            }}
          />

          {/* Dashed Line */}
          <YStack
            flex={1}
            height={0}
            borderTopWidth={1}
            borderStyle="dashed"
            borderColor="#D1D1DB"
          />

          {/* Right Notch */}
          <View
            style={{
              position: "absolute",
              right: -wp(32),
              width: wp(32),
              height: wp(32),
              borderRadius: wp(18),
              backgroundColor: "#FFFFFF",
              zIndex: 10,
            }}
          />
        </XStack>

        {/* Bottom Section - Code and Copy Button */}
        <YStack
          backgroundColor="#F5E6FF"
          borderRadius={wp(12)}
          paddingVertical={hp(12)}
          paddingHorizontal={wp(14)}
          gap={hp(8)}
        >
          {/* Coupon Code and Copy */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize={fp(20)}
              fontWeight="700"
              color="#121217"
              letterSpacing={1.5}
              lineHeight={fp(26)}
            >
              {couponCode}
            </Text>

            <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
              <XStack
                backgroundColor="#8E0FFF"
                paddingHorizontal={wp(12)}
                paddingVertical={hp(6)}
                borderRadius={wp(16)}
                alignItems="center"
                gap={wp(4)}
              >
                <Copy size={wp(12)} color="#FFFFFF" strokeWidth={2.5} />
                <Text fontSize={fp(12)} fontWeight="600" color="#FFFFFF">
                  {copied ? "Copied" : "Copy"}
                </Text>
              </XStack>
            </TouchableOpacity>
          </XStack>

          {/* Valid Till and Min Order */}
          <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <XStack alignItems="center" gap={wp(4)}>
              <Clock size={wp(12)} color="#8E8E93" strokeWidth={2} />
              <Text fontSize={fp(10)} color="#8E8E93" lineHeight={fp(13)}>
                Valid till {formatDate(offer.valid_till)}
              </Text>
            </XStack>

            {offer.min_order_value > 0 && (
              <YStack
                backgroundColor="#EBEBEF"
                paddingHorizontal={wp(8)}
                paddingVertical={hp(4)}
                borderRadius={wp(8)}
              >
                <Text fontSize={fp(10)} color="#8E8E93" lineHeight={fp(13)} fontWeight="500">
                  Min: ₹{offer.min_order_value}
                </Text>
              </YStack>
            )}
          </XStack>
        </YStack>
      </LinearGradient>
    </YStack>
  );
}
