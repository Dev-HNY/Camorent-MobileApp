import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Spinner, XStack } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { FlashList } from "@shopify/flash-list";
import { ProductCard } from "@/components/ui/ProductCard";
import { hp, wp } from "@/utils/responsive";
import { Heading2 } from "@/components/ui/Typography";

export default function SimilarProducts() {
  const { subcategory_id, category_id } = useLocalSearchParams();

  const { data: products, isLoading } = UseGetAllProducts({
    subcategory_id: subcategory_id as string,
    is_active: true,
  });

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={"#8E0FFF"} />
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingTop={hp(12)}>
        <YStack paddingBottom={hp(12)}>
          <InsideScreenHeader onBackPress={() => router.back()} />
        </YStack>

        <XStack
          marginHorizontal={wp(12)}
          marginVertical={wp(8)}
          paddingHorizontal={wp(8)}
          paddingVertical={wp(8)}
          borderWidth={1}
          borderRadius={wp(12)}
          borderColor={"#EBEBEF"}
        >
          <Heading2>
            Products similar to {subcategory_id} {category_id}
          </Heading2>
        </XStack>
        <YStack flex={1} paddingHorizontal={wp(16)}>
          <FlashList
            data={products?.data}
            estimatedItemSize={280}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <YStack height={hp(12)} />}
            renderItem={({ item: product }) => (
              <ProductCard
                product={product}
                onProductPress={() => handleProductPress(product.sku_id)}
              />
            )}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
