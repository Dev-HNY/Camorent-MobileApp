import React, { useState } from "react";
import { YStack, ScrollView, XStack, Card, View, Text, Image } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCartStore } from "@/store/cart/cart";
import { ArrowLeft, ArrowUp, ChevronRight } from "lucide-react-native";
import { BodyText, BodySmall, Heading2 } from "@/components/ui/Typography";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";
import { Button } from "@/components/ui/Button";
import { hp, wp } from "@/utils/responsive";
import { RadioMini } from "@/components/ui/RadioMini";
import { WalletIcon } from "@/components/icons/WalletIcon";

export default function PaymentOptionsScreen() {
  const { summary } = useCartStore();
  const [paymentTiming, setPaymentTiming] = useState<"now" | "later">("now");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >("paytm");
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    router.back();
  };

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      // Simulate payment processing
      const isSuccess = Math.random() > 0.3; // 70% success rate
      // if (isSuccess) {
      //   router.push("/checkout/payment/success");
      // } else {
      //   router.push("/checkout/payment/failure");
      // }
    }
  };

  const upiMethods = [
    {
      id: "paytm",
      title: "Paytm UPI",
      logo: require("@/assets/images/paytm.png"),
      buttonColor: "#8b5cf6",
      buttonText: "Pay via Paytm",
    },
    {
      id: "phonepe",
      title: "Phone pe UPI",
      logo: require("@/assets/images/phonepe.png"),
      buttonColor: "#5f259f",
      buttonText: "Pay via PhonePe",
    },
    {
      id: "gpay",
      title: "GPay UPI",
      logo: require("@/assets/images/gpay.png"),
      buttonColor: "#1a73e8",
      buttonText: "Pay via GPay",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1}>
        {/* Custom Header */}
        <YStack padding="$4" paddingBottom="$2">
          <XStack alignItems="center" gap={wp(12)} marginBottom={hp(16)}>
            <XStack
              borderRadius={28}
              borderWidth={1}
              padding={"$2"}
              borderColor={"$gray7"}
              onPress={() => router.back()}
            >
              <ArrowLeft size={18} />
            </XStack>
            <YStack flex={1}>
              <BodySmall fontWeight={"600"} color={"#121217"}>
                Payment options
              </BodySmall>
              <BodyText color={"#17663A"}>
                Bill total:{" "}
                <BodyText fontWeight={"600"} color={"#17663A"}>
                  ₹2500
                </BodyText>
              </BodyText>
            </YStack>
          </XStack>
        </YStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + hp(60) }}
        >
          <YStack paddingHorizontal={wp(16)} gap="$5">
            {/* When do you prefer to pay */}
            <YStack gap={hp(12)}>
              <BodySmall fontWeight={"600"} color={"#121217"}>
                When do you prefer to pay?
              </BodySmall>
              <YStack>
                <XStack
                  alignItems="center"
                  gap="$3"
                  onPress={() => setPaymentTiming("now")}
                  borderWidth={1}
                  paddingHorizontal={wp(12)}
                  paddingVertical={hp(10)}
                  borderTopRightRadius={wp(8)}
                  borderTopLeftRadius={wp(8)}
                  borderColor={"#EBEBEF"}
                >
                  <RadioMini
                    selected={paymentTiming === "now"}
                    onSelect={() => setPaymentTiming("now")}
                  />
                  <BodySmall color={"#121217"} fontWeight={"500"}>
                    Pay now
                  </BodySmall>
                </XStack>
                <XStack
                  alignItems="center"
                  gap="$3"
                  onPress={() => setPaymentTiming("later")}
                  borderWidth={1}
                  borderTopWidth={0}
                  paddingHorizontal={wp(12)}
                  paddingVertical={hp(10)}
                  borderBottomRightRadius={wp(8)}
                  borderBottomLeftRadius={wp(8)}
                  borderColor={"#EBEBEF"}
                >
                  <RadioMini
                    selected={paymentTiming === "later"}
                    onSelect={() => setPaymentTiming("later")}
                  />
                  <BodySmall color={"#121217"} fontWeight={"500"}>
                    Pay later
                  </BodySmall>
                </XStack>
              </YStack>
            </YStack>

            {/* Payment methods */}
            <YStack gap={hp(12)}>
              <YStack gap={hp(4)}>
                <Heading2>Payment methods</Heading2>
                <Text
                  fontSize={hp(10)}
                  fontWeight={"500"}
                  lineHeight={hp(12)}
                  color={"#17663A"}
                >
                  Payments are secured and encrypted
                </Text>
              </YStack>
              <YStack>
                {upiMethods.map((method, index) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  const isFirst = index === 0;
                  const isLast = index === upiMethods.length - 1;

                  return (
                    <YStack
                      key={method.id}
                      onPress={() => setSelectedPaymentMethod(method.id)}
                      borderWidth={1}
                      paddingHorizontal={wp(12)}
                      paddingVertical={hp(10)}
                      borderTopRightRadius={isFirst ? wp(8) : 0}
                      borderTopLeftRadius={isFirst ? wp(8) : 0}
                      borderBottomRightRadius={isLast ? wp(8) : 0}
                      borderBottomLeftRadius={isLast ? wp(8) : 0}
                      borderTopWidth={isFirst ? 1 : 0}
                      borderColor={"#EBEBEF"}
                      gap={hp(12)}
                    >
                      <XStack
                        gap={wp(12)}
                        justifyContent="space-between"
                        alignItems={"flex-start"}
                      >
                        <XStack
                          paddingVertical={hp(4)}
                          paddingHorizontal={wp(8)}
                          justifyContent="center"
                          alignItems="center"
                          borderWidth={wp(0.5)}
                          borderRadius={wp(4)}
                          borderColor={"#EBEBEF"}
                        >
                          <Image
                            source={method.logo}
                            height={hp(20)}
                            width={wp(29)}
                            aspectRatio={29.0 / 19.33}
                            objectFit="contain"
                          />
                        </XStack>

                        <YStack flex={1} gap={hp(4)}>
                          <XStack
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <BodyText fontWeight={"600"}>
                              {method.title}
                            </BodyText>
                            <RadioMini
                              selected={isSelected}
                              onSelect={() =>
                                setSelectedPaymentMethod(method.id)
                              }
                            />
                          </XStack>

                          {isSelected && (
                            <YStack marginTop={hp(4)}>
                              <Button
                                variant="primary"
                                borderRadius={wp(8)}
                                onPress={handlePayment}
                              >
                                {method.buttonText}
                              </Button>
                            </YStack>
                          )}
                        </YStack>
                      </XStack>
                    </YStack>
                  );
                })}
              </YStack>
            </YStack>

            {/* Pay by any UPI ID */}
            <YStack gap={hp(12)}>
              <BodySmall fontWeight={"600"} color={"#121217"}>
                Pay by any UPI ID
              </BodySmall>
              <PaymentMethodCard
                icon={
                  <Image
                    source={require("@/assets/images/upi.png")}
                    height={hp(20)}
                    width={wp(29)}
                    aspectRatio={29.0 / 19.33}
                    objectFit="contain"
                  />
                }
                title="Add UPI ID"
                rightElement={
                  <XStack gap={wp(6)} alignItems="center">
                    <ArrowUp size={wp(18)} color={"#6D00DA"} />
                    <Heading2 fontWeight={"500"} color={"#6D00DA"}>
                      Add
                    </Heading2>
                  </XStack>
                }
                onPress={() => {}}
              />
            </YStack>

            {/* Pay by Card */}
            <YStack gap={hp(12)}>
              <BodySmall fontWeight={"600"} color={"#121217"}>
                Pay by Card
              </BodySmall>
              <PaymentMethodCard
                icon={
                  <Image
                    source={require("@/assets/images/plus.png")}
                    height={hp(20)}
                    width={wp(29)}
                    aspectRatio={29.0 / 19.33}
                    objectFit="contain"
                  />
                }
                title="Add CARD"
                rightElement={
                  <XStack gap={wp(6)} alignItems="center">
                    <ArrowUp size={wp(18)} color={"#6D00DA"} />
                    <Heading2 fontWeight={"500"} color={"#6D00DA"}>
                      Add
                    </Heading2>
                  </XStack>
                }
                onPress={() => {}}
              />
            </YStack>

            {/* More payment options */}
            <YStack gap={hp(12)}>
              <BodySmall fontWeight={"600"} color={"#121217"}>
                More payment options
              </BodySmall>
              <YStack gap={hp(12)}>
                <PaymentMethodCard
                  icon={<WalletIcon size={hp(20)} color="#8A8AA3" />}
                  title="Wallets"
                  subtitle="PhonePe, Amazon Pay & more"
                  rightElement={<ChevronRight size={hp(20)} color="#8A8AA3" />}
                  onPress={() => {}}
                />

                <PaymentMethodCard
                  icon={<WalletIcon size={hp(20)} color="#8A8AA3" />}
                  title="Netbanking"
                  subtitle="PhonePe, Amazon Pay & more"
                  rightElement={<ChevronRight size={hp(20)} color="#8A8AA3" />}
                  onPress={() => {}}
                />
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
