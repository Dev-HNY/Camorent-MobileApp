import React, { useState, useEffect, useRef } from "react";
import { YStack, ScrollView, Spinner, Text } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Alert, BackHandler, Keyboard } from "react-native";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useCartStore } from "@/store/cart/cart";
import { useAuthStore } from "@/store/auth/auth";
import { CartProgressIndicator } from "@/components/cart/CartProgressIndicator";
import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import { StickyBottomCart } from "@/components/PDP/StickyBottomCart";
import { hp, wp } from "@/utils/responsive";
import { useGetBookingById } from "@/hooks/shoots/useGetBookingById";
import { useGetBookingInvoice } from "@/hooks/shoots/useGetBookingInvoice";
import { useGetMyAddresses } from "@/hooks/delivery/useGetMyAddresses";
import {
  useCreateDraftBooking,
  DraftBookingRequest,
} from "@/hooks/crew/useCreateDraftBooking";
import { useCreateTransaction } from "@/hooks/payment/useCreateTransaction";
import { useCLearCart } from "@/hooks/cart/useClearCart";
import { useQueryClient } from "@tanstack/react-query";
import { AdminApprovalDialog } from "@/components/checkout/AdminApprovalDialog";
import { useBookingTimerStore } from "@/store/bookingTimer/bookingTimer";
import { PaymentDetails } from "@/components/checkout/PaymentDetails";
import { BillingSummary } from "@/components/checkout/BillingSummary";
import { PromocodeSection } from "@/components/checkout/PromocodeSection";
import { RentInfoBanner } from "@/components/checkout/RentInfoCards";
import { ShootSettingsManager } from "@/components/checkout/ShootSettingsManager";
import {
  formatBookingDate,
  formatDateForBackend,
  formatDateDisplay,
  isDateAfterOrEqual,
} from "@/utils/booking/dateFormatters";
import { formatBookingPaymentData } from "@/utils/booking/bookingDataFormatters";

