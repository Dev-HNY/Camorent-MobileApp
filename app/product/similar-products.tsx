import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Spinner } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { FlashList } from "@shopify/flash-list";
import { ProductCard } from "@/components/ui/ProductCard";
import { fp, hp, wp } from "@/utils/responsive";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";

export default function SimilarProducts() {
  const { subcategory_id, category_id } = useLocalSearchParams();

  const { data: products, isLoading } = UseGetAllProducts({
    subcategory_id: subcategory_id as string,
    is_active: true,
  });

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const title = (subcategory_id as string) || (category_id as string) || "Similar Products";

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(200)}>
        <XStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={wp(20)}
          paddingTop={hp(10)}
          paddingBottom={hp(14)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F2F2F7"
          position="relative"
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backBtn}
          >
            <ChevronLeft size={hp(20)} color="#1C1C1E" strokeWidth={2.5} />
          </Pressable>
          <Text
            fontSize={fp(17)}
            fontWeight="600"
            color="#1C1C1E"
            letterSpacing={-0.3}
            textTransform="capitalize"
            numberOfLines={1}
            maxWidth={wp(220)}
          >
            {title}
          </Text>
        </XStack>
      </Animated.View>

      {isLoading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="#8E0FFF" />
        </YStack>
      ) : (
        <>
          {/* Section label + count */}
          <XStack
            paddingHorizontal={wp(20)}
            paddingTop={hp(18)}
            paddingBottom={hp(10)}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text style={styles.sectionLabel}>SIMILAR GEAR</Text>
            {products?.data?.length ? (
              <Text fontSize={fp(12)} color="#8E8E93" fontWeight="400">
                {products.data.length} items
              </Text>
            ) : null}
          </XStack>

          <YStack flex={1} paddingHorizontal={wp(16)}>
            <FlashList
              data={products?.data}
              estimatedItemSize={280}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(32) }}
              ItemSeparatorComponent={() => <YStack height={hp(12)} />}
              renderItem={({ item: product, index }) => (
                <XStack
                  paddingRight={index % 2 === 0 ? wp(6) : 0}
                  paddingLeft={index % 2 === 1 ? wp(6) : 0}
                  flex={1}
                >
                  <ProductCard
                    product={product}
                    onProductPress={() => handleProductPress(product.sku_id)}
                  />
                </XStack>
              )}
              ListEmptyComponent={
                <YStack paddingTop={hp(60)} alignItems="center" gap={hp(10)}>
                  <Text fontSize={fp(16)} fontWeight="600" color="#1C1C1E">
                    No products found
                  </Text>
                  <Text fontSize={fp(13)} color="#8E8E93" textAlign="center">
                    Try browsing other categories
                  </Text>
                </YStack>
              }
            />
          </YStack>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  backBtn: {
    position: "absolute",
    left: wp(16),
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
  },
});
