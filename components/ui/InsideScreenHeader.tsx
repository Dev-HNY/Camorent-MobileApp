import { useState } from "react";
import { XStack, YStack, Text, Stack, Spinner } from "tamagui";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ArrowLeft,
} from "lucide-react-native";
import { BodySmall, BodyText } from "./Typography";
import { useAuthStore } from "@/store/auth/auth";
import { router, usePathname } from "expo-router";
import { LocationIcon } from "./LocationIcon";
import { HeartIcon } from "./HeartIcon";
import { hp, wp } from "@/utils/responsive";
import { CitySelectionModal } from "../city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";

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
      <XStack justifyContent="space-between" alignItems="center" gap={"$1"}>
        <XStack
          borderRadius={28}
          borderWidth={1}
          padding={"$2"}
          borderColor={"$gray7"}
          onPress={onBackPress || (() => router.back())}
        >
          <ArrowLeft size={18} />
        </XStack>
        <XStack
          borderRadius={28}
          borderWidth={1}
          padding={"$2"}
          borderColor={"$gray7"}
          onPress={handleCityPress}
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          <LocationIcon width={20} height={20} stroke="#ff0000" />
        </XStack>

        {isLoadingPreferences ? (
          <Spinner />
        ) : (
          <Stack
            onPress={handleCityPress}
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
          >
            <YStack>
              <XStack alignItems="center" gap={"$1"}>
                <BodyText>{city}</BodyText>
                <ChevronDown size={18} />
              </XStack>
              <BodySmall fontSize={12}>India</BodySmall>
            </YStack>
          </Stack>
        )}
      </XStack>

      <XStack justifyContent="space-between" alignItems="center" gap={"$1"}>
        <XStack
          borderRadius={28}
          borderWidth={1}
          padding={"$2"}
          borderColor={"$gray7"}
          alignItems="center"
          justifyContent="center"
          onPress={() => router.push("/search")}
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          <Search size={18} color={"gray"} />
        </XStack>
        <YStack position="relative">
          <XStack
            borderRadius={28}
            borderWidth={1}
            padding={"$2"}
            borderColor={"$gray7"}
            alignItems="center"
            justifyContent="center"
            onPress={() => router.push("/(tabs)/(profile)/wishlist")}
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
          >
            <HeartIcon width={18} height={18} color={"gray"} />
          </XStack>
          {wishlistCount > 0 && (
            <XStack
              position="absolute"
              top={-8}
              right={-8}
              backgroundColor="$red10"
              borderRadius={10}
              minWidth={20}
              height={20}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color="white"
                fontSize={12}
                fontWeight="600"
                textAlign="center"
              >
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </Text>
            </XStack>
          )}
        </YStack>
        {!isCartScreen && (
          <YStack position="relative">
            <XStack
              borderRadius={36}
              borderWidth={1}
              borderColor={"$gray7"}
              padding={"$2"}
              alignItems="center"
              justifyContent="center"
              onPress={() => router.push("/cart")}
            >
              <ShoppingCart size={18} color={"gray"} />
            </XStack>
            {cartCount > 0 && (
              <XStack
                position="absolute"
                top={-8}
                right={-8}
                backgroundColor="$red10"
                borderRadius={10}
                minWidth={20}
                height={20}
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  color="white"
                  fontSize={12}
                  fontWeight="600"
                  textAlign="center"
                >
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
