import React, { useState } from "react";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { hp, wp } from "@/utils/responsive";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BodySmall, Heading2 } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { TimelineItem } from "./track-order";
import { DateRangePicker } from "@/components/checkout/DateRangePicker";

const MOCK_TRACKING_DATA = {
  timeline: [
    { id: 1, status: "Order Confirmed", description: "Your order has been confirmed", date: "10 Jan 2025", isCompleted: true, isActive: false },
    { id: 2, status: "Gear Dispatched", description: "Gear is on the way", date: "12 Jan 2025", isCompleted: true, isActive: false },
    { id: 3, status: "Delivered", description: "Gear delivered successfully", date: "13 Jan 2025", isCompleted: false, isActive: true },
  ],
};

export default function RescheduleScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  // Initialize date range state
  const getDefaultDates = () => {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return {
      startDate: formatDate(today),
      endDate: formatDate(threeDaysLater),
    };
  };

  const [selectedDateRange, setSelectedDateRange] = useState(getDefaultDates());

  const handleDateRangeChange = (dates: {
    startDate: string;
    endDate: string;
  }) => {
    setSelectedDateRange(dates);
  };

  const handleReschedule = () => {
    // TODO: Submit reschedule request to backend
    console.log({
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingTop={hp(12)}
          gap={wp(83)}
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
          <Heading2 flex={1}> Reschedule</Heading2>
        </XStack>

        <YStack paddingHorizontal={wp(16)} paddingTop={hp(16)} gap={hp(10)}>
          <BodySmall fontWeight={"500"} color={"#121217"}>
            Want to reschedule your shoot dates?
          </BodySmall>
          <DateRangePicker
            startDate={selectedDateRange.startDate}
            endDate={selectedDateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </YStack>

        <ScrollView
          flex={1}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + hp(24),
          }}
        >
          <YStack gap={hp(16)} padding={wp(16)}>
            <YStack backgroundColor="white" gap={hp(16)}>
              <XStack justifyContent="space-between" alignItems="center">
                <Heading2> Timeline</Heading2>
                <Badge
                  backgroundColor="#F3E8FF"
                  textColor="#6D00DA"
                  label="Completed"
                />
              </XStack>
              <YStack alignItems="center" gap={hp(8)}>
                {MOCK_TRACKING_DATA.timeline.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    status={item.status}
                    description={item.description}
                    date={item.date}
                    isCompleted={item.isCompleted}
                    isActive={item.isActive}
                    isLast={index === MOCK_TRACKING_DATA.timeline.length - 1}
                    stepNumber={index + 1}
                  />
                ))}
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
