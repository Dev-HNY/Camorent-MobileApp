import React, { useState, useCallback } from "react";
import {
  YStack,
  XStack,
  Text,
  Stack,
  Separator,
} from "tamagui";
import * as Linking from "expo-linking";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeInDown,
  FadeIn,
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
import { DURATION } from "@/components/animations/constants";
import { ChevronLeft } from "lucide-react-native";

export default function OrderDetailsPage() {
  const { booking_id, status } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  const {
    data: bookingDetails,
    isLoading: isLoadingBookingDetails,
    isError,
    error,
  } = useGetBookingById(booking_id as string);

  const { data: invoiceData, isLoading: isLoadingInvoice } =
    useGetBookingInvoice({
      bookingId: booking_id as string,
      invoice_id: bookingDetails?.invoice_id ?? "",
    });

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Header bottom border fades in after a bit of scroll
  const animatedHeaderBorder = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { borderBottomColor: `rgba(229, 231, 235, ${opacity})` };
  });

  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  if (isLoadingBookingDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(12)}
          gap={wp(12)}
          borderBottomWidth={1}
          borderBottomColor="#F3F4F6"
        >
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E">
            Order details
          </Text>
        </XStack>
        <SkeletonOrderDetails />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(12)}
          gap={wp(12)}
          borderBottomWidth={1}
          borderBottomColor="#F3F4F6"
        >
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E">
            Order details
          </Text>
        </XStack>
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.errorContainer}
        >
          <Text fontSize={fp(16)} color="#6C6C70" textAlign="center">
            {error?.message || "Failed to load booking details"}
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!bookingDetails) {
    return null;
  }

  const rentalDays = bookingDetails.total_rental_days;

  const productData = bookingDetails.sku_items?.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    days: rentalDays,
    price: parseFloat(item.price_per_day),
    total: parseFloat(item.total_price),
  }));

  const crewData = bookingDetails.crew_items?.map((item) => ({
    id: item.crew_id,
    name: item.crew_type_name,
    quantity: item.quantity,
    days: rentalDays,
    price: parseFloat(item.price_per_day),
    total: parseFloat(item.total_price),
  }));

  const handleRateClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(shoots)/rating",
      params: { booking_id },
    });
  };

  const handleTrackOrder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(shoots)/track-order",
      params: { booking_id },
    });
  };

  const handleReplaceItem = (itemId: string, itemName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(shoots)/replace-item",
      params: { itemId, itemName },
    });
  };

  const handleConfirmCancel = () => {
    setShowCancelSheet(false);
    router.back();
  };

  const showReplaceButton = false;
  const showRatingCard = status === "past";

  return (
    <SafeAreaView style={styles.container}>
      {/* Always-visible sticky header */}
      <Animated.View style={[styles.header, animatedHeaderBorder]}>
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          height={hp(52)}
          gap={wp(12)}
        >
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <ChevronLeft size={22} color="#1C1C1E" />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" flex={1}>
            Order #{booking_id?.toString().slice(-6)}
          </Text>
          {bookingDetails?.invoice_id && bookingDetails.invoice_id !== "" && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                invoiceData?.pdf_url && Linking.openURL(invoiceData.pdf_url);
              }}
              disabled={isLoadingInvoice || !invoiceData?.pdf_url}
              style={styles.invoiceButton}
            >
              <Text
                fontSize={fp(13)}
                fontWeight="600"
                color={isLoadingInvoice ? "#B8B8C7" : "#8E0FFF"}
              >
                {isLoadingInvoice ? "Loading..." : "Invoice"}
              </Text>
            </Pressable>
          )}
        </XStack>
      </Animated.View>

      <YStack flex={1}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: hp(16),
            paddingBottom: insets.bottom + hp(24),
          }}
        >
          <YStack gap={hp(20)} paddingHorizontal={wp(16)}>
            {/* Order Status Card */}
            <Animated.View
              entering={FadeInDown.delay(0).springify().damping(18).stiffness(250)}
            >
              <OrderStatusCard
                deliveryDate={new Date(bookingDetails.rental_start_date)}
                status={bookingDetails.status}
                onTrackOrder={handleTrackOrder}
              />
            </Animated.View>

            {/* Rating Card - for past orders */}
            {showRatingCard && (
              <Animated.View
                entering={FadeInDown.delay(DURATION.stagger).springify().damping(18).stiffness(250)}
              >
                <RatingCard
                  onPress={handleRateClick}
                  rating={bookingDetails.rating}
                  review={bookingDetails.review}
                />
              </Animated.View>
            )}

            {/* All Items Card */}
            <Animated.View
              entering={FadeInDown.delay(DURATION.stagger * 2).springify().damping(18).stiffness(250)}
            >
              <YStack gap={hp(12)}>
                <XStack alignItems="center" justifyContent="space-between">
                  <Text fontSize={fp(18)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
                    All Items
                  </Text>
                  <Text fontSize={fp(13)} fontWeight="500" color="#8E8E93">
                    {productData.length + crewData.length} item{productData.length + crewData.length !== 1 ? "s" : ""}
                  </Text>
                </XStack>

                {/* Clean white card — no gradient */}
                <Stack style={styles.itemsCard}>
                  <YStack gap={hp(16)}>
                    {/* Delivery info */}
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack gap={hp(2)}>
                        <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                          Delivery scheduled on
                        </Text>
                        <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">
                          {new Date(bookingDetails.rental_start_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </YStack>
                    </XStack>

                    <Separator borderColor="#F3F4F6" />

                    {/* Product Items */}
                    {productData.length > 0 && (
                      <YStack gap={hp(16)}>
                        {productData.map((item, index) => (
                          <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(DURATION.stagger * (3 + index))
                              .springify()
                              .damping(18)
                              .stiffness(250)}
                                      >
                            <OrderItemCard
                              id={item.id}
                              name={item.name}
                              quantity={item.quantity}
                              days={item.days}
                              total={item.total}
                              showReplaceButton={showReplaceButton}
                              onReplace={() => handleReplaceItem(item.id, item.name)}
                            />
                          </Animated.View>
                        ))}
                      </YStack>
                    )}

                    {/* Crew Items */}
                    {crewData.length > 0 && (
                      <>
                        {productData.length > 0 && (
                          <Separator borderStyle="dashed" borderColor="#E5E7EB" />
                        )}
                        <YStack gap={hp(16)}>
                          {crewData.map((item, index) => (
                            <Animated.View
                              key={item.id}
                              entering={FadeInDown.delay(
                                DURATION.stagger * (3 + productData.length + index)
                              )
                                .springify()
                                .damping(18)
                                .stiffness(250)}
                                          >
                              <OrderItemCard
                                id={item.id}
                                name={item.name}
                                quantity={item.quantity}
                                days={item.days}
                                imageUri={`https://img.camorent.co.in/crews/images/${item.id}.webp`}
                                total={item.total}
                                showReplaceButton={showReplaceButton}
                                onReplace={() => handleReplaceItem(item.id, item.name)}
                              />
                            </Animated.View>
                          ))}
                        </YStack>
                      </>
                    )}

                    <Separator borderColor="#F3F4F6" />

                    {/* Total Price Row */}
                    <XStack alignItems="center" justifyContent="space-between">
                      <Text fontSize={fp(16)} fontWeight="700" color="#1C1C1E">
                        Total Price
                      </Text>
                      <YStack alignItems="flex-end" gap={hp(4)}>
                        <Text
                          fontSize={fp(20)}
                          fontWeight="700"
                          color="#1C1C1E"
                          letterSpacing={-0.5}
                        >
                          ₹{parseFloat(bookingDetails.total_amount).toLocaleString()}
                        </Text>
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowPriceBreakdown(true);
                          }}
                          style={styles.priceBreakupButton}
                        >
                          <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">
                            Price breakup
                          </Text>
                        </Pressable>
                      </YStack>
                    </XStack>
                  </YStack>
                </Stack>
              </YStack>
            </Animated.View>

            {/* Need Help */}
            <Animated.View
              entering={FadeInDown.delay(DURATION.stagger * 5).springify().damping(18).stiffness(250)}
            >
              <YStack gap={hp(12)}>
                <Text fontSize={fp(18)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
                  Need help?
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Linking.openURL("mailto:support@camorent.co.in");
                  }}
                  style={styles.helpButton}
                >
                  <Text fontSize={fp(15)} fontWeight="600" color="#8E0FFF">
                    Chat with us
                  </Text>
                </Pressable>
              </YStack>
            </Animated.View>
          </YStack>
        </Animated.ScrollView>
      </YStack>

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
        onConfirmCancel={handleConfirmCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  backButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(16),
  },
  itemsCard: {
    borderRadius: wp(14),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: wp(16),
    backgroundColor: "#FFFFFF",
  },
  invoiceButton: {
    paddingVertical: hp(4),
    paddingHorizontal: wp(8),
  },
  priceBreakupButton: {
    paddingVertical: hp(2),
  },
  helpButton: {
    width: "100%",
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
    borderRadius: wp(10),
    borderWidth: 1.5,
    borderColor: "#E5D5FF",
    backgroundColor: "#FAFAFF",
    alignItems: "center",
  },
});
