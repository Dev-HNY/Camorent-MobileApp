import { Heading2 } from "@/components/ui/Typography";
import { XStack, Card, YStack, Text } from "tamagui";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { useWishlistStatus } from "@/hooks/wishlist";
import { Image } from "expo-image";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { useRef, useEffect } from "react";

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
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        delay: index * 50,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const imageUrl = `https://img.camorent.co.in/skus/images/${item?.id}/primary.webp`;

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [
          { translateY: translateYAnim },
          { scale: scaleAnim },
        ],
      }}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 1)",
          "rgba(142, 15, 255, 0.02)",
          "rgba(255, 255, 255, 1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: wp(14),
          borderWidth: 1,
          borderColor: "rgba(142, 15, 255, 0.1)",
          padding: wp(14),
          shadowColor: "#8E0FFF",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 1,
        }}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          gap={wp(14)}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push({
              pathname: `/product/[id]` as any,
              params: {
                id: item.sku_id,
                from: "wishlist",
              },
            });
          }}
        >
          <XStack gap={wp(14)} alignItems="center" flex={1}>
            <YStack
              backgroundColor="rgba(142, 15, 255, 0.04)"
              borderRadius={wp(10)}
              padding={wp(4)}
            >
              <Image
                source={{ uri: imageUrl }}
                contentFit="contain"
                transition={300}
                cachePolicy="memory-disk"
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: wp(6),
                }}
              />
            </YStack>
            <YStack flex={1} gap={hp(4)}>
              <Text
                fontSize={fp(15)}
                fontWeight="600"
                color="#1C1C1E"
                numberOfLines={2}
                ellipsizeMode="tail"
                letterSpacing={-0.2}
              >
                {item.sku_name}
              </Text>
              <Text fontSize={fp(12)} color="#6B7280">
                {item.sku_category}
              </Text>
            </YStack>
          </XStack>
          <XStack
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleWishlist();
            }}
            disabled={isToggling}
            opacity={isToggling ? 0.5 : 1}
            padding={wp(8)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            backgroundColor="rgba(142, 15, 255, 0.08)"
            borderRadius={wp(8)}
          >
            <HeartIcon filled={isInWishlist} />
          </XStack>
        </XStack>
      </LinearGradient>
    </Animated.View>
  );
}
