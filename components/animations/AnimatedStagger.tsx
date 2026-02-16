/**
 * AnimatedStagger - Staggered animation container for lists
 * Creates beautiful cascading entrance animations like Airbnb
 */

import React, { ReactNode, Children, cloneElement, isValidElement, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  Layout,
} from 'react-native-reanimated';
import { SPRING_CONFIG, DURATION, DISTANCE } from './constants';

type StaggerDirection = 'up' | 'down' | 'left' | 'right';

interface AnimatedStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: StaggerDirection;
  style?: StyleProp<ViewStyle>;
}

/**
 * AnimatedStagger - Container that staggers children animations
 */
export function AnimatedStagger({
  children,
  staggerDelay = DURATION.stagger,
  initialDelay = 0,
  direction = 'up',
  style,
}: AnimatedStaggerProps) {
  const getEnteringAnimation = (index: number) => {
    const delay = initialDelay + index * staggerDelay;

    switch (direction) {
      case 'up':
        return FadeInDown.delay(delay).springify().damping(18).stiffness(250);
      case 'down':
        return FadeInUp.delay(delay).springify().damping(18).stiffness(250);
      case 'left':
        return FadeInRight.delay(delay).springify().damping(18).stiffness(250);
      case 'right':
        return FadeInLeft.delay(delay).springify().damping(18).stiffness(250);
      default:
        return FadeInDown.delay(delay).springify().damping(18).stiffness(250);
    }
  };

  return (
    <Animated.View style={style}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
          <Animated.View
            key={index}
            entering={getEnteringAnimation(index)}
            layout={Layout.springify().damping(18).stiffness(250)}
          >
            {child}
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

/**
 * StaggerItem - Individual item with controlled stagger animation
 */
interface StaggerItemProps {
  children: ReactNode;
  index: number;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: StaggerDirection;
  style?: StyleProp<ViewStyle>;
}

export function StaggerItem({
  children,
  index,
  staggerDelay = DURATION.stagger,
  initialDelay = 0,
  direction = 'up',
  style,
}: StaggerItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? DISTANCE.large : direction === 'down' ? -DISTANCE.large : 0);
  const translateX = useSharedValue(direction === 'left' ? DISTANCE.large : direction === 'right' ? -DISTANCE.large : 0);

  useEffect(() => {
    const delay = initialDelay + index * staggerDelay;

    const timeout = setTimeout(() => {
      opacity.value = withSpring(1, SPRING_CONFIG.smooth);
      translateY.value = withSpring(0, SPRING_CONFIG.smooth);
      translateX.value = withSpring(0, SPRING_CONFIG.smooth);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, staggerDelay, initialDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * StaggerGrid - For grid layouts with staggered animations
 */
interface StaggerGridProps {
  children: ReactNode;
  columns?: number;
  staggerDelay?: number;
  style?: StyleProp<ViewStyle>;
}

export function StaggerGrid({
  children,
  columns = 2,
  staggerDelay = DURATION.stagger,
  style,
}: StaggerGridProps) {
  const childArray = Children.toArray(children);

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        style,
      ]}
    >
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        // Calculate delay based on diagonal pattern for natural feel
        const row = Math.floor(index / columns);
        const col = index % columns;
        const diagonalIndex = row + col;
        const delay = diagonalIndex * staggerDelay;

        return (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(delay).springify().damping(18).stiffness(250)}
            style={{ width: `${100 / columns}%` }}
          >
            {child}
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

/**
 * StaggerList - Optimized for FlatList/ScrollView children
 */
interface StaggerListItemProps {
  children: ReactNode;
  index: number;
  visibleIndex?: number;
  style?: StyleProp<ViewStyle>;
}

export function StaggerListItem({
  children,
  index,
  visibleIndex = 0,
  style,
}: StaggerListItemProps) {
  // Only animate items that become visible
  const relativeIndex = index - visibleIndex;
  const shouldAnimate = relativeIndex >= 0 && relativeIndex < 10;
  const delay = shouldAnimate ? relativeIndex * DURATION.stagger : 0;

  return (
    <Animated.View
      entering={
        shouldAnimate
          ? FadeInDown.delay(delay).springify().damping(18).stiffness(250)
          : undefined
      }
      layout={Layout.springify().damping(18).stiffness(250)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/**
 * useStaggerAnimation - Hook for manual stagger control
 */
export function useStaggerAnimation(itemCount: number, staggerDelay: number = DURATION.stagger) {
  const animations = Array.from({ length: itemCount }, (_, index) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(DISTANCE.large);

    useEffect(() => {
      const timeout = setTimeout(() => {
        opacity.value = withSpring(1, SPRING_CONFIG.smooth);
        translateY.value = withSpring(0, SPRING_CONFIG.smooth);
      }, index * staggerDelay);

      return () => clearTimeout(timeout);
    }, [index]);

    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return style;
  });

  return animations;
}
