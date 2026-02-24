import React, { useEffect, useRef } from "react";
import { YStack, XStack, Text, ScrollView, Spinner } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ChevronLeft, Calendar } from "lucide-react-native";
import { TrackingTimeline } from "@/types/shoots/shoots";
import { router, useLocalSearchParams } from "expo-router";
import { Animated, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { wp, hp, fp } from "@/utils/responsive";
import { Badge } from "@/components/ui/Badge";
import { useGetBookingById } from "@/hooks/shoots/useGetBookingById";
import {
  OrderCheckpoint,
  CHECKPOINT_LABELS,
  CHECKPOINT_ORDER,
} from "@/constants/order-status";

export const TimelineItem = ({
  status,
  description,
  date,
  isCompleted,
  isActive,
  isLast,
  stepNumber,
}: {
  status: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isActive?: boolean;
  isLast: boolean;
  stepNumber: number;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  const circleBg = isCompleted || isActive ? "#8E0FFF" : "#F3F4F6";

  return (
    <XStack gap={wp(12)} alignItems="flex-start" paddingVertical={hp(2)}>
      {/* Circle + line */}
      <YStack alignItems="center" width={wp(28)}>
        <Animated.View
          style={{
            width: wp(28),
            height: wp(28),
            borderRadius: wp(14),
            backgroundColor: circleBg,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: isActive ? pulseAnim : 1 }],
          }}
        >
          {isActive && (
            <YStack
              position="absolute"
              width={wp(36)}
              height={wp(36)}
              borderRadius={wp(18)}
              backgroundColor="rgba(142, 15, 255, 0.12)"
            />
          )}
          <Text
            fontSize={fp(11)}
            fontWeight="700"
            color={isCompleted || isActive ? "#FFFFFF" : "#9CA3AF"}
          >
            {stepNumber}
          </Text>
        </Animated.View>

        {!isLast && (
          <YStack
            width={2}
            flex={1}
            minHeight={hp(32)}
            marginTop={hp(2)}
            backgroundColor={isCompleted ? "#8E0FFF" : "#E5E7EB"}
            borderRadius={1}
          />
        )}
      </YStack>

      {/* Content */}
      <YStack flex={1} gap={hp(3)} paddingTop={hp(3)} paddingBottom={hp(10)}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color={isCompleted || isActive ? "#1C1C1E" : "#9CA3AF"}
            letterSpacing={-0.2}
            flex={1}
            marginRight={wp(8)}
          >
            {status}
          </Text>
          <Badge
            textColor={isCompleted ? "#059669" : isActive ? "#8E0FFF" : "#9CA3AF"}
            backgroundColor={
              isCompleted
                ? "rgba(16, 185, 129, 0.08)"
                : isActive
                ? "rgba(142, 15, 255, 0.08)"
                : "rgba(156, 163, 175, 0.06)"
            }
            label={isCompleted ? "Done" : isActive ? "Active" : "Pending"}
            fontSize={fp(10)}
          />
        </XStack>

        {description && (
          <Text
            fontSize={fp(12)}
            color={isActive ? "#6B7280" : "#B0B0B8"}
            lineHeight={fp(17)}
            letterSpacing={-0.1}
          >
            {description}
          </Text>
        )}

        {date && (
          <XStack alignItems="center" gap={wp(4)} marginTop={hp(1)}>
            <Calendar size={fp(11)} color="#B0B0B8" strokeWidth={2} />
            <Text fontSize={fp(11)} color="#B0B0B8" fontWeight="400">
              {date}
            </Text>
          </XStack>
        )}
      </YStack>
    </XStack>
  );
};

