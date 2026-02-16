/**
 * AnimatedStickyHeader - Sticky header with blur effect on scroll
 * Inspired by Apple's iOS header behavior
 */

import React, { ReactNode } from 'react';
import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { hp, wp, fp } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedStickyHeaderProps {
  scrollY: SharedValue<number>;
  title?: string;
  threshold?: number;
  children?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showBorder?: boolean;
  backgroundColor?: string;
  blurIntensity?: number;
}

export function AnimatedStickyHeader({
  scrollY,
  title,
  threshold = 100,
  children,
  leftContent,
  rightContent,
  showBorder = true,
  backgroundColor = '#FFFFFF',
  blurIntensity = 60,
}: AnimatedStickyHeaderProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = hp(56);

  // Title fade in animation
  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [threshold - 30, threshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [threshold - 30, threshold],
      [10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Background blur/opacity animation
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, threshold * 0.7],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Border animation
  const animatedBorderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [threshold - 20, threshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Shadow animation
  const animatedShadowStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      scrollY.value,
      [threshold, threshold + 50],
      [0, 0.1],
      Extrapolation.CLAMP
    );

    return {
      shadowOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { height: headerHeight + insets.top, paddingTop: insets.top },
        animatedShadowStyle,
      ]}
    >
      {/* Blur Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          animatedBackgroundStyle,
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={blurIntensity}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: `${backgroundColor}F5` },
            ]}
          />
        )}
      </Animated.View>

      {/* Header Content */}
      <Animated.View style={styles.headerContent}>
        {/* Left Content */}
        <Animated.View style={styles.leftContainer}>
          {leftContent}
        </Animated.View>

        {/* Center Title */}
        <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
          {title ? (
            <Animated.Text style={styles.title} numberOfLines={1}>
              {title}
            </Animated.Text>
          ) : (
            children
          )}
        </Animated.View>

        {/* Right Content */}
        <Animated.View style={styles.rightContainer}>
          {rightContent}
        </Animated.View>
      </Animated.View>

      {/* Bottom Border */}
      {showBorder && (
        <Animated.View style={[styles.border, animatedBorderStyle]} />
      )}
    </Animated.View>
  );
}

/**
 * CollapsibleHeader - Header that shrinks on scroll
 */
interface CollapsibleHeaderProps {
  scrollY: SharedValue<number>;
  expandedHeight?: number;
  collapsedHeight?: number;
  expandedContent: ReactNode;
  collapsedContent?: ReactNode;
}

export function CollapsibleHeader({
  scrollY,
  expandedHeight = 200,
  collapsedHeight = 60,
  expandedContent,
  collapsedContent,
}: CollapsibleHeaderProps) {
  const insets = useSafeAreaInsets();
  const scrollDistance = expandedHeight - collapsedHeight;

  const animatedContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [expandedHeight + insets.top, collapsedHeight + insets.top],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  });

  const animatedExpandedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const animatedCollapsedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [scrollDistance * 0.5, scrollDistance],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.collapsibleContainer, animatedContainerStyle]}>
      <Animated.View style={[styles.expandedContent, animatedExpandedStyle]}>
        {expandedContent}
      </Animated.View>
      {collapsedContent && (
        <Animated.View style={[styles.collapsedContent, animatedCollapsedStyle]}>
          {collapsedContent}
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * LargeTitle - iOS-style large title that collapses
 */
interface LargeTitleProps {
  scrollY: SharedValue<number>;
  title: string;
  subtitle?: string;
}

export function LargeTitle({ scrollY, title, subtitle }: LargeTitleProps) {
  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 100],
      [32, 18],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      fontSize,
      transform: [{ translateY }],
    };
  });

  const animatedSubtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -10],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={styles.largeTitleContainer}>
      <Animated.Text style={[styles.largeTitle, animatedTitleStyle]}>
        {title}
      </Animated.Text>
      {subtitle && (
        <Animated.Text style={[styles.subtitle, animatedSubtitleStyle]}>
          {subtitle}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
  },
  leftContainer: {
    width: wp(60),
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: wp(60),
    alignItems: 'flex-end',
  },
  title: {
    fontSize: fp(17),
    fontWeight: '600',
    color: '#121217',
    letterSpacing: -0.3,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: '#E5E5E5',
  },
  collapsibleContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  expandedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  collapsedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  largeTitleContainer: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
  },
  largeTitle: {
    fontWeight: '700',
    color: '#121217',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fp(15),
    color: '#6C6C89',
    marginTop: hp(4),
  },
});
