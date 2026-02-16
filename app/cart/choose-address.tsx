import { router } from "expo-router";
import { ArrowLeft, MapPin } from "lucide-react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { XStack, YStack, Text, ScrollView as TamaguiScrollView } from "tamagui";
import { useState } from "react";
import { hp, wp, fp } from "@/utils/responsive";
import { Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useCartStore } from "@/store/cart/cart";
import { Input } from "@/components/ui/Input";
import * as Haptics from "expo-haptics";

export default function AddressModal() {
  const { setDraftAddress } = useCartStore();
  const insets = useSafeAreaInsets();

  // Manual address entry state
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const handleContinue = () => {
    // Validate required fields
    if (!addressLine.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Set the draft address
    setDraftAddress({
      name: addressLine,
      district: landmark || "",
      city: city,
      state: state,
      pincode: pincode,
      latitude: 0,
      longitude: 0,
    });

    // Navigate to address details
    router.push("/cart/address-details");
  };

  const isFormValid = addressLine.trim() && city.trim() && state.trim() && pincode.trim() && pincode.length === 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={hp(10)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1}>
            {/* Header */}
            <YStack
              paddingHorizontal={wp(16)}
              paddingVertical={hp(12)}
              gap={hp(12)}
              borderBottomWidth={1}
              borderBottomColor="#EBEBEF"
            >
              <XStack alignItems="center">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.back();
                  }}
                  style={{
                    width: wp(40),
                    height: wp(40),
                    borderRadius: wp(20),
                    backgroundColor: "rgba(142, 15, 255, 0.06)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ArrowLeft size={hp(20)} color="#8E0FFF" strokeWidth={2.5} />
                </Pressable>
                <Text
                  fontSize={fp(18)}
                  fontWeight="700"
                  color="#1C1C1E"
                  letterSpacing={-0.3}
                  marginLeft={wp(12)}
                  flex={1}
                >
                  Enter Your Location
                </Text>
              </XStack>
            </YStack>

            <TamaguiScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: wp(16),
                paddingTop: hp(24),
                paddingBottom: insets.bottom + hp(120),
              }}
            >
              <YStack gap={hp(20)}>
                {/* Info Card */}
                <YStack
                  backgroundColor="rgba(142, 15, 255, 0.04)"
                  padding={wp(14)}
                  borderRadius={wp(12)}
                  borderWidth={1}
                  borderColor="rgba(142, 15, 255, 0.12)"
                  gap={hp(6)}
                >
                  <XStack gap={wp(8)} alignItems="center">
                    <MapPin size={hp(18)} color="#8E0FFF" strokeWidth={2} />
                    <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">
                      Delivery Location
                    </Text>
                  </XStack>
                  <Text fontSize={fp(13)} color="#6B7280" lineHeight={hp(18)}>
                    Please enter your shoot location address manually
                  </Text>
                </YStack>

                {/* Address Line */}
                <YStack gap={hp(8)}>
                  <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                    Address Line <Text color="#FF4444">*</Text>
                  </Text>
                  <Input
                    placeholder="Enter street address, area"
                    value={addressLine}
                    onChangeText={setAddressLine}
                    placeholderTextColor="#8A8AA3"
                  />
                </YStack>

                {/* Landmark */}
                <YStack gap={hp(8)}>
                  <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                    Landmark{" "}
                    <Text color="#6C6C89" fontWeight="400">
                      (optional)
                    </Text>
                  </Text>
                  <Input
                    placeholder="Enter nearby landmark"
                    value={landmark}
                    onChangeText={setLandmark}
                    placeholderTextColor="#8A8AA3"
                  />
                </YStack>

                {/* City & State Row */}
                <XStack gap={wp(12)}>
                  <YStack flex={1} gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                      City <Text color="#FF4444">*</Text>
                    </Text>
                    <Input
                      placeholder="Enter city"
                      value={city}
                      onChangeText={setCity}
                      placeholderTextColor="#8A8AA3"
                    />
                  </YStack>

                  <YStack flex={1} gap={hp(8)}>
                    <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                      State <Text color="#FF4444">*</Text>
                    </Text>
                    <Input
                      placeholder="Enter state"
                      value={state}
                      onChangeText={setState}
                      placeholderTextColor="#8A8AA3"
                    />
                  </YStack>
                </XStack>

                {/* Pincode */}
                <YStack gap={hp(8)}>
                  <Text fontSize={fp(14)} fontWeight="500" color="#121217">
                    Pincode <Text color="#FF4444">*</Text>
                  </Text>
                  <Input
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChangeText={(text) => {
                      // Only allow numbers and max 6 digits
                      const numericText = text.replace(/[^0-9]/g, '');
                      setPincode(numericText.slice(0, 6));
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor="#8A8AA3"
                  />
                  {pincode.length > 0 && pincode.length < 6 && (
                    <Text fontSize={fp(12)} color="#FF4444">
                      Pincode must be 6 digits
                    </Text>
                  )}
                </YStack>
              </YStack>
            </TamaguiScrollView>

            {/* Bottom Button */}
            <YStack
              position="absolute"
              bottom={insets.bottom}
              left={0}
              right={0}
              backgroundColor="white"
              paddingHorizontal={wp(16)}
              paddingVertical={hp(16)}
              borderTopWidth={1}
              borderTopColor="#EBEBEF"
            >
              <Pressable
                onPress={handleContinue}
                disabled={!isFormValid}
                style={{
                  paddingVertical: hp(16),
                  borderRadius: wp(12),
                  backgroundColor: isFormValid ? "#8E0FFF" : "#B8B8C7",
                  alignItems: "center",
                  opacity: isFormValid ? 1 : 0.7,
                }}
              >
                <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF" letterSpacing={-0.2}>
                  Continue
                </Text>
              </Pressable>
            </YStack>
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
