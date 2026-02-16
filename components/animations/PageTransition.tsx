import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  SlideInUp,
  SlideOutDown,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { YStack } from 'tamagui';

export type TransitionType =
  | 'fade'
  | 'slideRight'
  | 'slideLeft'
  | 'slideUp'
  | 'slideDown'
  | 'zoom'
  | 'scale'
  | 'spring'
  | 'elastic';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  style?: any;
}

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 1,
};

const ELASTIC_CONFIG = {
  damping: 10,
  stiffness: 100,
  mass: 0.5,
};

export function PageTransition({
  children,
  type = 'fade',
  duration = 400,
  delay = 0,
  style,
}: PageTransitionProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    if (type === 'spring') {
      opacity.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
      scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
    } else if (type === 'elastic') {
      opacity.value = withDelay(delay, withSpring(1, ELASTIC_CONFIG));
      scale.value = withDelay(delay, withSpring(1, ELASTIC_CONFIG));
      translateY.value = withDelay(delay, withSpring(0, ELASTIC_CONFIG));
    } else {
      opacity.value = withDelay(delay, withTiming(1, timingConfig));
      translateY.value = withDelay(delay, withTiming(0, timingConfig));
      translateX.value = withDelay(delay, withTiming(0, timingConfig));
      scale.value = withDelay(delay, withTiming(1, timingConfig));
    }
  }, [type, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseStyle = {
      opacity: opacity.value,
    };

    switch (type) {
      case 'slideUp':
      case 'slideDown':
        return {
          ...baseStyle,
          transform: [{ translateY: translateY.value }],
        };
      case 'slideRight':
      case 'slideLeft':
        return {
          ...baseStyle,
          transform: [{ translateX: translateX.value }],
        };
      case 'zoom':
      case 'scale':
      case 'spring':
      case 'elastic':
        return {
          ...baseStyle,
          transform: [{ scale: scale.value }],
        };
      default:
        return baseStyle;
    }
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

// Reusable entering/exiting animations for Stack screens
export const screenTransitions = {
  fadeIn: FadeIn.duration(300),
  fadeOut: FadeOut.duration(200),
  slideInRight: SlideInRight.duration(350).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  slideOutLeft: SlideOutLeft.duration(250).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  slideInLeft: SlideInLeft.duration(350).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  slideOutRight: SlideOutRight.duration(250).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  slideInUp: SlideInUp.duration(400).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  slideOutDown: SlideOutDown.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  zoomIn: ZoomIn.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
  zoomOut: ZoomOut.duration(200).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
};

export default PageTransition;
