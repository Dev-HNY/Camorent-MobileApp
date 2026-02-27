import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, XStack, Text } from "tamagui";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  FlatList,
  View,
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
import { Grid3x3, Rows3, ChevronLeft } from "lucide-react-native";
import { Image } from "expo-image";
import { SKU } from "@/types/products/product";
import { formatPrice } from "@/utils/format";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";

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
      fontSize={fp(13)}
      fontWeight={isSelected ? "600" : "500"}
      color={isSelected ? "#FFFFFF" : "#6B7280"}
      letterSpacing={-0.1}
    >
      {filter}
    </Text>
  </Pressable>
);

export default function Selections() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

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
    ({ item, index }: { item: SKU; index: number }) => (
      <ReAnimated.View
        entering={FadeIn.duration(280).delay(Math.min(index * 40, 240))}
      >
        <Pressable
          onPress={() => handleProductPress(item.sku_id)}
          style={styles.listItem}
        >
          <XStack gap={wp(12)} alignItems="center">
            <View style={styles.listThumb}>
              <Image
                source={{ uri: item.primary_image_url }}
                contentFit="contain"
                cachePolicy="memory-disk"
                style={{ width: wp(64), height: hp(64) }}
              />
            </View>
            <YStack flex={1} gap={hp(4)}>
              <Text
                fontSize={fp(14)}
                fontWeight="600"
                color="#1C1C1E"
                numberOfLines={2}
                letterSpacing={-0.2}
              >
                {item.name}
              </Text>
              <Text fontSize={fp(12)} color="#8E8E93" numberOfLines={1}>
                {item.brand}
              </Text>
              <XStack alignItems="baseline" gap={wp(3)} marginTop={hp(2)}>
                <Text fontSize={fp(15)} fontWeight="700" color="#1C1C1E">
                  {formatPrice(Number(item.price_per_day))}
                </Text>
                <Text fontSize={fp(11)} color="#8E8E93">
                  /day
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </Pressable>
      </ReAnimated.View>
    ),
    [handleProductPress]
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
  const ListHeader = (
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
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
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

        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingTop={hp(8)}
          paddingBottom={hp(10)}
          gap={wp(12)}
        >
          {/* Back button */}
          <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
            <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
          </Pressable>

          {/* Title + count */}
          <YStack flex={1}>
            <Text
              fontSize={fp(20)}
              fontWeight="700"
              color="#1C1C1E"
              letterSpacing={-0.5}
              numberOfLines={1}
            >
              Browse Gear
            </Text>
            {count > 0 && !isLoading && (
              <Text
                fontSize={fp(12)}
                color="#8E8E93"
                fontWeight="400"
                marginTop={hp(1)}
              >
                {count} item{count !== 1 ? "s" : ""}
              </Text>
            )}
          </YStack>

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
        </XStack>
      </View>

      {isLoading ? (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator size="large" color="#8E0FFF" />
        </YStack>
      ) : viewMode === "grid" ? (
        <FlatList<SKU>
          data={products}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={renderGridItem}
          ItemSeparatorComponent={gridSeparator}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={{ gap: wp(8) }}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + hp(24),
            paddingHorizontal: wp(16),
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          ListEmptyComponent={<EmptyState />}
        />
      ) : (
        <FlatList<SKU>
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderListItem}
          ItemSeparatorComponent={listSeparator}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + hp(24),
            paddingHorizontal: wp(16),
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={10}
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
        <Text fontSize={fp(30)}>📷</Text>
      </View>
      <Text
        fontSize={fp(17)}
        fontWeight="600"
        color="#1C1C1E"
        textAlign="center"
        letterSpacing={-0.3}
      >
        Nothing here yet
      </Text>
      <Text
        fontSize={fp(14)}
        color="#8E8E93"
        textAlign="center"
        marginTop={hp(6)}
        lineHeight={fp(20)}
      >
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
  listThumb: {
    width: wp(80),
    height: hp(80),
    borderRadius: wp(10),
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
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
});
