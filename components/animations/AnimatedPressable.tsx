/**
 * AnimatedPressable - Premium press effect component
 * Provides smooth scale/opacity animation on press like Apple apps
 */

import React, { useCallback, ReactNode } from 'react';
import { StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIG, DURATION, SCALE, OPACITY } from './constants';

interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  hapticFeedback?: boolean;
  activeOpacity?: number;
}

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  scaleValue = SCALE.pressed,
  hapticFeedback = true,
  activeOpacity = OPACITY.pressed,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
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
      scale.value = withSpring(scaleValue, SPRING_CONFIG.snappy);
      opacity.value = withTiming(activeOpacity, { duration: DURATION.instant });
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
      scale.value = withSpring(1, SPRING_CONFIG.bouncy);
      opacity.value = withTiming(1, { duration: DURATION.fast });
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
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}

/**
 * AnimatedCardPressable - Card-specific press effect with shadow animation
 */
interface AnimatedCardPressableProps extends AnimatedPressableProps {
  elevation?: number;
}

export function AnimatedCardPressable({
  children,
  onPress,
  disabled = false,
  style,
  elevation = 4,
  hapticFeedback = true,
}: AnimatedCardPressableProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);
  const translateY = useSharedValue(0);

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

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.98, SPRING_CONFIG.snappy);
      shadowOpacity.value = withTiming(0.05, { duration: DURATION.fast });
      translateY.value = withSpring(2, SPRING_CONFIG.snappy);
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_CONFIG.bouncy);
      shadowOpacity.value = withTiming(0.1, { duration: DURATION.normal });
      translateY.value = withSpring(0, SPRING_CONFIG.bouncy);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    shadowOpacity: shadowOpacity.value,
    shadowColor: '#8E0FFF',
    shadowOffset: { width: 0, height: elevation },
    shadowRadius: elevation * 2,
    elevation: elevation,
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
