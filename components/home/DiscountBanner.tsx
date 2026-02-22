import { YStack } from "tamagui";
import { hp, wp } from "@/utils/responsive";
import { Dimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable } from "react-native";

const SCREEN_W = Dimensions.get("window").width;
const discountImg = require("@/assets/images/brands/banners/discount.png");

export function DiscountBanner() {
  return (
    <YStack paddingHorizontal={wp(16)} paddingVertical={hp(8)}>
      <Pressable onPress={() => router.push("/(tabs)/(home)/selections")}>
        <Image
          source={discountImg}
          contentFit="cover"
          style={{
            width: SCREEN_W - wp(32),
            height: hp(110),
            borderRadius: wp(14),
          }}
          cachePolicy="memory-disk"
        />
      </Pressable>
    </YStack>
  );
}
