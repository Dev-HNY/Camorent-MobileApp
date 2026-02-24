import { XStack, YStack, Text } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";
import { ChevronRight, ShoppingBag } from "lucide-react-native";
import { router } from "expo-router";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useCartStore } from "@/store/cart/cart";
import { calculateRentalDays } from "@/utils/date";
import { formatPrice } from "@/utils/format";

export function StickyCartButton() {
  const { data: cartData } = useGetCart();
  const insets = useSafeAreaInsets();
  const { rentalDates } = useCartStore();
  const cartCount = cartData?.sku_items.length ?? 0;

  const rentalDaysCount = rentalDates ? calculateRentalDays(rentalDates) : 1;
  const totalAmount = Number(cartData?.sku_amount || "0") * rentalDaysCount;

  if (cartCount === 0) return null;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/cart");
      }}
      style={[
        styles.wrapper,
        { bottom: insets.bottom + hp(100) },
      ]}
    >
      <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
        {/* Left: bag icon + labels */}
        <XStack alignItems="center" gap={wp(12)} flex={1}>
          {/* Cart count badge over bag icon */}
          <YStack style={styles.iconWrap}>
            <ShoppingBag size={hp(20)} color="#FFFFFF" strokeWidth={2} />
            <YStack style={styles.badge}>
              <Text fontSize={fp(9)} fontWeight="800" color="#8E0FFF" lineHeight={fp(11)}>
                {cartCount}
              </Text>
            </YStack>
          </YStack>

          <YStack gap={hp(1)}>
            <Text fontSize={fp(15)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.3}>
              View Cart
            </Text>
            <Text fontSize={fp(11)} color="rgba(255,255,255,0.7)" fontWeight="500">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </Text>
          </YStack>
        </XStack>

        {/* Right: total + chevron */}
        <XStack alignItems="center" gap={wp(8)}>
          {/* {totalAmount > 0 && (
            <Text fontSize={fp(15)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.3}>
              {formatPrice(totalAmount)}
            </Text>
          )} */}
          <YStack style={styles.chevronBtn}>
            <ChevronRight size={hp(16)} color="#8E0FFF" strokeWidth={2.5} />
          </YStack>
        </XStack>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: wp(85),
    right: wp(85),
    borderRadius: wp(30),
    overflow: "hidden",
    shadowColor: "#6D00DA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
    backgroundColor: "rgba(109, 0, 218, 0.62)",
  },
  iconWrap: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  chevronBtn: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
