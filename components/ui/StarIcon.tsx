import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StarIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export const StarIcon: React.FC<StarIconProps> = ({
  width = 12,
  height = 12,
  fill = "#FFC233"
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        d="M5.47949 1.73053C5.67215 1.26732 6.32785 1.26732 6.52051 1.73053L7.61914 4.37115L10.4707 4.59967C10.9705 4.64007 11.1729 5.2646 10.792 5.59088L8.62012 7.45123L9.2832 10.2335C9.39961 10.7214 8.86856 11.1073 8.44043 10.8458L6 9.35455L3.55859 10.8458C3.13048 11.1072 2.59943 10.7214 2.71582 10.2335L3.37988 7.45123L1.20703 5.59088C0.826073 5.2645 1.02924 4.63976 1.5293 4.59967L4.38086 4.37115L5.47949 1.73053Z"
        fill={fill}
      />
    </Svg>
  );
};