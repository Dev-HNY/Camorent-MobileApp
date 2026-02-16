import { YStack, XStack, Text, Separator } from "tamagui";
import { Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Heading2, BodyText } from "@/components/ui/Typography";
import { wp, hp, fp } from "@/utils/responsive";
import { getStatusLabel } from "@/constants/order-status";

interface OrderStatusCardProps {
  deliveryDate: Date;
  status: string;
  onTrackOrder: () => void;
}

export function OrderStatusCard({
  deliveryDate,
  status,
  onTrackOrder,
}: OrderStatusCardProps) {
  return (
    <YStack
      backgroundColor="white"
      borderRadius={wp(12)}
      paddingHorizontal={wp(12)}
      paddingVertical={hp(16)}
      gap={hp(12)}
      borderWidth={1}
      borderColor="#EBEBEF"
    >
      <YStack>
        <Heading2>
          Gears {status === "upcoming" ? "will be" : "were"} delivered on{" "}
          {deliveryDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}
        </Heading2>
        <BodyText color="#6C6C89">{getStatusLabel(status)}</BodyText>
      </YStack>
      <Separator />
      <Pressable onPress={onTrackOrder}>
        <XStack alignItems="center" gap={wp(8)}>
          <Text
            fontSize={fp(12)}
            lineHeight={hp(16)}
            fontWeight="500"
            color="#6D00DA"
          >
            Track Order
          </Text>
          <ChevronRight size={16} color="#7c3aed" />
        </XStack>
      </Pressable>
    </YStack>
  );
}
