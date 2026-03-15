import React, { memo } from "react";
import { XStack, YStack, Text } from "tamagui";
import { Image } from "expo-image";
import { wp, fp, hp } from "@/utils/responsive";
import { View, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";

const BRANDS = [
  { id: "sony",    img: require("@/assets/images/brands/sony.png") },
  { id: "canon",   img: require("@/assets/images/brands/canaon.png") },
  { id: "aputure", img: require("@/assets/images/brands/aputure.png") },
  { id: "dji",     img: require("@/assets/images/brands/dji.png") },
  { id: "nanlux",  img: require("@/assets/images/brands/nanlux.png") },
  { id: "gopro",   img: require("@/assets/images/brands/gopro.png") },
];

interface BrandsSectionProps {
  onViewAllPress?: () => void;
  onBrandPress?: (brandId: string) => void;
}

const BrandCell = memo(({ img }: { img: any }) => (
  <View
    style={{
      flex: 1,
      height: hp(76),
      backgroundColor: "#FAFAFA",
      alignItems: "center",
      justifyContent: "center",
      padding: wp(12),
      borderRadius: wp(10),
      shadowColor: "#121217",
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
      elevation: 4,
    }}
  >
    <Image
      source={img}
      contentFit="contain"
      cachePolicy="memory-disk"
      style={{ width: "100%", height: "100%", maxWidth: wp(80), maxHeight: hp(44) }}
    />
  </View>
));

BrandCell.displayName = "BrandCell";

const row1 = BRANDS.slice(0, 3);
const row2 = BRANDS.slice(3, 6);

export function BrandsSection({ onViewAllPress }: BrandsSectionProps) {
  return (
    <YStack gap={hp(20)} paddingHorizontal={wp(16)}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={fp(16)} fontWeight="600" color="#121217">Search by Brands</Text>
        <Pressable
          onPress={onViewAllPress}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: wp(2), opacity: pressed ? 0.7 : 1 })}
        >
          <Text fontSize={fp(13)} fontWeight="600" color="#6B7280">View All</Text>
          <ChevronRight size={fp(14)} color="#6B7280" strokeWidth={2.5} />
        </Pressable>
      </XStack>

      {/* Grid — individual shadow cards with gap */}
      <YStack gap={wp(10)}>
        <XStack gap={wp(10)}>
          {row1.map((b) => (
            <BrandCell key={b.id} img={b.img} />
          ))}
        </XStack>
        <XStack gap={wp(10)}>
          {row2.map((b) => (
            <BrandCell key={b.id} img={b.img} />
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