export default function PaymentPage() {
  const {
    items,
    summary,
    rentalDates,
    shootName: storeShootName,
    calculateRentalDays,
  } = useCartStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { stopTimer, approveTimer } = useBookingTimerStore();
  const insets = useSafeAreaInsets();
  const [showShootSettings, setShowShootSettings] = useState<boolean>(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end">(
    "start"
  );
  const [shootName, setShootName] = useState(storeShootName || "");
  const [tempStartDate, setTempStartDate] = useState(
    rentalDates?.startDate || ""
  );
  const [tempEndDate, setTempEndDate] = useState(rentalDates?.endDate || "");
  const [tempStartTime, setTempStartTime] = useState("09:00 am");
  const [tempEndTime, setTempEndTime] = useState("12:00 pm");
  const [showAdminApprovalDialog, setShowAdminApprovalDialog] =
    useState<boolean>(true);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const lastHandledStatusRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef<boolean>(true);
  const { bookingId, setBookingId } = useCartStore();
  // Poll continuously while booking exists and has not yet been approved/rejected
  const { data: bookingDetails, isLoading: isLoadingBooking } =
    useGetBookingById(bookingId as string, !!bookingId);
  const { data: invoiceData, isLoading: isLoadingInvoice } =
    useGetBookingInvoice({
      bookingId: bookingId as string,
      invoice_id: bookingDetails?.invoice_id ?? "",
    });
  const { data: addresses, isLoading: isLoadingAddresses } =
    useGetMyAddresses();
  const bookingMutation = useCreateDraftBooking();
  const paymentMutation = useCreateTransaction();
  const clearCartMutation = useCLearCart();
  const isOrganization = user?.user_type === "organisation";

  const isLoading = isLoadingBooking || isLoadingAddresses;

  const handleBackPress = React.useCallback(() => {
    if (isOrganization) {
      router.replace("/(tabs)/(shoots)");
    } else {
      Alert.alert(
        "Leave payment?",
        "You need to complete payment to confirm your booking. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          { text: "Go back", style: "destructive", onPress: () => router.back() },
        ]
      );
    }
  }, [isOrganization]);

  // Intercept Android hardware back press on payment page
  useFocusEffect(
    React.useCallback(() => {
      const onHardwareBack = () => {
        handleBackPress();
        return true; // always intercept — handler decides what to do
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
      return () => sub.remove();
    }, [handleBackPress])
  );

  // Sync shoot details when rental dates or booking details change
  useEffect(() => {
    if (bookingDetails) {
      setTempStartDate(formatBookingDate(bookingDetails.rental_start_date));
      setTempEndDate(formatBookingDate(bookingDetails.rental_end_date));
    } else if (rentalDates) {
      setTempStartDate(rentalDates.startDate || "");
      setTempEndDate(rentalDates.endDate || "");
    }
  }, [rentalDates, bookingDetails]);

  // Sync shootName from store
  useEffect(() => {
    setShootName(storeShootName || "");
  }, [storeShootName]);

  // Check admin approval status once data loads
  useEffect(() => {
    if (!bookingDetails) return;

    const approval = bookingDetails.admin_approval;

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      if (approval !== "" && approval !== "pending" && approval !== "True") {
        setShowAdminApprovalDialog(false);
        lastHandledStatusRef.current = approval;
        return;
      }
    }

    if (approval === "" || approval === "pending") {
      setShowAdminApprovalDialog(true);
      lastHandledStatusRef.current = null;
    } else if (approval === "True") {
      setShowAdminApprovalDialog(false);
      lastHandledStatusRef.current = approval;
    } else if (lastHandledStatusRef.current !== approval) {
      stopTimer();
      setShowAdminApprovalDialog(false);
      lastHandledStatusRef.current = approval;
      Alert.alert(
        "Booking Rejected",
        "Your booking has been rejected by admin. Please review and try again.",
        [
          {
            text: "OK",
            onPress: () => {
              router.dismiss();
              router.dismiss();
              router.dismiss();
            },
          },
        ]
      );
    }
  }, [bookingDetails?.admin_approval]);

  const handleApprovalReceived = () => {
    approveTimer(); // shows congrats widget overlay before routing
    setShowAdminApprovalDialog(false);
    // Clear the server-side cart when admin approves - the booking is now locked in
    clearCartMutation.mutate();
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const handlePayNow = async () => {
    paymentMutation.mutate(
      {
        paymentPayload: {
          payment_method: "razorpay",
          payment_type: "final",
        },
        booking_id: bookingId,
      },
      {
        onSuccess: async (data) => {
          if (data.payment_link) {
            await Linking.openURL(data.payment_link);
            clearCartMutation.mutate();
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          } else {
          }
        },
        onError: (error) => {
        },
      }
    );
  };

  const handleStartDatePress = () => {
    setDatePickerMode("start");
    setShowDateTimePicker(true);
  };

  const handleEndDatePress = () => {
    setDatePickerMode("end");
    setShowDateTimePicker(true);
  };

  const handleDateRangeApply = (range: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }) => {
    if (datePickerMode === "start" && range.startDate) {
      setTempStartDate(range.startDate);
      if (range.startTime) setTempStartTime(range.startTime);
      if (tempEndDate && isDateAfterOrEqual(range.startDate, tempEndDate)) {
        setTempEndDate("");
      }
    } else if (datePickerMode === "end" && range.endDate) {
      setTempEndDate(range.endDate);
      if (range.endTime) setTempEndTime(range.endTime);
    }
    setShowDateTimePicker(false);
  };

  const handleShootSettingsDone = () => {
    if (!bookingDetails?.sku_items || bookingDetails.sku_items.length === 0) {
      Alert.alert("Error", "No booking items found");
      return;
    }

    if (!tempStartDate || !tempEndDate) {
      Alert.alert("Error", "Please select rental dates");
      return;
    }

    const mappedItems = bookingDetails.sku_items.map((item) => ({
      sku_id: item.id,
      quantity: item.quantity,
      addons: [],
    }));

    const draftBooking: DraftBookingRequest = {
      shoot_name: shootName,
      items: mappedItems,
      crews: [],
      rental_start_date: formatDateForBackend(tempStartDate),
      rental_end_date: formatDateForBackend(tempEndDate),
      coupon_codes: [],
    };
    setShowShootSettings(false);

    bookingMutation.mutate(draftBooking, {
      onSuccess: (response) => {
        setBookingId(response.booking_id);

        useCartStore.getState().setRentalDates({
          startDate: tempStartDate,
          endDate: tempEndDate,
        });
        useCartStore.getState().setShootName(shootName);

        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({
          queryKey: ["bookings", response.booking_id],
        });
      },
      onError: (error) => {
      },
    });
  };


  const { shootData, addressData, productData, crewData, billDetails } =
    formatBookingPaymentData(
      bookingDetails,
      rentalDates,
      addresses,
      summary,
      calculateRentalDays
    );

  // Compute coupon discount (placeholder - will use real data when backend supports it)
  const couponDiscount = isPromoApplied ? 240 : 0;
  const camocareAmount = 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <YStack flex={1}>
        {/* Header - clean white */}
        <YStack
          paddingTop={hp(12)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F3F4F6"
        >
          <Animated.View entering={FadeInDown.duration(300).springify()}>
            <YStack>
              <InsideScreenHeader onBackPress={handleBackPress} />
            </YStack>

            <YStack
              paddingHorizontal={wp(16)}
              paddingVertical={hp(16)}
              gap={hp(16)}
            >
              <CartProgressIndicator currentStep="payment" />
            </YStack>
          </Animated.View>
        </YStack>

        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color="#121217" />
            <Text fontSize={14} color="#6B7280" marginTop={hp(12)}>
              Loading payment details...
            </Text>
          </YStack>
        ) : (
          <ScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onScrollBeginDrag={Keyboard.dismiss}
              contentContainerStyle={{
                paddingBottom: insets.bottom + hp(220),
              }}
            >
              <YStack padding={wp(16)} gap={hp(12)}>
                <PaymentDetails
                  shootName={shootName}
                  shootDates={shootData.dates}
                  shootStartTime={shootData.startTime}
                  addressData={addressData}
                  productData={productData}
                  crewData={crewData}
                  hideEditShootDate
                  deliveryDate={
                    bookingDetails
                      ? formatBookingDate(bookingDetails.rental_start_date)
                      : ""
                  }
                  onEditShootSettings={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (bookingDetails) {
                      setTempStartDate(
                        formatBookingDate(bookingDetails.rental_start_date)
                      );
                      setTempEndDate(
                        formatBookingDate(bookingDetails.rental_end_date)
                      );
                    } else {
                      setTempStartDate(rentalDates?.startDate || "");
                      setTempEndDate(rentalDates?.endDate || "");
                    }
                    setShootName(storeShootName || "");
                    setShowShootSettings(true);
                  }}
                  onEditAddress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(tabs)/(home)/categories");
                  }}
                  onAddMoreProducts={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(tabs)/(home)/categories");
                  }}
                  onAddMoreCrew={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(tabs)/(home)/categories");
                  }}
                />

                <BillingSummary
                  itemTotal={billDetails.itemTotal}
                  crewTotal={billDetails.crewTotal}
                  gstCharges={billDetails.gstCharges}
                  cgstAmount={billDetails.cgstAmount}
                  sgstAmount={billDetails.sgstAmount}
                  igstAmount={billDetails.igstAmount}
                  couponDiscount={couponDiscount}
                  camocareAmount={camocareAmount}
                  totalAmount={billDetails.totalAmount}
                  invoiceId={bookingDetails?.invoice_id}
                  isLoadingInvoice={isLoadingInvoice}
                  invoiceUrl={invoiceData?.pdf_url}
                  onDownloadInvoice={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    invoiceData?.pdf_url && Linking.openURL(invoiceData.pdf_url);
                  }}
                />

                <RentInfoBanner />
              </YStack>
            </ScrollView>
        )}
        {/* Animated Sticky Bottom */}
        {bookingDetails?.sku_items && bookingDetails.sku_items.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500).springify()}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          >
            <StickyBottomCart
              embedded
              isPaymentScreen={true}
              isAdminApproved={bookingDetails.admin_approval === "True"}
              isOrganization={isOrganization}
              onContinue={handlePayNow}
              amount={bookingDetails?.total_amount}
              isLoading={paymentMutation.isPending}
            />
          </Animated.View>
        )}
      </YStack>
      {/* Shoot Settings Manager - Handles all sheet modals */}
      <ShootSettingsManager
        isShootSettingsOpen={showShootSettings}
        onCloseShootSettings={() => setShowShootSettings(false)}
        onDoneShootSettings={handleShootSettingsDone}
        onStartDatePress={handleStartDatePress}
        onEndDatePress={handleEndDatePress}
        startDate={tempStartDate}
        endDate={tempEndDate}
        startTime={tempStartTime}
        endTime={tempEndTime}
        formatDateDisplay={formatDateDisplay}
        isDateTimePickerOpen={showDateTimePicker}
        onCloseDateTimePicker={() => setShowDateTimePicker(false)}
        onApplyDateTimePicker={handleDateRangeApply}
        initialStartDate={tempStartDate}
        initialEndDate={tempEndDate}
        datePickerMode={datePickerMode}
      />
      <AdminApprovalDialog
        isOpen={showAdminApprovalDialog}
        onApprovalReceived={handleApprovalReceived}
        isApproved={bookingDetails?.admin_approval === "True"}
        bookingId={bookingId}
      />
    </SafeAreaView>
  );
}
