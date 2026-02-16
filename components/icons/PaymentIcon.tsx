import React from "react";
import Svg, { Path } from "react-native-svg";

interface PaymentIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function PaymentIcon({
  width = 16,
  height = 16,
  color = "#121217",
}: PaymentIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M0.75 2.75V13.25C0.75 14.3546 1.64543 15.25 2.75 15.25H13.25C14.3546 15.25 15.25 14.3546 15.25 13.25V6.25C15.25 5.14543 14.3546 4.25 13.25 4.25M13.25 4.25H2.5C1.5335 4.25 0.75 3.4665 0.75 2.5C0.75 1.5335 1.5335 0.75 2.5 0.75H11.25C12.3546 0.75 13.25 1.64543 13.25 2.75V4.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
