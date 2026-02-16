import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SpringPressableProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  scaleInValue?: number;
  enableHaptics?: boolean;
  hapticStyle?: 'light' | 'medium' | 'heavy';
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  style?: any;
}

export function SpringPressable({
  children,
  scaleInValue = 0.96,
  enableHaptics = true,
  hapticStyle = 'medium',
  springConfig = { damping: 15, stiffness: 400, mass: 0.8 },
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...props
}: SpringPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (event: any) => {
    scale.value = withSpring(scaleInValue, springConfig);
    if (enableHaptics) {
      const hapticType =
        hapticStyle === 'light'
          ? Haptics.ImpactFeedbackStyle.Light
          : hapticStyle === 'heavy'
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Medium;
      Haptics.impactAsync(hapticType);
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    scale.value = withSpring(1, springConfig);
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

interface BounceButtonProps extends SpringPressableProps {
  bounceScale?: number;
}

export function BounceButton({
  children,
  bounceScale = 1.05,
  onPress,
  ...props
}: BounceButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (event: any) => {
    scale.value = withSequence(
      withSpring(bounceScale, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    if (props.enableHaptics !== false) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(event);
  };

  return (
    <AnimatedPressable onPress={handlePress} style={[animatedStyle, props.style]} {...props}>
      {children}
    </AnimatedPressable>
  );
}

interface ShakeViewProps {
  children: React.ReactNode;
  trigger: boolean;
  style?: any;
}

export function ShakeView({ children, trigger, style }: ShakeViewProps) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

interface PulseViewProps {
  children: React.ReactNode;
  isActive: boolean;
  pulseScale?: number;
  duration?: number;
  style?: any;
}

export function PulseView({
  children,
  isActive,
  pulseScale = 1.05,
  duration = 1000,
  style,
}: PulseViewProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isActive) {
      scale.value = withSequence(
        withTiming(pulseScale, { duration: duration / 2, easing: Easing.ease }),
        withTiming(1, { duration: duration / 2, easing: Easing.ease })
      );
    }
  }, [isActive, pulseScale, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

interface FloatingActionButtonProps extends SpringPressableProps {
  floatDistance?: number;
}

export function FloatingActionButton({
  children,
  floatDistance = 5,
  style,
  ...props
}: FloatingActionButtonProps) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSequence(
      withTiming(-floatDistance, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    );
  }, [floatDistance]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SpringPressable {...props} style={[animatedStyle, style]}>
      {children}
    </SpringPressable>
  );
}

export default {
  SpringPressable,
  BounceButton,
  ShakeView,
  PulseView,
  FloatingActionButton,
};
