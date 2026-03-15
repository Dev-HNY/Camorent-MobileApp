import React, { useEffect, useState, useRef } from "react";
import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { YStack, XStack, Text } from "tamagui";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { useCartStore } from "@/store/cart/cart";
import { CartItem } from "@/components/cart/CartItem";
import { CartProgressIndicator } from "@/components/cart/CartProgressIndicator";
import { DateRangePicker } from "@/components/checkout/DateRangePicker";
import { ShootNameField } from "@/components/checkout/ShootNameField";
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { RefreshControl, Keyboard, Pressable, Switch, Text as RNText, View, Alert } from "react-native";
import { Truck, MapPin } from "lucide-react-native";
import Svg, { Path, Line } from "react-native-svg";
// import { CamocareSheet } from "@/components/PDP/CamocareSheet";
// import { CartCamocare } from "@/components/cart/CartCamocare";
import { fp, hp, wp } from "@/utils/responsive";
import { CancellationPolicySheet } from "@/components/cart/CancellationPolicySheet";
import { StickyBottomCart } from "@/components/PDP/StickyBottomCart";
import { TotalAmountAccordion } from "@/components/cart/TotalAmountAccordion";
import { CartActionButtons } from "@/components/cart/CartActionButtons";
import { FreeCancellation } from "@/components/cart/FreeCancellation";
import { CompleteYourSetup } from "@/components/cart/CompleteYourSetup";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { calculateRentalDays } from "@/utils/date";
import {
  DraftBookingRequest,
  useCreateDraftBooking,
} from "@/hooks/crew/useCreateDraftBooking";
import { useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { useRentalForm } from "@/hooks/useRentalForm";
import { AddressSheet } from "@/components/cart/AddressSheet";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { useUpdateBookingDelivery } from "@/hooks/delivery/useUpdateBookingDelivery";
import { GSTSheet } from "@/components/cart/GSTSheet";
import { useAuthStore } from "@/store/auth/auth";

function ReceiptIcon({ color = "#8E0FFF", size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="17" x2="12" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

const WAREHOUSE_ADDRESS = {
  address_line1: "N-65, Gautam Nagar",
  address_line2: "",
  city: "New Delhi",
  state: "Delhi",
  pincode: "110049",
  full_name: "Camorent Warehouse",
  mobile_number: "",
  is_self_pickup: true,
};

export default function Cart() {
  const {
    setRentalDates,
    rentalDates,
    shootName,
    setShootName,
    setBookingId,
    draftAddress,
    selectedAddress,
    fulfillmentType,
    setFulfillmentType,
    setSelectedAddress,
    gstEnabled,
    setGstEnabled,
  } = useCartStore();
  const queryClient = useQueryClient();
  const bookingMutation = useCreateDraftBooking();
  const updateDeliveryMutation = useUpdateBookingDelivery();
  const [isPickupLoading, setIsPickupLoading] = useState(false);

  const {
    control,
    handleSubmit,
    errors,
    selectedDateRange,
    handleDateRangeChange,
    handleShootNameChange,
  } = useRentalForm({
    initialShootName: shootName,
    initialRentalDates: rentalDates,
    onShootNameChange: setShootName,
    onRentalDatesChange: setRentalDates,
  });

  const { user } = useAuthStore();
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [showGSTSheet, setShowGSTSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [showCamocareSheet, setShowCamocareSheet] = useState(false);
  const insets = useSafeAreaInsets();
  const { data: cart, isLoading, refetch } = useGetCart();
  const items = cart?.sku_items || [];

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const handleSelfPickupContinue = () => {
    if (!shootName || shootName.trim().length < 3) {
      Alert.alert("Missing details", "Shoot name must be at least 3 characters");
      return;
    }
    if (!rentalDates?.startDate || !rentalDates?.endDate) {
      Alert.alert("Missing details", "Please select rental start and end dates");
      return;
    }
    if (!items || items.length === 0) return;

    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    };

    const draftBooking: DraftBookingRequest = {
      shoot_name: shootName,
      items: items.map((item) => ({ sku_id: item.sku_id, quantity: item.quantity, addons: [] })),
      crews: [],
      rental_start_date: formatDate(rentalDates.startDate),
      rental_end_date: formatDate(rentalDates.endDate),
      coupon_codes: [],
      ...(gstEnabled && user?.GSTIN_no ? { gstin: user.GSTIN_no } : {}),
    };

    setIsPickupLoading(true);
    bookingMutation.mutate(draftBooking, {
      onSuccess: (response) => {
        setBookingId(response.booking_id);
        updateDeliveryMutation.mutate(
          {
            booking_id: response.booking_id,
            deliveryUpdates: { delivery_option: "self_pickup" },
          },
          {
            onSuccess: () => {
              setIsPickupLoading(false);
              queryClient.invalidateQueries({ queryKey: ["bookings"] });
              router.push("/checkout/payment");
            },
            onError: () => {
              setIsPickupLoading(false);
              Alert.alert("Error", "Failed to update delivery. Please try again.");
            },
          }
        );
      },
      onError: () => {
        setIsPickupLoading(false);
        Alert.alert("Error", "Failed to create booking. Please try again.");
      },
    });
  };

  const handleContinue = handleSubmit(
    () => {
      router.push("/checkout/crew");
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      const message = (firstError as any)?.message as string | undefined;
      if (message) {
        Alert.alert("Missing details", message);
      }
    }
  );

  const rentalDaysCount = rentalDates ? calculateRentalDays(rentalDates) : 1;

  // Use total_amount from backend and multiply by rental days for cart display
  const totalAmount = Number(cart?.sku_amount || "0");
  const subtotalWithDays = totalAmount * rentalDaysCount;

  const cartSummary = {
    subtotal: subtotalWithDays,
    tax: 0,
    total: subtotalWithDays,
    itemCount: cart?.sku_items.length || 0,
    deliveryFee: 0,
    discount: 0,
    camocarePrice: 0,
  };
  // const handleCamocare = () => {
  //   setShowCamocareSheet(true);
  // };
  const handleAddNewAddress = () => {
    router.push("/cart/address-details");
    setShowAddressSheet(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <YStack flex={1}>
          {/* Header - fixed top bar: back button + progress only */}
          <View>
            <YStack
              paddingTop={hp(12)}
              paddingBottom={hp(12)}
              backgroundColor="#FFFFFF"
              borderBottomWidth={1}
              borderBottomColor="#F2F2F7"
            >
              <InsideScreenHeader />
              <YStack paddingHorizontal={wp(16)} paddingTop={hp(12)}>
                <CartProgressIndicator currentStep={"cart"} />
              </YStack>
            </YStack>
          </View>

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            contentContainerStyle={{
              paddingHorizontal: wp(16),
              paddingTop: hp(12),
              paddingBottom:
                items.length > 0
                  ? insets.bottom + hp(110)
                  : insets.bottom + hp(24),
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#121217"
                colors={["#121217"]}
              />
            }
          >
            {/* Shoot name, dates, fulfillment, GST — scrolls with content */}
            {items.length > 0 && (
              <YStack gap={hp(8)} marginBottom={hp(12)}>
                <Controller
                  control={control}
                  name="shootName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ShootNameField
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        handleShootNameChange(text);
                      }}
                      onBlur={onBlur}
                      error={errors.shootName?.message}
                    />
                  )}
                />
                <YStack gap={hp(4)}>
                  <DateRangePicker
                    startDate={selectedDateRange?.startDate}
                    endDate={selectedDateRange?.endDate}
                    onDateRangeChange={handleDateRangeChange}
                  />
                  {errors.rentalDates && (
                    <Text fontSize={12} color="#EF4444">
                      {typeof errors.rentalDates.message === "string"
                        ? errors.rentalDates.message
                        : "Please select rental start and end dates"}
                    </Text>
                  )}
                </YStack>

                {/* Fulfillment selector */}
                <View style={{ flexDirection: "row", gap: wp(8) }}>
                  {(["delivery", "self_pickup"] as const).map((type) => {
                    const isSelected = fulfillmentType === type;
                    const isDelivery = type === "delivery";
                    return (
                      <Pressable
                        key={type}
                        style={{ flex: 1 }}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setFulfillmentType(type);
                        }}
                      >
                        <View style={{
                          borderRadius: wp(12), borderWidth: 1.5,
                          borderColor: isSelected ? "#8E0FFF" : "#E5E7EB",
                          backgroundColor: isSelected ? "#F5EDFF" : "#FAFAFA",
                          paddingVertical: wp(10), paddingHorizontal: wp(12), gap: 4,
                        }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            {isDelivery
                              ? <Truck size={15} color={isSelected ? "#8E0FFF" : "#6B7280"} strokeWidth={2} />
                              : <MapPin size={15} color={isSelected ? "#8E0FFF" : "#6B7280"} strokeWidth={2} />
                            }
                            <RNText style={{ fontSize: 13, fontWeight: "600", color: isSelected ? "#8E0FFF" : "#374151" }}>
                              {isDelivery ? "Delivery" : "Self Pickup"}
                            </RNText>
                          </View>
                          <RNText style={{ fontSize: 11, color: isSelected ? "#9B59B6" : "#9CA3AF" }}>
                            {isDelivery ? "Deliver to my address" : "N-65, Gautam Nagar, Delhi"}
                          </RNText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {/* GST Invoice row */}
                {user?.GSTIN_no ? (
                  <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    borderRadius: wp(12), borderWidth: 1.5,
                    borderColor: gstEnabled ? "#22C55E" : "#E5D5FF",
                    backgroundColor: gstEnabled ? "#F0FDF4" : "#FAFAFA",
                    paddingVertical: hp(10), paddingHorizontal: wp(12),
                  }}>
                    <Pressable
                      style={{ flexDirection: "row", alignItems: "center", gap: wp(8), flex: 1 }}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowGSTSheet(true);
                      }}
                    >
                      <View style={{
                        width: wp(32), height: wp(32), borderRadius: wp(8),
                        backgroundColor: gstEnabled ? "#DCFCE7" : "#F5EDFF",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <ReceiptIcon color={gstEnabled ? "#16A34A" : "#8E0FFF"} size={18} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <RNText style={{ fontSize: fp(13), fontWeight: "600", color: gstEnabled ? "#15803D" : "#374151" }}>
                          GST Invoice
                        </RNText>
                        <RNText style={{ fontSize: fp(11), color: gstEnabled ? "#16A34A" : "#9CA3AF" }} numberOfLines={1}>
                          {user.GSTIN_no} · {user.org_name || "Tap to view"}
                        </RNText>
                      </View>
                    </Pressable>
                    <Switch
                      value={gstEnabled}
                      onValueChange={(val) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setGstEnabled(val);
                      }}
                      trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                      thumbColor={gstEnabled ? "#16A34A" : "#9CA3AF"}
                    />
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowGSTSheet(true);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                      borderRadius: wp(12), borderWidth: 1.5,
                      borderColor: "#E5D5FF", backgroundColor: "#FAFAFA",
                      paddingVertical: hp(10), paddingHorizontal: wp(12),
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: wp(8) }}>
                      <View style={{
                        width: wp(32), height: wp(32), borderRadius: wp(8),
                        backgroundColor: "#F5EDFF", alignItems: "center", justifyContent: "center",
                      }}>
                        <ReceiptIcon color="#8E0FFF" size={18} />
                      </View>
                      <View>
                        <RNText style={{ fontSize: fp(13), fontWeight: "600", color: "#374151" }}>Add GST Invoice</RNText>
                        <RNText style={{ fontSize: fp(11), color: "#9CA3AF" }}>Save GSTIN for tax invoice</RNText>
                      </View>
                    </View>
                    <RNText style={{ fontSize: fp(12), color: "#8E0FFF", fontWeight: "600" }}>Add →</RNText>
                  </Pressable>
                )}
              </YStack>
            )}

            {isLoading ? (
              <YStack gap={hp(12)} marginTop={hp(8)}>
                {[1, 2].map((i) => (
                  <Animated.View
                    key={i}
                    entering={FadeIn.delay(i * 100).duration(300)}
                  >
                    <YStack
                      backgroundColor="#F9F9FB"
                      borderRadius={wp(12)}
                      padding={wp(14)}
                      gap={hp(10)}
                    >
                      <XStack gap={wp(12)} alignItems="center">
                        <YStack
                          width={wp(70)}
                          height={hp(70)}
                          borderRadius={wp(10)}
                          backgroundColor="#EBEBEF"
                        />
                        <YStack flex={1} gap={hp(8)}>
                          <YStack width="70%" height={hp(14)} borderRadius={wp(4)} backgroundColor="#EBEBEF" />
                          <YStack width="40%" height={hp(12)} borderRadius={wp(4)} backgroundColor="#EBEBEF" />
                          <YStack width="30%" height={hp(14)} borderRadius={wp(4)} backgroundColor="#EBEBEF" />
                        </YStack>
                      </XStack>
                    </YStack>
                  </Animated.View>
                ))}
              </YStack>
            ) : items.length === 0 ? (
              // Enhanced Empty State with Animations
              <YStack
                justifyContent="center"
                alignItems="center"
                marginTop={hp(36)}
                gap={hp(16)}
              >
                <Animated.View entering={ZoomIn.duration(500).springify().damping(12)}>
                  <YStack
                    width={hp(120)}
                    height={hp(120)}
                    borderRadius={hp(60)}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#F9FAFB"
                  >
                    <Text fontSize={hp(48)}>🛒</Text>
                  </YStack>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(400).springify()}>
                  <YStack gap={hp(8)} alignItems="center">
                    <Text
                      fontSize="$6"
                      fontWeight="700"
                      textAlign="center"
                      color="#1C1C1E"
                    >
                      Your Cart is Empty
                    </Text>
                    <Text
                      fontSize="$3"
                      color="#6B7280"
                      textAlign="center"
                      maxWidth={wp(250)}
                    >
                      Add some items to get started with your rental
                    </Text>
                  </YStack>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
                  <Button
                    size="lg"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.replace("/(tabs)/(home)/categories");
                    }}
                  >
                    Browse Products
                  </Button>
                </Animated.View>
              </YStack>
            ) : (
              <YStack flex={1} gap={hp(16)}>
                {/* Cart Items */}
                <YStack flex={1} gap={hp(12)}>
                  {items.map((item) => (
                    <CartItem key={item.sku_id} item={item} />
                  ))}
                </YStack>

                <TotalAmountAccordion
                  cartData={cartSummary}
                  rentalDays={rentalDaysCount}
                />

                <CartActionButtons
                  onAddMoreItems={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(tabs)/(home)/categories");
                  }}
                  onCompleteSetup={() => { }}
                />

                {/* {!isCamocareAdded && (
                <CartCamocare
                  handleCamocare={handleCamocare}
                  isAdded={isCamocareAdded}
                  onToggle={toggleCamocare}
                />
              )} */}

                {/* <FreeCancellation
                onLearnMore={() => setShowCancellationPolicy(true)}
              /> */}

                {/* <CompleteYourSetup
                onProductPress={(id) => router.push(`/product/${id}`)}
                onViewAll={() => router.push("/(tabs)/(home)/categories")}
              /> */}
              </YStack>
            )}
          </Animated.ScrollView>
        {/* <CamocareSheet
        isOpen={showCamocareSheet}
        onClose={() => setShowCamocareSheet(false)}
        handleShowAdd={true}
      /> */}
        {/* <CancellationPolicySheet
        isOpen={showCancellationPolicy}
        onClose={() => setShowCancellationPolicy(false)}
      /> */}
        <AddressSheet
          isOpen={showAddressSheet}
          onClose={() => setShowAddressSheet(false)}
          handleAddNewAddress={handleAddNewAddress}
        />
        <GSTSheet
          open={showGSTSheet}
          onOpenChange={setShowGSTSheet}
        />
        {/* Self-pickup: show warehouse info + continue directly */}
        {items.length > 0 && fulfillmentType === "self_pickup" && (
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#FFFFFF"
          >
            <YStack
              paddingHorizontal={wp(16)}
              paddingVertical={hp(10)}
              borderTopWidth={1}
              borderTopColor="#F2F2F7"
            >
              <XStack alignItems="center" gap={wp(10)}>
                <YStack flex={1}>
                  <Text fontSize={fp(12)} color="#6C6C89" marginBottom={hp(2)}>
                    Pickup from
                  </Text>
                  <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                    Camorent Warehouse
                  </Text>
                  <Text fontSize={fp(12)} color="#6C6C89">
                    N-65, Gautam Nagar, New Delhi 110049
                  </Text>
                </YStack>
              </XStack>
            </YStack>
            <StickyBottomCart
              embedded
              isCartScreen={true}
              cartData={cartSummary}
              onContinue={handleSelfPickupContinue}
              isSelfPickup={true}
              isLoading={isPickupLoading || bookingMutation.isPending || updateDeliveryMutation.isPending}
            />
          </YStack>
        )}

        {/* Delivery: no address selected yet — prompt to choose */}
        {items.length > 0 && fulfillmentType === "delivery" && !draftAddress && !selectedAddress && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 1)']}
              style={{
                paddingHorizontal: wp(16),
                paddingTop: hp(20),
                paddingBottom: hp(16),
                borderTopWidth: 1,
                borderTopColor: "#F2F2F7",
              }}
            >
              <BottomSheetButton
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAddressSheet(true);
                }}
                size="md"
              >
                Choose Delivery Address
              </BottomSheetButton>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Delivery: draft address present but not saved */}
        {items.length > 0 && fulfillmentType === "delivery" && (draftAddress || (selectedAddress && !selectedAddress.address_id)) && !selectedAddress?.address_id && (
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#FFFFFF"
          >
            <YStack
              paddingHorizontal={wp(16)}
              paddingVertical={hp(12)}
              borderTopWidth={1}
              borderTopColor="#F2F2F7"
            >
              <XStack justifyContent="space-between" alignItems="center" gap={wp(12)}>
                <YStack flex={1}>
                  <Text fontSize={fp(12)} color="#6C6C89" marginBottom={hp(4)}>
                    Delivery to
                  </Text>
                  <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                    {draftAddress?.name}
                    {draftAddress?.state && `, ${draftAddress.state}`}
                  </Text>
                  <Text fontSize={fp(12)} color="#6C6C89">
                    {draftAddress?.city}
                  </Text>
                </YStack>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/cart/address-details");
                  }}
                >
                  Continue
                </Button>
              </XStack>
            </YStack>
            <StickyBottomCart
              embedded
              isCartScreen={true}
              cartData={cartSummary}
              onContinue={handleContinue}
            />
          </YStack>
        )}

        {/* Delivery: address fully selected */}
        {items.length > 0 && fulfillmentType === "delivery" && selectedAddress?.address_id && (
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#FFFFFF"
          >
            <YStack
              paddingHorizontal={wp(16)}
              paddingVertical={hp(10)}
              borderTopWidth={1}
              borderTopColor="#F2F2F7"
            >
              <XStack justifyContent="space-between" alignItems="center" gap={wp(12)}>
                <YStack flex={1}>
                  <Text fontSize={fp(12)} color="#6C6C89" marginBottom={hp(2)}>
                    Delivery to
                  </Text>
                  <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                    {selectedAddress.address_line1}
                    {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                  </Text>
                  <Text fontSize={fp(12)} color="#6C6C89">
                    {selectedAddress.city}
                    {selectedAddress.state && `, ${selectedAddress.state}`}
                  </Text>
                </YStack>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowAddressSheet(true);
                  }}
                >
                  Change
                </Button>
              </XStack>
            </YStack>
            <StickyBottomCart
              embedded
              isCartScreen={true}
              cartData={cartSummary}
              onContinue={handleContinue}
            />
          </YStack>
        )}
      </YStack>
      </SafeAreaView>
  );
}
