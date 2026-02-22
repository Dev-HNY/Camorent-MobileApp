import React from "react";
import { Text } from "tamagui";

type Props = {
  value: number | string | null | undefined;
  currency?: boolean; // show symbol
  locale?: string; // default 'en-IN'
  fractionDigits?: number | null; // null -> use Intl default
  fontSize?: number;
  fontWeight?: any;
  color?: string;
  lineHeight?: number;
  textDecorationLine?: any;
};

export default function Price({
  value,
  currency = true,
  locale = "en-IN",
  fractionDigits = 0,
  fontSize,
  fontWeight,
  color,
  lineHeight,
  textDecorationLine,
}: Props) {
  if (value == null || value === "") return <Text>-</Text>;
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) return <Text>-</Text>;

  const options: Intl.NumberFormatOptions = currency
    ? {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: fractionDigits ?? 0,
      }
    : { maximumFractionDigits: fractionDigits ?? 0 };

  const formatted = new Intl.NumberFormat(locale, options).format(num);

  return (
    <Text
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      lineHeight={lineHeight}
      textDecorationLine={textDecorationLine}
    >
      {formatted}
    </Text>
  );
}
