import React from "react";
import Svg, { Path } from "react-native-svg";

interface CameraIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function CameraIcon({
  width = 25,
  height = 24,
  color = "#8E0FFF",
}: CameraIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path
        d="M19.4818 17.146V9.79307C19.4818 8.71016 18.6039 7.83229 17.521 7.83229H17.1942C16.7984 7.83229 16.4415 7.59431 16.2892 7.22897L15.5665 5.49443C15.4143 5.12909 15.0573 4.89111 14.6615 4.89111H10.0864C9.69059 4.89111 9.33362 5.12909 9.1814 5.49443L8.45867 7.22897C8.30645 7.59431 7.94948 7.83229 7.5537 7.83229H7.2269C6.14399 7.83229 5.26611 8.71016 5.26611 9.79307V17.146C5.26611 18.2289 6.14399 19.1068 7.2269 19.1068H17.521C18.6039 19.1068 19.4818 18.2289 19.4818 17.146Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M15.5602 12.9793C15.5602 14.7391 14.1337 16.1656 12.374 16.1656C10.6142 16.1656 9.18768 14.7391 9.18768 12.9793C9.18768 11.2196 10.6142 9.79307 12.374 9.79307C14.1337 9.79307 15.5602 11.2196 15.5602 12.9793Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}