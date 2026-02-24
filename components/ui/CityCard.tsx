import React, { useRef, useEffect } from "react";
import { YStack, Text } from "tamagui";
import { ImageBackground, StyleSheet, ImageSourcePropType, Animated, Pressable } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";

interface CityCardProps {
  name: string;
  image: ImageSourcePropType;
  isSelected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function CityCard({ name, image, isSelected, onPress, disabled }: CityCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isSelected ? 1 : 0,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: "48%",
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            isSelected && styles.cardSelected,
            { opacity: disabled ? 0.6 : 1 },
          ]}
        >
          <ImageBackground source={image} style={styles.imageBackground} resizeMode="cover">
            {/* Coming Soon Overlay for disabled cities */}
            {disabled && (
              <YStack
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backgroundColor="rgba(0, 0, 0, 0.5)"
                justifyContent="center"
                alignItems="center"
                zIndex={5}
              >
                <YStack
                  backgroundColor="#8E0FFF"
                  paddingHorizontal={wp(16)}
                  paddingVertical={hp(8)}
                  borderRadius={wp(20)}
                >
                  <Text
                    fontSize={fp(13)}
                    fontWeight="700"
                    color="#FFFFFF"
                    textAlign="center"
                  >
                    Coming Soon
                  </Text>
                </YStack>
              </YStack>
            )}

            {/* Selection Indicator */}
            {isSelected && !disabled && (
              <Animated.View
                style={[
                  styles.checkContainer,
                  {
                    opacity: checkAnim,
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <YStack
                  backgroundColor="#8E0FFF"
                  borderRadius={wp(12)}
                  padding={wp(4)}
                >
                  <Check size={hp(16)} color="#FFFFFF" strokeWidth={3} />
                </YStack>
              </Animated.View>
            )}

            <YStack flex={1} justifyContent="flex-end">
              <YStack
                backgroundColor="rgba(0, 0, 0, 0.75)"
                paddingVertical={hp(12)}
                borderBottomLeftRadius={wp(12)}
                borderBottomRightRadius={wp(12)}
              >
                <Text
                  fontSize={fp(15)}
                  fontWeight="700"
                  color={isSelected ? "#8E0FFF" : "#FFFFFF"}
                  textAlign="center"
                  numberOfLines={1}
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.8)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {name}
                </Text>
              </YStack>
            </YStack>
          </ImageBackground>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: hp(140),
    borderRadius: wp(12),
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  cardSelected: {
    shadowColor: "#8E0FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurOverlay: {
    borderBottomLeftRadius: wp(12),
    borderBottomRightRadius: wp(12),
    overflow: "hidden",
  },
  checkContainer: {
    position: "absolute",
    top: hp(8),
    right: wp(8),
    zIndex: 10,
  },
});
