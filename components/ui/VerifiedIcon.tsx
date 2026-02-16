import React from "react";
import { Svg, Path } from "react-native-svg";

interface VerifiedIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function VerifiedIcon({
  width = 24,
  height = 24,
  color = "#2DCA72"
}: VerifiedIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.74917 12.75L10.9992 14.25L14.2492 9.75M4.74917 8L11.9992 4.75L19.2492 8C19.2492 8 19.9992 19.25 11.9992 19.25C3.99917 19.25 4.74917 8 4.74917 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}