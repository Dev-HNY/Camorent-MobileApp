import React, { useState, useEffect, useRef } from "react";
import { YStack, ScrollView, Spinner, Text } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import {
  Alert,
  BackHandler,
  Keyboard,
  RefreshControl,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useCartStore } from "@/store/cart/cart";
import { useAuthStore } from "@/store/auth/auth";
import { CartProgressIndicator } from "@/components/cart/CartProgressIndicator";
import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import { StickyBottomCart } from "@/components/PDP/StickyBottomCart";
import { hp, wp, fp } from "@/utils/responsive";
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
import { AdminApprovalDialog, BookingRejectedDialog } from "@/components/checkout/AdminApprovalDialog";
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
import { useUpdateUserProfile } from "@/hooks/auth/useUpdateUserProfile";
import { useVerifyGST } from "@/hooks/verifications/useVerifyGST";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Polyline } from "react-native-svg";

// ─── GSTIN regex (same as onboarding) ────────────────────────────────────────
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

// ─── GSTSection ───────────────────────────────────────────────────────────────
interface GSTSectionProps {
  initialGSTIN: string;
}

function GSTSection({ initialGSTIN }: GSTSectionProps) {
  const [enabled, setEnabled] = useState(!!initialGSTIN);
  const [gstin, setGstin] = useState(initialGSTIN || "");
  const [verifiedOrgName, setVerifiedOrgName] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(!!initialGSTIN);
  const [inputError, setInputError] = useState("");

  const { updateUser } = useAuthStore();
  const verifyMutation = useVerifyGST();
  const updateProfileMutation = useUpdateUserProfile();

  useEffect(() => {
    if (initialGSTIN) {
      setGstin(initialGSTIN);
      setEnabled(true);
      setIsSaved(true);
    }
  }, [initialGSTIN]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      setInputError("");
      verifyMutation.reset();
    }
  };

  const handleChange = (text: string) => {
    const upper = text.toUpperCase();
    setGstin(upper);
    setIsSaved(false);
    setInputError("");
    verifyMutation.reset();
    setVerifiedOrgName(null);
    // Auto-verify when 15 valid chars entered
    if (upper.length === 15 && GST_REGEX.test(upper)) {
      verifyMutation.mutate(
        { gstin: upper },
        {
          onSuccess: (data: any) => {
            if (data?.legal_name) {
              setVerifiedOrgName(data.legal_name);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        }
      );
    }
  };

  const handleSave = () => {
    const trimmed = gstin.trim();
    if (!trimmed || trimmed.length !== 15 || !GST_REGEX.test(trimmed)) {
      setInputError("Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)");
      return;
    }
    if (!verifyMutation.isSuccess) {
      setInputError("Please wait for GSTIN verification");
      return;
    }
    updateProfileMutation.mutate(
      {
        first_name: "", // required by type; backend merges existing values
        GSTIN_no: trimmed,
        ...(verifiedOrgName ? { org_name: verifiedOrgName } : {}),
      },
      {
        onSuccess: (data) => {
          updateUser(data as any);
          setIsSaved(true);
          setInputError("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: () => {
          setInputError("Failed to save GSTIN. Please try again.");
        },
      }
    );
  };

  const isVerifying = verifyMutation.isPending;
  const isVerified = verifyMutation.isSuccess;
  const verifyFailed = verifyMutation.isError;
  const isSaving = updateProfileMutation.isPending;
  const canSave = isVerified && !isSaved && !isSaving;

  return (
    <View style={gstStyles.card}>
      {/* Header — toggle row */}
      <Pressable onPress={handleToggle} style={gstStyles.headerRow}>
        <View style={gstStyles.labelGroup}>
          <View style={gstStyles.iconWrap}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="#8E0FFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Polyline
                points="14 2 14 8 20 8"
                stroke="#8E0FFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 13h6M9 17h4"
                stroke="#8E0FFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={gstStyles.title}>GST Invoice</Text>
            <Text style={gstStyles.subtitle} numberOfLines={1}>
              {isSaved && gstin
                ? `GSTIN: ${gstin}`
                : "Avail GST invoice for this booking"}
            </Text>
          </View>
        </View>
        <View style={[gstStyles.toggle, enabled && gstStyles.toggleOn]}>
          <View style={[gstStyles.thumb, enabled && gstStyles.thumbOn]} />
        </View>
      </Pressable>

      {/* Expanded area */}
      {enabled && (
        <View style={gstStyles.inputArea}>
          <View style={gstStyles.divider} />

          <View style={gstStyles.inputRow}>
            <TextInput
              style={[
                gstStyles.input,
                inputError ? gstStyles.inputError : null,
                isVerified ? gstStyles.inputVerified : null,
              ]}
              value={gstin}
              onChangeText={handleChange}
              placeholder="Enter 15-digit GSTIN"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={15}
              returnKeyType="done"
              editable={!isSaved}
            />

            {/* Status / action on the right */}
            {isVerifying || isSaving ? (
              // Spinner for both verifying and saving states
              <View style={[gstStyles.statusWrap, isSaving && { borderColor: "#8E0FFF", backgroundColor: "#F5EDFF" }]}>
                <ActivityIndicator size="small" color="#8E0FFF" />
              </View>
            ) : isSaved ? (
              <View style={[gstStyles.statusWrap, gstStyles.statusSaved]}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17l-5-5"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            ) : (
              <Pressable
                onPress={handleSave}
                disabled={!canSave}
                style={({ pressed }) => [
                  gstStyles.saveBtn,
                  !canSave && gstStyles.saveBtnDisabled,
                  pressed && { opacity: 0.82 },
                ]}
              >
                <LinearGradient
                  colors={["#8E0FFF", "#6D00DA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={gstStyles.saveBtnGrad}
                >
                  <Text style={gstStyles.saveBtnText}>Save</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>

          {/* Feedback messages */}
          {!!inputError && <Text style={gstStyles.errorText}>{inputError}</Text>}
          {isVerifying && <Text style={gstStyles.hintText}>Verifying GSTIN…</Text>}
          {isVerified && !isSaved && (
            <Text style={[gstStyles.hintText, { color: "#22C55E" }]}>
              ✓ GSTIN verified — tap Save to apply to this booking
            </Text>
          )}
          {verifyFailed && (
            <Text style={gstStyles.errorText}>
              {(verifyMutation.error as any)?.response?.data?.message ||
                "GSTIN verification failed. Please check the number."}
            </Text>
          )}

          {/* Verified org name */}
          {isVerified && verifiedOrgName && (
            <View style={gstStyles.orgCard}>
              <Text style={gstStyles.orgLabel}>Organisation Name</Text>
              <Text style={gstStyles.orgName}>{verifiedOrgName}</Text>
            </View>
          )}

          {/* Change GSTIN link */}
          {isSaved && (
            <Pressable
              onPress={() => {
                setIsSaved(false);
                verifyMutation.reset();
                setVerifiedOrgName(null);
              }}
              hitSlop={8}
            >
              <Text style={gstStyles.changeLink}>Change GSTIN</Text>
            </Pressable>
          )}

          {!isSaved && (
            <Text style={gstStyles.hintText}>
              Your GSTIN will be saved to your profile and sent to the payment gateway.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const gstStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    borderWidth: 1,
    borderColor: "#F3F0FF",
    overflow: "hidden",
    shadowColor: "#8E0FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    flex: 1,
    marginRight: wp(12),
  },
  iconWrap: {
    width: wp(34),
    height: wp(34),
    borderRadius: wp(10),
    backgroundColor: "#F5EDFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fp(14),
    fontWeight: "600",
    color: "#121217",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: fp(11.5),
    color: "#8E0FFF",
    marginTop: hp(1),
    fontWeight: "500",
  },
  toggle: {
    width: wp(44),
    height: wp(26),
    borderRadius: wp(13),
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: wp(3),
  },
  toggleOn: { backgroundColor: "#8E0FFF" },
  thumb: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: "flex-start",
  },
  thumbOn: { alignSelf: "flex-end" },
  inputArea: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(14),
    gap: hp(8),
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F0FF",
    marginBottom: hp(2),
  },
  inputRow: {
    flexDirection: "row",
    gap: wp(10),
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: hp(44),
    borderWidth: 1.5,
    borderColor: "#E5D5FF",
    borderRadius: wp(10),
    paddingHorizontal: wp(12),
    fontSize: fp(13.5),
    color: "#121217",
    backgroundColor: "#FAFAFA",
    letterSpacing: 1,
    fontWeight: "600",
  },
  inputError: { borderColor: "#EF4444" },
  inputVerified: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  statusWrap: {
    width: wp(44),
    height: hp(44),
    borderRadius: wp(10),
    borderWidth: 1.5,
    borderColor: "#E5D5FF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  statusSaved: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  saveBtn: {
    borderRadius: wp(10),
    overflow: "hidden",
    height: hp(44),
    minWidth: wp(64),
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(14),
  },
  saveBtnText: {
    fontSize: fp(13),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  errorText: {
    fontSize: fp(11.5),
    color: "#EF4444",
  },
  hintText: {
    fontSize: fp(11.5),
    color: "#9CA3AF",
    lineHeight: hp(16),
  },
  orgCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#22C55E",
    borderRadius: wp(10),
    padding: wp(12),
    gap: hp(3),
  },
  orgLabel: {
    fontSize: fp(11),
    color: "#6C6C89",
    fontWeight: "500",
  },
  orgName: {
    fontSize: fp(13.5),
    fontWeight: "700",
    color: "#121217",
  },
  changeLink: {
    fontSize: fp(12),
    color: "#8E0FFF",
    fontWeight: "600",
  },
});

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
  // Start as false — the useEffect opens it once booking data confirms pending status
  const [showAdminApprovalDialog, setShowAdminApprovalDialog] =
    useState<boolean>(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchBooking(), refetchInvoice()]);
    setRefreshing(false);
  };
  const [isPartialPaymentLoading, setIsPartialPaymentLoading] = useState(false);
  const [showRejectedDialog, setShowRejectedDialog] = useState(false);

  const lastHandledStatusRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef<boolean>(true);
  // Tracks whether the user explicitly dismissed the approval dialog so polling
  // doesn't re-open it while status is still "pending"
  const userDismissedDialogRef = useRef<boolean>(false);
  const { bookingId, setBookingId } = useCartStore();
  // Poll continuously while booking exists and has not yet been approved/rejected
  const { data: bookingDetails, isLoading: isLoadingBooking, refetch: refetchBooking } =
    useGetBookingById(bookingId as string, !!bookingId);
  const { data: invoiceData, isLoading: isLoadingInvoice, refetch: refetchInvoice } =
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
        "You need to complete payment to confirm your booking.",
        [{ text: "Stay", style: "cancel" }]
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
      // Only (re-)open dialog if user hasn't explicitly dismissed it
      if (!userDismissedDialogRef.current) {
        setShowAdminApprovalDialog(true);
      }
      lastHandledStatusRef.current = null;
    } else if (approval === "True") {
      setShowAdminApprovalDialog(false);
      lastHandledStatusRef.current = approval;
    } else if (lastHandledStatusRef.current !== approval) {
      stopTimer();
      setShowAdminApprovalDialog(false);
      lastHandledStatusRef.current = approval;
      setShowRejectedDialog(true);
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
    setIsPayingNow(true);
    const savedGSTIN = user?.GSTIN_no || "";

    paymentMutation.mutate(
      {
        paymentPayload: {
          payment_method: "razorpay",
          payment_type: "final",
          ...(savedGSTIN ? { gst_number: savedGSTIN } : {}),
        },
        booking_id: bookingId,
      },
      {
        onSuccess: async (data) => {
          if (data.payment_link) {
            await Linking.openURL(data.payment_link);
            clearCartMutation.mutate();
            queryClient.invalidateQueries({ queryKey: ["cart"] });
          }
          setIsPayingNow(false);
        },
        onError: () => {
          setIsPayingNow(false);
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


  const { shootData, addressData, productData, crewData, billDetails, isSelfPickup } =
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#8E0FFF"
                  colors={["#8E0FFF"]}
                />
              }
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
                  isSelfPickup={isSelfPickup}
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

                <GSTSection initialGSTIN={user?.GSTIN_no || ""} />

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
              isLoading={isPayingNow || paymentMutation.isPending}
              isPartialPaymentLoading={isPartialPaymentLoading}
              onPartialPayment={
                bookingDetails.admin_approval === "True"
                  ? async () => {
                      setIsPartialPaymentLoading(true);
                      const savedGSTIN = user?.GSTIN_no || "";
                      paymentMutation.mutate(
                        {
                          paymentPayload: {
                            payment_method: "razorpay",
                            payment_type: "advanced",
                            ...(savedGSTIN ? { gst_number: savedGSTIN } : {}),
                          },
                          booking_id: bookingId,
                        },
                        {
                          onSuccess: async (data) => {
                            if (data.payment_link) {
                              await Linking.openURL(data.payment_link);
                            }
                            setIsPartialPaymentLoading(false);
                          },
                          onError: () => {
                            setIsPartialPaymentLoading(false);
                          },
                        }
                      );
                    }
                  : undefined
              }
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
        onClose={() => {
          userDismissedDialogRef.current = true;
          setShowAdminApprovalDialog(false);
        }}
        isApproved={bookingDetails?.admin_approval === "True"}
        bookingId={bookingId}
      />
      <BookingRejectedDialog
        isOpen={showRejectedDialog}
        onClose={() => {
          setShowRejectedDialog(false);
          router.replace("/(tabs)/(home)");
        }}
      />
    </SafeAreaView>
  );
}
