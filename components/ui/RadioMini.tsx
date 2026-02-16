import { XStack } from "tamagui";
import Svg, { Circle } from "react-native-svg";
import { hp, wp } from "@/utils/responsive";

interface RadioMiniProps {
  selected: boolean;
  onSelect: () => void;
}

export function RadioMini({ selected, onSelect }: RadioMiniProps) {
  return (
    <XStack onPress={onSelect}>
      <Svg width="24" height="24" viewBox="0 0 24 25">
        <Circle
          cx="12"
          cy="12.5"
          r="7.25"
          fill="white"
          stroke={selected ? "#8E0FFF" : "#E0E0E0"}
          strokeWidth="1.5"
        />
        {selected && <Circle cx="12" cy="12.5" r="4" fill="#8E0FFF" />}
      </Svg>
    </XStack>
  );
}
