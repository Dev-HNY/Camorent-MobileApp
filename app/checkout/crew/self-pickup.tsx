import React, { useState } from "react";
import { YStack, ScrollView, XStack, Text } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ChevronLeft, ChevronDown, X } from "lucide-react-native";
import {
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { hp, wp, fp } from "@/utils/responsive";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pickupPersonSchema,
  type PickupPersonFormData,
  type PickupLocation,
} from "@/types/address";
import * as Haptics from "expo-haptics";

const pickupLocations: PickupLocation[] = [
  {
    id: "1",
    name: "Hauz Khas Store",
    address: "123 main street, Hauz khas, New delhi",
    hours: "Mon- Fri 9 am - 6 pm",
    is_active: true,
  },
  {
    id: "2",
    name: "Connaught Place Store",
    address: "123 main street, Connaught Place, New delhi",
    hours: "Mon- Fri 9 am - 6 pm",
    is_active: true,
  },
];

export default function SelfPickupScreen() {
  const [phoneFocus, setPhoneFocus] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PickupPersonFormData>({
    resolver: zodResolver(pickupPersonSchema),
    defaultValues: {
      full_name: "",
      mobile_number: "",
      is_self_pickup: false,
      pickup_location_id: "1",
    },
  });

  const isSelfPickup = watch("is_self_pickup");
  const selectedLocationId = watch("pickup_location_id");

  const onSubmit = (data: PickupPersonFormData) => {
    router.push({
      pathname: "/checkout/payment",
      params: {
        pickup_location_id: data.pickup_location_id,
        pickup_person_name: data.full_name,
        pickup_person_mobile: data.mobile_number,
        is_self_pickup: data?.is_self_pickup?.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        height={hp(52)}
        backgroundColor="#FFFFFF"
        borderBottomWidth={1}
        borderBottomColor="#F2F2F7"
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          hitSlop={8}
          style={styles.backBtn}
        >
          <ChevronLeft size={22} color="#1C1C1E" />
        </Pressable>
        <Text
          fontSize={fp(17)}
          fontWeight="600"
          color="#1C1C1E"
          marginLeft={wp(12)}
          letterSpacing={-0.3}
        >
          Self Pickup
        </Text>
      </XStack>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={hp(52)}
      >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingBottom: insets.bottom + hp(100),
            paddingTop: hp(16),
            paddingHorizontal: wp(16),
          }}
        >
          <YStack gap={hp(20)}>

            <Text fontSize={fp(14)} color="#6C6C89" lineHeight={hp(20)}>
              Pick up your order from the nearest Camorent location.
            </Text>

            {/* Pickup person card */}
            <YStack gap={hp(10)}>
              <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4} paddingHorizontal={wp(4)}>
                WHO WILL PICKUP THE ORDER?
              </Text>
              <YStack style={styles.card}>

                {/* Self-pickup checkbox row */}
                <Controller
                  control={control}
                  name="is_self_pickup"
                  render={({ field: { onChange, value } }) => (
                    <XStack
                      alignItems="center"
                      gap={wp(12)}
                      paddingHorizontal={wp(16)}
                      paddingVertical={hp(14)}
                    >
                      <Checkbox checked={!!value} onCheckedChange={onChange} />
                      <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E">
                        I am going to pick up the order.
                      </Text>
                    </XStack>
                  )}
                />

                <YStack height={1} backgroundColor="#F2F2F7" />

                <YStack paddingHorizontal={wp(16)} paddingVertical={hp(14)} gap={hp(14)}>
                  <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(18)}>
                    Details of a person in charge.
                  </Text>

                  {/* Full Name */}
                  <YStack gap={hp(6)}>
                    <Text fontSize={fp(13)} fontWeight="500" color="#1C1C1E">
                      Full name <Text color="#FF3B30">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="full_name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="Name of the pickup person"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholderTextColor="#C7C7CC"
                        />
                      )}
                    />
                    {errors.full_name && (
                      <Text fontSize={fp(12)} color="#FF3B30">
                        {errors.full_name.message}
                      </Text>
                    )}
                  </YStack>

                  {/* Mobile Number */}
                  <YStack gap={hp(6)}>
                    <Text fontSize={fp(13)} fontWeight="500" color="#1C1C1E">
                      Mobile Number <Text color="#FF3B30">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="mobile_number"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <XStack gap={wp(8)}>
                          {/* Country code */}
                          <XStack
                            alignItems="center"
                            borderWidth={1}
                            borderColor={phoneFocus ? "#8E0FFF" : "#E5E5EA"}
                            borderRadius={wp(10)}
                            paddingHorizontal={wp(10)}
                            paddingVertical={hp(11)}
                            backgroundColor="#FFFFFF"
                            gap={wp(4)}
                          >
                            <Image
                              source={require("@/assets/images/Flags.png")}
                              style={{ height: hp(16), width: wp(16), borderRadius: 20 }}
                            />
                            <Text fontSize={fp(14)} color="#1C1C1E" fontWeight="500">+91</Text>
                            <ChevronDown size={14} color="#8E8E93" />
                          </XStack>

                          {/* Phone input */}
                          <XStack
                            flex={1}
                            borderWidth={1}
                            borderColor={phoneFocus ? "#8E0FFF" : "#E5E5EA"}
                            borderRadius={wp(10)}
                            backgroundColor="#FFFFFF"
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
                              placeholderTextColor="#C7C7CC"
                              maxLength={10}
                              style={styles.phoneInput}
                            />
                            {value ? (
                              <TouchableOpacity onPress={() => onChange("")} style={{ padding: wp(4) }}>
                                <X color="#8E8E93" size={hp(15)} />
                              </TouchableOpacity>
                            ) : null}
                          </XStack>
                        </XStack>
                      )}
                    />
                    {errors.mobile_number && (
                      <Text fontSize={fp(12)} color="#FF3B30">
                        {errors.mobile_number.message}
                      </Text>
                    )}
                  </YStack>
                </YStack>

                <YStack height={1} backgroundColor="#F2F2F7" />

                {/* OTP note */}
                <XStack paddingHorizontal={wp(16)} paddingVertical={hp(12)}>
                  <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(18)}>
                    <Text fontWeight="600" color="#6C6C89">Note: </Text>
                    OTP verification is required at handover. Please ensure the mentioned person picks up the order.
                  </Text>
                </XStack>

              </YStack>
            </YStack>

            {/* Pickup locations */}
            <YStack gap={hp(10)}>
              <YStack gap={hp(4)} paddingHorizontal={wp(4)}>
                <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4}>
                  AVAILABLE PICKUP LOCATIONS
                </Text>
                <Text fontSize={fp(13)} color="#6C6C89">
                  Choose your nearest location for pickup.
                </Text>
              </YStack>

              <YStack gap={hp(10)}>
                {pickupLocations.map((location) => {
                  const isSelected = selectedLocationId === location.id;
                  return (
                    <Pressable
                      key={location.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setValue("pickup_location_id", location.id);
                      }}
                    >
                      <XStack
                        style={[
                          styles.locationCard,
                          isSelected && styles.locationCardSelected,
                        ]}
                        gap={wp(12)}
                        alignItems="flex-start"
                      >
                        <YStack paddingTop={hp(2)}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => setValue("pickup_location_id", location.id)}
                          />
                        </YStack>
                        <YStack flex={1} gap={hp(3)}>
                          <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" lineHeight={hp(20)}>
                            {location.address}
                          </Text>
                          <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(18)}>
                            {location.hours}
                          </Text>
                        </YStack>
                      </XStack>
                    </Pressable>
                  );
                })}
              </YStack>

              {errors.pickup_location_id && (
                <Text fontSize={fp(12)} color="#FF3B30">
                  {errors.pickup_location_id.message}
                </Text>
              )}
            </YStack>

          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky CTA */}
      <YStack
        paddingHorizontal={wp(16)}
        paddingTop={hp(12)}
        paddingBottom={Math.max(insets.bottom, hp(16))}
        backgroundColor="#FFFFFF"
        borderTopWidth={1}
        borderTopColor="#F2F2F7"
      >
        <BottomSheetButton
          variant="primary"
          size="lg"
          onPress={handleSubmit(onSubmit)}
        >
          Continue
        </BottomSheetButton>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F7" },
  backBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: wp(12),
    paddingVertical: hp(12),
    fontSize: fp(14),
    color: "#1C1C1E",
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationCardSelected: {
    shadowColor: "#8E0FFF",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
});
