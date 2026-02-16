import { YStack, XStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { Star, ChevronRight } from "lucide-react-native";
import { Heading2 } from "@/components/ui/Typography";
import { wp, hp, fp } from "@/utils/responsive";

interface RatingCardProps {
  onPress?: () => void;
  rating?: number;
  review?: string;
}

export function RatingCard({ onPress, rating, review }: RatingCardProps) {
  const hasRating = rating !== undefined && rating > 0;

  return (
    <Pressable onPress={onPress} disabled={hasRating}>
      <YStack
        backgroundColor="white"
        paddingHorizontal={wp(12)}
        paddingVertical={hp(16)}
        borderRadius={wp(12)}
        gap={hp(12)}
        borderWidth={1}
        borderColor="#EBEBEF"
      >
        <YStack gap={hp(12)} justifyContent="center" alignItems="center">
          <Heading2>{hasRating ? "Your Rating" : "How was the shoot?"}</Heading2>
          <XStack gap={wp(8)}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={28}
                color={hasRating && i < rating ? "#fbbf24" : "#9ca3af"}
                fill={hasRating && i < rating ? "#fbbf24" : "transparent"}
                strokeWidth={1.5}
              />
            ))}
          </XStack>
        </YStack>
        {hasRating && review && (
          <Text
            fontSize={fp(14)}
            lineHeight={hp(20)}
            color="#6C6C89"
            textAlign="center"
          >
            {review}
          </Text>
        )}
        {!hasRating && (
          <XStack alignItems="center" justifyContent="flex-end">
            <Text
              fontSize={fp(12)}
              lineHeight={hp(16)}
              fontWeight="500"
              color="#6D00DA"
            >
              Help us Improve
            </Text>
            <ChevronRight size={16} color="#7c3aed" />
          </XStack>
        )}
      </YStack>
    </Pressable>
  );
}
