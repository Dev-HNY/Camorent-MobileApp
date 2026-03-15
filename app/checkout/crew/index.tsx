import React from "react";
import { YStack, ScrollView, XStack, Text } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCartStore } from "@/store/cart/cart";
import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import { StickyBottomCart } from "@/components/PDP/StickyBottomCart";
import { hp, wp, fp } from "@/utils/responsive";
import { CartProgressIndicator } from "@/components/cart/CartProgressIndicator";
import { Counter } from "@/components/ui/Counter";
import { VerifiedIcon } from "@/components/ui/VerifiedIcon";
import { Image } from "expo-image";
import { Pressable, Keyboard, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  DraftBookingRequest,
  useCreateDraftBooking,
} from "@/hooks/crew/useCreateDraftBooking";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllCrews } from "@/hooks/crew/useGetAllCrews";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useModifyQuantity, Operation } from "@/hooks/cart/useModifyQuantity";
import { useDeleteItem } from "@/hooks/cart/useDeleteItem";
import { DateRangePicker } from "@/components/checkout/DateRangePicker";
import { ShootNameField } from "@/components/checkout/ShootNameField";
import { Controller } from "react-hook-form";
import { calculateRentalDays } from "@/utils/date";
import { useRentalForm } from "@/hooks/useRentalForm";
import { CrewCartItem } from "@/types/cart/cart";
import { useUpdateBookingDelivery } from "@/hooks/delivery/useUpdateBookingDelivery";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth/auth";

export default function CrewSelectionPage() {
  const {
    rentalDates,
    shootName,
    setBookingId,
    setRentalDates,
    setShootName,
    selectedAddress,
    gstEnabled,
  } = useCartStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const updateDeliveryMutation = useUpdateBookingDelivery();
  const { data: cartData } = useGetCart();
  const { data: crewData, isLoading: isLoadingCrew } = useGetAllCrews();
  const crews = crewData?.data;
  const addToCart = useAddToCart();
  const modifyQuantity = useModifyQuantity();
  const deleteItem = useDeleteItem();

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

  const rentalDaysCount = rentalDates ? calculateRentalDays(rentalDates) : 1;

  const totalAmount =
    parseFloat(cartData?.total_amount || "0") * rentalDaysCount;

  const bookingMutation = useCreateDraftBooking();
  const handleProceedToPayment = () => {
    if (!rentalDates?.startDate || !rentalDates?.endDate) {
      Alert.alert("Missing details", "Please select rental dates.");
      return;
    }

    if (!cartData?.sku_items || cartData.sku_items.length === 0) {
      return;
    }

    if (!selectedAddress?.address_id) {
      return;
    }

    if (!cartData?.crew_items || cartData.crew_items.length === 0) {
      Alert.alert(
        "Crew required",
        "Please add at least one crew member to proceed with delivery.",
        [{ text: "OK" }]
      );
      return;
    }

    const mappedItems = cartData.sku_items.map((item) => ({
      sku_id: item.sku_id,
      quantity: item.quantity,
      addons: [],
    }));

    const mappedCrews = (cartData.crew_items || []).map((item) => ({
      crew_type_id: item.crew_type_id,
      quantity: item.quantity,
    }));

    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    };

    const draftBooking: DraftBookingRequest = {
      shoot_name: shootName,
      items: mappedItems,
      crews: mappedCrews,
      rental_start_date: formatDate(rentalDates.startDate),
      rental_end_date: formatDate(rentalDates.endDate),
      coupon_codes: [],
      ...(gstEnabled && user?.GSTIN_no ? { gstin: user.GSTIN_no } : {}),
    };

    bookingMutation.mutate(draftBooking, {
      onSuccess: (response) => {
        setBookingId(response.booking_id);

        updateDeliveryMutation.mutate(
          {
            booking_id: response.booking_id,
            deliveryUpdates: {
              delivery_option: "delivery",
              address_id: selectedAddress.address_id!,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["bookings"] });
              router.push("/checkout/payment");
            },
            onError: (error) => {
            },
          }
        );
      },
      onError: (error) => {
      },
    });
  };

  const handleAddCrew = (crew: any) => {
    addToCart.mutate({
      item_id: crew.crew_type_id,
      item_quantity: 1,
      itemType: "crew",
    });
  };

  const handleIncrementCrew = (skuId: string) => {
    modifyQuantity.mutate({
      sku_id: skuId,
      operation: Operation.ADD,
    });
  };

  const handleDecrementCrew = (skuId: string) => {
    modifyQuantity.mutate({
      sku_id: skuId,
      operation: Operation.REMOVE,
    });
  };

  const handleRemoveCrew = (skuId: string) => {
    deleteItem.mutate({ sku_id: skuId });
  };

  const getCrewFromCart = (crewTypeId: string) => {
    return cartData?.crew_items?.find(
      (item) => item.crew_type_id === crewTypeId
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <YStack flex={1}>
        {/* Header - clean white, no gradient */}
        <YStack
          paddingTop={hp(12)}
          paddingBottom={hp(12)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F2F2F7"
        >
          <YStack paddingBottom={hp(12)}>
            <InsideScreenHeader />
          </YStack>

          <Animated.View
            entering={FadeInDown.duration(300).springify()}
          >
            <YStack paddingHorizontal={wp(16)}>
              <CartProgressIndicator currentStep="crew" />
            </YStack>
            <YStack paddingHorizontal={wp(16)} paddingTop={hp(8)} gap={hp(8)}>
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
                    {errors.rentalDates.message ||
                      errors.rentalDates.startDate?.message ||
                      errors.rentalDates.endDate?.message ||
                      "Please select rental start and end dates"}
                  </Text>
                )}
              </YStack>
            </YStack>
          </Animated.View>
        </YStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={{
            paddingBottom: insets.bottom + hp(300),
            paddingTop: wp(8),
          }}
        >
          <YStack paddingHorizontal={wp(16)} gap="$4">
            <YStack gap={hp(16)}>
              <Animated.View entering={FadeInDown.duration(300).springify()}>
                <XStack alignItems="baseline" gap={wp(6)}>
                  <Text fontSize={fp(18)} fontWeight="700" color="#121217" letterSpacing={-0.3}>
                    Select Crews
                  </Text>
                  <Text fontSize={fp(13)} color="#6B7280">
                    (12 hr shift)
                  </Text>
                </XStack>
              </Animated.View>

              {isLoadingCrew ? (
                <YStack gap={hp(12)}>
                  {[1, 2, 3].map((i) => (
                    <Animated.View
                      key={i}
                      entering={FadeInDown.delay(i * 80).duration(300)}
                    >
                      <YStack
                        backgroundColor="#F9FAFB"
                        borderRadius={wp(14)}
                        padding={wp(14)}
                      >
                        <XStack gap={wp(14)} alignItems="center">
                          <YStack width={wp(70)} height={hp(70)} borderRadius={wp(12)} backgroundColor="#E5E7EB" />
                          <YStack flex={1} gap={hp(8)}>
                            <YStack width="60%" height={hp(14)} borderRadius={wp(4)} backgroundColor="#E5E7EB" />
                            <XStack justifyContent="space-between" alignItems="center">
                              <YStack width="35%" height={hp(16)} borderRadius={wp(4)} backgroundColor="#E5E7EB" />
                              <YStack width={wp(60)} height={hp(32)} borderRadius={wp(8)} backgroundColor="#E5E7EB" />
                            </XStack>
                          </YStack>
                        </XStack>
                      </YStack>
                    </Animated.View>
                  ))}
                </YStack>
              ) : (
                crews?.map((crew: CrewCartItem, index: number) => {
                  const crewInCart = getCrewFromCart(crew.crew_type_id);
                  return (
                    <CrewCard
                      key={crew.id}
                      crew={crew}
                      crewInCart={crewInCart}
                      index={index}
                      handleAddCrew={handleAddCrew}
                      handleIncrementCrew={handleIncrementCrew}
                      handleDecrementCrew={handleDecrementCrew}
                    />
                  );
                })
              )}
            </YStack>
          </YStack>
        </ScrollView>

        {/* Animated Sticky Bottom with Address */}
        <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#FFFFFF"
          >
            {selectedAddress?.address_id && (
              <YStack
                paddingHorizontal={wp(16)}
                paddingVertical={hp(10)}
                borderTopWidth={1}
                borderTopColor="#F2F2F7"
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
                      router.back();
                    }}
                  >
                    Change
                  </Button>
                </XStack>
              </YStack>
            )}
            <StickyBottomCart
              embedded
              isCrewScreen={true}
              hasSelectedCrew={(cartData?.crew_items?.length || 0) > 0}
              onContinue={handleProceedToPayment}
              customAmount={totalAmount}
              isLoading={
                bookingMutation.isPending || updateDeliveryMutation.isPending
              }
            />
          </YStack>
        </Animated.View>
      </YStack>
    </SafeAreaView>
  );
}

