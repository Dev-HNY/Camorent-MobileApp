import { XStack, YStack, Text } from "tamagui";
import { BodySmall, BodyText } from "./Typography";
import { fp, hp, wp } from "@/utils/responsive";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StickyCartButton() {
  const { data: cartData } = useGetCart();
  const insets = useSafeAreaInsets();
  const cartCount = cartData?.sku_items.length ?? 0;
  return cartCount > 0 ? (
    <XStack
      alignItems="center"
      position="absolute"
      bottom={insets.bottom + hp(100)}
      left={"27%"}
      right={"27%"}
      backgroundColor={"#8E0FFF"}
      borderRadius={wp(40)}
      paddingVertical={hp(10)}
      paddingHorizontal={wp(16)}
      onPress={() => {
        router.push("/cart");
      }}
      gap={wp(12)}
      shadowColor="#8E0FFF"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={8}
      elevation={6}
      justifyContent="space-between"
    >
      <YStack gap={hp(2)} flex={1}>
        <XStack alignItems="center">
          <Text lineHeight={hp(20)} fontSize={fp(18)} fontWeight={"900"} color={"white"}>
            View Cart
          </Text>
        </XStack>
        <XStack>
          <BodyText lineHeight={hp(16)} fontSize={fp(13)} color="white" fontWeight={"500"}>
            {cartCount} {cartCount > 1 ? "items" : "item"}
          </BodyText>
        </XStack>
      </YStack>
      <YStack backgroundColor={"#FFF"} padding={wp(8)} borderRadius={wp(30)}>
        <ChevronRight size={hp(28)} color={"#8E0FFF"} strokeWidth={3} />
      </YStack>
    </XStack>
  ) : null;
}
