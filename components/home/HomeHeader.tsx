import { useState } from "react";
import { XStack, YStack, Text, Stack, Spinner } from "tamagui";
import { BodySmall, BodyText } from "@/components/ui/Typography";
import { Search, ShoppingCart, ChevronDown } from "lucide-react-native";
import { LocationIcon } from "../ui/LocationIcon";
import { HeartIcon } from "../ui/HeartIcon";
import { useAuthStore } from "@/store/auth/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CitySelectionModal } from "../city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";

interface HomeHeaderProps {
  onCityPress?: () => void;
  onCartPress?: () => void;
  onSearchPress?: () => void;
}

export function HomeHeader({
  onCityPress,
  onCartPress,
  onSearchPress,
}: HomeHeaderProps) {
  const { data: userPreferencesData, isLoading: isLoadingPreferences } =
    useGetUserPreferences();
  const { count: wishlistCount } = useWishlistCount();
  const city = userPreferencesData?.preferred_city || "";
  const insets = useSafeAreaInsets();
  const [showCityModal, setShowCityModal] = useState(false);

  const handleCityPress = () => {
    if (onCityPress) {
      onCityPress();
    } else {
      setShowCityModal(true);
    }
  };

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      borderRadius={900}
      backgroundColor={"$background"}
      paddingVertical={7}
      paddingHorizontal={14}
      margin={"$3"}
      position="absolute"
      left={0}
      right={0}
      top={insets.top + 10}
      zIndex={1000}
    >
      {isLoadingPreferences ? (
        <Spinner />
      ) : (
        <XStack justifyContent="space-between" alignItems="center" gap={"$1"}>
          <XStack
            borderRadius={28}
            borderWidth={1}
            padding={"$2"}
            borderColor={"$gray7"}
            onPress={handleCityPress}
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
          >
            <LocationIcon width={18} height={18} stroke="#ff0000" />
          </XStack>

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
        </XStack>
      )}
      <XStack justifyContent="space-between" alignItems="center" gap={"$1"}>
        <XStack
          borderRadius={28}
          borderWidth={1}
          padding={"$2"}
          borderColor={"$gray7"}
          alignItems="center"
          justifyContent="center"
          onPress={onSearchPress || (() => router.push("/search"))}
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
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(profile)/wishlist" as any,
                params: { from: "home" },
              })
            }
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
