import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { GlassmorphicView, GlassmorphicVariant } from './GlassmorphicView';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassmorphicCardProps extends Omit<PressableProps, 'style'> {
  variant?: GlassmorphicVariant;
  intensity?: number;
  children: React.ReactNode;
  enableHaptics?: boolean;
  pressScale?: number;
  style?: any;
  contentContainerStyle?: any;
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 400,
  mass: 0.8,
};

export function GlassmorphicCard({
  variant = 'light',
  intensity = 10,
  children,
  enableHaptics = true,
  pressScale = 0.97,
  onPress,
  onPressIn,
  onPressOut,
  style,
  contentContainerStyle,
  ...props
}: GlassmorphicCardProps) {
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, pressScale]);

    return {
      transform: [{ scale: withSpring(scale, SPRING_CONFIG) }],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(pressed.value, [0, 1], [0.15, 0.05]);

    return {
      shadowOpacity: withTiming(shadowOpacity, { duration: 200 }),
    };
  });

  const handlePressIn = (event: any) => {
    pressed.value = 1;
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    pressed.value = 0;
    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, shadowAnimatedStyle, style]}
      {...props}
    >
      <GlassmorphicView
        variant={variant}
        intensity={intensity}
        animated
        style={contentContainerStyle}
      >
        {children}
      </GlassmorphicView>
    </AnimatedPressable>
  );
}

export default GlassmorphicCard;
