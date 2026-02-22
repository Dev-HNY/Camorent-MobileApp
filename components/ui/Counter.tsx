import React from "react";
import { Minus, Plus } from "lucide-react-native";
import { wp, hp } from "@/utils/responsive";
import { TouchableOpacity } from "react-native";
import { XStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { BodyText } from "./Typography";

interface CounterProps {
  value: number;
  onIncrement: (e: any) => void;
  onDecrement: (e: any) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showLabel?: boolean;
  variant?: "primary" | "outline";
}

export function Counter({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  size = "md",
  disabled = false,
  showLabel = false,
  variant = "outline",
}: CounterProps) {
  const canDecrement = value > min && !disabled;
  const canIncrement = value < max && !disabled;

  const sizeConfig = {
    sm: {
      height: 30,
      paddingHorizontal: 12,
      fontSize: 16,
      iconSize: 14,
    },
    md: {
      height: 44,
      paddingHorizontal: 16,
      fontSize: 18,
      iconSize: 18,
    },
    lg: {
      height: 52,
      paddingHorizontal: 20,
      fontSize: 20,
      iconSize: 20,
    },
  };

  const config = sizeConfig[size];

  const variantStyles = {
    primary: {
      textColor: "#FFFFFF",
      iconColor: "#FFFFFF",
      disabledIconColor: "#D1D5DB",
    },
    outline: {
      textColor: "#8E0FFF",
      iconColor: "#8E0FFF",
      disabledIconColor: "#D1D5DB",
    },
  };

  const styles = variantStyles[variant];

  const counterContent = (
    <>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onDecrement(e);
        }}
        disabled={!canDecrement}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Minus
          size={config.iconSize}
          color={canDecrement ? styles.iconColor : styles.disabledIconColor}
          strokeWidth={2.5}
        />
      </TouchableOpacity>

      <BodyText
        fontWeight={"500"}
        color={styles.textColor}
        minWidth={24}
        textAlign="center"
      >
        {value}
      </BodyText>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onIncrement(e);
        }}
        disabled={!canIncrement}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Plus
          size={config.iconSize}
          color={canIncrement ? styles.iconColor : styles.disabledIconColor}
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </>
  );

  if (variant === "primary") {
    return (
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.00)", "rgba(255, 255, 255, 0.20)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          //  height: config.height,
          paddingHorizontal: config.paddingHorizontal,
          paddingVertical: hp(6),
          borderRadius: wp(20),
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
        }}
      >
        {counterContent}
      </LinearGradient>
    );
  }

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      height={config.height}
      paddingHorizontal={config.paddingHorizontal}
      borderRadius={wp(20)}
      borderWidth={1}
      borderColor="#8E0FFF"
      backgroundColor="transparent"
      // gap="$3"
    >
      {counterContent}
    </XStack>
  );
}
