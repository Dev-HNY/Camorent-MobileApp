import { YStack, XStack, Text } from "tamagui";
import { Clock, Copy, Gift, Check } from "lucide-react-native";
import { fp, hp, wp } from "@/utils/responsive";
import { Offer } from "@/hooks/offers/useGetAllOffers";
import { useState } from "react";
// eslint-disable-next-line deprecation/deprecation
import { Pressable, StyleSheet, View, Clipboard } from "react-native";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const couponCode = offer.offer_id.slice(-3).toUpperCase();
    Clipboard.setString(couponCode);
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
    <YStack width={wp(263)} style={styles.card}>
      {/* Top section */}
      <XStack alignItems="flex-start" justifyContent="space-between" marginBottom={hp(12)}>
        <XStack alignItems="center" gap={wp(10)}>
          {/* Gift icon circle */}
          <YStack style={styles.giftCircle}>
            <Gift size={wp(22)} color="#8E0FFF" strokeWidth={2} />
          </YStack>

          <YStack gap={hp(2)}>
            <Text
              fontSize={fp(20)}
              fontWeight="800"
              color="#8E0FFF"
              letterSpacing={-0.5}
              lineHeight={fp(24)}
            >
              {getDiscountText()}
            </Text>
            <Text
              fontSize={fp(11)}
              color="#8E8E93"
              lineHeight={fp(15)}
              maxWidth={wp(130)}
              numberOfLines={1}
            >
              {offer.title}
            </Text>
          </YStack>
        </XStack>

        {/* NEW badge */}
        <YStack style={styles.newBadge}>
          <Text fontSize={fp(10)} fontWeight="700" color="#FFFFFF" letterSpacing={0.3}>
            NEW
          </Text>
        </YStack>
      </XStack>

      {/* Dashed divider with notches */}
      <XStack alignItems="center" marginVertical={hp(10)} position="relative">
        <View style={styles.notchLeft} />
        <YStack
          flex={1}
          height={0}
          borderTopWidth={1}
          borderStyle="dashed"
          borderColor="#E5E5EA"
        />
        <View style={styles.notchRight} />
      </XStack>

      {/* Bottom section — coupon code */}
      <YStack style={styles.codeBox} gap={hp(8)}>
        <XStack alignItems="center" justifyContent="space-between">
          <Text
            fontSize={fp(18)}
            fontWeight="700"
            color="#1C1C1E"
            letterSpacing={2}
          >
            {couponCode}
          </Text>

          <Pressable onPress={handleCopy} style={styles.copyBtn}>
            {copied ? (
              <Check size={wp(12)} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Copy size={wp(12)} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text fontSize={fp(12)} fontWeight="600" color="#FFFFFF">
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>
        </XStack>

        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap={wp(4)}>
            <Clock size={wp(11)} color="#C7C7CC" strokeWidth={2} />
            <Text fontSize={fp(10)} color="#C7C7CC">
              Till {formatDate(offer.valid_till)}
            </Text>
          </XStack>

          {offer.min_order_value > 0 && (
            <YStack style={styles.minOrderPill}>
              <Text fontSize={fp(10)} color="#8E8E93" fontWeight="500">
                Min ₹{offer.min_order_value}
              </Text>
            </YStack>
          )}
        </XStack>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: wp(16),
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    padding: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  giftCircle: {
    width: wp(46),
    height: wp(46),
    borderRadius: wp(23),
    backgroundColor: "#F5EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  newBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: wp(9),
    paddingVertical: hp(4),
    borderRadius: wp(8),
    alignSelf: "flex-start",
  },
  notchLeft: {
    position: "absolute",
    left: -wp(28),
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#F2F2F7",
    zIndex: 10,
  },
  notchRight: {
    position: "absolute",
    right: -wp(28),
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#F2F2F7",
    zIndex: 10,
  },
  codeBox: {
    backgroundColor: "#F5EEFF",
    borderRadius: wp(12),
    paddingVertical: hp(12),
    paddingHorizontal: wp(14),
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    backgroundColor: "#8E0FFF",
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(14),
  },
  minOrderPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
    borderRadius: wp(8),
  },
});
