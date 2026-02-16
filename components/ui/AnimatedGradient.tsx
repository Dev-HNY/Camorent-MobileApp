import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type GradientPreset =
  | 'purple'
  | 'aurora'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'fire'
  | 'twilight'
  | 'champagne';

interface AnimatedGradientProps {
  preset?: GradientPreset;
  colors?: string[];
  animationType?: 'shift' | 'pulse' | 'wave' | 'rotate';
  duration?: number;
  style?: any;
  children?: React.ReactNode;
}

const GRADIENT_PRESETS: Record<GradientPreset, string[]> = {
  purple: ['#8E0FFF', '#B197FC', '#6D00DA'],
  aurora: ['#00C9FF', '#92FE9D', '#00F260'],
  sunset: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77'],
  ocean: ['#2E3192', '#1BFFFF', '#0575E6'],
  forest: ['#134E5E', '#71B280', '#C9D991'],
  fire: ['#FF0844', '#FFB199', '#FF512F'],
  twilight: ['#2C3E50', '#BDC3C7', '#34495E'],
  champagne: ['#FFF3D6', '#E8D5B7', '#F5E6D3'],
};

export function AnimatedGradient({
  preset = 'purple',
  colors: customColors,
  animationType = 'shift',
  duration = 3000,
  style,
  children,
}: AnimatedGradientProps) {
  const progress = useSharedValue(0);
  const colors = customColors || GRADIENT_PRESETS[preset];

  useEffect(() => {
    if (animationType === 'pulse') {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          withTiming(0, { duration: duration / 2, easing: Easing.bezier(0.4, 0, 0.6, 1) })
        ),
        -1,
        false
      );
    } else if (animationType === 'shift') {
      progress.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false
      );
    } else if (animationType === 'wave') {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2, easing: Easing.bezier(0.65, 0, 0.35, 1) }),
          withTiming(0, { duration: duration / 2, easing: Easing.bezier(0.65, 0, 0.35, 1) })
        ),
        -1,
        true
      );
    }
  }, [animationType, duration]);

  const animatedProps = useAnimatedProps(() => {
    if (animationType === 'rotate') {
      // For rotate, we'll animate start and end points
      return {
        start: { x: 0, y: progress.value },
        end: { x: 1, y: 1 - progress.value },
      };
    }

    // For other animations, interpolate colors
    const animatedColors = colors.map((_, index) => {
      const nextIndex = (index + 1) % colors.length;
      return interpolateColor(
        progress.value,
        [0, 1],
        [colors[index], colors[nextIndex]]
      );
    });

    return {
      colors: animatedColors,
    };
  });

  return (
    <AnimatedLinearGradient
      // @ts-ignore - animatedProps typing issue
      animatedProps={animatedProps}
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </AnimatedLinearGradient>
  );
}

export default AnimatedGradient;
