import React, { useState, useCallback } from "react";
import { YStack, XStack, Text } from "tamagui";
import * as Linking from "expo-linking";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { useGetBookingById } from "@/hooks/shoots/useGetBookingById";
import { PriceBreakdownSheet } from "@/components/shoots/PriceBreakdownSheet";
import { CancelOrderSheet } from "@/components/shoots/CancelOrderSheet";
import { OrderStatusCard } from "@/components/shoots/OrderStatusCard";
import { RatingCard } from "@/components/shoots/RatingCard";
import { OrderItemCard } from "@/components/shoots/OrderItemCard";
import { useGetBookingInvoice } from "@/hooks/shoots/useGetBookingInvoice";
import * as Haptics from "expo-haptics";
import { SkeletonOrderDetails } from "@/components/animations/SkeletonLoader";
import { ChevronLeft, FileText } from "lucide-react-native";

export default function OrderDetailsPage() {
  const { booking_id, status } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const { data: bookingDetails, isLoading: isLoadingBookingDetails, isError, error } =
    useGetBookingById(booking_id as string);

  const { data: invoiceData, isLoading: isLoadingInvoice } = useGetBookingInvoice({
    bookingId: booking_id as string,
    invoice_id: bookingDetails?.invoice_id ?? "",
  });

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  const headerBorderStyle = useAnimatedStyle(() => ({
    borderBottomColor: `rgba(229,231,235,${interpolate(scrollY.value, [0, 32], [0, 1], Extrapolation.CLAMP)})`,
  }));

  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  if (isLoadingBookingDetails) {
    return (
      <SafeAreaView style={styles.root}>
        <XStack alignItems="center" paddingHorizontal={wp(16)} height={hp(52)} gap={wp(12)}
          borderBottomWidth={1} borderBottomColor="#F3F4F6">
          <Pressable onPress={handleBackPress} style={styles.backBtn}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E">Order details</Text>
        </XStack>
        <SkeletonOrderDetails />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root}>
        <XStack alignItems="center" paddingHorizontal={wp(16)} height={hp(52)} gap={wp(12)}
          borderBottomWidth={1} borderBottomColor="#F3F4F6">
          <Pressable onPress={handleBackPress} style={styles.backBtn}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E">Order details</Text>
        </XStack>
        <Animated.View entering={FadeIn.duration(250)} style={styles.center}>
          <Text fontSize={fp(15)} color="#6C6C70" textAlign="center">
            {error?.message || "Failed to load booking details"}
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!bookingDetails) return null;

  const rentalDays = bookingDetails.total_rental_days;
  const showRatingCard = status === "past";
  const hasInvoice = !!(bookingDetails.invoice_id && bookingDetails.invoice_id !== "");
  const canOpenInvoice = hasInvoice && !isLoadingInvoice && !!invoiceData?.pdf_url;

  const productData = bookingDetails.sku_items?.map((item) => ({
    id: item.id, name: item.name, quantity: item.quantity,
    days: rentalDays, price: parseFloat(item.price_per_day), total: parseFloat(item.total_price),
  })) ?? [];

  const crewData = bookingDetails.crew_items?.map((item) => ({
    id: item.crew_id, name: item.crew_type_name, quantity: item.quantity,
    days: rentalDays, price: parseFloat(item.price_per_day), total: parseFloat(item.total_price),
  })) ?? [];

  const totalItems = productData.length + crewData.length;
  const deliveryLabel = new Date(bookingDetails.rental_start_date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <SafeAreaView style={styles.root}>

      {/* Sticky header */}
      <Animated.View style={[styles.header, headerBorderStyle]}>
        <XStack alignItems="center" paddingHorizontal={wp(16)} height={hp(52)} gap={wp(12)}>
          <Pressable onPress={handleBackPress} style={styles.backBtn} hitSlop={8}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" flex={1} letterSpacing={-0.3}>
            Order #{booking_id?.toString().slice(-6)}
          </Text>
          {hasInvoice && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                canOpenInvoice && Linking.openURL(invoiceData!.pdf_url);
              }}
              disabled={!canOpenInvoice}
              hitSlop={8}
              style={styles.invoiceBtn}
            >
              <Text fontSize={fp(13)} fontWeight="600" color={canOpenInvoice ? "#8E0FFF" : "#C7C7CC"}>
                {isLoadingInvoice ? "Loading..." : "Invoice"}
              </Text>
            </Pressable>
          )}
        </XStack>
      </Animated.View>

      {/* Scrollable body */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: hp(20), paddingBottom: insets.bottom + hp(48) }}
      >
        <YStack gap={hp(12)} paddingHorizontal={wp(16)}>

          {/* Status card */}
          <Animated.View entering={FadeInDown.duration(280).springify().damping(20).stiffness(260)}>
            <OrderStatusCard
              deliveryDate={new Date(bookingDetails.rental_start_date)}
              status={bookingDetails.status}
              onTrackOrder={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: "/(tabs)/(shoots)/track-order", params: { booking_id } });
              }}
            />
          </Animated.View>

          {/* Rating card */}
          {showRatingCard && (
            <Animated.View entering={FadeInDown.delay(60).duration(280).springify().damping(20).stiffness(260)}>
              <RatingCard
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: "/(tabs)/(shoots)/rating", params: { booking_id } });
                }}
                rating={bookingDetails.rating}
                review={bookingDetails.review}
              />
            </Animated.View>
          )}

          {/* Items section */}
          <Animated.View entering={FadeInDown.delay(showRatingCard ? 120 : 60).duration(280).springify().damping(20).stiffness(260)}>
            <YStack gap={hp(10)}>
              {/* Section label */}
              <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={wp(4)}>
                <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4}>
                  ITEMS IN ORDER
                </Text>
                <Text fontSize={fp(13)} fontWeight="500" color="#8E8E93">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </Text>
              </XStack>

              {/* Grouped white card */}
              <YStack style={styles.card}>

                {/* Delivery row */}
                <XStack alignItems="center" justifyContent="space-between"
                  paddingHorizontal={wp(16)} paddingVertical={hp(14)}>
                  <Text fontSize={fp(14)} color="#8E8E93">Delivery scheduled</Text>
                  <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">{deliveryLabel}</Text>
                </XStack>

                <YStack height={1} backgroundColor="#F2F2F7" />

                {/* Products */}
                {productData.length > 0 && (
                  <YStack paddingHorizontal={wp(16)} paddingTop={hp(14)}>
                    {productData.map((item, i) => (
                      <React.Fragment key={item.id}>
                        <OrderItemCard
                          id={item.id} name={item.name} quantity={item.quantity}
                          days={item.days} total={item.total} showReplaceButton={false}
                        />
                        {i < productData.length - 1 && (
                          <YStack height={1} backgroundColor="#F2F2F7" marginVertical={hp(12)} />
                        )}
                      </React.Fragment>
                    ))}
                  </YStack>
                )}

                {/* Crew */}
                {crewData.length > 0 && (
                  <>
                    <YStack height={1} backgroundColor="#F2F2F7" marginTop={hp(14)} />
                    <YStack paddingHorizontal={wp(16)} paddingTop={hp(14)}>
                      {crewData.map((item, i) => (
                        <React.Fragment key={item.id}>
                          <OrderItemCard
                            id={item.id} name={item.name} quantity={item.quantity}
                            days={item.days} total={item.total}
                            imageUri={`https://img.camorent.co.in/crews/images/${item.id}.webp`}
                            showReplaceButton={false}
                          />
                          {i < crewData.length - 1 && (
                            <YStack height={1} backgroundColor="#F2F2F7" marginVertical={hp(12)} />
                          )}
                        </React.Fragment>
                      ))}
                    </YStack>
                  </>
                )}

                {/* Total row */}
                <YStack height={1} backgroundColor="#F2F2F7" marginTop={hp(14)} />
                <XStack alignItems="center" justifyContent="space-between"
                  paddingHorizontal={wp(16)} paddingVertical={hp(16)}>
                  <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E">Total</Text>
                  <YStack alignItems="flex-end" gap={hp(4)}>
                    <Text fontSize={fp(20)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.5}>
                      {"\u20B9"}{parseFloat(bookingDetails.total_amount).toLocaleString()}
                    </Text>
                    <Pressable hitSlop={8} onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowPriceBreakdown(true);
                    }}>
                      <Text fontSize={fp(12)} fontWeight="600" color="#8E0FFF">
                        View price breakup
                      </Text>
                    </Pressable>
                  </YStack>
                </XStack>
              </YStack>
            </YStack>
          </Animated.View>

          {/* Support */}
          <Animated.View entering={FadeInDown.delay(showRatingCard ? 180 : 120).duration(280).springify().damping(20).stiffness(260)}>
            <YStack gap={hp(10)}>
              <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4} paddingHorizontal={wp(4)}>
                SUPPORT
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL("mailto:support@camorent.co.in");
                }}
                style={({ pressed }) => [styles.helpRow, { opacity: pressed ? 0.7 : 1 }]}
              >
                <XStack alignItems="center" gap={wp(12)} flex={1}>
                  <XStack width={36} height={36} borderRadius={10}
                    backgroundColor="#F5EEFF" alignItems="center" justifyContent="center">
                    <FileText size={18} color="#8E0FFF" strokeWidth={2} />
                  </XStack>
                  <YStack gap={hp(2)}>
                    <Text fontSize={fp(15)} fontWeight="500" color="#1C1C1E">Chat with us</Text>
                    <Text fontSize={fp(12)} color="#8E8E93">support@camorent.co.in</Text>
                  </YStack>
                </XStack>
                <ChevronLeft size={18} color="#C7C7CC"
                  style={{ transform: [{ rotate: "180deg" }] }} strokeWidth={2} />
              </Pressable>
            </YStack>
          </Animated.View>

        </YStack>
      </Animated.ScrollView>

      <PriceBreakdownSheet
        open={showPriceBreakdown}
        onOpenChange={setShowPriceBreakdown}
        itemsCount={productData.length}
        itemsAmount={bookingDetails.sku_amount}
        crewAmount={bookingDetails.crew_amount}
        discountAmount={"0"}
        couponDiscountAmount={bookingDetails.coupon_discount_amount}
        cgstAmount={bookingDetails.CGST_amount}
        sgstAmount={bookingDetails.SGST_amount}
        igstAmount={bookingDetails.IGST_amount}
        rentalDays={rentalDays}
        totalAmount={bookingDetails.total_amount}
      />

      <CancelOrderSheet
        open={showCancelSheet}
        onOpenChange={setShowCancelSheet}
        onConfirmCancel={() => { setShowCancelSheet(false); router.back(); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F7" },
  header: { backgroundColor: "#FFFFFF", borderBottomWidth: 1 },
  backBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center",
  },
  invoiceBtn: {
    paddingVertical: hp(6), paddingHorizontal: wp(10),
    borderRadius: wp(8), backgroundColor: "#F5EEFF",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: wp(24) },
  card: {
    backgroundColor: "#FFFFFF", borderRadius: wp(14), overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  helpRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    borderRadius: wp(14), paddingHorizontal: wp(14), paddingVertical: hp(14),
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
});
