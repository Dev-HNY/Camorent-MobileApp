/**
 * Custom Animation Hooks
 * Reusable hooks for common animation patterns
 */

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { SPRING_CONFIG, DURATION, EASING, SCALE, OPACITY } from './constants';

/**
 * Hook for entrance fade-in animation
 */
export function useFadeIn(delay: number = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withSpring(1, SPRING_CONFIG.smooth);
      translateY.value = withSpring(0, SPRING_CONFIG.smooth);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, opacity, translateY };
}

/**
 * Hook for scale on press animation
 */
export function usePressAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(SCALE.pressed, SPRING_CONFIG.snappy);
    opacity.value = withTiming(OPACITY.pressed, { duration: DURATION.fast });
  }, []);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(SCALE.normal, SPRING_CONFIG.bouncy);
    opacity.value = withTiming(OPACITY.visible, { duration: DURATION.fast });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut };
}

/**
 * Hook for parallax scroll effect
 */
export function useParallaxScroll(
  scrollY: SharedValue<number>,
  imageHeight: number = 300
) {
  const animatedImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-imageHeight, 0, imageHeight],
      [-imageHeight / 2, 0, imageHeight / 3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-imageHeight, 0],
      [2, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, imageHeight / 2],
      [1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return { animatedImageStyle };
}

/**
 * Hook for sticky header animation on scroll
 */
export function useStickyHeader(
  scrollY: SharedValue<number>,
  threshold: number = 100
) {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [threshold - 50, threshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [threshold - 50, threshold],
      [-20, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, threshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    };
  });

  return { animatedHeaderStyle, animatedBackgroundStyle };
}

/**
 * Hook for shake animation (errors)
 */
export function useShakeAnimation() {
  const translateX = useSharedValue(0);

  const shake = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { shake, animatedStyle };
}

/**
 * Hook for pulse animation (attention)
 */
export function usePulseAnimation(active: boolean = true) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withSpring(1.05, SPRING_CONFIG.gentle),
        withSpring(1, SPRING_CONFIG.gentle)
      );
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle };
}

/**
 * Hook for staggered list animation
 */
export function useStaggeredAnimation(
  itemCount: number,
  staggerDelay: number = DURATION.stagger
) {
  const createItemAnimation = useCallback(
    (index: number) => {
      const opacity = useSharedValue(0);
      const translateY = useSharedValue(30);

      useEffect(() => {
        const delay = index * staggerDelay;
        const timeout = setTimeout(() => {
          opacity.value = withSpring(1, SPRING_CONFIG.smooth);
          translateY.value = withSpring(0, SPRING_CONFIG.smooth);
        }, delay);

        return () => clearTimeout(timeout);
      }, [index]);

      const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
      }));

      return animatedStyle;
    },
    [staggerDelay]
  );

  return { createItemAnimation };
}

/**
 * Hook for bottom sheet animation
 */
export function useBottomSheetAnimation(isOpen: boolean) {
  const translateY = useSharedValue(500);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      backdropOpacity.value = withTiming(1, { duration: DURATION.normal });
      translateY.value = withSpring(0, SPRING_CONFIG.smooth);
    } else {
      backdropOpacity.value = withTiming(0, { duration: DURATION.fast });
      translateY.value = withSpring(500, SPRING_CONFIG.default);
    }
  }, [isOpen]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { sheetStyle, backdropStyle };
}

/**
 * Hook for card flip animation
 */
export function useCardFlip() {
  const rotateY = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const flip = useCallback(() => {
    const toValue = isFlipped.value ? 0 : 180;
    rotateY.value = withSpring(toValue, SPRING_CONFIG.smooth);
    isFlipped.value = !isFlipped.value;
  }, []);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value + 180}deg` }],
    backfaceVisibility: 'hidden',
  }));

  return { flip, frontStyle, backStyle };
}

/**
 * Hook for counter animation
 */
export function useCounterAnimation(value: number) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, SPRING_CONFIG.snappy),
      withSpring(1, SPRING_CONFIG.bouncy)
    );
    translateY.value = withSequence(
      withSpring(-5, SPRING_CONFIG.snappy),
      withSpring(0, SPRING_CONFIG.bouncy)
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return { animatedStyle };
}
