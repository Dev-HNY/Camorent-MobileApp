import { useState, memo } from "react";
import { XStack, YStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Pressable } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { CitySelectionModal } from "../city/CitySelectionModal";
import { useWishlistCount } from "@/hooks/wishlist";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useGetUserPreferences } from "@/hooks/user/useGetUserPreferences";
import { ChevronDown } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface UpdatedHomeHeaderProps {
  onSearchPress?: () => void;
}

const BackArrowIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="white"/>
    <Circle cx="24" cy="24" r="23.65" stroke="#EBEBEF" strokeWidth="0.7"/>
    <Path d="M22.3333 18.791L17.125 23.9993L22.3333 29.2077" stroke="#121217" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17.75 24H30.875" stroke="#121217" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LocationIconCircle = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="white"/>
    <Circle cx="24" cy="24" r="23.65" stroke="#EBEBEF" strokeWidth="0.7"/>
    <Path d="M26.5 22.75C26.5 24.1307 25.3807 25.25 24 25.25C22.6193 25.25 21.5 24.1307 21.5 22.75C21.5 21.3693 22.6193 20.25 24 20.25C25.3807 20.25 26.5 21.3693 26.5 22.75Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M30.25 22.75C30.25 28.7018 24 32.125 24 32.125C24 32.125 17.75 28.7018 17.75 22.75C17.75 19.2982 20.5482 16.5 24 16.5C27.4518 16.5 30.25 19.2982 30.25 22.75Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SearchIconCircle = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="white"/>
    <Circle cx="24" cy="24" r="23.65" stroke="#EBEBEF" strokeWidth="0.7"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M21.75 17.125C18.643 17.125 16.125 19.6434 16.125 22.75C16.125 25.8566 18.643 28.375 21.75 28.375C23.303 28.375 24.709 27.7461 25.727 26.7275C26.746 25.7089 27.375 24.3035 27.375 22.75C27.375 19.6434 24.857 17.125 21.75 17.125ZM14.875 22.75C14.875 18.953 17.953 15.875 21.75 15.875C25.547 15.875 28.625 18.953 28.625 22.75C28.625 24.4232 28.027 25.9575 27.033 27.1494L30.942 31.0581C31.186 31.3021 31.186 31.6979 30.942 31.9419C30.698 32.186 30.302 32.186 30.058 31.9419L26.149 28.0333C24.958 29.0266 23.423 29.625 21.75 29.625C17.953 29.625 14.875 26.547 14.875 22.75Z" fill="#121217"/>
  </Svg>
);

const HeartIconCircle = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="white"/>
    <Circle cx="24" cy="24" r="23.65" stroke="#EBEBEF" strokeWidth="0.7"/>
    <Path d="M28.5 20.875C28.5 18.8039 26.751 17.125 24.594 17.125C22.981 17.125 21.596 18.0636 21 19.4028C20.404 18.0636 19.019 17.125 17.406 17.125C15.249 17.125 13.5 18.8039 13.5 20.875C13.5 26.8921 21 30.875 21 30.875C21 30.875 28.5 26.8921 28.5 20.875Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CartIconCircle = ({ itemCount = 0 }: { itemCount?: number }) => (
  <YStack position="relative">
    <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="white"/>
      <Circle cx="24" cy="24" r="23.65" stroke="#EBEBEF" strokeWidth="0.7"/>
      <Path d="M29.605 18.7047C29.264 18.2416 28.734 17.9597 28.184 17.9597H16.643L16.283 16.4698C16.074 15.604 15.354 15 14.52 15H12.587C12.265 15 12 15.2819 12 15.6242C12 15.9664 12.265 16.2483 12.587 16.2483H14.52C14.805 16.2483 15.051 16.4497 15.127 16.7517L17.439 26.5369C17.647 27.4027 18.367 28.0067 19.201 28.0067H26.763C27.597 28.0067 28.336 27.4027 28.525 26.5369L29.946 20.3356C30.079 19.7718 29.965 19.1678 29.605 18.7047Z" fill="black"/>
      <Path d="M19.599 28.8125C18.519 28.8125 17.628 29.7588 17.628 30.9065C17.628 32.0541 18.519 33.0004 19.599 33.0004C20.679 33.0004 21.57 32.0541 21.57 30.9065C21.57 29.7588 20.679 28.8125 19.599 28.8125Z" fill="black"/>
      <Path d="M26.118 28.8125C25.038 28.8125 24.147 29.7588 24.147 30.9065C24.147 32.0541 25.038 33.0004 26.118 33.0004C27.199 33.0004 28.089 32.0541 28.089 30.9065C28.07 29.7588 27.199 28.8125 26.118 28.8125Z" fill="black"/>
    </Svg>
    {itemCount > 0 && (
      <XStack
        position="absolute"
        top={0}
        right={0}
        backgroundColor="#D50B3E"
        borderRadius={12}
        minWidth={24}
        height={24}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={6}
      >
        <Text color="white" fontSize={12} fontWeight="600">
          {itemCount > 9 ? "9+" : itemCount}
        </Text>
      </XStack>
    )}
  </YStack>
);

export function UpdatedHomeHeader({ onSearchPress }: UpdatedHomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const [showCityModal, setShowCityModal] = useState(false);
  const { count: wishlistCount } = useWishlistCount();
  const { data: cart } = useGetCart();
  const { data: userPreferencesData } = useGetUserPreferences();

  const city = userPreferencesData?.preferred_city || "Gurugram";
  const cartItemCount = cart?.total_items || 0;

  return (
    <>
      {/* Semi-transparent status bar background */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={40 + insets.top}
        backgroundColor="rgba(245, 245, 245, 0.8)"
        zIndex={999}
      />

      {/* Main rounded header container */}
      <XStack
        position="absolute"
        top={52 + insets.top}
        left={16}
        right={16}
        paddingHorizontal={16}
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="white"
        borderRadius={100}
        borderWidth={1}
        borderColor="#EBEBEF"
        zIndex={1000}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={3}
      >
        {/* Left: Back + Location */}
        <XStack alignItems="center" gap={8} flex={1}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <BackArrowIcon />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCityModal(true);
            }}
          >
            <LocationIconCircle />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCityModal(true);
            }}
            style={{ flex: 1 }}
          >
            <YStack>
              <XStack alignItems="center" gap={4}>
                <Text fontSize={18} fontWeight="700" color="#170E2B">
                  {city}
                </Text>
                <ChevronDown size={18} color="#170E2B" />
              </XStack>
              <Text fontSize={13} color="#6C6C89" opacity={0.6}>
                NCR, India
              </Text>
            </YStack>
          </Pressable>
        </XStack>

        {/* Right: Search, Heart, Cart */}
        <XStack alignItems="center" gap={12}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (onSearchPress) {
                onSearchPress();
              } else {
                router.push("/search");
              }
            }}
          >
            <SearchIconCircle />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: "/(tabs)/(profile)/wishlist" as any,
                params: { from: "home" },
              });
            }}
          >
            <YStack position="relative">
              <HeartIconCircle />
              {wishlistCount > 0 && (
                <XStack
                  position="absolute"
                  top={0}
                  right={0}
                  backgroundColor="#D50B3E"
                  borderRadius={12}
                  minWidth={24}
                  height={24}
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal={6}
                >
                  <Text color="white" fontSize={12} fontWeight="600">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </Text>
                </XStack>
              )}
            </YStack>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/cart");
            }}
          >
            <CartIconCircle itemCount={cartItemCount} />
          </Pressable>
        </XStack>
      </XStack>

      {/* City Selection Modal */}
      <CitySelectionModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        mode="change"
      />
    </>
  );
}
