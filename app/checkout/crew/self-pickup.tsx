import React, { useState } from "react";
import { YStack, ScrollView, XStack, Text, Card } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ArrowLeft, ChevronDown, X } from "lucide-react-native";
import { TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { hp, wp, fp } from "@/utils/responsive";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pickupPersonSchema,
  type PickupPersonFormData,
  type PickupLocation,
} from "@/types/address";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1} paddingHorizontal={wp(16)}>
        <XStack alignItems="center" paddingTop={hp(8)}>
          <XStack
            borderRadius={wp(30)}
            borderWidth={wp(0.7)}
            padding={wp(6)}
            borderColor={"#EBEBEF"}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} />
          </XStack>
          <XStack paddingLeft={wp(88)}>
            <Heading2>Self Pickup</Heading2>
          </XStack>
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: hp(24),
          }}
        >
          <YStack gap={hp(12)}>
            <BodyText>
              User can pickup the order from nearest location.
            </BodyText>

            <Card
              borderRadius={wp(12)}
              paddingVertical={hp(16)}
              paddingHorizontal={wp(12)}
              borderWidth={1}
              borderColor="#EBEBEF"
            >
              <YStack gap={hp(12)}>
                <YStack gap={hp(6)}>
                  <Heading2>Who will pickup the order?</Heading2>

                  <Controller
                    control={control}
                    name="is_self_pickup"
                    render={({ field: { onChange, value } }) => (
                      <XStack gap={wp(12)} alignItems="center">
                        <Checkbox
                          checked={!!value}
                          onCheckedChange={onChange}
                        />
                        <BodySmall color={"#121217"} fontWeight={"500"}>
                          I am going to pick up the order.
                        </BodySmall>
                      </XStack>
                    )}
                  />
                </YStack>
                <YStack gap={hp(8)}>
                  <Text fontSize={fp(13)} color="#6C6C89" lineHeight={hp(17)}>
                    Details of a person in charge.
                  </Text>
                  {/* Full Name Input */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#282833">
                      Full name <Text color="#FF4444">*</Text>
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
                          placeholderTextColor="#8A8AA3"
                        />
                      )}
                    />
                    {errors.full_name && (
                      <Text fontSize={fp(12)} color="#FF4444">
                        {errors.full_name.message}
                      </Text>
                    )}
                  </YStack>
                  {/* Mobile Number Input */}
                  <YStack gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                      Mobile Number <Text color="#FF4444">*</Text>
                    </Text>
                    <Controller
                      control={control}
                      name="mobile_number"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <>
                          <XStack gap={wp(12)}>
                            <XStack
                              alignItems="center"
                              borderWidth={1}
                              borderColor={phoneFocus ? "#6D00DA" : "#d1d1db"}
                              borderRadius={wp(8)}
                              padding={wp(8)}
                              paddingVertical={hp(10)}
                              backgroundColor="white"
                              boxShadow={"0 1px 2px 0 rgba(18, 18, 23, 0.05)"}
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
                                height={hp(18)}
                                width={wp(18)}
                              />
                            </XStack>

                            <XStack
                              flex={1}
                              borderWidth={1}
                              borderColor={phoneFocus ? "#6D00DA" : "#d1d1db"}
                              borderRadius={wp(8)}
                              backgroundColor="white"
                              boxShadow={"0 1px 2px 0 rgba(18, 18, 23, 0.05)"}
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
                                  padding: wp(8),
                                  paddingVertical: hp(10),
                                  fontSize: fp(14),
                                  color: "#121217",
                                  fontWeight: "400",
                                  backgroundColor: "transparent",
                                }}
                              />
                              {value && (
                                <TouchableOpacity
                                  onPress={() => onChange("")}
                                  style={{ padding: wp(4) }}
                                >
                                  <X color="#999" size={hp(16)} />
                                </TouchableOpacity>
                              )}
                            </XStack>
                          </XStack>
                        </>
                      )}
                    />
                    {errors.mobile_number && (
                      <Text fontSize={fp(12)} color="#FF4444">
                        {errors.mobile_number.message}
                      </Text>
                    )}
                  </YStack>
                </YStack>
                <XStack paddingTop={hp(12)}>
                  <BodyText color={"#6C6C89"}>
                    <BodyText fontWeight="600">Note:</BodyText> OTP verification
                    is required at handover. Please ensure the mentioned person
                    picks up the order.
                  </BodyText>
                </XStack>
              </YStack>
            </Card>

            {/* Available pickup locations */}
            <YStack gap={hp(16)}>
              <YStack gap={hp(4)}>
                <Heading2>Available pickup locations</Heading2>
                <BodyText>Choose your nearest location for pickup.</BodyText>
              </YStack>

              <YStack gap={hp(12)}>
                {pickupLocations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => setValue("pickup_location_id", location.id)}
                    activeOpacity={0.7}
                  >
                    <Card
                      backgroundColor="white"
                      borderRadius={wp(12)}
                      padding={wp(16)}
                      borderWidth={1.5}
                      borderColor={
                        selectedLocationId === location.id
                          ? "#7047EB"
                          : "#E8E8ED"
                      }
                    >
                      <XStack gap={wp(12)} alignItems="flex-start">
                        <YStack paddingTop={hp(2)}>
                          <Checkbox
                            checked={selectedLocationId === location.id}
                            onCheckedChange={() =>
                              setValue("pickup_location_id", location.id)
                            }
                          />
                        </YStack>

                        <YStack flex={1} gap={hp(4)}>
                          <Text
                            fontSize={fp(14)}
                            fontWeight="600"
                            color="#282833"
                            lineHeight={hp(19)}
                          >
                            {location.address}
                          </Text>
                          <Text
                            fontSize={fp(13)}
                            color="#6C6C89"
                            lineHeight={hp(17)}
                          >
                            {location.hours}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>
                  </TouchableOpacity>
                ))}
              </YStack>
              {errors.pickup_location_id && (
                <Text fontSize={fp(12)} color="#FF4444">
                  {errors.pickup_location_id.message}
                </Text>
              )}
            </YStack>
          </YStack>
        </ScrollView>
        </KeyboardAvoidingView>

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
