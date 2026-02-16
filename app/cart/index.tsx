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
  FadeInDown,
  FadeIn,
  Layout,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  ZoomIn
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { RefreshControl, Keyboard } from "react-native";
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

export default function Cart() {
  const {
    setRentalDates,
    rentalDates,
    shootName,
    setShootName,
    setBookingId,
    draftAddress,
    selectedAddress,
  } = useCartStore();
  const queryClient = useQueryClient();

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

  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [showCamocareSheet, setShowCamocareSheet] = useState(false);
  const insets = useSafeAreaInsets();
  const { data: cart, isLoading, refetch } = useGetCart();
  const items = cart?.sku_items || [];

  // Premium scroll animations
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header with parallax
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0.7],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const handleContinue = handleSubmit((data) => {
    // Validation passed, navigate to crew screen
    router.push("/checkout/crew");
  });

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <YStack flex={1}>
          {/* Header - clean white */}
          <Animated.View style={headerAnimatedStyle}>
            <YStack
              paddingTop={hp(12)}
              paddingBottom={hp(16)}
              backgroundColor="#FFFFFF"
              borderBottomWidth={1}
              borderBottomColor="#F3F4F6"
            >
              <YStack>
                <InsideScreenHeader />
              </YStack>

              <Animated.View
                entering={FadeInDown.duration(300).springify()}
              >
                <YStack paddingHorizontal={wp(16)} paddingTop={hp(16)} gap={hp(8)}>
                  <CartProgressIndicator currentStep={"cart"} />
              {items.length > 0 && (
                <>
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
                </>
              )}
              </YStack>
            </Animated.View>
          </YStack>
          </Animated.View>

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
                  ? insets.bottom + hp(150)
                  : insets.bottom + hp(24),
            }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#121217"
                colors={["#121217"]}
              />
            }
          >
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
                      router.replace("/(tabs)/(home)");
                    }}
                  >
                    Browse Products
                  </Button>
                </Animated.View>
              </YStack>
            ) : (
              <YStack flex={1} gap={hp(16)}>
                {/* Cart Items with Staggered Animation */}
                <YStack flex={1} gap={hp(12)}>
                  {items.map((item, index) => (
                    <Animated.View
                      key={item.sku_id}
                      entering={FadeInDown.delay(index * 100)
                        .duration(400)
                        .springify()
                        .damping(15)
                        .stiffness(200)}
                      layout={Layout.springify().damping(15)}
                    >
                      <CartItem item={item} />
                    </Animated.View>
                  ))}
                </YStack>

                {/* Total Amount with Animation */}
                <Animated.View
                  entering={FadeInDown.delay(items.length * 100 + 100)
                    .duration(400)
                    .springify()
                    .damping(15)}
                >
                  <TotalAmountAccordion
                    cartData={cartSummary}
                    rentalDays={rentalDaysCount}
                  />
                </Animated.View>

                {/* Action Buttons with Animation */}
                <Animated.View
                  entering={FadeInDown.delay(items.length * 100 + 200)
                    .duration(400)
                    .springify()
                    .damping(15)}
                >
                  <CartActionButtons
                    onAddMoreItems={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push("/(tabs)/(home)/categories");
                    }}
                    onCompleteSetup={() => { }}
                  />
                </Animated.View>

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
        </YStack>
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
        {items.length > 0 && !draftAddress && !selectedAddress && (
          <Animated.View
            entering={FadeInDown.duration(500).springify()}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 1)']}
              style={{
                paddingHorizontal: wp(16),
                paddingTop: hp(20),
                paddingBottom: hp(16),
                borderTopWidth: 1,
                borderTopColor: "#EBEBEF",
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
        {items.length > 0 && (draftAddress || (selectedAddress && !selectedAddress.address_id)) && !selectedAddress?.address_id && (
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
              borderTopColor="#EBEBEF"
            >
              <XStack
                justifyContent="space-between"
                alignItems="center"
                gap={wp(12)}
              >
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
        {items.length > 0 && selectedAddress?.address_id && (
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
              borderTopColor="#EBEBEF"
            >
              <XStack
                justifyContent="space-between"
                alignItems="center"
                gap={wp(12)}
              >
                <YStack flex={1}>
                  <Text fontSize={fp(12)} color="#6C6C89" marginBottom={hp(2)}>
                    {selectedAddress.is_self_pickup ? "Pickup by" : "Delivery to"}
                  </Text>
                  <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                    {selectedAddress.address_line1}
                    {selectedAddress.address_line2 &&
                      `, ${selectedAddress.address_line2}`}
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
