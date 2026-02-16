import React from "react";
import Svg, { Path } from "react-native-svg";

interface HelpCenterIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function HelpCenterIcon({
  width = 16,
  height = 16,
  color = "#121217",
}: HelpCenterIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M15.25 12V8.25C15.25 4.24594 12.0041 1 8 1C3.99594 1 0.75 4.24594 0.75 8.25V12M3.45 15.25C1.95883 15.25 0.75 14.0412 0.75 12.55V11.45C0.75 9.95883 1.95883 8.75 3.45 8.75C4.44411 8.75 5.25 9.55589 5.25 10.55V13.45C5.25 14.4441 4.44411 15.25 3.45 15.25ZM12.55 15.25C11.5559 15.25 10.75 14.4441 10.75 13.45V10.55C10.75 9.55589 11.5559 8.75 12.55 8.75C14.0412 8.75 15.25 9.95883 15.25 11.45V12.55C15.25 14.0412 14.0412 15.25 12.55 15.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
