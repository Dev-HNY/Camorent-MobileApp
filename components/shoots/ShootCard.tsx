import React, { useMemo } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Image } from "expo-image";
import { Pressable, Share, StyleSheet } from "react-native";
import { MyShootsBooking } from "@/utils/categorise-bookings";
import { Calendar, Check, ChevronRight, Mail, FileText, Share2 } from "lucide-react-native";
import { router } from "expo-router";
import { wp, hp, fp } from "@/utils/responsive";
import { formatDate } from "@/utils/date";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { apiClient } from "@/lib/api-client";
import Svg, { Path, Rect } from "react-native-svg";

const WalletIcon = ({ size = 18, color = "#8E0FFF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="15" rx="3" stroke={color} strokeWidth="1.8" />
    <Path d="M2 10h20" stroke={color} strokeWidth="1.8" />
    <Path d="M16 15.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill={color} stroke={color} strokeWidth="1" />
    <Path d="M6 5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const TAB_STATUS = {
  past:     { label: "Completed", bg: "#F0FDF4", color: "#16A34A" },
  ongoing:  { label: "Active",    bg: "#EDE9FE", color: "#7C3AED" },
  upcoming: { label: "Upcoming",  bg: "#FEF3C7", color: "#D97706" },
};

const BOOKING_STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  admin_review:   { label: "In Review",  bg: "#FEF3C7", color: "#D97706" },
  admin_approved: { label: "Approved",   bg: "#EDE9FE", color: "#7C3AED" },
  confirmed:      { label: "Confirmed",  bg: "#EDE9FE", color: "#7C3AED" },
  in_progress:    { label: "Active",     bg: "#EDE9FE", color: "#7C3AED" },
  shoot_complete: { label: "Completed",  bg: "#F0FDF4", color: "#16A34A" },
  completed:      { label: "Completed",  bg: "#F0FDF4", color: "#16A34A" },
  cancelled:      { label: "Cancelled",  bg: "#FEF2F2", color: "#DC2626" },
};

interface ShootCardProps {
  shoot: MyShootsBooking;
  onOrderDetailsClick?: () => void;
  tab?: "past" | "ongoing" | "upcoming";
  onCancelOrder?: () => void;
  index?: number;
}