// Crew Card - clean card design, no purple gradient
function CrewCard({
  crew,
  crewInCart,
  index,
  handleAddCrew,
  handleIncrementCrew,
  handleDecrementCrew,
}: {
  crew: CrewCartItem;
  crewInCart: any;
  index: number;
  handleAddCrew: (crew: any) => void;
  handleIncrementCrew: (crewTypeId: string) => void;
  handleDecrementCrew: (crewTypeId: string) => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(400)
        .springify()
        .damping(15)
        .stiffness(200)}
    >
      <XStack
        gap={wp(14)}
        alignItems="flex-start"
        backgroundColor="#FFFFFF"
        borderRadius={wp(14)}
        padding={wp(14)}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.05}
        shadowRadius={6}
        elevation={2}
      >
        <YStack
          width={wp(70)}
          height={hp(70)}
          borderRadius={wp(12)}
          backgroundColor="#F8F8FA"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={{
              uri: `https://img.camorent.co.in/crews/images/${crew.id}.webp`,
            }}
            style={{ width: wp(58), height: hp(58) }}
            contentFit="contain"
            transition={300}
            cachePolicy="memory-disk"
          />
        </YStack>

        <YStack flex={1} gap={hp(8)}>
          <XStack gap={wp(6)} alignItems="center">
            <Text fontSize={fp(16)} fontWeight="700" color="#121217" letterSpacing={-0.3}>
              {crew.crew_name}
            </Text>
            <VerifiedIcon />
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap={wp(4)} alignItems="baseline">
              <Text fontSize={fp(18)} fontWeight="700" color="#121217">
                ₹{Math.round(parseFloat(String(crew.crew_price_0_12))).toLocaleString()}
              </Text>
              <Text fontSize={fp(12)} color="#9CA3AF">
                per day
              </Text>
            </XStack>
            {crewInCart ? (
              <Counter
                value={crewInCart.quantity}
                onIncrement={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleIncrementCrew(crew.crew_type_id);
                }}
                onDecrement={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleDecrementCrew(crew.crew_type_id);
                }}
                size="sm"
                variant="primary"
              />
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleAddCrew(crew);
                }}
                style={{
                  paddingHorizontal: wp(16),
                  paddingVertical: hp(8),
                  backgroundColor: "#121217",
                  borderRadius: wp(8),
                }}
              >
                <Text fontSize={fp(13)} fontWeight="600" color="#FFFFFF">
                  Add
                </Text>
              </Pressable>
            )}
          </XStack>
        </YStack>
      </XStack>
    </Animated.View>
  );
}
