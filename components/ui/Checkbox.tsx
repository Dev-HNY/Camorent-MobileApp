import React from "react";
import { TouchableOpacity } from "react-native";
import Svg, {
  Path,
  G,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
} from "react-native-svg";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onCheckedChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Defs>
          <Filter
            id="filter0_d_2272_6529"
            x="2"
            y="3"
            width="20"
            height="20"
            filterUnits="userSpaceOnUse"
          >
            <FeFlood floodOpacity="0" result="BackgroundImageFix" />
            <FeColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <FeOffset dy="1" />
            <FeGaussianBlur stdDeviation="1" />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix
              type="matrix"
              values="0 0 0 0 0.0705882 0 0 0 0 0.0705882 0 0 0 0 0.0901961 0 0 0 0.05 0"
            />
            <FeBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2272_6529"
            />
            <FeBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2272_6529"
              result="shape"
            />
          </Filter>
        </Defs>
        <G filter="url(#filter0_d_2272_6529)">
          <Path
            d="M4.75 8.75C4.75 6.54086 6.54086 4.75 8.75 4.75H15.25C17.4591 4.75 19.25 6.54086 19.25 8.75V15.25C19.25 17.4591 17.4591 19.25 15.25 19.25H8.75C6.54086 19.25 4.75 17.4591 4.75 15.25V8.75Z"
            fill={checked ? "#7047EB" : "white"}
          />
          <Path
            d="M4.75 8.75C4.75 6.54086 6.54086 4.75 8.75 4.75H15.25C17.4591 4.75 19.25 6.54086 19.25 8.75V15.25C19.25 17.4591 17.4591 19.25 15.25 19.25H8.75C6.54086 19.25 4.75 17.4591 4.75 15.25V8.75Z"
            stroke={checked ? "#7047EB" : "#D1D1DB"}
            strokeWidth="1.5"
          />
        </G>
        {checked && (
          <G transform="translate(7, 7)">
            <Check size={10} color="white" strokeWidth={3} />
          </G>
        )}
      </Svg>
    </TouchableOpacity>
  );
}
