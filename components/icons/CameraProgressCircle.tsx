import React from "react";
import Svg, { Rect, Path, Circle } from "react-native-svg";

interface CameraProgressCircleProps {
  width?: number;
  height?: number;
  progress?: number; // 0 to 100
}

export function CameraProgressCircle({
  width = 41,
  height = 40,
  progress = 25,
}: CameraProgressCircleProps) {
  const radius = 18.27655; // Adjusted radius for the progress circle
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={width} height={height} viewBox="0 0 41 40" fill="none">
      <Rect x="0.375" width="40" height="40" rx="20" fill="#FFF9EB" />

      {/* Background circle */}
      <Circle
        cx="20.375"
        cy="20"
        r={radius}
        stroke="white"
        strokeWidth="3.447"
        fill="none"
      />

      {/* Progress circle - starts from bottom, fills clockwise */}
      <Circle
        cx="20.375"
        cy="20"
        r={radius}
        stroke="#8E0FFF"
        strokeWidth="3.447"
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="90"
        origin="20.375, 20"
      />
    </Svg>
  );
}
