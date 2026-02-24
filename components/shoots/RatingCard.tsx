import { YStack, XStack, Text } from "tamagui";
import { Pressable, StyleSheet } from "react-native";
import { Star, ChevronRight } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";

interface RatingCardProps {
  onPress?: () => void;
  rating?: number;
  review?: string;
}

export function RatingCard({ onPress, rating, review }: RatingCardProps) {
  const hasRating = rating !== undefined && rating > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={hasRating}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
    >
      <YStack gap={hp(12)} alignItems="center">
        <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
          {hasRating ? "Your Rating" : "How was the shoot?"}
        </Text>
        <XStack gap={wp(10)}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={28}
              color={hasRating && i < rating ? "#FBBF24" : "#D1D1D6"}
              fill={hasRating && i < rating ? "#FBBF24" : "transparent"}
              strokeWidth={1.5}
            />
          ))}
        </XStack>
      </YStack>

      {hasRating && review && (
        <Text
          fontSize={fp(14)}
          lineHeight={hp(20)}
          color="#6C6C70"
          textAlign="center"
          marginTop={hp(10)}
        >
          {review}
        </Text>
      )}

      {!hasRating && (
        <XStack alignItems="center" justifyContent="flex-end" marginTop={hp(6)}>
          <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">
            Rate your experience
          </Text>
          <ChevronRight size={15} color="#8E0FFF" strokeWidth={2.5} />
        </XStack>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
