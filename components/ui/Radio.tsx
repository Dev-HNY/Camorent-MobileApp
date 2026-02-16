import { XStack, YStack, Text, Separator } from "tamagui";
import { TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { hp, wp } from "@/utils/responsive";
import { BodySmall } from "./Typography";

interface RadioProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  showSeparator?: boolean;
}

export function Radio({
  label,
  selected,
  onSelect,
  showSeparator = true,
}: RadioProps) {
  return (
    <YStack>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingVertical={hp(10)}
        paddingHorizontal={wp(16)}
        width="100%"
        onPress={onSelect}
      >
        <Svg width="20" height="20" viewBox="0 0 24 25">
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
        <BodySmall fontWeight="500" flex={1} marginLeft={wp(12)}>
          {label}
        </BodySmall>
      </XStack>
      {showSeparator && <Separator />}
    </YStack>
  );
}
