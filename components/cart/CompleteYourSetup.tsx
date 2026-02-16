import { FlashList } from "@shopify/flash-list";
import { Spinner, Text, XStack, YStack } from "tamagui";
import { ProductCard } from "../ui/ProductCard";
import { wp, hp, fp } from "@/utils/responsive";
import { BodySmall, Heading2 } from "../ui/Typography";
import { Product } from "@/types/products/product";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";

interface CompleteYourSetupProps {
  onViewAll?: () => void;
  onProductPress?: (productId: number | string) => void;
}

export function CompleteYourSetup({
  onProductPress,
  onViewAll,
}: CompleteYourSetupProps) {
  const { data: productsResponse, isLoading } = UseGetAllProducts({
    limit: 6,
    is_active: true,
  });
  const products = productsResponse?.data || [];

  return (
    <YStack gap={hp(12)}>
      <XStack justifyContent="space-between" alignItems="center">
        <Heading2>Complete your setup</Heading2>
        <XStack onPress={onViewAll}>
          <BodySmall fontWeight="500" color="#121217">
            View all
          </BodySmall>
        </XStack>
      </XStack>
      {isLoading ? (
        <Spinner color="#8E0FFF" />
      ) : (
        <>
          <YStack height={hp(300)}>
            <FlashList
              horizontal
              data={products}
              estimatedItemSize={280}
              estimatedListSize={{ width: 200, height: 300 }}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <YStack width={wp(12)} />}
              contentContainerStyle={{}}
              renderItem={({ item: product }) => (
                <ProductCard
                  product={product}
                  onProductPress={() => onProductPress?.(product.sku_id)}
                />
              )}
            />
          </YStack>
        </>
      )}
    </YStack>
  );
}
