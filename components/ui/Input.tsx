import { fp, hp, wp } from "@/utils/responsive";
import React, { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, Animated } from "react-native";
import { YStack, XStack } from "tamagui";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps extends TextInputProps {
  style?: any;
  error?: boolean;
  showPasswordToggle?: boolean;
}

export function Input({ style, error, showPasswordToggle, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: false,
    }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      friction: 6,
      tension: 50,
      useNativeDriver: false,
    }).start();
    props.onBlur?.(e);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? "#ef4444" : "#E5E7EB", error ? "#ef4444" : "#121217"],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.08],
  });

  const scale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.005],
  });

  return (
    <YStack flex={style?.flex || undefined}>
      <Animated.View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: wp(8),
          backgroundColor: "white",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity,
          shadowRadius: 8,
          elevation: isFocused ? 2 : 0,
          transform: [{ scale }],
        }}
      >
        <XStack alignItems="center">
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: wp(12),
              paddingVertical: hp(10),
              fontSize: fp(14),
              fontWeight: "400",
              lineHeight: hp(19),
              color: "#121217",
              ...style,
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={showPasswordToggle && !isPasswordVisible}
            {...props}
          />
          {showPasswordToggle && props.value && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{
                paddingHorizontal: wp(12),
                paddingVertical: hp(10),
              }}
              activeOpacity={0.7}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="#6C6C89" />
              ) : (
                <Eye size={20} color="#6C6C89" />
              )}
            </TouchableOpacity>
          )}
        </XStack>
      </Animated.View>
    </YStack>
  );
}
