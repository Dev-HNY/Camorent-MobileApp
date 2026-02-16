import React, { useState, useEffect } from "react";
import { YStack, XStack, ScrollView, Text, Dialog, Button } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Percent, Check, ArrowLeft } from "lucide-react-native";
import { fp, hp, wp } from "@/utils/responsive";
import { BodyText, Heading2 } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { useCouponStore } from "@/store/coupon/coupon";
import { useCartStore } from "@/store/cart/cart";
import { LinearGradient } from "expo-linear-gradient";

export default function CouponsPage() {
  const insets = useSafeAreaInsets();
  const [couponCode, setCouponCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    type: "success" | "error" | "removed";
    code?: string;
    savings?: number;
    message?: string;
  } | null>(null);

  const { coupons, appliedCoupon, applyCoupon, removeCoupon, loadCoupons } =
    useCouponStore();
  const { summary } = useCartStore();

  useEffect(() => {
    loadCoupons();
  }, []);

  // Filter coupons based on search query
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCoupon = (code: string) => {
    const cartTotal = summary.itemsSubtotal + summary.crewSubtotal;
    const result = applyCoupon(code, cartTotal);

    if (result.success) {
      setDialogContent({
        type: "success",
        code: code,
        savings: appliedCoupon?.discount || 0,
      });
      setDialogOpen(true);
    } else {
      setDialogContent({
        type: "error",
        message: result.message,
      });
      setDialogOpen(true);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    // setDialogContent({
    //   type: "removed",
    //   message: "Coupon removed successfully",
    // });
    // setDialogOpen(true);
  };

  const handleApplyFromInput = () => {
    if (couponCode.trim()) {
      handleApplyCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    }
  };

  const isApplied = (code: string) => {
    return appliedCoupon?.coupon.code === code;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => setDialogOpen(false)}
            backgroundColor={"#141414"}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            paddingHorizontal={wp(16)}
            paddingVertical={hp(24)}
            backgroundColor="#FFFFFF"
            borderRadius="$3"
            minWidth={wp(280)}
          >
            <YStack alignItems="center" gap="$3">
              {dialogContent?.type === "success" && (
                <>
                  <YStack
                    width={wp(60)}
                    height={wp(60)}
                    borderRadius={wp(30)}
                    borderWidth={wp(3)}
                    borderColor="#10B981"
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="$2"
                  >
                    <Check size={wp(32)} color="#10B981" strokeWidth={3} />
                  </YStack>
                  <Text
                    fontSize={fp(18)}
                    fontWeight="600"
                    color="#8E0FFF"
                    textAlign="center"
                  >
                    "{dialogContent.code}" applied
                  </Text>
                  <Text
                    fontSize={fp(16)}
                    fontWeight="700"
                    color="#141414"
                    textAlign="center"
                  >
                    ₹{dialogContent.savings} savings with this coupon.
                  </Text>
                </>
              )}

              {dialogContent?.type === "error" && (
                <>
                  <Text
                    fontSize={fp(16)}
                    fontWeight="600"
                    color="#EF4444"
                    textAlign="center"
                  >
                    Error
                  </Text>
                  <Text fontSize={fp(14)} color="#6C6C89" textAlign="center">
                    {dialogContent.message}
                  </Text>
                </>
              )}

              <Text>
                {dialogContent?.type === "success" ? "Wohoo! Thanks" : "Okay"}
              </Text>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <YStack flex={1}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <XStack
          alignItems="center"
          paddingTop={hp(8)}
          paddingHorizontal={wp(16)}
        >
          <XStack
            borderRadius={28}
            borderWidth={1}
            padding={"$2"}
            borderColor={"$gray7"}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} />
          </XStack>
          <XStack paddingLeft={wp(85)}>
            <Heading2>Apply Coupons</Heading2>
          </XStack>
        </XStack>

        {/* Coupon Input with Apply Button */}
        <YStack paddingHorizontal={wp(16)} paddingVertical={hp(16)}>
          <Input
            placeholder="Enter Coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            placeholderTextColor="#8A8AA3"
          />
        </YStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
          }}
        >
          <YStack paddingHorizontal={wp(16)} gap={hp(16)}>
            <Heading2>Best Coupon</Heading2>

            <YStack gap={hp(12)}>
              {filteredCoupons.map((coupon) => {
                const applied = isApplied(coupon.code);

                const CouponCard = (
                  <XStack
                    key={coupon.id}
                    paddingHorizontal={wp(12)}
                    paddingVertical={hp(12)}
                    borderRadius={wp(12)}
                    borderWidth={wp(1)}
                    borderColor={!applied ? "#EBEBEF" : "transparent"}
                    backgroundColor={applied ? undefined : "#FFFFFF"}
                    justifyContent="space-between"
                    alignItems="center"
                    overflow="hidden"
                  >
                    <YStack flex={1}>
                      <XStack alignItems="flex-start" gap={wp(8)}>
                        {applied ? (
                          <Check
                            size={wp(20)}
                            color="#FFFFFF"
                            strokeWidth={wp(1.2)}
                            style={{
                              backgroundColor: "#5F00BA",
                              borderRadius: wp(4),
                              padding: wp(2),
                            }}
                          />
                        ) : (
                          <Percent size={wp(16)} color="#8A8AA3" />
                        )}
                        <YStack gap={hp(4)} flex={1}>
                          <BodyText fontWeight={"600"} color={"#141414"}>
                            {coupon.title}
                          </BodyText>
                          <BodyText color="#6C6C89" fontSize={fp(12)}>
                            {coupon.description}
                          </BodyText>
                          <BodyText color="#8A8AA3" fontSize={fp(12)}>
                            Valid till {coupon.validTill}
                          </BodyText>
                        </YStack>
                      </XStack>
                    </YStack>
                    {applied ? (
                      <XStack
                        borderWidth={1}
                        borderColor="#8E0FFF"
                        borderRadius={wp(8)}
                        paddingHorizontal={wp(12)}
                        paddingVertical={hp(6)}
                        onPress={handleRemoveCoupon}
                      >
                        <BodyText color="#8E0FFF" fontWeight="500">
                          Remove
                        </BodyText>
                      </XStack>
                    ) : (
                      <XStack
                        borderWidth={1}
                        borderColor="#8E0FFF"
                        borderRadius={wp(8)}
                        paddingHorizontal={wp(12)}
                        paddingVertical={hp(6)}
                        onPress={() => handleApplyCoupon(coupon.code)}
                      >
                        <BodyText color="#8E0FFF" fontWeight="500">
                          Apply
                        </BodyText>
                      </XStack>
                    )}
                  </XStack>
                );

                return applied ? (
                  <LinearGradient
                    key={coupon.id}
                    colors={["#F0FAFF", "#F0FAFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      borderRadius: wp(12),
                      borderWidth: wp(1),
                      borderColor: "#EBEBEF",
                    }}
                  >
                    {CouponCard}
                  </LinearGradient>
                ) : (
                  CouponCard
                );
              })}
            </YStack>

            {filteredCoupons.length === 0 && (
              <YStack paddingVertical={hp(40)} alignItems="center">
                <BodyText color="#8A8AA3">No coupons found</BodyText>
              </YStack>
            )}
          </YStack>
        </ScrollView>
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
