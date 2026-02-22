import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack } from 'tamagui';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-300, 300]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: '#F3F4F6',
          overflow: 'hidden' as const,
        },
        style,
      ]}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

export function ProductCardSkeleton() {
  return (
    <YStack
      width={160}
      padding="$3"
      gap="$2"
      backgroundColor="white"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$border"
    >
      <Skeleton width="100%" height={140} borderRadius={12} />
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={14} />
      <YStack gap="$1">
        <Skeleton width="50%" height={12} />
        <Skeleton width="70%" height={18} />
      </YStack>
    </YStack>
  );
}

export function CategoryCardSkeleton() {
  return (
    <YStack alignItems="center" gap="$2" width={80}>
      <Skeleton width={64} height={64} borderRadius={32} />
      <Skeleton width={60} height={12} />
    </YStack>
  );
}

export function BrandCardSkeleton() {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      padding="$3"
      backgroundColor="white"
      borderRadius="$3"
      borderWidth={1}
      borderColor="$border"
      width={100}
      height={100}
    >
      <Skeleton width={70} height={70} borderRadius={8} />
    </YStack>
  );
}

export function ListItemSkeleton() {
  return (
    <XStack
      padding="$4"
      gap="$3"
      backgroundColor="white"
      borderRadius="$3"
      borderWidth={1}
      borderColor="$border"
    >
      <Skeleton width={80} height={80} borderRadius={8} />
      <YStack flex={1} gap="$2">
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={14} />
        <Skeleton width="40%" height={12} />
        <XStack gap="$2" marginTop="$2">
          <Skeleton width={60} height={24} borderRadius={12} />
          <Skeleton width={60} height={24} borderRadius={12} />
        </XStack>
      </YStack>
    </XStack>
  );
}

export function HeaderSkeleton() {
  return (
    <YStack gap="$3" padding="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Skeleton width={120} height={20} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </XStack>
      <Skeleton width="100%" height={48} borderRadius={12} />
    </YStack>
  );
}

export default Skeleton;
