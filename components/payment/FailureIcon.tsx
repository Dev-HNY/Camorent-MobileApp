import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { FailureSymbolIcon } from "./FailureSymbolIcon";

interface FailureIconProps {
  width?: number;
  height?: number;
}

export const FailureIcon: React.FC<FailureIconProps> = ({
  width = 212,
  height = 117,
}) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 212 117" fill="none">
        <G clipPath="url(#clip0_163_28564)">
          <Rect width="212" height="116.76" rx="58.3799" fill="#FEF0F4" />
          <Path
            d="M167.89 -1.98633H32.5838C-7.2917 -1.98633 -39.6172 32.499 -39.6172 75.0388C-39.6172 117.579 -7.2917 152.064 32.5838 152.064H167.89C207.765 152.064 240.091 117.579 240.091 75.0388C240.091 32.499 207.765 -1.98633 167.89 -1.98633Z"
            fill="#FFE6E6"
          />
          <Circle cx="106.5" cy="58.499" r="61.5" fill="#FDD8E1" />
          <Circle cx="106.5" cy="58.4991" r="42.75" fill="#FBB1C4" />
          <Path
            d="M84.2604 71.0014C84.9802 74.7806 86.8799 77.5894 88.5033 77.2751C90.1267 76.9607 90.8592 73.6423 90.1394 69.8632C89.4195 66.084 87.5199 63.2752 85.8965 63.5895C84.273 63.9038 83.5405 67.2223 84.2604 71.0014Z"
            fill="#33C5FF"
          />
          <Path
            d="M191.074 46.4496L198.816 43.6484L201.731 52.4712L193.712 54.8596L191.074 46.4496Z"
            fill="white"
          />
          <Path
            d="M17.364 43.5555L22.7787 42.7978L27.0034 46.7953L27.1679 41.2658L32.3367 38.707L27.4555 36.6369L26.7176 31.2337L23.087 34.9539L17.4264 33.9105L19.9692 39.0611L17.364 43.5555Z"
            fill="white"
          />
          <Path
            d="M40.0638 77.999L42.6324 87.672L33 84.4477L40.0638 77.999Z"
            fill="white"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_163_28564">
            <Rect width="212" height="116.76" rx="58.3799" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
      <View style={styles.failureSymbol}>
        <FailureSymbolIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  failureSymbol: {
    position: "absolute",
    top: "50%",
    left: "28%",
    transform: [{ translateX: -40.5 }, { translateY: -40.5 }],
  },
});
