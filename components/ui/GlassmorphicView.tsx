import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { YStack, YStackProps } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export type GlassmorphicVariant = 'light' | 'dark' | 'primary' | 'subtle' | 'frosted';

interface GlassmorphicViewProps extends YStackProps {
  variant?: GlassmorphicVariant;
  intensity?: number;
  borderWidth?: number;
  children?: React.ReactNode;
  animated?: boolean;
}

const VARIANT_CONFIG = {
  light: {
    blurType: 'light' as const,
    overlayColors: ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.3)'],
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    blurType: 'dark' as const,
    overlayColors: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)'],
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  primary: {
    blurType: 'light' as const,
    overlayColors: ['rgba(142, 15, 255, 0.15)', 'rgba(109, 0, 218, 0.08)'],
    borderColor: 'rgba(142, 15, 255, 0.3)',
    shadowColor: 'rgba(142, 15, 255, 0.2)',
  },
  subtle: {
    blurType: 'extraLight' as const,
    overlayColors: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)'],
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
  },
  frosted: {
    blurType: 'regular' as const,
    overlayColors: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)'],
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
  },
};

export function GlassmorphicView({
  variant = 'light',
  intensity = 10,
  borderWidth = 1,
  children,
  animated = false,
  style,
  ...props
}: GlassmorphicViewProps) {
  const config = VARIANT_CONFIG[variant];

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) return {};
    return {
      opacity: withTiming(1, { duration: 400 }),
      transform: [
        {
          scale: withSpring(1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  }, [animated]);

  return (
    <YStack
      position="relative"
      overflow="hidden"
      {...props}
      style={[
        {
          borderWidth,
          borderColor: config.borderColor,
          shadowColor: config.shadowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 24,
          elevation: 8,
        },
        style,
      ]}
    >
      <AnimatedBlurView
        style={[StyleSheet.absoluteFill, animatedStyle]}
        blurType={config.blurType}
        blurAmount={intensity}
        reducedTransparencyFallbackColor="white"
      />

      <LinearGradient
        colors={config.overlayColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <YStack position="relative" zIndex={1}>
        {children}
      </YStack>
    </YStack>
  );
}

export default GlassmorphicView;
