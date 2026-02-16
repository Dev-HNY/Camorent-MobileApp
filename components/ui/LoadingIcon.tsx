import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface LoadingIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function LoadingIcon({ width = 10, height = 14, color = "white" }: LoadingIconProps) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 10 14" fill="none">
        <Path
          d="M0.586829 1.01896C2.0041 1.1115 3.37936 1.53816 4.60014 2.26405C5.82093 2.98993 6.85259 3.99444 7.61078 5.19544C8.36896 6.39643 8.83214 7.75982 8.96245 9.17412C9.09275 10.5884 8.88649 12.0135 8.36051 13.3328"
          stroke={color}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
}