import { YStack, XStack, Text } from "tamagui";
import { Pressable, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
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
  const dateLabel = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const statusLabel = getStatusLabel(status);
  const isUpcoming = status === "upcoming" || status === "confirmed" || status === "pending_allocation" || status === "admin_approved" || status === "pending_payment";
  const dotColor =
    status === "shoot_complete" ? "#34C759" :
    status === "admin_rejection" ? "#FF3B30" :
    status === "delivery_started" || status === "shoot_start" ? "#FF9500" :
    "#8E0FFF";

  return (
    <YStack style={styles.card}>
      {/* Status row */}
      <XStack alignItems="center" gap={wp(10)}
        paddingHorizontal={wp(16)} paddingTop={hp(16)} paddingBottom={hp(14)}>
        <XStack
          width={8} height={8} borderRadius={4}
          backgroundColor={dotColor}
        />
        <Text fontSize={fp(13)} fontWeight="600" color={dotColor} letterSpacing={0.1}>
          {statusLabel}
        </Text>
      </XStack>

      <YStack height={1} backgroundColor="#F2F2F7" />

      {/* Delivery info */}
      <XStack alignItems="center" justifyContent="space-between"
        paddingHorizontal={wp(16)} paddingVertical={hp(14)}>
        <YStack gap={hp(3)}>
          <Text fontSize={fp(12)} color="#8E8E93">
            {isUpcoming ? "Delivery scheduled" : "Delivered on"}
          </Text>
          <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
            {dateLabel}
          </Text>
        </YStack>

        <Pressable
          onPress={onTrackOrder}
          style={({ pressed }) => [styles.trackBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">Track</Text>
          <ChevronRight size={14} color="#8E0FFF" strokeWidth={2.5} />
        </Pressable>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    backgroundColor: "#F5EEFF",
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    borderRadius: wp(20),
  },
});
