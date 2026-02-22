import { YStack, XStack, Text } from "tamagui";
import { Heading2 } from "../ui/Typography";
import { ProductCard } from "../ui/ProductCard";
import { SKU } from "@/types/products/product";
import { hp, wp, fp } from "@/utils/responsive";
import { ScrollView } from "react-native";

interface ProductListSectionProps {
  title: string;
  products: SKU[] | undefined;
  onViewAllPress?: () => void;
  onProductPress: (productId: string) => void;
}

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
    <YStack gap={hp(16)}>
      <XStack
        paddingHorizontal={wp(16)}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={fp(16)} fontWeight="600" color="#121217">{title}</Text>
        {onViewAllPress && (
          <Text
            fontSize={fp(12)}
            color="#3f3f50"
            onPress={onViewAllPress}
            pressStyle={{ opacity: 0.7 }}
          >
            View all
          </Text>
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
          <YStack key={product.sku_id} marginRight={wp(12)}>
            <ProductCard
              product={product}
              onProductPress={() => onProductPress(product.sku_id)}
              maxWidth={wp(162)}
            />
          </YStack>
        ))}
      </ScrollView>
    </YStack>
  );
}
