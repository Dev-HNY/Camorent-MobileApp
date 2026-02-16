import React, { useState, useEffect, useRef } from "react";
import { YStack, ScrollView, XStack, Text, Spinner } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ArrowLeft, ChevronDown, Plus, X } from "lucide-react-native";
import { hp, wp, fp } from "@/utils/responsive";
import { Input } from "@/components/ui/Input";
import { BodySmall } from "@/components/ui/Typography";
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useAddMyAddress } from "@/hooks/delivery/useAddMyAddress";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart/cart";
import { useGetCurrentUser } from "@/hooks/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deliveryAddressSchema,
  type DeliveryAddressFormData,
} from "@/types/address";

export default function CamorentDeliveryScreen() {
  const queryClient = useQueryClient();
  const [phoneFocus, setPhoneFocus] = useState(false);
  const addressMutation = useAddMyAddress();
  const { draftAddress, setSelectedAddress, clearDraftAddress } =
    useCartStore();
  const { data: user } = useGetCurrentUser();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: {
      street: "",
      pincode: draftAddress?.pincode || "",
      city: draftAddress?.city || "",
      state_country: draftAddress?.state || "",
      mobile_number: "",
      delivery_instructions: "",
    },
  });

  // Premium animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-fill from draft address if available
  useEffect(() => {
    if (draftAddress) {
      if (draftAddress.pincode) setValue("pincode", draftAddress.pincode);
      if (draftAddress.city) setValue("city", draftAddress.city);
      if (draftAddress.state) setValue("state_country", draftAddress.state);
    }
  }, [draftAddress, setValue]);

  const onSubmit = (data: DeliveryAddressFormData) => {
    const addressData = {
      address_line1: data.street,
      address_line2: data.delivery_instructions || "",
      city: data.city,
      state: data.state_country,
      pincode: data.pincode,
      type: "delivery",
      is_default: false,
    };

    addressMutation.mutate(addressData, {
      onSuccess: (response) => {
        setSelectedAddress({
          address_id: response.address_id,
          address_line1: data.street,
          address_line2: data.delivery_instructions || "",
          city: data.city,
          state: data.state_country,
          pincode: data.pincode,
          full_name: "",
          mobile_number: data.mobile_number,
          is_self_pickup: false,
        });

        clearDraftAddress();
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        router.back();
        router.back();
      },
      onError: (error) => {
        console.error("Error adding address:", error);
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack
          alignItems="center"
          paddingTop={hp(12)}
          paddingBottom={hp(12)}
          paddingHorizontal={wp(16)}
          borderBottomWidth={1}
          borderBottomColor="#F3F4F6"
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: wp(36),
              height: wp(36),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={hp(22)} color="#1C1C1E" strokeWidth={2} />
          </Pressable>
          <Text
            fontSize={fp(17)}
            fontWeight="700"
            color="#1C1C1E"
            flex={1}
            textAlign="center"
            marginRight={wp(36)}
          >
            Add delivery address
          </Text>
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={hp(10)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <ScrollView
                flex={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: insets.bottom + hp(100),
                  paddingTop: hp(24),
                  paddingHorizontal: wp(20),
                }}
              >
                <YStack gap={hp(22)}>
                  {/* Section title */}
                  <Text
                    fontSize={fp(16)}
                    fontWeight="700"
                    color="#1C1C1E"
                  >
                    Add your shoot location address
                  </Text>

                  {/* Street */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                      Street <Text color="#FF4444">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="street"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="Placeholder"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholderTextColor="#8A8AA3"
                          error={!!errors.street}
                        />
                      )}
                    />
                    {errors.street && (
                      <Text fontSize={fp(12)} color="#FF4444">
                        {errors.street.message}
                      </Text>
                    )}
                  </YStack>

                  {/* Pincode + City side by side */}
                  <XStack gap={wp(16)}>
                    <YStack gap={hp(8)} flex={1}>
                      <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                        Pincode <Text color="#FF4444">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="pincode"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            placeholder="Pincode"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholderTextColor="#8A8AA3"
                            keyboardType="number-pad"
                            maxLength={6}
                            error={!!errors.pincode}
                          />
                        )}
                      />
                      {errors.pincode && (
                        <Text fontSize={fp(12)} color="#FF4444">
                          {errors.pincode.message}
                        </Text>
                      )}
                    </YStack>

                    <YStack gap={hp(8)} flex={1}>
                      <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                        City <Text color="#FF4444">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="city"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            placeholder="City name"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholderTextColor="#8A8AA3"
                            error={!!errors.city}
                          />
                        )}
                      />
                      {errors.city && (
                        <Text fontSize={fp(12)} color="#FF4444">
                          {errors.city.message}
                        </Text>
                      )}
                    </YStack>
                  </XStack>

                  {/* State & Country */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                      State & Country <Text color="#FF4444">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="state_country"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="State & Country name"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholderTextColor="#8A8AA3"
                          error={!!errors.state_country}
                        />
                      )}
                    />
                    {errors.state_country && (
                      <Text fontSize={fp(12)} color="#FF4444">
                        {errors.state_country.message}
                      </Text>
                    )}
                  </YStack>

                  {/* Mobile Number */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                      Mobile Number <Text color="#FF4444">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="mobile_number"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <XStack gap={wp(12)}>
                          <XStack
                            alignItems="center"
                            borderWidth={1}
                            borderColor={phoneFocus ? "#8E0FFF" : "#E5E7EB"}
                            borderRadius={wp(8)}
                            paddingHorizontal={wp(10)}
                            paddingVertical={hp(10)}
                            backgroundColor="white"
                          >
                            <Image
                              source={require("@/assets/images/Flags.png")}
                              style={{
                                height: hp(16),
                                width: wp(16),
                                borderRadius: 20,
                              }}
                            />
                            <BodySmall color="#121217" marginLeft="$2">
                              +91
                            </BodySmall>
                            <ChevronDown
                              color="#8A8AA3"
                              height={hp(16)}
                              width={wp(16)}
                            />
                          </XStack>

                          <XStack
                            flex={1}
                            borderWidth={1}
                            borderColor={phoneFocus ? "#8E0FFF" : "#E5E7EB"}
                            borderRadius={wp(8)}
                            backgroundColor="white"
                            alignItems="center"
                            paddingRight={value ? wp(8) : 0}
                          >
                            <TextInput
                              keyboardType="phone-pad"
                              placeholder="99998 99999"
                              value={value}
                              onChangeText={onChange}
                              onFocus={() => setPhoneFocus(true)}
                              onBlur={() => {
                                setPhoneFocus(false);
                                onBlur();
                              }}
                              placeholderTextColor="#8A8AA3"
                              maxLength={10}
                              style={{
                                flex: 1,
                                paddingHorizontal: wp(12),
                                paddingVertical: hp(10),
                                fontSize: fp(14),
                                color: "#121217",
                                fontWeight: "400",
                              }}
                            />
                            {value ? (
                              <TouchableOpacity
                                onPress={() => onChange("")}
                                style={{ padding: wp(4) }}
                              >
                                <X color="#999" size={hp(16)} />
                              </TouchableOpacity>
                            ) : null}
                          </XStack>
                        </XStack>
                      )}
                    />
                    {errors.mobile_number && (
                      <Text fontSize={fp(12)} color="#FF4444">
                        {errors.mobile_number.message}
                      </Text>
                    )}
                    <Text fontSize={fp(13)} color="#6C6C89" lineHeight={fp(17)}>
                      Delivery person may call on this number.
                    </Text>
                  </YStack>

                  {/* Delivery instructions */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">
                      Delivery instructions{" "}
                      <Text fontSize={fp(13)} fontWeight="400" color="#6C6C89">
                        (optional)
                      </Text>
                    </Text>
                    <Controller
                      control={control}
                      name="delivery_instructions"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="Add delivery related instruction"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholderTextColor="#8A8AA3"
                          multiline
                          numberOfLines={4}
                          style={{
                            minHeight: hp(110),
                            paddingTop: hp(12),
                            textAlignVertical: "top",
                          }}
                        />
                      )}
                    />
                  </YStack>

                  {/* Add Multiple Locations */}
                  <XStack
                    borderWidth={1}
                    borderColor="#8E0FFF"
                    borderRadius={wp(10)}
                    paddingVertical={hp(14)}
                    paddingHorizontal={wp(16)}
                    justifyContent="center"
                    alignItems="center"
                    gap={wp(6)}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    backgroundColor="#FFFFFF"
                  >
                    <Plus size={fp(16)} color="#8E0FFF" strokeWidth={2.5} />
                    <Text
                      fontSize={fp(14)}
                      fontWeight="600"
                      color="#8E0FFF"
                    >
                      Add Multiple Locations
                    </Text>
                  </XStack>
                </YStack>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Continue Button - fixed at bottom */}
          <YStack
            paddingHorizontal={wp(20)}
            paddingBottom={insets.bottom + hp(12)}
            paddingTop={hp(12)}
            backgroundColor="#FFFFFF"
            borderTopWidth={1}
            borderTopColor="#F3F4F6"
          >
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleSubmit(onSubmit)();
              }}
              disabled={addressMutation.isPending}
              style={{
                paddingVertical: hp(16),
                borderRadius: wp(12),
                backgroundColor: addressMutation.isPending
                  ? "#B8B8C7"
                  : "#8E0FFF",
                alignItems: "center",
                opacity: addressMutation.isPending ? 0.7 : 1,
              }}
            >
              {addressMutation.isPending ? (
                <Spinner size="small" color="white" />
              ) : (
                <Text
                  fontSize={fp(16)}
                  fontWeight="600"
                  color="#FFFFFF"
                >
                  Continue
                </Text>
              )}
            </Pressable>
          </YStack>
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
