import React from "react";
import { Text, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { fp, hp, wp } from "@/utils/responsive";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "default";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: (e: any) => void;
  [key: string]: any;
}

const getButtonStyles = (variant: Variant, size: Size, disabled: boolean) => {
  const baseStyles = {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 8,
    flexDirection: "row" as const,
    cursor: disabled ? "not-allowed" : "pointer",
    // opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: wp(12),
      paddingVertical: hp(6),
      borderRadius: wp(8),
    },
    md: {
      paddingHorizontal: wp(12),
      paddingVertical: hp(6),
      borderRadius: wp(8),
    },
    lg: {
      paddingHorizontal: wp(16),
      paddingVertical: hp(14),
      borderRadius: wp(12),
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: "#8b5cf6",
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: "#1f2937",
      borderWidth: 0,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#AAAAB1",
    },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    danger: {
      backgroundColor: "#ef4444",
      borderWidth: 0,
    },
    default: {
      backgroundColor: "#8b5cf6",
      borderWidth: 0,
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

const getTextStyles = (variant: Variant, size: Size) => {
  const baseStyles = {
    fontWeight: "500" as const,
    textAlign: "center" as const,
  };

  const sizeStyles = {
    sm: {
      fontSize: fp(12),
      lineHeight: hp(16),
      fontWeight: "500",
    },
    md: {
      fontSize: fp(12),
      lineHeight: hp(16),
      fontWeight: "500",
    },
    lg: {
      fontSize: fp(16),
      lineHeight: hp(20),
      fontWeight: "500",
    },
  };

  const variantStyles = {
    primary: {
      color: "white",
    },
    secondary: {
      color: "white",
    },
    outline: {
      color: "#AAAAB1",
    },
    ghost: {
      color: "#374151",
    },
    danger: {
      color: "white",
    },
    default: {
      color: "white",
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  ...props
}: ButtonProps) {
  const isStringChildren = typeof children === "string";
  const buttonStyles = getButtonStyles(variant, size, disabled);
  const textStyles = getTextStyles(variant, size);

  // Use linear gradient for size primary buttons
  const shouldUseGradient = variant === "primary";

  if (shouldUseGradient) {
    const { cursor, ...validStyles } = buttonStyles;
    return (
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.00)", "rgba(255, 255, 255, 0.20)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[
          validStyles,
          {
            alignItems: "center",
            backgroundColor: "#5F00BA",
            borderWidth: 1,
            borderColor: "#8E0FFF",
            shadowColor: "#8E0FFF",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={disabled ? undefined : onPress}
        {...props}
      >
        {leftIcon && <YStack alignSelf="center">{leftIcon}</YStack>}
        {leftIcon && isStringChildren && <YStack width={6} />}
        {isStringChildren ? <Text {...textStyles}>{children}</Text> : children}
        {rightIcon && isStringChildren && <YStack width={6} />}
        {rightIcon && <YStack alignSelf="center">{rightIcon}</YStack>}
      </LinearGradient>
    );
  }

  return (
    <YStack
      {...buttonStyles}
      onPress={disabled ? undefined : onPress}
      {...props}
    >
      {leftIcon && <YStack alignSelf="center">{leftIcon}</YStack>}
      {leftIcon && isStringChildren && <YStack width={6} />}
      {isStringChildren ? <Text {...textStyles}>{children}</Text> : children}
      {rightIcon && isStringChildren && <YStack width={6} />}
      {rightIcon && <YStack alignSelf="center">{rightIcon}</YStack>}
    </YStack>
  );
}
