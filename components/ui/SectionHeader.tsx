import { XStack, Text } from "tamagui";
import { Heading2 } from "./Typography";
import { wp } from "@/utils/responsive";

interface SectionHeaderProps {
  title: string;
  onViewAllPress?: () => void;
  showViewAll?: boolean;
}

export function SectionHeader({
  title,
  onViewAllPress,
  showViewAll = true,
}: SectionHeaderProps) {
  return (
    <XStack
      paddingHorizontal={wp(16)}
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading2>{title}</Heading2>
      {showViewAll && onViewAllPress && (
        <XStack onPress={onViewAllPress} cursor="pointer">
          <Text color="$purple9">View all </Text>
        </XStack>
      )}
    </XStack>
  );
}
