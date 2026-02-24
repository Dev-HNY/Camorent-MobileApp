import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { ChevronLeft, Heart } from "lucide-react-native";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { Pressable, FlatList, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useGetWishlist } from "@/hooks/wishlist";
import { WishlistItem } from "@/components/ui/WishlistItem";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function WishlistPage() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data: wishlistItems, isLoading } = useGetWishlist();

  return (
    <SafeAreaView style={styles.root}>
      <YStack flex={1}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(DURATION.normal)}>
          <XStack
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(20)}
            paddingTop={hp(10)}
            paddingBottom={hp(14)}
            backgroundColor="#FFFFFF"
            position="relative"
            borderBottomWidth={1}
            borderBottomColor="#F2F2F7"
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

            <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.3}>
              My Wishlist
            </Text>

            {wishlistItems && wishlistItems.total > 0 && (
              <XStack
                position="absolute"
                right={wp(16)}
                backgroundColor="#F3F4F6"
                paddingHorizontal={wp(10)}
                paddingVertical={hp(4)}
                borderRadius={wp(12)}
              >
                <Text fontSize={fp(12)} fontWeight="600" color="#8E8E93">
                  {wishlistItems.total} {wishlistItems.total === 1 ? "item" : "items"}
                </Text>
              </XStack>
            )}
          </XStack>
        </Animated.View>

        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center" gap={hp(12)}>
            <Spinner size="large" color="#8E0FFF" />
            <Text fontSize={fp(14)} color="#8E8E93">
              Loading your wishlist...
            </Text>
          </YStack>
        ) : wishlistItems?.total === 0 ? (
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(40)}
            gap={hp(0)}
          >
            {/* Empty state icon */}
            <YStack style={styles.emptyIcon}>
              <Heart size={wp(44)} color="#8E0FFF" strokeWidth={1.5} />
            </YStack>

            <Text
              fontSize={fp(20)}
              fontWeight="700"
              color="#1C1C1E"
              textAlign="center"
              marginTop={hp(20)}
              marginBottom={hp(8)}
              letterSpacing={-0.4}
            >
              Your wishlist is empty
            </Text>
            <Text
              fontSize={fp(14)}
              color="#8E8E93"
              textAlign="center"
              lineHeight={fp(20)}
            >
              Save your favorite gear by tapping the heart icon on any product
            </Text>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/(home)");
              }}
              style={styles.browseBtn}
            >
              <Text fontSize={fp(15)} fontWeight="600" color="#FFFFFF">
                Browse Products
              </Text>
            </Pressable>
          </YStack>
        ) : (
          <>
            {/* Section label */}
            <Text style={styles.sectionLabel}>
              SAVED ITEMS
            </Text>

            <FlatList
              data={wishlistItems?.items || []}
              keyExtractor={(item) => item.wishlist_id}
              renderItem={({ item, index }) => (
                <WishlistItem item={item} index={index} />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp(16),
                paddingBottom: tabBarHeight + hp(24),
                paddingTop: hp(4),
              }}
              ItemSeparatorComponent={() => <YStack height={hp(10)} />}
            />
          </>
        )}
      </YStack>
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
  emptyIcon: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(50),
    backgroundColor: "#F5EEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  browseBtn: {
    marginTop: hp(28),
    paddingHorizontal: wp(28),
    paddingVertical: hp(13),
    backgroundColor: "#8E0FFF",
    borderRadius: wp(14),
  },
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(10),
  },
});
