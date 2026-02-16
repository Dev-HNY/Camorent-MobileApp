import { YStack, XStack } from "tamagui";
import { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import { wp, hp } from "@/utils/responsive";

interface ProductCardSkeletonProps {
  width?: number;
}

export function ProductCardSkeleton({ width }: ProductCardSkeletonProps = {}) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const { width: screenWidth } = Dimensions.get("window");
  const cardWidth = width || (screenWidth - wp(32) - wp(12)) / 2;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <YStack
      width={cardWidth}
      borderRadius={wp(16)}
      backgroundColor="white"
      overflow="hidden"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={4}
    >
      {/* Image skeleton */}
      <Animated.View style={{ opacity: pulseAnim }}>
        <YStack backgroundColor="#E5E5E5" height={hp(110)} />
      </Animated.View>

      {/* Content skeleton */}
      <YStack padding={wp(10)} paddingTop={hp(6)} gap={hp(8)}>
        {/* Product name skeleton - 2 lines */}
        <YStack gap={hp(4)}>
          <Animated.View style={{ opacity: pulseAnim }}>
            <YStack backgroundColor="#E5E5E5" height={hp(12)} borderRadius={wp(4)} width="90%" />
          </Animated.View>
          <Animated.View style={{ opacity: pulseAnim }}>
            <YStack backgroundColor="#E5E5E5" height={hp(12)} borderRadius={wp(4)} width="70%" />
          </Animated.View>
        </YStack>

        {/* Price skeleton */}
        <YStack gap={hp(4)}>
          <Animated.View style={{ opacity: pulseAnim }}>
            <YStack backgroundColor="#E5E5E5" height={hp(14)} borderRadius={wp(4)} width="50%" />
          </Animated.View>
          <Animated.View style={{ opacity: pulseAnim }}>
            <YStack backgroundColor="#E5E5E5" height={hp(10)} borderRadius={wp(4)} width="60%" />
          </Animated.View>
        </YStack>

        {/* Button skeleton */}
        <Animated.View style={{ opacity: pulseAnim }}>
          <YStack backgroundColor="#E5E5E5" height={hp(36)} borderRadius={wp(8)} marginTop={hp(4)} />
        </Animated.View>
      </YStack>
    </YStack>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <XStack gap={wp(12)} flexWrap="wrap" justifyContent="space-between">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </XStack>
  );
}
