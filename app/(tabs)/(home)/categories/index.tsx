import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Spinner } from "tamagui";
import { Dimensions, FlatList, RefreshControl, Pressable, StyleSheet } from "react-native";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Funnel, Grid3x3, Rows3, Plus, Minus } from "lucide-react-native";
import { FilterSheet, FilterState } from "@/components/CDP/FilterSheet";
import { SortSheet, SortOption } from "@/components/CDP/SortSheet";
import { router, useLocalSearchParams } from "expo-router";
import { ProductCard } from "@/components/ui/ProductCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { CategorySelector } from "@/components/category/CategorySelector";
import { fp, hp, wp } from "@/utils/responsive";
import {
  filterProducts,
  getActiveFilterCount,
  createEmptyFilters,
} from "@/utils/product-filters";
import {
  applySorting,
  DEFAULT_SORT_OPTIONS,
  DEFAULT_SORT_OPTION,
} from "@/utils/product-sorting";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { FilterChipsContainer } from "@/components/ui/FilterChip";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import * as Haptics from "expo-haptics";
import { StickyCartButton } from "@/components/ui/StickyCartButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useGetCurrentUser } from "@/hooks/auth";
import { SKU } from "@/types/products/product";

const ITEMS_PER_PAGE = 10;
const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - wp(48)) / 2;

type ViewMode = "grid" | "list";

