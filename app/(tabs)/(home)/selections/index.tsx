import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { ProductCard } from "@/components/ui/ProductCard";
import { router } from "expo-router";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { hp, wp, fp } from "@/utils/responsive";
import { useCallback, useMemo, useState, useRef } from "react";
import ReAnimated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Grid3x3, Rows3, ChevronLeft, Plus, Minus } from "lucide-react-native";
import { Image } from "expo-image";
import { SKU } from "@/types/products/product";
import { formatPrice } from "@/utils/format";
import { BlurView } from "expo-blur";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useGetCurrentUser } from "@/hooks/auth";

type ViewMode = "grid" | "list";

const FILTERS = ["All", "Cameras", "Lenses", "Lights", "Audio"];
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - wp(48)) / 2;

// ── Filter chip ────────────────────────────────────────────────────────────────
const FilterChip = ({
  filter,
  isSelected,
  onPress,
}: {
  filter: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, isSelected && styles.chipSelected]}
  >
    <Text
      style={[
        styles.chipText,
        isSelected ? styles.chipTextSelected : styles.chipTextDefault,
      ]}
    >
      {filter}
    </Text>
  </Pressable>
);

export default function Selections() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = hp(80); // static fallback — not inside a tab navigator

  const { data: user } = useGetCurrentUser();
  const { data: cart } = useGetCart();
  const addToCartMutation = useAddToCart();
  const modifyQuantityMutation = useModifyQuantity();

  const { data: productsResponse, isLoading } = UseGetAllProducts({
    is_active: true,
    limit: 100,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Use RN Animated for scroll-driven sticky header (compatible with FlatList)
  const scrollY = useRef(new Animated.Value(0)).current;

  const stickyOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

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

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const products = useMemo(() => {
    const all = productsResponse?.data || [];
    if (selectedFilter === "All") return all;
    const lower = selectedFilter.toLowerCase();
    return all.filter((p) => p.category_id?.toLowerCase().includes(lower));
  }, [productsResponse?.data, selectedFilter]);

  const count = products.length;

  const keyExtractor = useCallback((item: SKU) => item.sku_id, []);

  const renderGridItem = useCallback(
    ({ item, index }: { item: SKU; index: number }) => (
      <ReAnimated.View
        entering={FadeIn.duration(280).delay(Math.min(index * 40, 240))}
        style={{ width: CARD_WIDTH }}
      >
        <ProductCard
          product={item}
          maxWidth={CARD_WIDTH}
          onProductPress={() => handleProductPress(item.sku_id)}
        />
      </ReAnimated.View>
    ),
    [handleProductPress]
  );

  const renderListItem = useCallback(
    ({ item, index }: { item: SKU; index: number }) => {
      const cartItem = cart?.sku_items.find((c) => c.sku_id === item.sku_id);
      const isInCart = !!cartItem;
      const quantity = cartItem?.quantity || 0;

      return (
        <ReAnimated.View
          entering={FadeIn.duration(280).delay(Math.min(index * 40, 240))}
        >
          <Pressable
            onPress={() => handleProductPress(item.sku_id)}
            style={styles.listItem}
          >
            <View style={styles.listRow}>
              <View style={styles.listThumb}>
                <Image
                  source={{ uri: item.primary_image_url }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  style={{ width: wp(80), height: hp(80) }}
                />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.listBrand} numberOfLines={1}>
                  {item.brand}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.listPrice}>
                    {formatPrice(Number(item.price_per_day))}
                  </Text>
                  <Text style={styles.listPriceSuffix}>/day</Text>
                </View>
                <View style={styles.cartRow}>
                  {!isInCart ? (
                    <Pressable
                      style={styles.addToCartBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (!user?.user_id) return;
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        addToCartMutation.mutate({ item_id: item.sku_id, item_quantity: 1, itemType: "sku" });
                      }}
                    >
                      <Plus size={hp(14)} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.addToCartText}>Add</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.qtyControl}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          if (!user?.user_id) return;
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          modifyQuantityMutation.mutate({ sku_id: item.sku_id, operation: Operation.REMOVE });
                        }}
                      >
                        <Minus size={hp(13)} color="#121217" strokeWidth={2.5} />
                      </Pressable>
                      <Text style={styles.qtyText}>{quantity}</Text>
                      <Pressable
                        style={[styles.qtyBtn, styles.qtyBtnPlus]}
                        onPress={(e) => {
                          e.stopPropagation();
                          if (!user?.user_id) return;
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          modifyQuantityMutation.mutate({ sku_id: item.sku_id, operation: Operation.ADD });
                        }}
                      >
                        <Plus size={hp(13)} color="#FFFFFF" strokeWidth={2.5} />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        </ReAnimated.View>
      );
    },
    [handleProductPress, cart?.sku_items, user?.user_id, addToCartMutation, modifyQuantityMutation]
  );

  const gridSeparator = useCallback(
    () => <View style={{ height: hp(12) }} />,
    []
  );
  const listSeparator = useCallback(
    () => <View style={{ height: hp(10) }} />,
    []
  );

  // Scrollable filter row — lives in ListHeaderComponent
  const ListHeader = useCallback(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: wp(8), paddingVertical: hp(12) }}
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
    ),
    [selectedFilter, handleFilterPress]
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.root}>
      {/* ── Fixed header: always visible ── */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={60}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(242,242,247,0.97)" },
            ]}
          />
        )}

        {/* Thin divider fades in on scroll */}
        <Animated.View
          style={[styles.headerDivider, { opacity: stickyOpacity }]}
        />

        <View style={styles.headerRow}>
          {/* Back button */}
          <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
            <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
          </Pressable>

          {/* Title + count */}
          <View style={styles.titleWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Browse Gear
            </Text>
            {count > 0 && !isLoading && (
              <Text style={styles.headerCount}>
                {count} item{count !== 1 ? "s" : ""}
              </Text>
            )}
          </View>

          {/* View mode toggle */}
          <Pressable
            onPress={toggleViewMode}
            style={styles.toggleBtn}
            hitSlop={6}
          >
            {viewMode === "grid" ? (
              <Rows3 size={19} color="#1C1C1E" />
            ) : (
              <Grid3x3 size={19} color="#1C1C1E" />
            )}
          </Pressable>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#8E0FFF" />
        </View>
      ) : (
        <FlatList<SKU>
          key={viewMode}
          data={products}
          keyExtractor={keyExtractor}
          numColumns={viewMode === "grid" ? 2 : 1}
          renderItem={viewMode === "grid" ? renderGridItem : renderListItem}
          ItemSeparatorComponent={viewMode === "grid" ? gridSeparator : listSeparator}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={viewMode === "grid" ? { gap: wp(8) } : undefined}
          contentContainerStyle={{
            paddingTop: insets.top + hp(64),
            paddingBottom: tabBarHeight + hp(24),
            paddingHorizontal: wp(16),
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={viewMode === "grid" ? 6 : 8}
          maxToRenderPerBatch={viewMode === "grid" ? 8 : 10}
          windowSize={5}
          ListEmptyComponent={<EmptyState />}
        />
      )}
    </View>
  );
}

