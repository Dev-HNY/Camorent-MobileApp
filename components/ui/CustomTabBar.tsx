import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Keyboard } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { BodyText } from './Typography';
import { HomeIcon, MyShootsIcon, ProfileIcon } from './TabIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_BAR_HEIGHT = 92;
const CURVE_DEPTH = 31.5; // How deep the curve goes

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedIndex = state.index;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  if (keyboardVisible) return null;

  const getIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case '(home)':
        return <HomeIcon focused={focused} />;
      case '(shoots)':
        return <MyShootsIcon focused={focused} />;
      case '(profile)':
        return <ProfileIcon focused={focused} />;
      default:
        return null;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case '(home)':
        return 'Home';
      case '(shoots)':
        return 'Shoots';
      case '(profile)':
        return 'Profile';
      default:
        return '';
    }
  };

  // Calculate the center X position for each tab
  const tabWidth = SCREEN_WIDTH / 3;
  const getCenterX = (index: number) => (index + 0.5) * tabWidth;

  // Generate curved path - from Figma: M39.0625 16C53.4507 28.9814 51.7347 47.5 73 47.5C92.6152 47.5 95.995 27.1823 105.883 16
  const generateCurvePath = (centerX: number, totalHeight: number) => {
    const leftStart = centerX - 33.9375;
    const leftCurve1X = centerX - 19.5493;
    const leftCurve2X = centerX - 21.2653;
    const leftCurveEnd = centerX;

    const rightCurveEnd = centerX + 19.6152;
    const rightCurve1X = centerX + 22.995;
    const rightEnd = centerX + 32.883;

    return `
      M${leftStart} 16
      C${leftCurve1X} 28.9814 ${leftCurve2X} ${CURVE_DEPTH + 16} ${leftCurveEnd} ${CURVE_DEPTH + 16}
      C${rightCurveEnd} ${CURVE_DEPTH + 16} ${rightCurve1X} 27.1823 ${rightEnd} 16
      H${SCREEN_WIDTH}
      V${totalHeight}
      H0
      V16
      H${leftStart}
      Z
    `.trim().replace(/\s+/g, ' ');
  };

  const totalHeight = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <View style={[styles.container, { height: totalHeight, paddingBottom: insets.bottom }]}>
      {/* SVG covers the full height including gesture nav area — solid white, no transparency */}
      <View style={styles.svgContainer}>
        <Svg
          width={SCREEN_WIDTH}
          height={totalHeight}
          viewBox={`0 0 ${SCREEN_WIDTH} ${totalHeight}`}
          style={StyleSheet.absoluteFill}
        >
          <Path
            d={generateCurvePath(getCenterX(focusedIndex), totalHeight)}
            fill="white"
            stroke="none"
          />
        </Svg>
      </View>

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarTestID as string | undefined}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
                {getIcon(route.name, isFocused)}
              </View>
              <BodyText
                fontWeight="500"
                color={isFocused ? '#6D00DA' : '#8E0FFF'}
                fontSize={12}
                style={styles.label}
              >
                {getLabel(route.name)}
              </BodyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerFocused: {
    marginTop: -20.5,
  },
  label: {
    marginTop: 4,
  },
});
