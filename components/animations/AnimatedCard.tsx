/**
 * AnimatedCard - Premium card component with press animations
 * Provides smooth scale/shadow/translate effects on press
 */

import React, { ReactNode, useCallback } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIG, DURATION, SCALE } from './constants';
import { hp, wp } from '@/utils/responsive';

interface AnimatedCardProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hapticFeedback?: boolean;
  elevation?: number;
  borderRadius?: number;
  backgroundColor?: string;
  gradientColors?: string[];
  shadowColor?: string;
}

export function AnimatedCard({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
  hapticFeedback = true,
  elevation = 4,
  borderRadius = wp(16),
  backgroundColor = '#FFFFFF',
  gradientColors,
  shadowColor = '#8E0FFF',
}: AnimatedCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.08);
  const isPressed = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    if (hapticFeedback && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [hapticFeedback, disabled]);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [disabled, onPress]);

  const handleLongPress = useCallback(() => {
    if (!disabled && onLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress();
    }
  }, [disabled, onLongPress]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
      scale.value = withSpring(0.98, SPRING_CONFIG.snappy);
      translateY.value = withSpring(2, SPRING_CONFIG.snappy);
      shadowOpacity.value = withTiming(0.04, { duration: DURATION.fast });
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
      scale.value = withSpring(1, SPRING_CONFIG.bouncy);
      translateY.value = withSpring(0, SPRING_CONFIG.bouncy);
      shadowOpacity.value = withTiming(0.08, { duration: DURATION.normal });
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      'worklet';
      runOnJS(handleLongPress)();
    });

  const composedGestures = onLongPress
    ? Gesture.Race(tapGesture, longPressGesture)
    : tapGesture;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    shadowOpacity: shadowOpacity.value,
    opacity: disabled ? 0.6 : 1,
  }));

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        {
          borderRadius,
          backgroundColor: gradientColors ? 'transparent' : backgroundColor,
          shadowColor,
          elevation: elevation,
        },
        style,
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (gradientColors) {
    return (
      <GestureDetector gesture={composedGestures}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.card,
              {
                borderRadius,
                shadowColor,
                elevation,
              },
              style,
            ]}
          >
            {children}
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    );
  }

  return <GestureDetector gesture={composedGestures}>{cardContent}</GestureDetector>;
}

/**
 * AnimatedProductCard - Specialized card for product listings
 */
interface AnimatedProductCardProps extends AnimatedCardProps {
  featured?: boolean;
}

export function AnimatedProductCard({
  children,
  onPress,
  style,
  disabled = false,
  featured = false,
  ...props
}: AnimatedProductCardProps) {
  return (
    <AnimatedCard
      onPress={onPress}
      disabled={disabled}
      borderRadius={wp(16)}
      shadowColor={featured ? '#8E0FFF' : '#000000'}
      elevation={featured ? 6 : 3}
      style={[
        styles.productCard,
        featured && styles.featuredCard,
        style,
      ]}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * AnimatedListCard - Card optimized for list items
 */
interface AnimatedListCardProps extends AnimatedCardProps {
  index?: number;
}

export function AnimatedListCard({
  children,
  onPress,
  style,
  index = 0,
  ...props
}: AnimatedListCardProps) {
  return (
    <AnimatedCard
      onPress={onPress}
      borderRadius={wp(12)}
      elevation={2}
      style={[styles.listCard, style]}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

/**
 * AnimatedActionCard - Card with action button styling
 */
interface AnimatedActionCardProps extends AnimatedCardProps {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedActionCard({
  children,
  onPress,
  style,
  variant = 'primary',
  ...props
}: AnimatedActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          gradientColors: ['#8E0FFF', '#6D00DA'] as string[],
          shadowColor: '#8E0FFF',
        };
      case 'secondary':
        return {
          backgroundColor: '#F5EEFF',
          shadowColor: '#8E0FFF',
        };
      case 'outline':
        return {
          backgroundColor: '#FFFFFF',
          shadowColor: '#000000',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedCard
      onPress={onPress}
      borderRadius={wp(12)}
      elevation={4}
      style={[
        styles.actionCard,
        variant === 'outline' && styles.outlineCard,
        style,
      ]}
      {...variantStyles}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: 'hidden',
  },
  productCard: {
    borderWidth: 1,
    borderColor: '#EBEBEF',
    backgroundColor: '#FFFFFF',
  },
  featuredCard: {
    borderColor: 'rgba(142, 15, 255, 0.2)',
    borderWidth: 1.5,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEF',
    padding: wp(12),
  },
  actionCard: {
    padding: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineCard: {
    borderWidth: 1.5,
    borderColor: 'rgba(142, 15, 255, 0.15)',
  },
});
