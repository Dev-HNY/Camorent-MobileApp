import { XStack, Text, styled } from "tamagui";
import { fp, hp, wp } from "@/utils/responsive";
import { BodyText } from "./Typography";

export interface BadgeProps {
  label: string;
  variant?: "teal" | "blue" | "gray" | "green" | "red";
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

const variantStyles = {
  teal: {
    backgroundColor: "#E6FFFA",
    color: "#2C7A7B",
  },
  blue: {
    backgroundColor: "#EBF8FF",
    color: "#2C5282",
  },
  gray: {
    backgroundColor: "#F7FAFC",
    color: "#4A5568",
  },
  green: {
    backgroundColor: "#F0FFF4",
    color: "#276749",
  },
  red: {
    backgroundColor: "#FFF5F5",
    color: "#C53030",
  },
};

export const Badge = ({
  label,
  variant = "teal",
  backgroundColor,
  textColor,
  fontSize,
}: BadgeProps) => {
  const styles = variantStyles[variant];

  return (
    <XStack
      paddingVertical={hp(4)}
      paddingHorizontal={wp(8)}
      backgroundColor={backgroundColor || styles.backgroundColor}
      borderRadius={wp(8)}
    >
      <BodyText fontSize={fontSize} color={textColor || styles.color}>{label}</BodyText>
    </XStack>
  );
};
