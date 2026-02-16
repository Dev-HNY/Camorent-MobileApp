/**
 * AnimatedFadeIn - Smooth entrance animation component
 * Provides consistent fade + slide animations throughout the app
 */

import React, { ReactNode, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  Layout,
} from 'react-native-reanimated';
import { SPRING_CONFIG, DURATION, DISTANCE } from './constants';

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none';
type AnimationType = 'fade' | 'slide' | 'zoom' | 'spring';

interface AnimatedFadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: AnimationDirection;
  distance?: number;
  style?: StyleProp<ViewStyle>;
  type?: AnimationType;
}

export function AnimatedFadeIn({
  children,
  delay = 0,
  duration = DURATION.entrance,
  direction = 'up',
  distance = DISTANCE.medium,
  style,
  type = 'spring',
}: AnimatedFadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  const translateX = useSharedValue(direction === 'left' ? distance : direction === 'right' ? -distance : 0);
  const scale = useSharedValue(type === 'zoom' ? 0.9 : 1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (type === 'spring') {
        opacity.value = withSpring(1, SPRING_CONFIG.smooth);
        translateY.value = withSpring(0, SPRING_CONFIG.smooth);
        translateX.value = withSpring(0, SPRING_CONFIG.smooth);
        scale.value = withSpring(1, SPRING_CONFIG.smooth);
      } else {
        opacity.value = withTiming(1, { duration });
        translateY.value = withTiming(0, { duration });
        translateX.value = withTiming(0, { duration });
        scale.value = withTiming(1, { duration });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, duration, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * Pre-built entering/exiting animations using Reanimated's layout animations
 */
export const ENTERING_ANIMATIONS = {
  fadeInUp: FadeInDown.springify().damping(18).stiffness(250),
  fadeInDown: FadeInUp.springify().damping(18).stiffness(250),
  fadeInLeft: FadeInRight.springify().damping(18).stiffness(250),
  fadeInRight: FadeInLeft.springify().damping(18).stiffness(250),
  fadeIn: FadeIn.duration(DURATION.normal),
  slideInUp: SlideInDown.springify().damping(18).stiffness(250),
  slideInDown: SlideInUp.springify().damping(18).stiffness(250),
  zoomIn: ZoomIn.springify().damping(15).stiffness(200),
} as const;

export const EXITING_ANIMATIONS = {
  fadeOutDown: FadeOutDown.duration(DURATION.exit),
  fadeOutUp: FadeOutUp.duration(DURATION.exit),
  fadeOut: FadeOut.duration(DURATION.exit),
  slideOutDown: SlideOutDown.duration(DURATION.exit),
  slideOutUp: SlideOutUp.duration(DURATION.exit),
  zoomOut: ZoomOut.duration(DURATION.exit),
} as const;

/**
 * AnimatedLayoutItem - For items in lists with layout animations
 */
interface AnimatedLayoutItemProps {
  children: ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedLayoutItem({
  children,
  index = 0,
  style,
}: AnimatedLayoutItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * DURATION.stagger)
        .springify()
        .damping(18)
        .stiffness(250)}
      exiting={FadeOutDown.duration(DURATION.exit)}
      layout={Layout.springify().damping(18).stiffness(250)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/**
 * AnimatedPresence - Wrapper for conditional rendering with animations
 */
interface AnimatedPresenceProps {
  children: ReactNode;
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  enterFrom?: AnimationDirection;
  exitTo?: AnimationDirection;
}

export function AnimatedPresence({
  children,
  visible,
  style,
  enterFrom = 'down',
  exitTo = 'down',
}: AnimatedPresenceProps) {
  if (!visible) return null;

  const getEntering = () => {
    switch (enterFrom) {
      case 'up':
        return ENTERING_ANIMATIONS.fadeInDown;
      case 'down':
        return ENTERING_ANIMATIONS.fadeInUp;
      case 'left':
        return ENTERING_ANIMATIONS.fadeInRight;
      case 'right':
        return ENTERING_ANIMATIONS.fadeInLeft;
      default:
        return ENTERING_ANIMATIONS.fadeIn;
    }
  };

  const getExiting = () => {
    switch (exitTo) {
      case 'up':
        return EXITING_ANIMATIONS.fadeOutUp;
      case 'down':
        return EXITING_ANIMATIONS.fadeOutDown;
      default:
        return EXITING_ANIMATIONS.fadeOut;
    }
  };

  return (
    <Animated.View entering={getEntering()} exiting={getExiting()} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * AnimatedCounter - Number animation for counters
 */
interface AnimatedCounterProps {
  value: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: object;
}

export function AnimatedCounter({
  value,
  style,
  textStyle,
}: AnimatedCounterProps) {
  return (
    <Animated.View
      key={value}
      entering={SlideInUp.springify().damping(15).stiffness(200)}
      exiting={SlideOutUp.duration(150)}
      style={style}
    >
      <Animated.Text style={textStyle}>{value}</Animated.Text>
    </Animated.View>
  );
}
