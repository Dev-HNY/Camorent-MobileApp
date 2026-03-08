import { XStack, Text } from "tamagui";
import { Heading2 } from "./Typography";
import { wp, fp } from "@/utils/responsive";
import { Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";

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
        <Pressable
          onPress={onViewAllPress}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: wp(2), opacity: pressed ? 0.7 : 1 })}
        >
          <Text fontSize={fp(13)} fontWeight="600" color="#6B7280">View All</Text>
          <ChevronRight size={fp(14)} color="#6B7280" strokeWidth={2.5} />
        </Pressable>
      )}
    </XStack>
  );
}
