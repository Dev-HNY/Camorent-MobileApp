import React, { useState } from "react";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
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

const EXTENSION_OPTIONS = [
  { days: 1, price: 500, originalPrice: 600 },
  { days: 2, price: 900, originalPrice: 1200 },
  { days: 3, price: 1300, originalPrice: 1800 },
  { days: 5, price: 2000, originalPrice: 3000 },
];

export default function ExtendRentalScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const currentEndDate = "15 Jan 2025";
  const currentEndTime = "6:00 PM";

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

  const handleExtend = () => {
    if (selectedDays === null) return;

    // TODO: Submit extension request to backend
    router.back();
  };

  const selectedOption = EXTENSION_OPTIONS.find(
    (opt) => opt.days === selectedDays
  );
  const isFormValid = selectedDays !== null;

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
          <Heading2 flex={1}> Extend Rental</Heading2>
        </XStack>

        <YStack paddingHorizontal={wp(16)} paddingTop={hp(16)} gap={hp(10)}>
          <BodySmall fontWeight={"500"} color={"#121217"}>
            Want to extend your shoot time?
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
            paddingBottom: tabBarHeight + hp(60),
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