function EmptyState() {
  return (
    <ReAnimated.View entering={FadeIn.duration(400)} style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>📷</Text>
      </View>
      <Text style={styles.emptyTitle}>Nothing here yet</Text>
      <Text style={styles.emptySubtitle}>
        No gear found for this filter.{"\n"}Try a different category.
      </Text>
    </ReAnimated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  // Fixed top header — always visible, blurred
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  headerDivider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(16),
    paddingTop: hp(8),
    paddingBottom: hp(10),
    gap: wp(12),
  },
  titleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fp(20),
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: fp(12),
    color: "#8E8E93",
    fontWeight: "400",
    marginTop: hp(1),
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(10),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chip: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(7),
    borderRadius: wp(20),
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
  chipSelected: {
    backgroundColor: "#8E0FFF",
    borderColor: "transparent",
  },
  chipText: {
    fontSize: fp(13),
    letterSpacing: -0.1,
  },
  chipTextDefault: {
    fontWeight: "500",
    color: "#6B7280",
  },
  chipTextSelected: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // List view
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(12),
  },
  listThumb: {
    width: wp(80),
    height: hp(80),
    borderRadius: wp(10),
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  listInfo: {
    flex: 1,
    gap: hp(4),
  },
  listName: {
    fontSize: fp(14),
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  listBrand: {
    fontSize: fp(12),
    color: "#8E8E93",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: wp(3),
    marginTop: hp(2),
  },
  listPrice: {
    fontSize: fp(15),
    fontWeight: "700",
    color: "#1C1C1E",
  },
  listPriceSuffix: {
    fontSize: fp(11),
    color: "#8E8E93",
  },
  cartRow: {
    marginTop: hp(8),
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
    backgroundColor: "#8E0FFF",
    paddingVertical: hp(7),
    paddingHorizontal: wp(14),
    borderRadius: wp(8),
    alignSelf: "flex-start",
  },
  addToCartText: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    backgroundColor: "#F3F4F6",
    borderRadius: wp(8),
    paddingHorizontal: wp(8),
    paddingVertical: hp(5),
    alignSelf: "flex-start",
  },
  qtyBtn: {
    width: wp(26),
    height: hp(26),
    borderRadius: wp(6),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnPlus: {
    backgroundColor: "#8E0FFF",
  },
  qtyText: {
    fontSize: fp(14),
    fontWeight: "600",
    color: "#1C1C1E",
    minWidth: wp(20),
    textAlign: "center",
  },
  // Empty state
  emptyWrap: {
    alignItems: "center",
    paddingTop: hp(60),
    paddingHorizontal: wp(32),
    gap: hp(8),
  },
  emptyIcon: {
    width: wp(72),
    height: wp(72),
    borderRadius: wp(36),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyEmoji: {
    fontSize: fp(30),
  },
  emptyTitle: {
    fontSize: fp(17),
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: fp(14),
    color: "#8E8E93",
    textAlign: "center",
    marginTop: hp(6),
    lineHeight: fp(20),
  },
});
