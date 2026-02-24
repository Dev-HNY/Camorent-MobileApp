import { XStack, YStack, Text } from "tamagui";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";

interface OrderItemCardProps {
  id: string;
  name: string;
  quantity: number;
  days: number;
  total: number;
  imageUri?: string;
  showReplaceButton?: boolean;
  onReplace?: () => void;
}

export function OrderItemCard({
  id,
  name,
  quantity,
  days,
  total,
  imageUri,
  showReplaceButton,
  onReplace,
}: OrderItemCardProps) {
  const defaultImage = imageUri || `https://img.camorent.co.in/skus/images/${id}/primary.webp`;

  return (
    <XStack alignItems="center" gap={wp(12)} paddingVertical={hp(2)}>
      {/* Thumbnail */}
      <YStack style={styles.imageBox}>
        <Image
          source={{ uri: defaultImage }}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
          style={styles.image}
        />
      </YStack>

      {/* Info */}
      <YStack flex={1} gap={hp(5)}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#1C1C1E"
            flex={1}
            numberOfLines={2}
            lineHeight={hp(20)}
            paddingRight={wp(8)}
            letterSpacing={-0.1}
          >
            {name}
          </Text>
          <Text fontSize={fp(15)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.4}>
            {"\u20B9"}{total.toLocaleString()}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={fp(12)} color="#8E8E93">
            Qty {quantity} · {days} {days === 1 ? "day" : "days"}
          </Text>
          {showReplaceButton && onReplace && (
            <Text
              fontSize={fp(12)}
              fontWeight="600"
              color="#8E0FFF"
              onPress={onReplace}
            >
              Replace
            </Text>
          )}
        </XStack>
      </YStack>
    </XStack>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(10),
    backgroundColor: "#F8F8FA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: wp(48),
    height: wp(48),
  },
});
