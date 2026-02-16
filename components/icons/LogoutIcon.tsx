import React from "react";
import Svg, { Path } from "react-native-svg";

interface LogoutIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function LogoutIcon({
  width = 16,
  height = 16,
  color = "#121217",
}: LogoutIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M11.75 4.75L15.25 8L11.75 11.25M15 8H6.75M11.25 0.75H2.75C1.64543 0.75 0.75 1.64543 0.75 2.75V13.25C0.75 14.3546 1.64543 15.25 2.75 15.25H11.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
