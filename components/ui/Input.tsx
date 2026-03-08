import { fp, hp, wp } from "@/utils/responsive";
import React, { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps extends TextInputProps {
  style?: any;
  error?: boolean;
  showPasswordToggle?: boolean;
}

export function Input({ style, error, showPasswordToggle, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const borderColor = error ? "#ef4444" : isFocused ? "#121217" : "#E5E7EB";

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor,
        borderRadius: wp(8),
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
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
    </View>
  );
}
