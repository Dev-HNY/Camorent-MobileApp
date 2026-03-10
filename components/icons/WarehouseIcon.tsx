import React from "react";
import Svg, { Path, Rect, Polyline } from "react-native-svg";

interface WarehouseIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function WarehouseIcon({
  size = 16,
  color = "#D97706",
  strokeWidth = 2,
}: WarehouseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Roof / triangle */}
      <Polyline
        points="3 9 12 3 21 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left wall */}
      <Path
        d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <Rect
        x="9"
        y="14"
        width="6"
        height="7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Window left */}
      <Rect
        x="4"
        y="12"
        width="3"
        height="3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Window right */}
      <Rect
        x="17"
        y="12"
        width="3"
        height="3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
