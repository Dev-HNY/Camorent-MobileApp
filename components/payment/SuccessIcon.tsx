import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, G, Rect, Path, Circle, Defs, ClipPath } from "react-native-svg";
import { CheckIcon } from "./CheckIcon";

interface SuccessIconProps {
  width?: number;
  height?: number;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  width = 206,
  height = 114,
}) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 206 114" fill="none">
        <G clipPath="url(#clip0_163_28507)">
          <Rect width="205.845" height="113.37" rx="56.685" fill="#EDEFFA" />
          <Path
            d="M157.998 -3.14648H26.4826C-12.2756 -3.14648 -43.6953 22.7192 -43.6953 54.6261C-43.6953 86.533 -12.2756 112.399 26.4826 112.399H157.998C196.756 112.399 228.175 86.533 228.175 54.6261C228.175 22.7192 196.756 -3.14648 157.998 -3.14648Z"
            fill="#E6F1F8"
          />
          <Path
            d="M157.998 -3.14648H26.4826C-12.2756 -3.14648 -43.6953 22.7192 -43.6953 54.6261C-43.6953 86.533 -12.2756 112.399 26.4826 112.399H157.998C196.756 112.399 228.175 86.533 228.175 54.6261C228.175 22.7192 196.756 -3.14648 157.998 -3.14648Z"
            fill="#DBF3FF"
          />
          <Circle cx="103.406" cy="56.8032" r="59.7145" fill="#ADE4FF" />
          <Circle cx="103.407" cy="56.8032" r="41.5088" fill="#70D1FF" />
          <Path
            d="M81.8073 68.9428C82.5062 72.6122 84.3507 75.3395 85.927 75.0343C87.5033 74.7291 88.2145 71.507 87.5156 67.8376C86.8166 64.1682 84.9722 61.4409 83.3959 61.7461C81.8196 62.0513 81.1083 65.2734 81.8073 68.9428Z"
            fill="#33C5FF"
          />
          <Path
            d="M185.524 45.1038L193.041 42.3839L195.872 50.9505L188.086 53.2696L185.524 45.1038Z"
            fill="#F0FAFF"
          />
          <Path
            d="M16.8568 42.2927L22.1143 41.557L26.2163 45.4384L26.3761 40.0695L31.3948 37.585L26.6553 35.5749L25.9389 30.3286L22.4137 33.9408L16.9174 32.9277L19.3863 37.9288L16.8568 42.2927Z"
            fill="#F0FAFF"
          />
          <Path
            d="M38.8977 75.7362L41.3918 85.1283L32.0391 81.9976L38.8977 75.7362Z"
            fill="#F0FAFF"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_163_28507">
            <Rect width="205.845" height="113.37" rx="56.685" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
      <View style={styles.checkIcon}>
        <CheckIcon width={83} height={84} />
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
  checkIcon: {
    position: "absolute",
    top: "50%",
    left: "27%",
    transform: [{ translateX: -41.5 }, { translateY: -42 }],
  },
});