export default function TrackOrderScreen() {
  const { booking_id } = useLocalSearchParams();
  const {
    data: bookingDetails,
    isLoading,
    isError,
    error,
    isRefetching,
  } = useGetBookingById(booking_id as string);
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!isLoading && bookingDetails) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, bookingDetails]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getTimelineData = (): TrackingTimeline[] => {
    if (!bookingDetails) return [];

    const currentStatus = bookingDetails.status as OrderCheckpoint;

    // Rejected: only show the steps up to rejection
    if (currentStatus === "admin_rejection") {
      return [
        {
          id: 1,
          status: CHECKPOINT_LABELS["draft"].label,
          description: CHECKPOINT_LABELS["draft"].description,
          date: formatDate(bookingDetails.created_at),
          isCompleted: true,
        },
        {
          id: 2,
          status: CHECKPOINT_LABELS["admin_review"].label,
          description: CHECKPOINT_LABELS["admin_review"].description,
          date: formatDate(bookingDetails.created_at),
          isCompleted: true,
        },
        {
          id: 3,
          status: CHECKPOINT_LABELS["admin_rejection"].label,
          description: CHECKPOINT_LABELS["admin_rejection"].description,
          date: formatDate(bookingDetails.updated_at),
          isCompleted: false,
          isActive: true,
        },
      ];
    }

    // Normal flow: only show completed steps + current step + next step
    const currentIndex = CHECKPOINT_ORDER.indexOf(currentStatus);
    // Show up to 1 step ahead of current status
    const visibleSteps = CHECKPOINT_ORDER.slice(0, currentIndex + 2);

    return visibleSteps.map((checkpoint, index) => {
      const checkpointInfo = CHECKPOINT_LABELS[checkpoint];
      const isCompleted = index < currentIndex;
      const isActive = index === currentIndex;

      let date = "";
      if (isCompleted || isActive) {
        date =
          checkpoint === "draft"
            ? formatDate(bookingDetails.created_at)
            : formatDate(bookingDetails.updated_at);
      }

      return {
        id: index + 1,
        status: checkpointInfo.label,
        description: checkpointInfo.description,
        date,
        isCompleted,
        isActive,
      };
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="#8E0FFF" />
          <Text fontSize={fp(13)} color="#9CA3AF" marginTop={hp(10)}>
            Loading...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <YStack flex={1} justifyContent="center" alignItems="center" padding={wp(16)}>
          <Text fontSize={fp(14)} color="#6C6C89" textAlign="center">
            {error?.message || "Failed to load order tracking"}
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!bookingDetails) return null;

  const timelineData = getTimelineData();
  const currentStatus = bookingDetails.status as OrderCheckpoint;
  const currentStatusInfo = CHECKPOINT_LABELS[currentStatus];
  const completedCount = timelineData.filter((t) => t.isCompleted).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        paddingTop={hp(10)}
        paddingBottom={hp(8)}
        gap={wp(10)}
        backgroundColor="#FFFFFF"
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
            borderRadius: wp(18),
            backgroundColor: "#F3F4F6",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={hp(20)} color="#1C1C1E" strokeWidth={2.5} />
        </Pressable>
        <Text fontSize={fp(16)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.3} flex={1}>
          Order Tracking
        </Text>
        {isRefetching && <Spinner size="small" color="#8E0FFF" />}
      </XStack>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          flex={1}
          contentContainerStyle={{ paddingBottom: insets.bottom + hp(100) }}
          showsVerticalScrollIndicator={false}
        >
          <YStack gap={hp(12)} padding={wp(16)} paddingTop={hp(14)}>

            {/* Compact Status Banner */}
            <LinearGradient
              colors={["#8E0FFF", "#6B0ACC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: wp(14),
                paddingVertical: hp(14),
                paddingHorizontal: wp(16),
              }}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap={hp(2)} flex={1} marginRight={wp(10)}>
                  <Text fontSize={fp(10)} color="rgba(255,255,255,0.65)" fontWeight="500" letterSpacing={0.4}>
                    CURRENT STATUS
                  </Text>
                  <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF" letterSpacing={-0.2}>
                    {currentStatusInfo?.label || "In Progress"}
                  </Text>
                  <Text fontSize={fp(11)} color="rgba(255,255,255,0.8)" lineHeight={fp(15)}>
                    {currentStatusInfo?.description || "Processing your order"}
                  </Text>
                </YStack>
                <YStack
                  backgroundColor="rgba(255,255,255,0.15)"
                  borderRadius={wp(8)}
                  paddingVertical={hp(5)}
                  paddingHorizontal={wp(8)}
                  alignItems="center"
                >
                  <Text fontSize={fp(16)} fontWeight="700" color="#FFFFFF">
                    {completedCount}
                  </Text>
                  <Text fontSize={fp(9)} color="rgba(255,255,255,0.7)" fontWeight="500">
                    of {timelineData.length}
                  </Text>
                </YStack>
              </XStack>
            </LinearGradient>

            {/* Booking Reference Row */}
            <XStack
              backgroundColor="#FFFFFF"
              paddingVertical={hp(12)}
              paddingHorizontal={wp(16)}
              borderRadius={wp(12)}
              justifyContent="space-between"
              alignItems="center"
              borderWidth={1}
              borderColor="#F3F4F6"
            >
              <YStack gap={hp(2)}>
                <Text fontSize={fp(11)} color="#9CA3AF" fontWeight="500">
                  Booking Reference
                </Text>
                <Text fontSize={fp(14)} color="#1C1C1E" fontWeight="600" letterSpacing={-0.2}>
                  {bookingDetails.booking_reference}
                </Text>
              </YStack>
              <Badge
                backgroundColor="rgba(142, 15, 255, 0.08)"
                textColor="#8E0FFF"
                label={`${completedCount}/${timelineData.length} Steps`}
                fontSize={fp(10)}
              />
            </XStack>

            {/* Timeline Card */}
            <YStack
              backgroundColor="#FFFFFF"
              borderRadius={wp(14)}
              paddingTop={hp(16)}
              paddingHorizontal={wp(16)}
              paddingBottom={hp(4)}
              borderWidth={1}
              borderColor="#F3F4F6"
            >
              <Text
                fontSize={fp(13)}
                fontWeight="600"
                color="#8E8E93"
                letterSpacing={0.2}
                textTransform="uppercase"
                marginBottom={hp(12)}
              >
                Progress Timeline
              </Text>

              {timelineData.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  status={item.status}
                  description={item.description}
                  date={item.date}
                  isCompleted={item.isCompleted}
                  isActive={item.isActive}
                  isLast={index === timelineData.length - 1}
                  stepNumber={index + 1}
                />
              ))}
            </YStack>

            {/* Shoot Details */}
            {bookingDetails.shoot_name && (
              <YStack
                backgroundColor="#FFFFFF"
                borderRadius={wp(12)}
                paddingVertical={hp(12)}
                paddingHorizontal={wp(16)}
                gap={hp(8)}
                borderWidth={1}
                borderColor="#F3F4F6"
              >
                <Text fontSize={fp(11)} color="#9CA3AF" fontWeight="500" textTransform="uppercase" letterSpacing={0.2}>
                  Shoot Details
                </Text>
                <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                  {bookingDetails.shoot_name}
                </Text>
                <XStack alignItems="center" gap={wp(6)}>
                  <Calendar size={fp(13)} color="#8E0FFF" strokeWidth={2} />
                  <Text fontSize={fp(13)} color="#6B7280" fontWeight="400">
                    {new Date(bookingDetails.rental_start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}–{" "}
                    {new Date(bookingDetails.rental_end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Badge
                    backgroundColor="rgba(99, 102, 241, 0.08)"
                    textColor="#6366F1"
                    label={`${bookingDetails.total_rental_days} Days`}
                  />
                </XStack>
              </YStack>
            )}

          </YStack>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
