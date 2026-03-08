import React, { memo } from "react";
import { XStack, YStack, Text } from "tamagui";
import { Image } from "expo-image";
import { wp, fp, hp } from "@/utils/responsive";
import { useGetBrands } from "@/hooks/CDP/useGetBrands";
import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";

interface BrandsSectionProps {
  onBrandPress?: (brand: string) => void;
  onViewAllPress?: () => void;
}

const BrandCell = memo(({ brand, onPress, borderRight, borderBottom }: {
  brand: { id: string; name: string };
  onPress: () => void;
  borderRight?: boolean;
  borderBottom?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      height: hp(76),
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      padding: wp(16),
      borderRightWidth: borderRight ? 1 : 0,
      borderBottomWidth: borderBottom ? 1 : 0,
      borderColor: "#EBEBEF",
    }}
  >
    <Image
      source={{ uri: `https://img.camorent.co.in/brands/images/${brand.id}/primary.webp` }}
      contentFit="contain"
      cachePolicy="memory-disk"
      style={{ width: "100%", height: "100%", maxWidth: wp(80), maxHeight: hp(44) }}
    />
  </Pressable>
));

BrandCell.displayName = "BrandCell";

export function BrandsSection({ onBrandPress, onViewAllPress }: BrandsSectionProps) {
  const { data: brandsData } = useGetBrands();
  const brands = (brandsData || [])
    .filter((b: { id: string; name: string }) => b.id !== "blackmagic")
    .slice(0, 6);

  const row1 = brands.slice(0, 3);
  const row2 = brands.slice(3, 6);

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

      {/* Grid with gradient fade on left/right edges (borders appear to dissolve) */}
      <View style={{ position: "relative" }}>
        <View style={{ borderWidth: 1, borderColor: "#EBEBEF", borderRadius: wp(12), overflow: "hidden" }}>
          <XStack>
            {row1.map((brand: { id: string; name: string }, i: number) => (
              <BrandCell
                key={brand.id}
                brand={brand}
                onPress={() => onBrandPress?.(brand.name)}
                borderRight={i < 2}
                borderBottom
              />
            ))}
          </XStack>
          <XStack>
            {row2.map((brand: { id: string; name: string }, i: number) => (
              <BrandCell
                key={brand.id}
                brand={brand}
                onPress={() => onBrandPress?.(brand.name)}
                borderRight={i < 2}
              />
            ))}
          </XStack>
        </View>
        {/* Left */}
        <LinearGradient
          colors={["#ffffff", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: wp(32), pointerEvents: "none" }}
        />
        {/* Right */}
        <LinearGradient
          colors={["rgba(255,255,255,0)", "#ffffff"]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: wp(32), pointerEvents: "none" }}
        />
        {/* Top */}
        <LinearGradient
          colors={["#ffffff", "rgba(255,255,255,0)"]}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: hp(24), pointerEvents: "none" }}
        />
        {/* Bottom */}
        <LinearGradient
          colors={["rgba(255,255,255,0)", "#ffffff"]}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: hp(24), pointerEvents: "none" }}
        />
      </View>
    </YStack>
  );
}
