import React, { useCallback, useState } from "react";
import { XStack, YStack, Text } from "tamagui";
import { ProductCard } from "../ui/ProductCard";
import { Heading2 } from "../ui/Typography";
import { hp, wp, fp } from "@/utils/responsive";
import { SKU } from "@/types/products/product";
import { Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Camocare } from "./Camocare";
import { CamocareSheet } from "./CamocareSheet";

interface SimilarProductsProps {
  products: SKU[] | undefined;
  onProductPress: (productId: string) => void;
}

function SimilarProductsComponent({ products, onProductPress }: SimilarProductsProps) {
  const [isCamocareSheetOpen, setIsCamocareSheetOpen] = useState(false);

  const handleViewMore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/(home)/selections");
  }, []);

  const handleCamocarePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCamocareSheetOpen(true);
  }, []);

  if (!products?.length) return null;

  return (
    <YStack gap={hp(16)}>
      {/* Camo Care Component */}
      <YStack paddingHorizontal={wp(16)} paddingTop={wp(16)}>
        <Camocare handleCamocare={handleCamocarePress} />
      </YStack>

      {/* Similar Products Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={wp(16)}
      >
        <Heading2>Add Ons</Heading2>
        <Pressable onPress={handleViewMore}>
          <Text fontSize={fp(14)} fontWeight="600" color="#8E0FFF">
            View More
          </Text>
        </Pressable>
      </XStack>

      {/* Products List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: wp(16),
          paddingRight: wp(16),
          paddingBottom: hp(40),
          gap: wp(12)
        }}
      >
        {products.map((item) => (
          <React.Fragment key={item.sku_id}>
            <ProductCard
              product={item}
              onProductPress={() => onProductPress(item.sku_id)}
            />
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Camocare Sheet Modal */}
      <CamocareSheet
        isOpen={isCamocareSheetOpen}
        onClose={() => setIsCamocareSheetOpen(false)}
        handleShowAdd={false}
      />
    </YStack>
  );
}

export const SimilarProducts = React.memo(SimilarProductsComponent);
