import React from 'react';
import { ScrollView, ScrollViewProps, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface ParallaxScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
  headerHeight?: number;
  parallaxFactor?: number;
  fadeHeader?: boolean;
  scaleHeader?: boolean;
}

export function ParallaxScrollView({
  children,
  headerComponent,
  headerHeight = 300,
  parallaxFactor = 0.5,
  fadeHeader = true,
  scaleHeader = false,
  ...scrollViewProps
}: ParallaxScrollViewProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight * parallaxFactor],
      Extrapolation.CLAMP
    );

    const opacity = fadeHeader
      ? interpolate(
          scrollY.value,
          [0, headerHeight * 0.5, headerHeight],
          [1, 0.7, 0],
          Extrapolation.CLAMP
        )
      : 1;

    const scale = scaleHeader
      ? interpolate(
          scrollY.value,
          [-headerHeight, 0, headerHeight],
          [1.5, 1, 0.9],
          Extrapolation.CLAMP
        )
      : 1;

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [headerHeight * 0.7, headerHeight],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [headerHeight * 0.7, headerHeight],
      [-20, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <AnimatedScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      {...scrollViewProps}
    >
      {headerComponent && (
        <Animated.View
          style={[
            {
              height: headerHeight,
              overflow: 'hidden',
            },
            headerAnimatedStyle,
          ]}
        >
          {headerComponent}
        </Animated.View>
      )}
      {children}
    </AnimatedScrollView>
  );
}

export default ParallaxScrollView;
