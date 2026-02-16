import React, { useEffect, useRef, useState } from "react";
import { Animated, TextInput as RNTextInput, StyleSheet, Pressable } from "react-native";
import { YStack, Text, XStack } from "tamagui";
import { wp, hp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

interface AnimatedFormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  editable?: boolean;
}

export function AnimatedFormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
}: AnimatedFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: isFocused || value ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Shake animation - smoother with decreasing amplitude
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const handleFocus = () => {
    setIsFocused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Interpolated values
  const labelTranslateY = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp(-27)],
  });

  const labelTranslateX = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [leftIcon ? wp(36) : 0, 0],
  });

  const labelScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.857], // 12/14 = 0.857 for font size scaling
  });

  const iconOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  // Compute border and label colors directly
  const getBorderColor = () => {
    if (error) return "#F44336";
    return (isFocused || value) ? "#8E0FFF" : "#E0E0E0";
  };

  const getLabelColor = () => {
    if (error) return "#F44336";
    return (isFocused || value) ? "#8E0FFF" : "#9E9E9E";
  };

  return (
    <YStack gap={hp(6)}>
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: getBorderColor(),
            borderWidth: 1.5,
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        {/* Floating Label */}
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                { translateY: labelTranslateY },
                { translateX: labelTranslateX },
                { scale: labelScale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Animated.Text
            style={[
              styles.label,
              {
                color: getLabelColor(),
                backgroundColor: "#FFFFFF",
                paddingHorizontal: wp(4),
              },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        <XStack alignItems="center" gap={wp(12)}>
          {/* Left Icon */}
          {leftIcon && (
            <Animated.View style={{ opacity: iconOpacity }}>
              {leftIcon}
            </Animated.View>
          )}

          {/* Input */}
          <YStack flex={1}>
            <RNTextInput
              value={value}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={(isFocused && !value) ? placeholder : ""}
              placeholderTextColor="#BDBDBD"
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete as any}
              editable={editable}
              selectionColor="#8E0FFF"
              style={[
                styles.input,
                {
                  color: editable ? "#121217" : "#9E9E9E",
                },
              ]}
            />
          </YStack>

          {/* Right Icon */}
          {rightIcon && (
            <Pressable onPress={onRightIconPress}>
              <Animated.View style={{ opacity: iconOpacity }}>
                {rightIcon}
              </Animated.View>
            </Pressable>
          )}
        </XStack>
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Animated.View
          style={{
            opacity: errorAnim,
            transform: [
              {
                translateY: errorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <Text fontSize={fp(12)} color="#F44336" paddingLeft={wp(4)}>
            {error}
          </Text>
        </Animated.View>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: hp(12),
    paddingHorizontal: wp(16),
    paddingTop: hp(20),
    paddingBottom: hp(12),
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: hp(16),
    left: wp(16),
    paddingHorizontal: wp(4),
    zIndex: 1,
  },
  label: {
    fontWeight: "500",
    fontSize: fp(14),
  },
  input: {
    fontSize: fp(14),
    fontWeight: "400",
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: hp(20),
  },
});
