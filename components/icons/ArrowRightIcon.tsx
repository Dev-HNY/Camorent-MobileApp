import React from "react";
import Svg, { Path } from "react-native-svg";

interface ArrowRightIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function ArrowRightIcon({
  width = 13,
  height = 10,
  color = "white",
}: ArrowRightIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 13 10" fill="none">
      <Path
        d="M7.8125 1.0625L11.9375 5L7.8125 8.9375M11.75 5H1.0625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}