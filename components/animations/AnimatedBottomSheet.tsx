/**
 * AnimatedBottomSheet - Premium gesture-driven bottom sheet
 * Smooth, spring-based animations with drag-to-dismiss
 */

import React, { useCallback, useEffect, ReactNode } from 'react';
import {
  StyleSheet,
  Dimensions,
  Pressable,
  BackHandler,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIG, DURATION } from './constants';
import { hp, wp } from '@/utils/responsive';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  initialSnapIndex?: number;
  enablePanDownToClose?: boolean;
  enableBackdropDismiss?: boolean;
  backdropOpacity?: number;
  handleComponent?: ReactNode;
  containerStyle?: object;
}

export function AnimatedBottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5],
  initialSnapIndex = 0,
  enablePanDownToClose = true,
  enableBackdropDismiss = true,
  backdropOpacity = 0.5,
  handleComponent,
  containerStyle,
}: AnimatedBottomSheetProps) {
  const insets = useSafeAreaInsets();

  // Convert snap points to actual heights
  const snapPointHeights = snapPoints.map((point) =>
    point <= 1 ? SCREEN_HEIGHT * point : point
  );
  const maxHeight = Math.max(...snapPointHeights);
  const initialHeight = snapPointHeights[initialSnapIndex];

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacityValue = useSharedValue(0);
  const currentSnapIndex = useSharedValue(initialSnapIndex);
  const context = useSharedValue({ y: 0 });

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(
        SCREEN_HEIGHT - initialHeight,
        SPRING_CONFIG.smooth
      );
      backdropOpacityValue.value = withTiming(backdropOpacity, {
        duration: DURATION.normal,
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG.default);
      backdropOpacityValue.value = withTiming(0, { duration: DURATION.fast });
    }
  }, [isOpen, initialHeight, backdropOpacity]);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android' && isOpen) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onClose();
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, [isOpen, onClose]);

  const closeSheet = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  // Pan gesture for dragging
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newTranslateY = context.value.y + event.translationY;

      // Clamp to prevent over-pulling
      if (newTranslateY >= SCREEN_HEIGHT - maxHeight) {
        translateY.value = newTranslateY;
      }

      // Update backdrop opacity based on position
      const progress = interpolate(
        newTranslateY,
        [SCREEN_HEIGHT - maxHeight, SCREEN_HEIGHT],
        [backdropOpacity, 0],
        Extrapolation.CLAMP
      );
      backdropOpacityValue.value = progress;
    })
    .onEnd((event) => {
      // Determine if we should close or snap
      const currentY = translateY.value;
      const velocity = event.velocityY;

      // Fast downward swipe - close
      if (enablePanDownToClose && velocity > 500) {
        runOnJS(closeSheet)();
        return;
      }

      // Fast upward swipe - snap to max
      if (velocity < -500 && snapPoints.length > 1) {
        translateY.value = withSpring(
          SCREEN_HEIGHT - maxHeight,
          SPRING_CONFIG.smooth
        );
        return;
      }

      // Find nearest snap point
      const distances = snapPointHeights.map((height) =>
        Math.abs(currentY - (SCREEN_HEIGHT - height))
      );
      const nearestIndex = distances.indexOf(Math.min(...distances));

      // If dragged more than halfway down from current snap, close
      if (
        enablePanDownToClose &&
        currentY > SCREEN_HEIGHT - snapPointHeights[0] / 2
      ) {
        runOnJS(closeSheet)();
        return;
      }

      // Snap to nearest point
      const targetHeight = snapPointHeights[nearestIndex];
      translateY.value = withSpring(
        SCREEN_HEIGHT - targetHeight,
        SPRING_CONFIG.smooth
      );
      currentSnapIndex.value = nearestIndex;

      // Update backdrop
      backdropOpacityValue.value = withTiming(backdropOpacity, {
        duration: DURATION.fast,
      });
    });

  // Animated styles
  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
    pointerEvents: backdropOpacityValue.value > 0 ? 'auto' : 'none',
  }));

  // Handle indicator animation
  const animatedHandleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - maxHeight - 20, SCREEN_HEIGHT - maxHeight],
      [1.2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scaleX: scale }],
    };
  });

  if (!isOpen && translateY.value >= SCREEN_HEIGHT) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={enableBackdropDismiss ? closeSheet : undefined}
            />
          </BlurView>
        ) : (
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
            onPress={enableBackdropDismiss ? closeSheet : undefined}
          />
        )}
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            { maxHeight: maxHeight + insets.bottom },
            containerStyle,
            animatedSheetStyle,
          ]}
        >
          {/* Handle */}
          {handleComponent || (
            <Animated.View style={[styles.handleContainer]}>
              <Animated.View style={[styles.handle, animatedHandleStyle]} />
            </Animated.View>
          )}

          {/* Content */}
          <Animated.ScrollView
            style={styles.contentContainer}
            contentContainerStyle={{ paddingBottom: insets.bottom + hp(16) }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

/**
 * useBottomSheet - Hook for controlling bottom sheet
 */
export function useBottomSheet() {
  const isOpen = useSharedValue(false);

  const open = useCallback(() => {
    isOpen.value = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const close = useCallback(() => {
    isOpen.value = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const toggle = useCallback(() => {
    isOpen.value = !isOpen.value;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return { isOpen, open, close, toggle };
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: hp(12),
    paddingBottom: hp(8),
  },
  handle: {
    width: wp(40),
    height: hp(4),
    backgroundColor: '#E5E5E5',
    borderRadius: wp(2),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(16),
  },
});
