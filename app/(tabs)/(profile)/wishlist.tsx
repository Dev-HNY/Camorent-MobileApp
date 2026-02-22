import { BodyText } from "@/components/ui/Typography";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { XStack, YStack, ScrollView, Text, Spinner } from "tamagui";
import { ChevronLeft, Heart } from "lucide-react-native";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { Pressable, FlatList } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useGetWishlist } from "@/hooks/wishlist";
import { WishlistItem } from "@/components/ui/WishlistItem";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function WishlistPage() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data: wishlistItems, isLoading } = useGetWishlist();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <YStack flex={1}>
        {/* Premium Header */}
        <Animated.View
          entering={FadeIn.duration(DURATION.normal)}
        >
          <XStack
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(20)}
            paddingTop={hp(12)}
            paddingBottom={hp(16)}
            backgroundColor="#FFFFFF"
            position="relative"
            borderBottomWidth={1}
            borderBottomColor="rgba(142, 15, 255, 0.08)"
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                position: "absolute",
                left: wp(16),
                width: wp(40),
                height: wp(40),
                borderRadius: wp(20),
                backgroundColor: "rgba(142, 15, 255, 0.06)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={hp(22)} color="#8E0FFF" strokeWidth={2.5} />
            </Pressable>
            <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.3}>
              My Wishlist
            </Text>
            {wishlistItems && wishlistItems.total > 0 && (
              <XStack
                position="absolute"
                right={wp(16)}
                backgroundColor="rgba(142, 15, 255, 0.1)"
                paddingHorizontal={wp(10)}
                paddingVertical={hp(4)}
                borderRadius={wp(12)}
              >
                <Text fontSize={fp(12)} fontWeight="600" color="#8E0FFF">
                  {wishlistItems.total} {wishlistItems.total === 1 ? "item" : "items"}
                </Text>
              </XStack>
            )}
          </XStack>
        </Animated.View>

        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color="#8E0FFF" />
            <Text fontSize={fp(14)} color="#6B7280" marginTop={hp(12)}>
              Loading your wishlist...
            </Text>
          </YStack>
        ) : wishlistItems?.total === 0 ? (
          <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal={wp(32)}>
            <LinearGradient
              colors={["rgba(142, 15, 255, 0.1)", "rgba(142, 15, 255, 0.02)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: wp(120),
                height: wp(120),
                borderRadius: wp(60),
                justifyContent: "center",
                alignItems: "center",
                marginBottom: hp(24),
              }}
            >
              <Heart size={wp(56)} color="#8E0FFF" strokeWidth={1.5} />
            </LinearGradient>
            <Text fontSize={fp(20)} fontWeight="700" color="#1C1C1E" textAlign="center" marginBottom={hp(8)}>
              Your wishlist is empty
            </Text>
            <Text fontSize={fp(14)} color="#6B7280" textAlign="center" lineHeight={fp(20)}>
              Start browsing and save your favorite items by tapping the heart icon
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/(home)");
              }}
              style={{
                marginTop: hp(24),
                paddingHorizontal: wp(24),
                paddingVertical: hp(12),
                backgroundColor: "#8E0FFF",
                borderRadius: wp(12),
              }}
            >
              <Text fontSize={fp(15)} fontWeight="600" color="#FFFFFF">
                Browse Products
              </Text>
            </Pressable>
          </YStack>
        ) : (
          <FlatList
            data={wishlistItems?.items || []}
            keyExtractor={(item) => item.wishlist_id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 80)
                  .springify()
                  .damping(18)
                  .stiffness(250)}
              >
                <WishlistItem item={item} index={index} />
              </Animated.View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: wp(16),
              paddingBottom: tabBarHeight + hp(24),
              paddingTop: hp(16),
            }}
            ItemSeparatorComponent={() => <YStack height={hp(12)} />}
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}
