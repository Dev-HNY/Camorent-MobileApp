import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, XStack, Text } from "tamagui";
import { useLocalSearchParams, router } from "expo-router";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { FlashList } from "@shopify/flash-list";
import { ProductCard } from "@/components/ui/ProductCard";
import { fp, hp, wp } from "@/utils/responsive";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { SKU } from "@/types/products/product";

export default function SimilarProducts() {
  const insets = useSafeAreaInsets();
  const { subcategory_id, category_id } = useLocalSearchParams();

  const { data: products, isLoading } = UseGetAllProducts({
    subcategory_id: subcategory_id as string,
    is_active: true,
  });

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Sticky header fades in after 40px of scroll
  const stickyHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [20, 60], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [20, 60],
          [-8, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const handleProductPress = (productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${productId}`);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const rawTitle =
    (subcategory_id as string) || (category_id as string) || "Similar Gear";
  // Prettify: replace hyphens/underscores with spaces, title-case
  const title = rawTitle
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const count = products?.data?.length ?? 0;

  return (
    <View style={styles.root}>
      {/* ── Sticky floating header (appears on scroll) ── */}
      <Animated.View
        style={[styles.stickyHeader, { paddingTop: insets.top }, stickyHeaderStyle]}
        pointerEvents="none"
      >
        <View style={styles.stickyInner}>
          <Text
            fontSize={fp(16)}
            fontWeight="600"
            color="#1C1C1E"
            letterSpacing={-0.3}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      </Animated.View>

      {/* ── Back button — always on top ── */}
      <View style={[styles.backRow, { top: insets.top + hp(8) }]} pointerEvents="box-none">
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
          <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
        </Pressable>
      </View>

      {isLoading ? (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingTop={insets.top + hp(56)}
        >
          <ActivityIndicator size="large" color="#8E0FFF" />
        </YStack>
      ) : (
        <FlashList<SKU>
          data={(products?.data ?? []) as SKU[]}
          estimatedItemSize={280}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: insets.top + hp(56),
            paddingBottom: insets.bottom + hp(32),
            paddingHorizontal: wp(16),
          }}
          ListHeaderComponent={
            <Animated.View entering={FadeIn.duration(300).delay(100)}>
              <XStack
                alignItems="center"
                justifyContent="space-between"
                paddingBottom={hp(14)}
                paddingTop={hp(4)}
              >
                <Text
                  fontSize={fp(22)}
                  fontWeight="700"
                  color="#1C1C1E"
                  letterSpacing={-0.5}
                >
                  {title}
                </Text>
                {count > 0 && (
                  <Text fontSize={fp(13)} color="#8E8E93" fontWeight="400">
                    {count} item{count !== 1 ? "s" : ""}
                  </Text>
                )}
              </XStack>
            </Animated.View>
          }
          ItemSeparatorComponent={() => <View style={{ height: hp(12) }} />}
          renderItem={({ item: product, index }: { item: SKU; index: number }) => (
            <Animated.View
              entering={FadeIn.duration(300).delay(Math.min(index * 60, 300))}
              style={[
                styles.cardWrapper,
                index % 2 === 0
                  ? { paddingRight: wp(6) }
                  : { paddingLeft: wp(6) },
              ]}
            >
              <ProductCard
                product={product}
                onProductPress={() => handleProductPress(product.sku_id)}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <Animated.View
              entering={FadeIn.duration(400)}
              style={styles.emptyWrap}
            >
              <View style={styles.emptyIcon}>
                <Text fontSize={fp(32)}>📷</Text>
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
                No similar gear found.{"\n"}Try browsing other categories.
              </Text>
              <Pressable onPress={() => router.back()} style={styles.emptyBtn}>
                <Text fontSize={fp(15)} fontWeight="600" color="#8E0FFF">
                  Go back
                </Text>
              </Pressable>
            </Animated.View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  // Sticky header that fades in on scroll
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(242,242,247,0.92)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  stickyInner: {
    height: hp(44),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(60),
  },
  // Back button — always floating on top left
  backRow: {
    position: "absolute",
    left: wp(16),
    zIndex: 20,
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
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  cardWrapper: {
    flex: 1,
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
  emptyBtn: {
    marginTop: hp(20),
    paddingHorizontal: wp(28),
    paddingVertical: hp(12),
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
});
