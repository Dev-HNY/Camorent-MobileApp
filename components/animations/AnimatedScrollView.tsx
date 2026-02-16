/**
 * AnimatedScrollView - Premium scroll view with parallax and sticky header support
 * Provides smooth 60fps animations on the UI thread
 */

import React, { ReactNode, useCallback, forwardRef } from 'react';
import { StyleProp, ViewStyle, LayoutChangeEvent, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { SPRING_CONFIG } from './constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedScrollViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onScroll?: (scrollY: number) => void;
  scrollY?: SharedValue<number>;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  scrollEventThrottle?: number;
}

export const AnimatedScrollView = forwardRef<
  Animated.ScrollView,
  AnimatedScrollViewProps
>(
  (
    {
      children,
      style,
      contentContainerStyle,
      onScroll,
      scrollY: externalScrollY,
      showsVerticalScrollIndicator = false,
      bounces = true,
      scrollEventThrottle = 16,
    },
    ref
  ) => {
    const internalScrollY = useSharedValue(0);
    const scrollY = externalScrollY || internalScrollY;

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
    });

    return (
      <Animated.ScrollView
        ref={ref}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onScroll={scrollHandler}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={bounces}
      >
        {children}
      </Animated.ScrollView>
    );
  }
);

AnimatedScrollView.displayName = 'AnimatedScrollView';

/**
 * ParallaxHeader - Hero image with parallax scroll effect
 */
interface ParallaxHeaderProps {
  scrollY: SharedValue<number>;
  imageUri: string;
  height?: number;
  children?: ReactNode;
  overlayGradient?: boolean;
}

export function ParallaxHeader({
  scrollY,
  imageUri,
  height = 300,
  children,
  overlayGradient = true,
}: ParallaxHeaderProps) {
  const animatedImageStyle = useAnimatedStyle(() => {
    // Parallax effect - image moves slower than scroll
    const translateY = interpolate(
      scrollY.value,
      [-height, 0, height],
      [-height / 2, 0, height * 0.3],
      Extrapolation.CLAMP
    );

    // Scale up when pulling down (overscroll)
    const scale = interpolate(
      scrollY.value,
      [-height, 0],
      [1.5, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    // Fade in gradient overlay as user scrolls up
    const opacity = interpolate(
      scrollY.value,
      [0, height * 0.5],
      [0.3, 0.7],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={{
        height,
        width: SCREEN_WIDTH,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Animated.Image
        source={{ uri: imageUri }}
        style={[
          {
            width: SCREEN_WIDTH,
            height: height * 1.3,
            position: 'absolute',
            top: 0,
          },
          animatedImageStyle,
        ]}
        resizeMode="cover"
      />
      {overlayGradient && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            animatedOverlayStyle,
          ]}
        />
      )}
      {children && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}
        >
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * useScrollY - Hook to create and share scroll value
 */
export function useScrollY() {
  const scrollY = useSharedValue(0);
  return scrollY;
}

/**
 * ScrollProgressBar - Shows scroll progress at the top
 */
interface ScrollProgressBarProps {
  scrollY: SharedValue<number>;
  contentHeight: number;
  containerHeight: number;
}

export function ScrollProgressBar({
  scrollY,
  contentHeight,
  containerHeight,
}: ScrollProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const maxScroll = contentHeight - containerHeight;
    const progress = interpolate(
      scrollY.value,
      [0, maxScroll],
      [0, SCREEN_WIDTH],
      Extrapolation.CLAMP
    );

    return {
      width: progress,
    };
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 3,
        backgroundColor: '#8E0FFF',
        borderRadius: 1.5,
        zIndex: 100,
      }}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: '#8E0FFF',
            borderRadius: 1.5,
          },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
}

/**
 * PullToRefresh indicator animation style
 */
export function usePullToRefreshAnimation(scrollY: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollY.value,
      [-100, -50, 0],
      [360, 180, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-100, -50, 0],
      [1, 0.8, 0],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [-80, -40, 0],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
      opacity,
    };
  });

  return animatedStyle;
}
