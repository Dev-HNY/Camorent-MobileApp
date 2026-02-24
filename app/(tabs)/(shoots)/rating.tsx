import React, { useState } from "react";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { ChevronLeft, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { RatingCategory } from "@/types/shoots/shoots";
import { router, useLocalSearchParams } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { useToastController, useToastState } from "@tamagui/toast";
import { ShootsToast } from "@/components/ui/ShootsToast";
import { usePostBookingReview } from "@/hooks/reviews/usePostBookingReview";
import { useQueryClient } from "@tanstack/react-query";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const RATING_CATEGORIES: RatingCategory[] = [
  { title: "Rate our service", rating: 0, maxRating: 5 },
];

const RATING_LABELS: Record<number, { text: string; bg: string; color: string }> = {
  1: { text: "Poor",      bg: "#FEF2F2", color: "#DC2626" },
  2: { text: "Fair",      bg: "#FEF3C7", color: "#D97706" },
  3: { text: "Good",      bg: "#FEF3C7", color: "#D97706" },
  4: { text: "Great",     bg: "#F0FDF4", color: "#16A34A" },
  5: { text: "Excellent", bg: "#F0FDF4", color: "#16A34A" },
};

const StarIcon = ({ size = 36, filled = false, index = 0 }: {
  size?: number; filled?: boolean; index?: number;
}) => {
  const id = `star-grad-${index}`;
  // Partial fill: last filled star can be full, unfilled grey
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgLinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={filled ? "#FBBF24" : "#E5E5EA"} />
          <Stop offset="1" stopColor={filled ? "#F59E0B" : "#D1D1D6"} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M12 2L14.85 9H22L16.18 13.5L18.36 20.5L12 16.5L5.64 20.5L7.82 13.5L2 9H9.15L12 2Z"
        stroke={filled ? "#F59E0B" : "#D1D1D6"}
        fill={`url(#${id})`}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default function RatingScreen() {
  const { booking_id } = useLocalSearchParams<{ booking_id: string }>();
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const [categories, setCategories] = useState<RatingCategory[]>(RATING_CATEGORIES);
  const [additionalComments, setAdditionalComments] = useState("");

  const postreviewMutation = usePostBookingReview();
  const toast = useToastController();
  const state = useToastState();
  const queryClient = useQueryClient();

  const currentRating = categories[0].rating;
  const isComplete = currentRating > 0;
  const ratingMeta = RATING_LABELS[currentRating];

  const updateCategoryRating = (rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCategories((prev) => prev.map((cat, idx) => (idx === 0 ? { ...cat, rating } : cat)));
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    postreviewMutation.mutate(
      {
        booking_id: booking_id,
        reviewData: {
          review: additionalComments,
          rating: categories[0].rating,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["bookings", booking_id] });
          toast.show("Thank you!", {
            message: "Your feedback means a lot to us.",
            duration: 3000,
          });
          router.back();
        },
        onError: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          toast.show("Oops!", {
            message: "Failed to submit. Please try again.",
            duration: 3000,
          });
        },
      }
    );
  };

  // Bottom bar height: tab bar + safe area + padding
  const bottomBarHeight = tabHeight + insets.bottom + hp(28) + hp(15) * 2 + hp(16);

  return (
    <SafeAreaView style={styles.root}>

      {/* White sticky header */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        height={hp(52)}
        backgroundColor="#FFFFFF"
        borderBottomWidth={1}
        borderBottomColor="#F2F2F7"
      >
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          style={styles.backBtn}
          hitSlop={8}
        >
          <ChevronLeft size={22} color="#1C1C1E" />
        </Pressable>
        <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" marginLeft={wp(12)} letterSpacing={-0.3}>
          Rate your shoot
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
          contentContainerStyle={{ paddingBottom: bottomBarHeight }}
        >

          {/* Purple gradient hero — Camorent branding */}
          <Animated.View entering={FadeIn.duration(350)}>
            <LinearGradient
              colors={["#8E0FFF", "#A855F7", "#C084FC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              {/* Sparkle accent
              <XStack
                position="absolute"
                top={hp(14)}
                right={wp(20)}
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor="rgba(255,255,255,0.15)"
                alignItems="center"
                justifyContent="center"
              >
                <Sparkles size={16} color="#FFFFFF" strokeWidth={2} />
              </XStack> */}

              <YStack gap={hp(6)}>
                <Text fontSize={fp(24)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.5}>
                  Shoot complete!
                </Text>
                <Text fontSize={fp(14)} color="rgba(255,255,255,0.82)" lineHeight={hp(20)}>
                  How was your experience with Camorent?
                </Text>
              </YStack>

              {/* Camorent wordmark pill */}
              <XStack
                marginTop={hp(16)}
                alignSelf="flex-start"
                backgroundColor="rgba(255,255,255,0.15)"
                paddingHorizontal={wp(12)}
                paddingVertical={hp(5)}
                borderRadius={wp(20)}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.2)"
              >
                <Text fontSize={fp(12)} fontWeight="700" color="#FFFFFF" letterSpacing={0.4}>
                  CAMORENT
                </Text>
              </XStack>
            </LinearGradient>
          </Animated.View>

          <YStack paddingHorizontal={wp(16)} paddingTop={hp(20)} gap={hp(16)}>

            {/* Star rating card */}
            <Animated.View entering={FadeInDown.delay(80).duration(280).springify().damping(20).stiffness(260)}>
              <YStack style={styles.card}>

                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal={wp(16)}
                  paddingTop={hp(14)}
                  paddingBottom={hp(12)}
                >
                  <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4}>
                    OVERALL RATING
                  </Text>
                  {currentRating > 0 && (
                    <XStack
                      backgroundColor={ratingMeta.bg}
                      paddingHorizontal={wp(10)}
                      paddingVertical={hp(3)}
                      borderRadius={wp(20)}
                    >
                      <Text fontSize={fp(11)} fontWeight="700" color={ratingMeta.color}>
                        {ratingMeta.text}
                      </Text>
                    </XStack>
                  )}
                </XStack>

                <YStack height={1} backgroundColor="#F2F2F7" />

                <YStack alignItems="center" gap={hp(18)} paddingVertical={hp(24)} paddingHorizontal={wp(16)}>

                  {/* Stars row */}
                  <XStack gap={wp(10)}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Pressable
                        key={i}
                        onPress={() => updateCategoryRating(i + 1)}
                        hitSlop={8}
                      >
                        <Animated.View
                          entering={FadeInDown.delay(i * 40).duration(200).springify()}
                        >
                          <StarIcon
                            size={wp(46)}
                            filled={i < currentRating}
                            index={i}
                          />
                        </Animated.View>
                      </Pressable>
                    ))}
                  </XStack>

                  {/* Score or prompt */}
                  {currentRating > 0 ? (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <XStack alignItems="baseline" gap={wp(4)}>
                        <Text fontSize={fp(32)} fontWeight="800" color="#1C1C1E" letterSpacing={-1}>
                          {currentRating}
                        </Text>
                        <Text fontSize={fp(18)} fontWeight="400" color="#C7C7CC" letterSpacing={-0.3}>
                          /5
                        </Text>
                      </XStack>
                    </Animated.View>
                  ) : (
                    <Text fontSize={fp(13)} color="#C7C7CC" letterSpacing={0.1}>
                      Tap a star to rate
                    </Text>
                  )}
                </YStack>
              </YStack>
            </Animated.View>

            {/* Comments card */}
            <Animated.View entering={FadeInDown.delay(160).duration(280).springify().damping(20).stiffness(260)}>
              <YStack gap={hp(10)}>
                <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.4} paddingHorizontal={wp(4)}>
                  COMMENTS
                  <Text fontSize={fp(11)} fontWeight="400" color="#C7C7CC" letterSpacing={0}> (optional)</Text>
                </Text>
                <YStack style={[styles.card, styles.textAreaCard]}>
                  <TextInput
                    placeholder="Tell us what you loved or how we can improve..."
                    placeholderTextColor="#C7C7CC"
                    value={additionalComments}
                    onChangeText={setAdditionalComments}
                    multiline
                    numberOfLines={5}
                    style={styles.textInput}
                    textAlignVertical="top"
                  />
                </YStack>
              </YStack>
            </Animated.View>

          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky submit — sits above tab bar */}
      <View style={[styles.submitBar, { paddingBottom: tabHeight + (insets.bottom > 0 ? insets.bottom : hp(8)) }]}>
        <Pressable
          onPress={handleSubmit}
          disabled={!isComplete || postreviewMutation.isPending}
          style={({ pressed }) => [
            styles.submitBtn,
            {
              backgroundColor: isComplete ? "#8E0FFF" : "#E5E5EA",
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          {isComplete ? (
            <LinearGradient
              colors={["#8E0FFF", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text fontSize={fp(16)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.2}>
                {postreviewMutation.isPending ? "Submitting…" : "Submit Review"}
              </Text>
            </LinearGradient>
          ) : (
            <YStack style={styles.submitGradient} alignItems="center" justifyContent="center">
              <Text fontSize={fp(16)} fontWeight="600" color="#C7C7CC" letterSpacing={-0.2}>
                Submit Review
              </Text>
            </YStack>
          )}
        </Pressable>
      </View>

      {state && <ShootsToast />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F7" },
  backBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center",
  },
  hero: {
    paddingHorizontal: wp(20),
    paddingTop: hp(28),
    paddingBottom: hp(28),
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
  textAreaCard: {
    padding: wp(14),
    minHeight: hp(110),
  },
  textInput: {
    fontSize: fp(14),
    color: "#1C1C1E",
    lineHeight: hp(22),
    flex: 1,
  },
  submitBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingHorizontal: wp(16),
    paddingTop: hp(12),
  },
  submitBtn: {
    borderRadius: wp(12),
    overflow: "hidden",
  },
  submitGradient: {
    paddingVertical: hp(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp(12),
  },
});
