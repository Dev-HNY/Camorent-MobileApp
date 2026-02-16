import React, { useRef, useEffect } from "react";
import { Animated, TextInput, StyleSheet, TextInputProps } from "react-native";
import { YStack, XStack } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";

interface AnimatedInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
}

export function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon,
  keyboardType = "default",
  autoCapitalize = "words",
  secureTextEntry = false,
  ...rest
}: AnimatedInputProps) {
  const focusAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: value ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [value]);

  useEffect(() => {
    if (error) {
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 300,
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
    Animated.spring(focusAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      Animated.spring(focusAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const getBorderColor = () => {
    if (error) return "#F44336";
    return "#E5E5EA";
  };

  const getLabelColor = () => {
    if (error) return "#F44336";
    return "#8E8E93";
  };

  const labelTranslateY = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp(-24)],
  });

  const labelScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const isFocused = value.length > 0;

  return (
    <YStack gap={hp(6)}>
      <YStack position="relative" zIndex={1}>
        {/* Floating Label */}
        {isFocused && (
          <Animated.View
            style={[
              styles.labelContainer,
              {
                transform: [
                  { translateY: labelTranslateY },
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
        )}

        {/* Input Container */}
        <XStack
          alignItems="center"
          backgroundColor="#FFFFFF"
          borderRadius={wp(12)}
          borderWidth={1.5}
          borderColor={getBorderColor()}
          paddingLeft={icon ? wp(12) : wp(16)}
          paddingRight={wp(16)}
          gap={wp(10)}
        >
          {/* Icon */}
          {icon && <YStack>{icon}</YStack>}

          {/* Text Input */}
          <TextInput
            style={[
              styles.input,
              {
                fontSize: fp(15),
                paddingVertical: hp(14),
              },
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={!isFocused ? label : placeholder}
            placeholderTextColor="#FFFFFF"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            {...rest}
          />
        </XStack>
      </YStack>

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
          <Animated.Text
            style={{
              fontSize: fp(12),
              color: "#F44336",
              paddingLeft: wp(4),
            }}
          >
            {error}
          </Animated.Text>
        </Animated.View>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    position: "absolute",
    top: hp(14),
    left: wp(12),
    paddingHorizontal: wp(4),
    zIndex: 100,
  },
  label: {
    fontWeight: "500",
    fontSize: fp(12),
  },
  input: {
    flex: 1,
    fontWeight: "400",
    color: "#000000",
  },
});
