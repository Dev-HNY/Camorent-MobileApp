import { XStack, YStack, Text } from "tamagui";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { useWishlistStatus } from "@/hooks/wishlist";
import { Image } from "expo-image";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { Animated, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react-native";

interface WishlistItemProps {
  item: {
    wishlist_id: string;
    sku_id: string;
    user_id: string;
    id: string;
    sku_name: string;
    sku_category: string;
    created_at: string;
  };
  index?: number;
}

export function WishlistItem({ item, index = 0 }: WishlistItemProps) {
  const { isInWishlist, toggleWishlist, isToggling } = useWishlistStatus(
    item.sku_id,
    item.sku_name
  );

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        delay: index * 40,
        friction: 9,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const imageUrl = `https://img.camorent.co.in/skus/images/${item?.id}/primary.webp`;

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
      }}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: `/product/[id]` as any,
            params: { id: item.sku_id, from: "wishlist" },
          });
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Product image */}
        <YStack style={styles.imageBox}>
          <Image
            source={{ uri: imageUrl }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            style={styles.image}
          />
        </YStack>

        {/* Info */}
        <YStack flex={1} gap={hp(4)}>
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#1C1C1E"
            numberOfLines={2}
            ellipsizeMode="tail"
            letterSpacing={-0.2}
          >
            {item.sku_name}
          </Text>
          <Text fontSize={fp(12)} color="#8E8E93" fontWeight="400">
            {item.sku_category}
          </Text>
        </YStack>

        {/* Right: heart + chevron */}
        <XStack alignItems="center" gap={wp(8)}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleWishlist();
            }}
            disabled={isToggling}
            style={[styles.heartBtn, { opacity: isToggling ? 0.5 : 1 }]}
            hitSlop={8}
          >
            <HeartIcon filled={isInWishlist} />
          </Pressable>
          <ChevronRight size={hp(16)} color="#C7C7CC" strokeWidth={2} />
        </XStack>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(14),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageBox: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(10),
    backgroundColor: "#F8F8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: wp(58),
    height: wp(58),
  },
  heartBtn: {
    width: wp(34),
    height: wp(34),
    borderRadius: wp(17),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});