const styles = StyleSheet.create({
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
  addToCartBtn: {
    backgroundColor: "#8E0FFF",
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    borderRadius: wp(8),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  qtyControl: {
    alignItems: "center",
    gap: wp(12),
    backgroundColor: "#F3F4F6",
    borderRadius: wp(8),
    paddingHorizontal: wp(8),
    paddingVertical: hp(6),
    flexDirection: "row",
  },
  qtyBtnMinus: {
    width: wp(28),
    height: hp(28),
    borderRadius: wp(6),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnPlus: {
    width: wp(28),
    height: hp(28),
    borderRadius: wp(6),
    backgroundColor: "#8E0FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    borderRadius: wp(20),
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: wp(6),
  },
  viewToggleBtn: {
    padding: wp(8),
    borderRadius: wp(8),
    backgroundColor: "#F3F4F6",
  },
});

export default function Categories() {
  const { category, brand, openFilters, filterCategory } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(category as string);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [showFilterSheet, setShowFilterSheet] = useState(openFilters === "true");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialFilterCategory] = useState<keyof FilterState | undefined>(
    filterCategory as keyof FilterState | undefined
  );
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const tabHeight = useBottomTabBarHeight();

  // Cart hooks for list view
  const { data: user } = useGetCurrentUser();
  const { data: cart } = useGetCart();
  const addToCartMutation = useAddToCart();
  const modifyQuantityMutation = useModifyQuantity();

  // Smooth animations with Reanimated
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const contentOpacity = useSharedValue(0);
  const filterBadgeScale = useSharedValue(1);

  const initialFilters = useMemo(() => {
    const f = createEmptyFilters();
    if (brand && typeof brand === "string") {
      f.brands = [brand];
    }
    return f;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);
  const [activeSortOption, setActiveSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION);

  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = UseGetAllProducts(
    selectedCategory || selectedSubcategory
      ? {
          category_id: typeof selectedCategory === "string" ? selectedCategory : undefined,
          subcategory_id: selectedSubcategory || undefined,
          is_active: true,
          limit: 100,
          page: 1,
        }
      : { limit: 100, page: 1, is_active: true }
  );

  const products = useMemo(() => productsResponse?.data || [], [productsResponse?.data]);

  const filteredProducts = useMemo(
    () => filterProducts(products, { filters: activeFilters }),
    [products, activeFilters]
  );

  const filteredAndSortedProducts = useMemo(
    () => applySorting(filteredProducts, activeSortOption),
    [filteredProducts, activeSortOption]
  );

  const displayedProducts = useMemo(
    () => filteredAndSortedProducts.slice(0, displayedCount),
    [filteredAndSortedProducts, displayedCount]
  );

  const hasMore = displayedCount < filteredAndSortedProducts.length;

  // Entrance animations
  useEffect(() => {
    headerOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
    headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    setTimeout(() => {
      contentOpacity.value = withSpring(1, { damping: 20, stiffness: 90 });
    }, 100);
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const filterBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterBadgeScale.value }],
  }));

  // Reset displayed count when filters/sorting changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
    contentOpacity.value = 0;
    contentOpacity.value = withSpring(1, { damping: 20 });
  }, [activeFilters, activeSortOption, selectedCategory, selectedSubcategory]);

  const loadMoreProducts = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
        setIsLoadingMore(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 300);
    }
  }, [hasMore, isLoadingMore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDisplayedCount(ITEMS_PER_PAGE);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const toggleTempFilter = useCallback((type: keyof FilterState, value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTempFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  }, []);

  const applyFiltersAndClose = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setActiveFilters(tempFilters);
    setShowFilterSheet(false);
    filterBadgeScale.value = withSpring(1.2, { damping: 10 }, () => {
      filterBadgeScale.value = withSpring(1);
    });
  }, [tempFilters, filterBadgeScale]);

  const clearActiveFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const emptyFilters = createEmptyFilters();
    setActiveFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setShowFilterSheet(false);
  }, []);

  const openFilterSheet = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTempFilters(activeFilters);
    setShowFilterSheet(true);
  }, [activeFilters]);

  const handleSortSelect = useCallback((option: SortOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveSortOption(option);
    setShowSortSheet(false);
  }, []);

  const toggleViewMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    contentOpacity.value = 0;
    contentOpacity.value = withSpring(1, { damping: 15 });
  }, [contentOpacity]);

  const handleProductPress = useCallback((skuId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${skuId}`);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
  }, []);

  const handleSubcategorySelect = useCallback((subcategoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSubcategory(subcategoryId);
  }, []);

  const handleOpenSortSheet = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSortSheet(true);
  }, []);

  const handleCloseFilterSheet = useCallback(() => setShowFilterSheet(false), []);
  const handleCloseSortSheet = useCallback(() => setShowSortSheet(false), []);

  const handleRemoveFilter = useCallback((type: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: prev[type as keyof FilterState].filter((item: string) => item !== value),
    }));
  }, []);

  const handleEndReached = useCallback(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  const activeFilterCount = useMemo(() => getActiveFilterCount(activeFilters), [activeFilters]);

  const activeFilterChips = useMemo(
    () => (Object.keys(activeFilters) as (keyof FilterState)[]).flatMap(
      (type) => activeFilters[type].map((value: string) => ({ type, value, label: value }))
    ),
    [activeFilters]
  );

  // FlatList render functions
  const keyExtractor = useCallback((item: SKU) => item.sku_id, []);

  const renderGridItem = useCallback(({ item }: { item: SKU }) => (
    <YStack width={cardWidth}>
      <ProductCard
        product={item}
        maxWidth={cardWidth}
        onProductPress={() => handleProductPress(item.sku_id)}
      />
    </YStack>
  ), [handleProductPress]);

  const renderListItem = useCallback(({ item }: { item: SKU }) => {
    const cartItem = cart?.sku_items.find((c) => c.sku_id === item.sku_id);
    const isInCart = !!cartItem;
    const quantity = cartItem?.quantity || 0;

    return (
      <Pressable onPress={() => handleProductPress(item.sku_id)} style={styles.listItem}>
        <XStack gap={wp(12)} alignItems="center">
          <LinearGradient
            colors={["#F5EDFF", "#FDFBFF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: wp(100),
              height: hp(100),
              borderRadius: wp(12),
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.primary_image_url ? (
              <Image
                source={{ uri: item.primary_image_url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            ) : (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <Text fontSize={fp(40)}>📷</Text>
              </YStack>
            )}
          </LinearGradient>

          <YStack flex={1} gap={hp(6)}>
            <Text fontSize={fp(16)} fontWeight="600" color="#121217" numberOfLines={2}>
              {item.name}
            </Text>
            <Text fontSize={fp(13)} color="#6B7280" numberOfLines={1}>
              {item.brand}
            </Text>
            <XStack alignItems="center" gap={wp(8)} marginTop={hp(2)}>
              <Text fontSize={fp(18)} fontWeight="700" color="#121217">
                ₹{item.price_per_day}
              </Text>
              <Text fontSize={fp(13)} color="#9CA3AF">/day</Text>
            </XStack>

            <XStack marginTop={hp(8)}>
              {!isInCart ? (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    if (!user?.user_id) return;
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    addToCartMutation.mutate({ item_id: item.sku_id, item_quantity: 1, itemType: "sku" });
                  }}
                  style={styles.addToCartBtn}
                >
                  <Plus size={hp(16)} color="#FFFFFF" strokeWidth={2.5} />
                  <Text fontSize={fp(14)} fontWeight="600" color="#FFFFFF">Add to Cart</Text>
                </Pressable>
              ) : (
                <XStack style={styles.qtyControl}>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      if (!user?.user_id) return;
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      modifyQuantityMutation.mutate({ sku_id: item.sku_id, operation: Operation.REMOVE });
                    }}
                    style={styles.qtyBtnMinus}
                  >
                    <Minus size={hp(14)} color="#121217" strokeWidth={2.5} />
                  </Pressable>
                  <Text fontSize={fp(15)} fontWeight="600" color="#121217" minWidth={wp(24)} textAlign="center">
                    {quantity}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      if (!user?.user_id) return;
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      modifyQuantityMutation.mutate({ sku_id: item.sku_id, operation: Operation.ADD });
                    }}
                    style={styles.qtyBtnPlus}
                  >
                    <Plus size={hp(14)} color="#FFFFFF" strokeWidth={2.5} />
                  </Pressable>
                </XStack>
              )}
            </XStack>
          </YStack>
        </XStack>
      </Pressable>
    );
  }, [cart?.sku_items, user?.user_id, handleProductPress, addToCartMutation, modifyQuantityMutation]);

  const gridSeparator = useCallback(() => <YStack height={hp(12)} />, []);
  const listSeparator = useCallback(() => <YStack height={hp(12)} />, []);

  const listFooter = useCallback(() => isLoadingMore ? (
    <YStack alignItems="center" paddingVertical={hp(20)}>
      <Spinner size="small" color="#121217" />
    </YStack>
  ) : null, [isLoadingMore]);

  const emptyComponent = useCallback(() => (
    <YStack flex={1} justifyContent="center" alignItems="center" marginTop={hp(80)}>
      <Text fontSize={fp(18)} fontWeight="600" color="#121217">No products found</Text>
      <Text fontSize={fp(14)} color="#6B7280" marginTop={hp(8)}>Try adjusting your filters</Text>
    </YStack>
  ), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <LinearGradient
        colors={["#FFFFFF", "#FAFAFA", "#FFFFFF"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <YStack flex={1}>
        {/* Header */}
        <Animated.View style={headerStyle}>
          <YStack
            paddingHorizontal={wp(16)}
            paddingTop={hp(4)}
            paddingBottom={hp(6)}
            backgroundColor="rgba(255, 255, 255, 0.95)"
            borderBottomWidth={0.5}
            borderBottomColor="rgba(0, 0, 0, 0.05)"
          >
            <InsideScreenHeader />

            {/* Category Selector */}
            <YStack marginTop={hp(8)}>
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                selectedSubcategory={selectedSubcategory}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </YStack>

            {/* Filter & Sort Bar */}
            <XStack gap={wp(8)} marginTop={hp(8)}>
              <Animated.View style={[{ flex: 1 }, filterBadgeStyle]}>
                <Pressable
                  onPress={openFilterSheet}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: hp(10),
                    paddingHorizontal: wp(16),
                    borderRadius: wp(20),
                    backgroundColor: activeFilterCount > 0 ? "#121217" : "#F3F4F6",
                    borderWidth: activeFilterCount > 0 ? 0 : 1,
                    borderColor: "#E5E7EB",
                    gap: wp(6),
                  }}
                >
                  <Funnel size={hp(16)} color={activeFilterCount > 0 ? "#FFFFFF" : "#6B7280"} />
                  <Text
                    fontSize={fp(14)}
                    fontWeight={activeFilterCount > 0 ? "600" : "500"}
                    color={activeFilterCount > 0 ? "#FFFFFF" : "#6B7280"}
                  >
                    Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable onPress={handleOpenSortSheet} style={styles.sortBtn}>
                <Text fontSize={fp(14)} fontWeight="500" color="#6B7280">
                  {activeSortOption.label}
                </Text>
              </Pressable>

              <Pressable onPress={toggleViewMode} style={styles.viewToggleBtn}>
                {viewMode === "grid" ? (
                  <Rows3 size={hp(18)} color="#121217" />
                ) : (
                  <Grid3x3 size={hp(18)} color="#121217" />
                )}
              </Pressable>
            </XStack>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <YStack marginTop={hp(12)}>
                <FilterChipsContainer
                  activeFilters={activeFilterChips}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={clearActiveFilters}
                />
              </YStack>
            )}

            {/* Product Count */}
            <Text fontSize={fp(12)} color="#6B7280" marginTop={hp(8)}>
              {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""}
            </Text>
          </YStack>
        </Animated.View>

        {/* Content */}
        {isLoading ? (
          <YStack flex={1} paddingHorizontal={wp(16)} paddingTop={hp(20)}>
            <ProductGridSkeleton count={6} />
          </YStack>
        ) : error ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text fontSize={fp(16)} color="#EF4444">Error loading products</Text>
          </YStack>
        ) : (
          <Animated.View style={[{ flex: 1 }, contentStyle]}>
            {viewMode === "grid" ? (
              <FlatList
                data={displayedProducts}
                keyExtractor={keyExtractor}
                numColumns={2}
                renderItem={renderGridItem}
                ItemSeparatorComponent={gridSeparator}
                ListFooterComponent={listFooter}
                ListEmptyComponent={emptyComponent}
                columnWrapperStyle={{ gap: wp(8), paddingHorizontal: wp(16) }}
                contentContainerStyle={{ paddingTop: hp(16), paddingBottom: tabHeight + hp(100) }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#121217"
                    colors={["#121217"]}
                  />
                }
                removeClippedSubviews
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={5}
              />
            ) : (
              <FlatList
                data={displayedProducts}
                keyExtractor={keyExtractor}
                renderItem={renderListItem}
                ItemSeparatorComponent={listSeparator}
                ListFooterComponent={listFooter}
                ListEmptyComponent={emptyComponent}
                contentContainerStyle={{
                  paddingHorizontal: wp(16),
                  paddingTop: hp(16),
                  paddingBottom: tabHeight + hp(100),
                }}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#121217"
                    colors={["#121217"]}
                  />
                }
                removeClippedSubviews
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </Animated.View>
        )}

        <StickyCartButton />
      </YStack>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={showFilterSheet}
        onClose={handleCloseFilterSheet}
        tempFilters={tempFilters}
        onToggleFilter={toggleTempFilter}
        onApply={applyFiltersAndClose}
        onClear={clearActiveFilters}
        initialCategory={initialFilterCategory}
      />

      {/* Sort Sheet */}
      <SortSheet
        isOpen={showSortSheet}
        onClose={handleCloseSortSheet}
        sortOptions={DEFAULT_SORT_OPTIONS}
        activeSortOption={activeSortOption}
        onSelectSort={handleSortSelect}
      />
    </SafeAreaView>
  );
}
