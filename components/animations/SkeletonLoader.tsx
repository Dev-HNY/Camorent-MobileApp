/**
 * SkeletonLoader - Shimmer loading animations
 * Provides smooth, professional loading states like Airbnb
 */

import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, StyleProp, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { hp, wp } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Skeleton - Basic shimmer loading placeholder
 */
export function Skeleton({
  width = '100%',
  height = hp(20),
  borderRadius = wp(8),
  style,
}: SkeletonProps) {
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerPosition.value,
      [-1, 1],
      [-SCREEN_WIDTH, SCREEN_WIDTH]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: (typeof width === 'number' ? wp(width) : width) as any,
          height,
          borderRadius,
          backgroundColor: '#EBEBEF',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFillObject, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * SkeletonText - Text placeholder with multiple lines
 */
interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: string;
  spacing?: number;
}

export function SkeletonText({
  lines = 3,
  lineHeight = hp(14),
  lastLineWidth = '60%',
  spacing = hp(8),
}: SkeletonTextProps) {
  return (
    <Animated.View style={{ gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          borderRadius={wp(4)}
        />
      ))}
    </Animated.View>
  );
}

/**
 * SkeletonCircle - Circular placeholder (avatars, icons)
 */
interface SkeletonCircleProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonCircle({ size = 48, style }: SkeletonCircleProps) {
  return (
    <Skeleton
      width={size}
      height={hp(size)}
      borderRadius={size / 2}
      style={style}
    />
  );
}

/**
 * SkeletonCard - Card placeholder
 */
interface SkeletonCardProps {
  style?: StyleProp<ViewStyle>;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  return (
    <Animated.View style={[styles.card, style]}>
      <Skeleton width="100%" height={hp(150)} borderRadius={wp(12)} />
      <Animated.View style={styles.cardContent}>
        <Skeleton width="70%" height={hp(16)} borderRadius={wp(4)} />
        <Skeleton width="50%" height={hp(12)} borderRadius={wp(4)} />
        <Skeleton width="30%" height={hp(14)} borderRadius={wp(4)} />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * SkeletonProductCard - Product card loading state
 */
export function SkeletonProductCard() {
  return (
    <Animated.View style={styles.productCard}>
      <Skeleton width="100%" height={hp(180)} borderRadius={wp(16)} />
      <Animated.View style={styles.productCardContent}>
        <Skeleton width="80%" height={hp(16)} borderRadius={wp(4)} />
        <Skeleton width="50%" height={hp(14)} borderRadius={wp(4)} />
        <Animated.View style={styles.priceRow}>
          <Skeleton width={wp(60)} height={hp(20)} borderRadius={wp(4)} />
          <Skeleton width={wp(40)} height={hp(14)} borderRadius={wp(4)} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

/**
 * SkeletonProductDetails - Product details page loading state
 */
export function SkeletonProductDetails() {
  return (
    <Animated.View style={styles.productDetails}>
      {/* Hero Image */}
      <Skeleton width="100%" height={hp(300)} borderRadius={0} />

      {/* Thumbnail row */}
      <Animated.View style={styles.thumbnailRow}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width={wp(70)} height={hp(70)} borderRadius={wp(12)} />
        ))}
      </Animated.View>

      <Animated.View style={styles.detailsContent}>
        {/* Title & Price */}
        <Skeleton width="60%" height={hp(24)} borderRadius={wp(4)} />
        <Animated.View style={styles.priceSection}>
          <Skeleton width={wp(80)} height={hp(28)} borderRadius={wp(4)} />
          <Skeleton width={wp(60)} height={hp(24)} borderRadius={wp(16)} />
        </Animated.View>

        {/* Features */}
        <Animated.View style={styles.featuresRow}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={wp(85)} height={hp(85)} borderRadius={wp(12)} />
          ))}
        </Animated.View>

        {/* Description */}
        <SkeletonText lines={4} />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * SkeletonOrderDetails - Order details page loading state
 */
export function SkeletonOrderDetails() {
  return (
    <Animated.View style={styles.orderDetails}>
      {/* Status Card */}
      <Skeleton width="100%" height={hp(120)} borderRadius={wp(14)} />

      {/* Items Card */}
      <Animated.View style={styles.orderItemsCard}>
        <Animated.View style={styles.orderItemsHeader}>
          <Skeleton width={wp(80)} height={hp(20)} borderRadius={wp(4)} />
          <Skeleton width={wp(100)} height={hp(16)} borderRadius={wp(4)} />
        </Animated.View>

        {/* Order Items */}
        {[1, 2].map((i) => (
          <Animated.View key={i} style={styles.orderItem}>
            <SkeletonCircle size={60} />
            <Animated.View style={styles.orderItemContent}>
              <Skeleton width="70%" height={hp(16)} borderRadius={wp(4)} />
              <Skeleton width="40%" height={hp(12)} borderRadius={wp(4)} />
              <Skeleton width="30%" height={hp(14)} borderRadius={wp(4)} />
            </Animated.View>
          </Animated.View>
        ))}

        {/* Total */}
        <Animated.View style={styles.orderTotal}>
          <Skeleton width={wp(80)} height={hp(18)} borderRadius={wp(4)} />
          <Skeleton width={wp(100)} height={hp(24)} borderRadius={wp(4)} />
        </Animated.View>
      </Animated.View>

      {/* Help Card */}
      <Skeleton width="100%" height={hp(60)} borderRadius={wp(10)} />
    </Animated.View>
  );
}

/**
 * SkeletonListItem - List item placeholder
 */
export function SkeletonListItem() {
  return (
    <Animated.View style={styles.listItem}>
      <SkeletonCircle size={48} />
      <Animated.View style={styles.listItemContent}>
        <Skeleton width="70%" height={hp(16)} borderRadius={wp(4)} />
        <Skeleton width="50%" height={hp(12)} borderRadius={wp(4)} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: wp(16),
    overflow: 'hidden',
  },
  cardContent: {
    padding: wp(12),
    gap: hp(8),
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: wp(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEBEF',
  },
  productCardContent: {
    padding: wp(12),
    gap: hp(8),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(4),
  },
  productDetails: {
    flex: 1,
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(16),
    gap: wp(8),
  },
  detailsContent: {
    padding: wp(16),
    gap: hp(16),
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetails: {
    padding: wp(16),
    gap: hp(16),
  },
  orderItemsCard: {
    backgroundColor: '#FFF',
    borderRadius: wp(14),
    padding: wp(14),
    borderWidth: 1,
    borderColor: 'rgba(142, 15, 255, 0.08)',
  },
  orderItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
    paddingVertical: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEF',
  },
  orderItemContent: {
    flex: 1,
    gap: hp(6),
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(16),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(12),
    gap: wp(12),
  },
  listItemContent: {
    flex: 1,
    gap: hp(6),
  },
});