export const ShootCard = React.memo(function ShootCard({
  shoot,
  onOrderDetailsClick,
  tab = "past",
  onCancelOrder,
}: ShootCardProps) {

  const productImages = useMemo(
    () =>
      shoot.sku_list.map(
        (item) => `https://img.camorent.co.in/skus/images/${item}/primary.webp`
      ),
    [shoot.sku_list]
  );

  const handleLeftButtonClick = () => {
    switch (tab) {
      case "past":
        if (!shoot.rating) {
          router.push({
            pathname: "/(tabs)/(shoots)/rating",
            params: { booking_id: shoot.booking_id },
          });
        }
        break;
      case "ongoing":
        router.push("/(tabs)/(shoots)/report-issue");
        break;
      case "upcoming":
        onCancelOrder?.();
        break;
    }
  };

  const displayItems = shoot.sku_list.slice(0, 3);
  const remainingItems = shoot.sku_list.length - 3;
  const statusBadge = BOOKING_STATUS_BADGE[shoot.status] ?? TAB_STATUS[tab];
  // Show "Pay Now" only when invoice exists and hasn't been paid yet
  const needsPayment = shoot.invoice_status === "created" || shoot.invoice_status === "pending";

  const leftLabel =
    tab === "past" ? (shoot.rating ? "Rated" : "Rate order") :
    tab === "ongoing" ? "Report issue" : "Cancel order";

  const handleInvoicePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const response = await apiClient.get(`/bookings/${shoot.booking_id}/invoice/download`);
      if (response.data?.pdf_url) {
        Linking.openURL(response.data.pdf_url);
      } else {
        onOrderDetailsClick?.();
      }
    } catch {
      onOrderDetailsClick?.();
    }
  };

  return (
    <YStack style={styles.card}>

      {/* Top row: date range + status badge */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={hp(12)}>
        <XStack alignItems="center" gap={wp(5)}>
          <Calendar size={13} color="#8E8E93" strokeWidth={2} />
          <Text fontSize={fp(12)} color="#8E8E93" fontWeight="500">
            {formatDate(shoot.rental_start_date)} – {formatDate(shoot.rental_end_date)}
          </Text>
        </XStack>
        <XStack
          backgroundColor={statusBadge.bg}
          paddingHorizontal={wp(10)}
          paddingVertical={hp(4)}
          borderRadius={wp(20)}
        >
          <Text fontSize={fp(11)} fontWeight="600" color={statusBadge.color}>
            {statusBadge.label}
          </Text>
        </XStack>
      </XStack>

      {/* Shoot name + amount */}
      <XStack alignItems="flex-start" justifyContent="space-between" marginBottom={hp(14)}>
        <Text
          fontSize={fp(16)}
          fontWeight="700"
          color="#1C1C1E"
          lineHeight={hp(22)}
          letterSpacing={-0.4}
          flex={1}
          marginRight={wp(12)}
          numberOfLines={2}
        >
          {shoot.shoot_name || "Unnamed Shoot"}
        </Text>
        <YStack alignItems="flex-end" gap={hp(5)}>
          <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
            {"\u20B9"}{shoot.total_amount.toLocaleString()}
          </Text>
          {needsPayment ? (
            <Pressable
              hitSlop={10}
              onPress={handleInvoicePress}
              style={({ pressed }) => [styles.payNowPill, { opacity: pressed ? 0.75 : 1 }]}
            >
              <Text fontSize={fp(10)} fontWeight="700" color="#8E0FFF">PAY NOW</Text>
            </Pressable>
          ) : (
            <XStack style={styles.paidPill}>
              <Text fontSize={fp(10)} fontWeight="600" color="#16A34A">Paid</Text>
            </XStack>
          )}
        </YStack>
      </XStack>

      {/* Divider */}
      <YStack height={1} backgroundColor="#F2F2F7" marginBottom={hp(14)} />

      {/* Product thumbnails + Invoice chip */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={hp(14)}>
        <XStack gap={wp(8)} alignItems="center">
          {displayItems.map((_, idx) => (
            <YStack key={idx} style={styles.thumbBox}>
              <Image
                source={{ uri: productImages[idx] }}
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
                style={styles.thumbImage}
              />
            </YStack>
          ))}
          {remainingItems > 0 && (
            <YStack style={[styles.thumbBox, styles.remainingBox]}>
              <Text fontSize={fp(12)} fontWeight="700" color="#8E0FFF">+{remainingItems}</Text>
              <Text fontSize={fp(9)} fontWeight="500" color="#8E0FFF">more</Text>
            </YStack>
          )}
        </XStack>

        <Pressable onPress={handleInvoicePress} hitSlop={10}>
          <YStack style={styles.invoiceChip}>
            {needsPayment
              ? <WalletIcon size={18} color="#8E0FFF" />
              : <FileText size={18} color="#8E0FFF" strokeWidth={1.8} />
            }
            <Text fontSize={fp(10)} fontWeight="600" color="#8E0FFF">
              {needsPayment ? "Pay now" : "Invoice"}
            </Text>
          </YStack>
        </Pressable>
      </XStack>

      {/* Two-button row: action + view details */}
      <XStack gap={wp(10)}>
        {/* Left: contextual action */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleLeftButtonClick();
          }}
          disabled={tab === "past" && !!shoot.rating}
          style={({ pressed }) => [
            styles.actionBtn,
            tab === "past" && shoot.rating ? styles.actionBtnDone : null,
            { opacity: (tab === "past" && !!shoot.rating) ? 0.55 : pressed ? 0.75 : 1 },
          ]}
        >
          {tab === "past" && shoot.rating
            ? <Check size={13} color="#34C759" strokeWidth={2.5} />
            : null}
          <Text
            fontSize={fp(13)}
            fontWeight="600"
            color={tab === "past" && shoot.rating ? "#34C759" : "#8E0FFF"}
          >
            {leftLabel}
          </Text>
        </Pressable>

        {/* Right: view details — filled purple */}
        <Pressable
          hitSlop={8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOrderDetailsClick?.();
          }}
          style={({ pressed }) => [styles.detailsBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Text fontSize={fp(13)} fontWeight="600" color="#FFFFFF">Details</Text>
          <ChevronRight size={13} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </XStack>

      {/* Footer */}
      <YStack height={1} backgroundColor="#F2F2F7" marginTop={hp(14)} marginBottom={hp(12)} />
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={fp(11)} color="#C7C7CC" fontWeight="500" letterSpacing={0.2}>
          #{shoot.booking_id.slice(-8).toUpperCase()}
        </Text>
        <XStack gap={wp(8)} alignItems="center">
          <Pressable
            hitSlop={10}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL("mailto:support@camorent.co.in");
            }}
          >
            <YStack style={styles.iconBtn}>
              <Mail size={15} color="#8E0FFF" strokeWidth={2} />
            </YStack>
          </Pressable>
          <Pressable
            hitSlop={10}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Share.share({
                message: "Rent premium camera gear for your shoots on Camorent! Download the app: https://camorent.co.in",
                url: "https://camorent.co.in",
              });
            }}
          >
            <YStack style={styles.iconBtn}>
              <Share2 size={15} color="#8E0FFF" strokeWidth={2} />
            </YStack>
          </Pressable>
        </XStack>
      </XStack>
    </YStack>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    padding: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbBox: {
    width: wp(52),
    height: wp(52),
    borderRadius: wp(10),
    backgroundColor: "#F8F8FA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  thumbImage: {
    width: wp(40),
    height: wp(40),
  },
  remainingBox: {
    backgroundColor: "#F5EEFF",
  },
  invoiceChip: {
    backgroundColor: "#F5EEFF",
    borderRadius: wp(10),
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    alignItems: "center",
    justifyContent: "center",
    gap: hp(3),
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(5),
    paddingVertical: hp(11),
    borderRadius: wp(10),
    borderWidth: 1.5,
    borderColor: "#8E0FFF",
    backgroundColor: "#FFFFFF",
  },
  actionBtnDone: {
    borderColor: "#34C759",
    backgroundColor: "#F0FDF4",
  },
  detailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(4),
    paddingVertical: hp(11),
    borderRadius: wp(10),
    backgroundColor: "#8E0FFF",
  },
  payNowPill: {
    backgroundColor: "#F5EEFF",
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
    borderRadius: wp(20),
  },
  paidPill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
    borderRadius: wp(20),
  },
  iconBtn: {
    backgroundColor: "#F5EEFF",
    width: wp(32),
    height: wp(32),
    borderRadius: wp(8),
    justifyContent: "center",
    alignItems: "center",
  },
});
