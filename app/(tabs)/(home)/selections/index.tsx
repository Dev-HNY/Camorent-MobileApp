import { BackButton } from "@/components/ui/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, ScrollView, Spinner, Text } from "tamagui";
import { Dimensions, Pressable, StyleSheet, FlatList } from "react-native";
import { Heading2 } from "@/components/ui/Typography";
import { ProductCard } from "@/components/ui/ProductCard";
import { router } from "expo-router";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { hp, wp, fp } from "@/utils/responsive";
import { useCallback, useMemo, useState, useEffect } from "react";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Grid3x3, Rows3 } from "lucide-react-native";
import { Image } from "expo-image";
import { SKU } from "@/types/products/product";
import { formatPrice } from "@/utils/format";

type ViewMode = "grid" | "list";

const FILTERS = ["All", "Cameras", "Lenses", "Lights", "Audio"];
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - wp(48)) / 2;

// Static styles to avoid inline object creation per render
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  toggleBtn: {
    padding: wp(8),
    borderRadius: wp(8),
    backgroundColor: "#F3F4F6",
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    padding: wp(12),
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridContainer: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(40),
  },
  listContainer: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(40),
    gap: hp(12),
  },
});

// Memoized filter chip to avoid re-renders
const FilterChip = ({ filter, isSelected, onPress }: { filter: string; isSelected: boolean; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: wp(16),
      paddingVertical: hp(7),
      borderRadius: wp(20),
      backgroundColor: isSelected ? "#8E0FFF" : "#F3F4F6",
      borderWidth: isSelected ? 0 : 1,
      borderColor: isSelected ? "transparent" : "#E5E7EB",
    }}
  >
    <Text
      fontSize={fp(13)}
      fontWeight={isSelected ? "600" : "500"}
      color={isSelected ? "#FFFFFF" : "#6B7280"}
    >
      {filter}
    </Text>
  </Pressable>
);

export default function NewArrivals() {
  const { data: productsResponse, isLoading } = UseGetAllProducts({
    is_active: true,
    limit: 100,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Entrance animation — runs once on mount
  const contentOpacity = useSharedValue(0);
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const toggleViewMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  const handleFilterPress = useCallback((filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  }, []);

  const handleProductPress = useCallback((skuId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${skuId}`);
  }, []);

  // Memoize filtered products
  const products = useMemo(() => {
    const all = productsResponse?.data || [];
    if (selectedFilter === "All") return all;
    const lower = selectedFilter.toLowerCase();
    // Filter by category_id which contains category name (e.g., "camera", "lens", "light", "audio")
    return all.filter((p) => p.category_id?.toLowerCase().includes(lower));
  }, [productsResponse?.data, selectedFilter]);

  // FlatList render functions — stable references
  const keyExtractor = useCallback((item: SKU) => item.sku_id, []);

  const renderGridItem = useCallback(({ item }: { item: SKU }) => (
    <YStack width={CARD_WIDTH}>
      <ProductCard
        product={item}
        maxWidth={CARD_WIDTH}
        onProductPress={() => handleProductPress(item.sku_id)}
      />
    </YStack>
  ), [handleProductPress]);

  const renderListItem = useCallback(({ item }: { item: SKU }) => (
    <Pressable onPress={() => handleProductPress(item.sku_id)} style={styles.listItem}>
      <XStack gap={wp(12)} alignItems="center">
        <Image
          source={{ uri: item.primary_image_url }}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={{ width: wp(80), height: hp(80), borderRadius: wp(10) }}
        />
        <YStack flex={1} gap={hp(4)}>
          <Text fontSize={fp(14)} fontWeight="600" color="#121217" numberOfLines={2}>
            {item.name}
          </Text>
          <Text fontSize={fp(12)} color="#6B7280" numberOfLines={1}>
            {item.brand}
          </Text>
          <XStack alignItems="center" gap={wp(4)} marginTop={hp(2)}>
            <Text fontSize={fp(15)} fontWeight="700" color="#121217">
              {formatPrice(Number(item.price_per_day))}
            </Text>
            <Text fontSize={fp(12)} color="#9CA3AF">/day</Text>
          </XStack>
        </YStack>
      </XStack>
    </Pressable>
  ), [handleProductPress]);

  const gridSeparator = useCallback(() => <YStack height={hp(12)} />, []);
  const listSeparator = useCallback(() => <YStack height={hp(10)} />, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <YStack flex={1}>
        {/* Header */}
        <YStack
          paddingHorizontal={wp(20)}
          paddingTop={hp(8)}
          paddingBottom={hp(12)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={0.5}
          borderBottomColor="rgba(0,0,0,0.06)"
        >
          <XStack alignItems="center" justifyContent="space-between" marginBottom={hp(12)}>
            <XStack alignItems="center" flex={1}>
              <BackButton />
              <Heading2 color="#121217">Similar Products</Heading2>
            </XStack>
            <Pressable onPress={toggleViewMode} style={styles.toggleBtn}>
              {viewMode === "grid"
                ? <Rows3 size={hp(20)} color="#121217" />
                : <Grid3x3 size={hp(20)} color="#121217" />
              }
            </Pressable>
          </XStack>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: wp(8) }}
          >
            {FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                filter={filter}
                isSelected={selectedFilter === filter}
                onPress={() => handleFilterPress(filter)}
              />
            ))}
          </ScrollView>
        </YStack>

        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Animated.View entering={FadeIn.duration(200)}>
              <Spinner size="large" color="#121217" />
            </Animated.View>
          </YStack>
        ) : (
          <Animated.View style={[{ flex: 1 }, contentStyle]}>
            {viewMode === "grid" ? (
              <FlatList
                data={products}
                keyExtractor={keyExtractor}
                numColumns={2}
                renderItem={renderGridItem}
                ItemSeparatorComponent={gridSeparator}
                columnWrapperStyle={{ gap: wp(8), paddingHorizontal: wp(20) }}
                contentContainerStyle={{ paddingTop: hp(16), paddingBottom: hp(40) }}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={5}
              />
            ) : (
              <FlatList
                data={products}
                keyExtractor={keyExtractor}
                renderItem={renderListItem}
                ItemSeparatorComponent={listSeparator}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </Animated.View>
        )}
      </YStack>
    </SafeAreaView>
  );
}
