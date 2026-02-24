import React, { useState, useEffect } from "react";
import { YStack, XStack, Text, Dialog } from "tamagui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Percent, Check, ChevronLeft, Tag, X } from "lucide-react-native";
import { fp, hp, wp } from "@/utils/responsive";
import { useCouponStore } from "@/store/coupon/coupon";
import { useCartStore } from "@/store/cart/cart";
import * as Haptics from "expo-haptics";

export default function CouponsPage() {
  const insets = useSafeAreaInsets();
  const [couponCode, setCouponCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    type: "success" | "error";
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

  const handleApplyCoupon = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const cartTotal = summary.itemsSubtotal + summary.crewSubtotal;
    const result = applyCoupon(code, cartTotal);

    if (result.success) {
      setDialogContent({
        type: "success",
        code,
        savings: appliedCoupon?.discountAmount || 0,
      });
      setDialogOpen(true);
    } else {
      setDialogContent({ type: "error", message: result.message });
      setDialogOpen(true);
    }
  };

  const handleRemoveCoupon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removeCoupon();
  };

  const handleApplyFromInput = () => {
    if (couponCode.trim()) {
      handleApplyCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    }
  };

  const isApplied = (code: string) => appliedCoupon?.coupon.code === code;

  return (
    <SafeAreaView style={styles.root}>
      <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.4}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => setDialogOpen(false)}
            backgroundColor="#000"
          />
          <Dialog.Content
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={["quick", { opacity: { overshootClamping: true } }]}
            enterStyle={{ y: -16, opacity: 0, scale: 0.95 }}
            exitStyle={{ y: 8, opacity: 0, scale: 0.95 }}
            backgroundColor="#FFFFFF"
            borderRadius={wp(20)}
            paddingHorizontal={wp(24)}
            paddingVertical={hp(28)}
            minWidth={wp(300)}
          >
            <YStack alignItems="center" gap={hp(12)}>
              {dialogContent?.type === "success" ? (
                <>
                  <YStack style={styles.dialogIcon}>
                    <Check size={wp(28)} color="#34C759" strokeWidth={3} />
                  </YStack>
                  <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E" textAlign="center" letterSpacing={-0.3}>
                    Coupon Applied!
                  </Text>
                  <Text fontSize={fp(14)} color="#8E8E93" textAlign="center">
                    <Text fontWeight="600" color="#8E0FFF">"{dialogContent.code}"</Text>
                    {" "}saves you ₹{dialogContent.savings}
                  </Text>
                </>
              ) : (
                <>
                  <YStack style={styles.dialogIconError}>
                    <X size={wp(24)} color="#FF3B30" strokeWidth={2.5} />
                  </YStack>
                  <Text fontSize={fp(17)} fontWeight="700" color="#1C1C1E" textAlign="center" letterSpacing={-0.3}>
                    Invalid Coupon
                  </Text>
                  <Text fontSize={fp(14)} color="#8E8E93" textAlign="center">
                    {dialogContent?.message}
                  </Text>
                </>
              )}
              <Pressable
                onPress={() => setDialogOpen(false)}
                style={styles.dialogBtn}
              >
                <Text fontSize={fp(15)} fontWeight="600" color="#FFFFFF">
                  {dialogContent?.type === "success" ? "Great!" : "Got it"}
                </Text>
              </Pressable>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <XStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={wp(20)}
          paddingTop={hp(10)}
          paddingBottom={hp(14)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F2F2F7"
          position="relative"
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backBtn}
          >
            <ChevronLeft size={hp(20)} color="#1C1C1E" strokeWidth={2.5} />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.3}>
            Apply Coupon
          </Text>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + hp(40) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Coupon input card */}
          <YStack style={styles.inputCard}>
            <Text style={styles.sectionLabel}>ENTER COUPON CODE</Text>
            <XStack
              backgroundColor="#FFFFFF"
              borderRadius={wp(14)}
              alignItems="center"
              paddingHorizontal={wp(14)}
              height={hp(50)}
              style={styles.inputRow}
              gap={wp(10)}
            >
              <Tag size={hp(16)} color="#8E0FFF" strokeWidth={2} />
              <TextInput
                value={couponCode}
                onChangeText={(t) => setCouponCode(t.toUpperCase())}
                placeholder="e.g. SAVE20"
                placeholderTextColor="#C7C7CC"
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleApplyFromInput}
                style={styles.textInput}
              />
              {couponCode.length > 0 && (
                <Pressable
                  onPress={handleApplyFromInput}
                  style={styles.applyPill}
                >
                  <Text fontSize={fp(13)} fontWeight="600" color="#FFFFFF">
                    Apply
                  </Text>
                </Pressable>
              )}
            </XStack>
          </YStack>

          {/* Available coupons */}
          <Text style={styles.sectionLabel}>AVAILABLE OFFERS</Text>

          <YStack paddingHorizontal={wp(16)} gap={hp(10)}>
            {coupons.length === 0 ? (
              <YStack paddingVertical={hp(40)} alignItems="center" gap={hp(10)}>
                <YStack style={styles.emptyIcon}>
                  <Percent size={hp(24)} color="#C7C7CC" strokeWidth={1.8} />
                </YStack>
                <Text fontSize={fp(14)} color="#8E8E93">No coupons available</Text>
              </YStack>
            ) : (
              coupons.map((coupon) => {
                const applied = isApplied(coupon.code);
                return (
                  <YStack
                    key={coupon.id}
                    style={[styles.couponCard, applied && styles.couponCardApplied]}
                  >
                    <XStack alignItems="flex-start" gap={wp(12)}>
                      {/* Icon */}
                      <YStack style={[styles.couponIcon, applied && styles.couponIconApplied]}>
                        {applied ? (
                          <Check size={hp(16)} color="#FFFFFF" strokeWidth={2.5} />
                        ) : (
                          <Percent size={hp(16)} color="#8E0FFF" strokeWidth={2} />
                        )}
                      </YStack>

                      {/* Text */}
                      <YStack flex={1} gap={hp(4)}>
                        <XStack alignItems="center" gap={wp(8)}>
                          <Text
                            fontSize={fp(13)}
                            fontWeight="700"
                            color="#1C1C1E"
                            letterSpacing={0.2}
                          >
                            {coupon.code}
                          </Text>
                          {applied && (
                            <XStack style={styles.appliedBadge}>
                              <Text fontSize={fp(10)} fontWeight="600" color="#34C759">
                                Applied
                              </Text>
                            </XStack>
                          )}
                        </XStack>
                        <Text fontSize={fp(13)} fontWeight="500" color="#1C1C1E">
                          {coupon.title}
                        </Text>
                        <Text fontSize={fp(12)} color="#8E8E93" numberOfLines={2}>
                          {coupon.description}
                        </Text>
                        <Text fontSize={fp(11)} color="#C7C7CC">
                          Valid till {coupon.validTill}
                        </Text>
                      </YStack>

                      {/* Action button */}
                      <Pressable
                        onPress={() => applied ? handleRemoveCoupon() : handleApplyCoupon(coupon.code)}
                        style={[styles.couponActionBtn, applied && styles.couponActionBtnRemove]}
                      >
                        <Text
                          fontSize={fp(12)}
                          fontWeight="600"
                          color={applied ? "#FF3B30" : "#8E0FFF"}
                        >
                          {applied ? "Remove" : "Apply"}
                        </Text>
                      </Pressable>
                    </XStack>
                  </YStack>
                );
              })
            )}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  backBtn: {
    position: "absolute",
    left: wp(16),
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  inputCard: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(4),
  },
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(10),
  },
  inputRow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: fp(15),
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: 0.5,
    padding: 0,
    margin: 0,
  },
  applyPill: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(7),
    backgroundColor: "#8E0FFF",
    borderRadius: wp(10),
  },
  couponCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  couponCardApplied: {
    backgroundColor: "#F5EEFF",
    shadowColor: "#8E0FFF",
    shadowOpacity: 0.1,
  },
  couponIcon: {
    width: wp(34),
    height: wp(34),
    borderRadius: wp(17),
    backgroundColor: "#F5EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  couponIconApplied: {
    backgroundColor: "#8E0FFF",
  },
  appliedBadge: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
    backgroundColor: "#E8FAF0",
    borderRadius: wp(8),
  },
  couponActionBtn: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(7),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#8E0FFF",
    alignSelf: "flex-start",
  },
  couponActionBtnRemove: {
    borderColor: "#FF3B30",
  },
  emptyIcon: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogIcon: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: "#E8FAF0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(4),
  },
  dialogIconError: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(4),
  },
  dialogBtn: {
    marginTop: hp(4),
    width: "100%",
    paddingVertical: hp(13),
    backgroundColor: "#8E0FFF",
    borderRadius: wp(14),
    alignItems: "center",
  },
});
