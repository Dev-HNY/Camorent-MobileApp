import { YStack, XStack, Text } from "tamagui";
import { ProductCard } from "../ui/ProductCard";
import { SKU } from "@/types/products/product";
import { hp, wp, fp } from "@/utils/responsive";
import { Pressable, ScrollView } from "react-native";
import { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface ProductListSectionProps {
  title: string;
  products: SKU[] | undefined;
  onViewAllPress?: () => void;
  onProductPress: (productId: string) => void;
}

const ProductItem = memo(({
  product,
  onProductPress,
}: {
  product: SKU;
  onProductPress: (id: string) => void;
}) => {
  const handlePress = useCallback(() => onProductPress(product.sku_id), [product.sku_id, onProductPress]);
  return (
    <YStack marginRight={wp(12)}>
      <ProductCard product={product} onProductPress={handlePress} maxWidth={wp(162)} />
    </YStack>
  );
});

export function ProductListSection({
  title,
  products,
  onViewAllPress,
  onProductPress,
}: ProductListSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <YStack gap={hp(14)}>
      <XStack
        paddingHorizontal={wp(16)}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
          {title}
        </Text>
        {onViewAllPress && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onViewAllPress();
            }}
            hitSlop={8}
          >
            <XStack alignItems="center" gap={wp(2)}>
              <Text fontSize={fp(13)} fontWeight="600" color="#6B7280">
                View All
              </Text>
              <ChevronRight size={14} color="#6B7280" strokeWidth={2.5} />
            </XStack>
          </Pressable>
        )}
      </XStack>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingBottom: hp(8),
        }}
      >
        {products.map((product) => (
          <ProductItem key={product.sku_id} product={product} onProductPress={onProductPress} />
        ))}
      </ScrollView>
    </YStack>
  );
}
