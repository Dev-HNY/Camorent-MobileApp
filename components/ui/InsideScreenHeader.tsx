import { useState } from "react";
import { XStack, YStack, Text, Spinner } from "tamagui";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
} from "lucide-react-native";
import { useAuthStore } from "@/store/auth/auth";
import { router, usePathname } from "expo-router";
import { LocationIcon } from "./LocationIcon";
import { HeartIcon } from "./HeartIcon";
import { hp, wp, fp } from "@/utils/responsive";
import { CitySelectionModal } from "../city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

interface InsideScreenHeaderProps {
  onBackPress?: () => void;
  onCityPress?: () => void;
}

export function InsideScreenHeader({
  onBackPress,
  onCityPress,
}: InsideScreenHeaderProps) {
  const { data: userPreferencesData, isLoading: isLoadingPreferences } =
    useGetUserPreferences();
  const { count: wishlistCount } = useWishlistCount();
  const city = userPreferencesData?.preferred_city || "";
  const { data: cartData } = useGetCart();
  const cartCount = cartData?.sku_items.length ?? 0;
  const [showCityModal, setShowCityModal] = useState(false);
  const pathname = usePathname();
  const isCartScreen =
    pathname === "/cart" ||
    pathname === "payment" ||
    pathname === "crew" ||
    pathname.startsWith("/product/");

  const handleCityPress = () => {
    if (onCityPress) {
      onCityPress();
    } else {
      setShowCityModal(true);
    }
  };

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={wp(16)}
    >
      {/* Left: back button + city selector */}
      <XStack alignItems="center" gap={wp(8)}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (onBackPress) onBackPress();
            else router.back();
          }}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
        </Pressable>

        <Pressable
          onPress={handleCityPress}
          hitSlop={8}
          style={styles.cityBtn}
        >
          <LocationIcon width={14} height={14} stroke="#8E0FFF" />
          {isLoadingPreferences ? (
            <Spinner size="small" color="#8E0FFF" />
          ) : (
            <XStack alignItems="center" gap={wp(2)}>
              <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                {city}
              </Text>
              <ChevronDown size={14} color="#8E8E93" strokeWidth={2} />
            </XStack>
          )}
        </Pressable>
      </XStack>

      {/* Right: icon buttons */}
      <XStack alignItems="center" gap={wp(8)}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/search");
          }}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <Search size={18} color="#1C1C1E" strokeWidth={2} />
        </Pressable>

        {/* Wishlist */}
        <YStack>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/(profile)/wishlist");
            }}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <HeartIcon width={18} height={18} color="#1C1C1E" />
          </Pressable>
          {wishlistCount > 0 && (
            <XStack style={styles.badge}>
              <Text color="white" fontSize={fp(10)} fontWeight="700" textAlign="center">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </Text>
            </XStack>
          )}
        </YStack>

        {/* Cart (hidden on cart/payment/crew/product) */}
        {!isCartScreen && (
          <YStack>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/cart");
              }}
              hitSlop={8}
              style={styles.iconBtn}
            >
              <ShoppingCart size={18} color="#1C1C1E" strokeWidth={2} />
            </Pressable>
            {cartCount > 0 && (
              <XStack style={styles.badge}>
                <Text color="white" fontSize={fp(10)} fontWeight="700" textAlign="center">
                  {cartCount > 99 ? "99+" : cartCount}
                </Text>
              </XStack>
            )}
          </YStack>
        )}
      </XStack>

      {/* City Selection Modal */}
      <CitySelectionModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        mode="change"
      />
    </XStack>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cityBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
    paddingHorizontal: wp(10),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    backgroundColor: "#F3F4F6",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
});
