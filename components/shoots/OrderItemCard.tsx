import { XStack, YStack, Text, Stack } from "tamagui";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BodySmall } from "@/components/ui/Typography";
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
    <XStack alignItems="center" gap={wp(12)}>
      <Stack
        width={wp(60)}
        height={wp(60)}
        borderRadius={wp(10)}
        borderWidth={1}
        borderColor="rgba(142, 15, 255, 0.15)"
        overflow="hidden"
      >
        <LinearGradient
          colors={[
            "rgba(142, 15, 255, 0.08)",
            "rgba(197, 164, 255, 0.12)",
            "rgba(255, 255, 255, 0.95)",
            "rgba(142, 15, 255, 0.10)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{ uri: defaultImage }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            style={{ width: wp(50), height: wp(50) }}
          />
        </LinearGradient>
      </Stack>
      <YStack flex={1} gap={hp(4)}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#1C1C1E"
            width="72%"
            numberOfLines={2}
            lineHeight={hp(20)}
          >
            {name}
          </Text>
          <Text fontSize={fp(15)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
            ₹{total.toLocaleString()}
          </Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <BodySmall color="#8E8E93">
            Qty: {quantity} · {days} {days === 1 ? "day" : "days"}
          </BodySmall>
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
