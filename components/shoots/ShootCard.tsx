import React, { useMemo } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Image } from "expo-image";
import { Pressable, Share } from "react-native";
import { MyShootsBooking } from "@/utils/categorise-bookings";
import { Calendar, Check, ChevronRight, Mail, FileText, Share2 } from "lucide-react-native";
import { router } from "expo-router";
import { wp, hp, fp } from "@/utils/responsive";
import { formatDate } from "@/utils/date";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { apiClient } from "@/lib/api-client";

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

export function ShootCard({
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

  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={wp(16)}
      borderWidth={1}
      borderColor="#E5E7EB"
      padding={wp(16)}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.06}
      shadowRadius={8}
      elevation={2}
    >
      {/* Top row: date + status badge */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={hp(12)}>
        <XStack alignItems="center" gap={wp(6)}>
          <Calendar size={hp(14)} color="#8E8E93" strokeWidth={2} />
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
          letterSpacing={-0.3}
          flex={1}
          marginRight={wp(12)}
          numberOfLines={2}
        >
          {shoot.shoot_name || "Unnamed Shoot"}
        </Text>
        <YStack alignItems="flex-end" gap={hp(2)}>
          <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E">
            ₹{shoot.total_amount.toLocaleString()}
          </Text>
          {needsPayment ? (
            <Pressable
              hitSlop={10}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                try {
                  // Fetch invoice directly when clicked
                  const response = await apiClient.get(`/bookings/${shoot.booking_id}/invoice/download`);
                  if (response.data?.pdf_url) {
                    Linking.openURL(response.data.pdf_url);
                  } else {
                    // Fallback to order details if no pdf_url
                    onOrderDetailsClick?.();
                  }
                } catch (error) {
                  console.error("Error fetching invoice:", error);
                  // Fallback to order details on error
                  onOrderDetailsClick?.();
                }
              }}
            >
              <Text fontSize={fp(11)} fontWeight="600" color="#8E0FFF" textDecorationLine="underline">
                Pay Now
              </Text>
            </Pressable>
          ) : (
            <Text fontSize={fp(11)} fontWeight="500" color="#16A34A">
              Paid
            </Text>
          )}
        </YStack>
      </XStack>

      {/* Product image thumbnails + View Invoice */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={hp(14)}>
        <XStack gap={wp(8)} alignItems="center">
          {displayItems.map((_, idx) => (
            <YStack
              key={idx}
              width={wp(52)}
              height={hp(52)}
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
                  source={{ uri: productImages[idx] }}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                  style={{ width: wp(42), height: hp(42) }}
                />
              </LinearGradient>
            </YStack>
          ))}
          {remainingItems > 0 && (
            <YStack
              width={wp(52)}
              height={hp(52)}
              borderRadius={wp(10)}
              borderWidth={1}
              borderColor="#E5E7EB"
              backgroundColor="#F5F3FF"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={fp(13)} fontWeight="700" color="#8E0FFF">
                +{remainingItems}
              </Text>
              <Text fontSize={fp(9)} fontWeight="500" color="#8E0FFF" marginTop={hp(1)}>
                items
              </Text>
            </YStack>
          )}
        </XStack>

        {/* View Invoice button — fills empty right space */}
        <Pressable
          hitSlop={10}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            try {
              // Fetch invoice directly when clicked
              const response = await apiClient.get(`/bookings/${shoot.booking_id}/invoice/download`);
              if (response.data?.pdf_url) {
                Linking.openURL(response.data.pdf_url);
              } else {
                // Fallback to order details if no pdf_url
                onOrderDetailsClick?.();
              }
            } catch (error) {
              console.error("Error fetching invoice:", error);
              // Fallback to order details on error
              onOrderDetailsClick?.();
            }
          }}
        >
          <YStack
            backgroundColor="#F5F3FF"
            borderRadius={wp(10)}
            paddingVertical={hp(8)}
            paddingHorizontal={wp(10)}
            alignItems="center"
            justifyContent="center"
            gap={hp(4)}
          >
            <FileText size={hp(18)} color="#8E0FFF" strokeWidth={1.8} />
            <Text fontSize={fp(10)} fontWeight="600" color="#8E0FFF">
              {needsPayment ? "Pay now" : "Invoice"}
            </Text>
          </YStack>
        </Pressable>
      </XStack>

      {/* View order details link */}
      <Pressable
        hitSlop={12}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onOrderDetailsClick?.();
        }}
        style={{ marginBottom: hp(14) }}
      >
        <XStack alignItems="center" gap={wp(4)}>
          <Text fontSize={fp(13)} color="#8E0FFF" fontWeight="600">
            View order details
          </Text>
          <ChevronRight size={hp(15)} color="#8E0FFF" strokeWidth={2.5} />
        </XStack>
      </Pressable>

      {/* Action Buttons */}
      <XStack gap={wp(10)}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleLeftButtonClick();
          }}
          disabled={tab === "past" && !!shoot.rating}
          style={{
            flex: 1,
            paddingVertical: hp(11),
            borderRadius: wp(10),
            borderWidth: 1.5,
            borderColor: "#8E0FFF",
            backgroundColor: "#FFFFFF",
            opacity: tab === "past" && shoot.rating ? 0.45 : 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: wp(5),
          }}
        >
          {tab === "past" && shoot.rating && (
            <Check size={hp(14)} color="#16A34A" strokeWidth={2.5} />
          )}
          <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">
            {leftLabel}
          </Text>
        </Pressable>
        {/* Reschedule / Track — hidden until feature is ready */}
        {/* <Pressable
          style={{
            flex: 1,
            paddingVertical: hp(11),
            borderRadius: wp(10),
            backgroundColor: "#8E0FFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text fontSize={fp(13)} fontWeight="600" color="#FFFFFF">
            {tab === "past" ? "Reorder" : tab === "ongoing" ? "Track" : "Reschedule"}
          </Text>
        </Pressable> */}
      </XStack>

      {/* Footer: Order ID + icon actions */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginTop={hp(14)}
        paddingTop={hp(12)}
        borderTopWidth={1}
        borderTopColor="#F3F4F6"
      >
        <Text fontSize={fp(11)} color="#9CA3AF" fontWeight="500">
          Order ID: #{shoot.booking_id.slice(-8)}
        </Text>
        <XStack gap={wp(10)} alignItems="center">
          {/* Email support */}
          <Pressable
            hitSlop={10}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL("mailto:support@camorent.co.in");
            }}
          >
            <YStack
              backgroundColor="#F5F3FF"
              width={wp(32)}
              height={wp(32)}
              borderRadius={wp(8)}
              justifyContent="center"
              alignItems="center"
            >
              <Mail size={hp(15)} color="#8E0FFF" strokeWidth={2} />
            </YStack>
          </Pressable>

          {/* Share app */}
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
            <YStack
              backgroundColor="#F5F3FF"
              width={wp(32)}
              height={wp(32)}
              borderRadius={wp(8)}
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={hp(15)} color="#8E0FFF" strokeWidth={2} />
            </YStack>
          </Pressable>
        </XStack>
      </XStack>
    </YStack>
  );
}
