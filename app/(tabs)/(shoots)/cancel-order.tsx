import React, { useState } from "react";
import { YStack, XStack, Text, ScrollView, Select, RadioGroup } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

const CANCELLATION_REASONS = [
  "Changed my mind",
  "Found alternative equipment",
  "Event postponed",
  "Event cancelled",
  "Pricing concerns",
  "Equipment not suitable",
  "Other",
];

export default function CancelOrderScreen() {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");

  const handleCancel = () => {
    if (!selectedReason) return;

    // TODO: Submit cancellation request to backend
    console.log({
      reason: selectedReason,
      additionalDetails,
      refundMethod,
    });
    router.back();
  };

  const isFormValid = selectedReason.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$3"
          gap="$3"
        >
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="black" />
          </Pressable>
          <Text fontSize={20} fontWeight="600" color="black">
            Cancel Order
          </Text>
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView flex={1} paddingHorizontal="$4" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <YStack gap="$4" paddingBottom="$6" paddingTop="$4">
            <XStack
              backgroundColor="#fef3c7"
              padding="$3"
              borderRadius={8}
              alignItems="center"
              gap="$2"
            >
              <AlertCircle size={20} color="#f59e0b" />
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color="#92400e">
                  Cancellation Policy
                </Text>
                <Text fontSize={13} color="#92400e">
                  Free cancellation up to 24 hours before shoot. After that, cancellation charges may apply.
                </Text>
              </YStack>
            </XStack>

            <YStack
              backgroundColor="white"
              borderRadius={16}
              borderWidth={1}
              borderColor="#E5E7EB"
              padding="$4"
              gap="$4"
            >
              <YStack gap="$3">
                <Text fontSize={16} fontWeight="600" color="black">
                  Why are you cancelling? *
                </Text>

                <YStack
                  borderWidth={1}
                  borderColor="#e5e7eb"
                  borderRadius={8}
                  backgroundColor="white"
                >
                  <Select value={selectedReason} onValueChange={setSelectedReason}>
                    <Select.Trigger
                      borderWidth={0}
                      backgroundColor="transparent"
                    >
                      <Select.Value placeholder="Select cancellation reason" />
                    </Select.Trigger>

                    <Select.Content>
                      <Select.ScrollUpButton />
                      <Select.Viewport>
                        {CANCELLATION_REASONS.map((reason, index) => (
                          <Select.Item key={reason} value={reason} index={index}>
                            <Select.ItemText>{reason}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton />
                    </Select.Content>
                  </Select>
                </YStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={16} fontWeight="600" color="black">
                  Additional details (optional)
                </Text>
                <TextInput
                  placeholder="Tell us more about why you're cancelling..."
                  value={additionalDetails}
                  onChangeText={setAdditionalDetails}
                  multiline
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 80,
                    fontSize: 16,
                    textAlignVertical: "top",
                  }}
                />
              </YStack>

              <YStack gap="$3">
                <Text fontSize={16} fontWeight="600" color="black">
                  Refund method
                </Text>
                <RadioGroup value={refundMethod} onValueChange={setRefundMethod}>
                  <YStack gap="$2">
                    <XStack alignItems="center" gap="$2">
                      <RadioGroup.Item value="original" id="original">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Text fontSize={14} color="black">
                        Refund to original payment method
                      </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2">
                      <RadioGroup.Item value="wallet" id="wallet">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Text fontSize={14} color="black">
                        Refund to Camorent wallet
                      </Text>
                    </XStack>
                  </YStack>
                </RadioGroup>
              </YStack>

              <YStack
                backgroundColor="#fee2e2"
                padding="$3"
                borderRadius={8}
                gap="$1"
              >
                <Text fontSize={14} fontWeight="600" color="#991b1b">
                  Estimated refund amount: ₹2,500
                </Text>
                <Text fontSize={12} color="#991b1b">
                  Refund will be processed within 5-7 business days
                </Text>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
        </KeyboardAvoidingView>

        <YStack padding="$4" gap="$2">
          <Button
            size="lg"
            disabled={!isFormValid}
            onPress={handleCancel}
            backgroundColor="#dc2626"
          >
            <Text fontSize={16} fontWeight="600" color="white">
              Confirm Cancellation
            </Text>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onPress={() => router.back()}
          >
            <Text fontSize={16} fontWeight="600" color="#6B7280">
              Keep Order
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
