import React, { useState, useEffect, useRef } from "react";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable, TextInput, Animated, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { RatingCategory } from "@/types/shoots/shoots";
import { router, useLocalSearchParams } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import Svg, { Path } from "react-native-svg";
import { Input } from "@/components/ui/Input";
import { Heading1, Heading2, BodyText } from "@/components/ui/Typography";
import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { ShootsToast } from "@/components/ui/ShootsToast";
import { usePostBookingReview } from "@/hooks/reviews/usePostBookingReview";
import { useQueryClient } from "@tanstack/react-query";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const RATING_CATEGORIES: RatingCategory[] = [
  { title: "Rate our service", rating: 0, maxRating: 5 },
];

const StarIcon = ({
  size = 16,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 0.75L9.75 6.25H15.25L10.75 9.75L12.25 15.25L8 11.75L3.75 15.25L5.25 9.75L0.75 6.25H6.25L8 0.75Z"
      stroke={filled ? "#fbbf24" : "#8A8AA3"}
      fill={filled ? "#fbbf24" : "none"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StarRating = ({
  rating,
  maxRating,
  onRatingChange,
  size = 24,
}: {
  rating: number;
  maxRating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}) => (
  <XStack gap={wp(8)}>
    {Array.from({ length: maxRating }, (_, i) => (
      <Pressable
        key={i}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onRatingChange(i + 1);
        }}
      >
        <StarIcon size={size} filled={i < rating} />
      </Pressable>
    ))}
  </XStack>
);

export default function RatingScreen() {
  const { booking_id } = useLocalSearchParams<{ booking_id: string }>();
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();
  const [categories, setCategories] =
    useState<RatingCategory[]>(RATING_CATEGORIES);
  const [reviewText, setReviewText] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [overallRating, setOverallRating] = useState(0);

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
  const updateCategoryRating = (categoryIndex: number, rating: number) => {
    setCategories((prev) =>
      prev.map((cat, idx) => (idx === categoryIndex ? { ...cat, rating } : cat))
    );
  };
  const postreviewMutation = usePostBookingReview();
  const toast = useToastController();
  const state = useToastState();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
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
          queryClient.invalidateQueries({
            queryKey: ["bookings", booking_id],
          });
          toast.show("Success!", {
            message: "Thank you for your valuable feedback! 🎉",
            duration: 3000,
          });
          router.back();
        },
        onError: (error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          toast.show("Error!", {
            message: "Failed to submit review. Please try again.",
            duration: 3000,
          });
        },
      }
    );
  };

  const isComplete = categories[0].rating > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack
          paddingHorizontal={wp(16)}
          paddingTop={hp(12)}
          paddingBottom={hp(16)}
        >
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
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingBottom: tabHeight,
            }}
          >
            <YStack paddingHorizontal={wp(16)} gap={hp(32)}>
              {/* Header Section */}
              <YStack alignItems="center" gap={hp(8)}>
                <Text fontSize={fp(28)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
                  Congratulations!!!
                </Text>
                <Text
                  fontSize={fp(16)}
                  fontWeight={"400"}
                  lineHeight={hp(24)}
                  color="#17663A"
                  textAlign="center"
                >
                  Your shoot is successfully done.
                </Text>
              </YStack>

              {/* Rating Section - Stars in Center */}
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 1)",
                  "rgba(142, 15, 255, 0.02)",
                  "rgba(255, 255, 255, 1)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: wp(14),
                  borderWidth: 1,
                  borderColor: "rgba(142, 15, 255, 0.08)",
                  padding: wp(20),
                  shadowColor: "#8E0FFF",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <YStack alignItems="center" gap={hp(16)}>
                  <Text fontSize={fp(18)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                    Rate our service
                  </Text>
                  <StarRating
                    rating={categories[0].rating}
                    maxRating={5}
                    onRatingChange={(rating) => updateCategoryRating(0, rating)}
                    size={wp(40)}
                  />
                  {categories[0].rating > 0 && (
                    <Text fontSize={fp(18)} fontWeight="600" color="#8E0FFF">
                      {categories[0].rating}
                    </Text>
                  )}
                </YStack>
              </LinearGradient>

              {/* Comment Section */}
              <YStack gap={hp(12)}>
                <Text fontSize={fp(18)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                  Comments
                </Text>
                <YStack
                  borderWidth={1}
                  borderColor="rgba(142, 15, 255, 0.12)"
                  borderRadius={wp(12)}
                  backgroundColor="white"
                  padding={wp(12)}
                  minHeight={hp(120)}
                >
                  <TextInput
                    placeholder="Share your experience with us..."
                    placeholderTextColor="#8A8AA3"
                    value={additionalComments}
                    onChangeText={setAdditionalComments}
                    multiline
                    numberOfLines={6}
                    style={{
                      fontSize: fp(14),
                      color: "#121217",
                      fontWeight: "400",
                      lineHeight: hp(20),
                      textAlignVertical: "top",
                      flex: 1,
                    }}
                  />
                </YStack>
              </YStack>
            </YStack>
          </ScrollView>
        </Animated.View>
        </KeyboardAvoidingView>

        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingHorizontal={wp(16)}
          paddingBottom={insets.bottom + hp(50)}
          paddingTop={hp(12)}
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="rgba(142, 15, 255, 0.08)"
        >
          <Pressable
            onPress={handleSubmit}
            disabled={!isComplete}
            style={{
              paddingVertical: hp(16),
              paddingHorizontal: wp(16),
              borderRadius: wp(12),
              backgroundColor: isComplete ? "#8E0FFF" : "#B8B8C7",
              alignItems: "center",
              opacity: isComplete ? 1 : 0.7,
            }}
          >
            <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF" letterSpacing={-0.2}>
              Submit
            </Text>
          </Pressable>
        </YStack>
      </YStack>
      {state && <ShootsToast />}
    </SafeAreaView>
  );
}
