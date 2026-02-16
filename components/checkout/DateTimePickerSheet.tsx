import React, { useState, useEffect, useRef } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { wp, hp, fp } from "@/utils/responsive";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

dayjs.extend(customParseFormat);

interface DateTimePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (range: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  mode?: "start" | "end" | "both";
}

export function DateTimePickerSheet({
  isOpen,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
  mode = "both",
}: DateTimePickerSheetProps) {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>(
    initialStartDate ? dayjs(initialStartDate, "DD-MM-YYYY") : undefined
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>(
    initialEndDate ? dayjs(initialEndDate, "DD-MM-YYYY") : undefined
  );

  // Premium animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Update dates when initial dates change (e.g., when dates are auto-corrected)
  useEffect(() => {
    setStartDate(
      initialStartDate ? dayjs(initialStartDate, "DD-MM-YYYY") : undefined
    );
    setEndDate(
      initialEndDate ? dayjs(initialEndDate, "DD-MM-YYYY") : undefined
    );
  }, [initialStartDate, initialEndDate]);

  // Entrance animation
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
    }
  }, [isOpen]);

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // For single mode, we only need the date being selected
    if (mode === "start" && startDate) {
      onApply({
        startDate: startDate.format("DD-MM-YYYY"),
        endDate: endDate ? endDate.format("DD-MM-YYYY") : "",
        startTime: startDate.format("hh:mm a"),
        endTime: endDate ? endDate.format("hh:mm a") : "",
      });
      onClose();
    } else if (mode === "end" && endDate) {
      onApply({
        startDate: startDate ? startDate.format("DD-MM-YYYY") : "",
        endDate: endDate.format("DD-MM-YYYY"),
        startTime: startDate ? startDate.format("hh:mm a") : "",
        endTime: endDate.format("hh:mm a"),
      });
      onClose();
    } else if (mode === "both" && startDate && endDate) {
      // Both mode requires both dates
      onApply({
        startDate: startDate.format("DD-MM-YYYY"),
        endDate: endDate.format("DD-MM-YYYY"),
        startTime: startDate.format("hh:mm a"),
        endTime: endDate.format("hh:mm a"),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const showStartDate = mode === "start" || mode === "both";
  const showEndDate = mode === "end" || mode === "both";

  // Determine if Apply button should be enabled
  const canApply =
    (mode === "start" && startDate) ||
    (mode === "end" && endDate) ||
    (mode === "both" && startDate && endDate);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[70]}>
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 1)",
          "rgba(142, 15, 255, 0.01)",
          "rgba(255, 255, 255, 1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <YStack paddingHorizontal={wp(16)} paddingTop={hp(16)} gap={hp(20)}>
            <Text fontSize={fp(20)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
              Select Date & Time
            </Text>

            <XStack gap={wp(12)}>
          {/* Start Date & Time */}
          {showStartDate && (
            <YStack flex={1} gap={hp(8)}>
              <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                Start Date & Time
              </Text>
              <YStack
                backgroundColor="rgba(142, 15, 255, 0.02)"
                borderRadius={wp(12)}
                overflow="hidden"
                borderWidth={1}
                borderColor="rgba(142, 15, 255, 0.08)"
              >
                <DateTimePicker
                  mode="single"
                  date={startDate}
                  minDate={dayjs()}
                  maxDate={
                    endDate
                      ? endDate.subtract(1, "day")
                      : dayjs().add(30, "day")
                  }
                  // timePicker
                  onChange={(params: any) => {
                    const date = params.date ? dayjs(params.date) : undefined;
                    // Ensure start date is before end date
                    if (date && endDate) {
                      if (
                        date.isAfter(endDate, "day") ||
                        date.isSame(endDate, "day")
                      ) {
                        return;
                      }
                    }
                    setStartDate(date);
                  }}
                  styles={{
                    day_cell: { padding: 1 },
                    day: { borderRadius: 5 },
                    day_label: { color: "#121217", fontSize: 12 },
                    month: {
                      borderColor: "#E5E5EA",
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                    month_label: { color: "#121217", fontSize: 11 },
                    year: {
                      borderColor: "#E5E5EA",
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                    year_label: { color: "#121217", fontSize: 11 },
                    header: { marginBottom: 5 },
                    month_selector_label: {
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#121217",
                    },
                    year_selector_label: {
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#121217",
                    },
                    weekday_label: {
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: "#6B7280",
                    },
                    button_next: {
                      tintColor: "#000000",
                      backgroundColor: "#D3D3D3",
                    },
                    button_prev: {
                      tintColor: "#000000",
                      backgroundColor: "#D3D3D3",
                    },
                    selected: {
                      backgroundColor: "#8E0FFF",
                    },
                    selected_label: {
                      color: "white",
                    },
                    disabled_label: {
                      color: "#6B7280",
                      opacity: 0.5,
                    },
                    outside_label: { color: "#6B7280" },
                    today_label: { color: "#121217" },
                    selected_month: {
                      backgroundColor: "#8E0FFF",
                      borderColor: "#8E0FFF",
                    },
                    selected_month_label: {
                      color: "white",
                    },
                    selected_year: {
                      backgroundColor: "#8E0FFF",
                      borderColor: "#8E0FFF",
                    },
                    selected_year_label: {
                      color: "white",
                    },
                    active_year: {
                      backgroundColor: "#EDE9FE",
                      borderColor: "#EDE9FE",
                    },
                    active_year_label: {
                      color: "#121217",
                    },
                  }}
                />
              </YStack>
            </YStack>
          )}

          {/* End Date & Time */}
          {showEndDate && (
            <YStack flex={1} gap={hp(8)}>
              <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                End Date & Time
              </Text>
              <YStack
                backgroundColor="rgba(142, 15, 255, 0.02)"
                borderRadius={wp(12)}
                overflow="hidden"
                borderWidth={1}
                borderColor="rgba(142, 15, 255, 0.08)"
              >
                <DateTimePicker
                  mode="single"
                  date={endDate}
                  minDate={
                    startDate ? startDate.add(1, "day") : dayjs().add(1, "day")
                  }
                  maxDate={
                    startDate
                      ? startDate.add(30, "day")
                      : dayjs().add(30, "day")
                  }
                  // timePicker
                  onChange={(params: any) => {
                    const date = params.date ? dayjs(params.date) : undefined;
                    // Ensure end date is after start date and within 30 days
                    if (date && startDate) {
                      if (
                        date.isBefore(startDate, "day") ||
                        date.isSame(startDate, "day")
                      ) {
                        return;
                      }
                      if (date.diff(startDate, "day") > 30) {
                        return;
                      }
                    }
                    setEndDate(date);
                  }}
                  styles={{
                    day_cell: { padding: 1 },
                    day: { borderRadius: 5 },
                    day_label: { color: "#121217", fontSize: 12 },
                    month: {
                      borderColor: "#E5E5EA",
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                    month_label: { color: "#121217", fontSize: 11 },
                    year: {
                      borderColor: "#E5E5EA",
                      borderWidth: 1,
                      borderRadius: 5,
                    },
                    year_label: { color: "#121217", fontSize: 11 },
                    header: { marginBottom: 5 },
                    month_selector_label: {
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#121217",
                    },
                    year_selector_label: {
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#121217",
                    },
                    weekday_label: {
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: "#6B7280",
                    },
                    button_next: {
                      tintColor: "#000000",
                      backgroundColor: "#D3D3D3",
                    },
                    button_prev: {
                      tintColor: "#000000",
                      backgroundColor: "#D3D3D3",
                    },
                    selected: {
                      backgroundColor: "#8E0FFF",
                    },
                    selected_label: {
                      color: "white",
                    },
                    disabled_label: {
                      color: "#6B7280",
                      opacity: 0.5,
                    },
                    outside_label: { color: "#6B7280" },
                    today_label: { color: "#121217" },
                    selected_month: {
                      backgroundColor: "#8E0FFF",
                      borderColor: "#8E0FFF",
                    },
                    selected_month_label: {
                      color: "white",
                    },
                    selected_year: {
                      backgroundColor: "#8E0FFF",
                      borderColor: "#8E0FFF",
                    },
                    selected_year_label: {
                      color: "white",
                    },
                    active_year: {
                      backgroundColor: "#EDE9FE",
                      borderColor: "#EDE9FE",
                    },
                    active_year_label: {
                      color: "#121217",
                    },
                  }}
                />
              </YStack>
            </YStack>
          )}
        </XStack>

        {/* Action Buttons */}
        <XStack gap={wp(12)} paddingBottom={hp(8)}>
          <Button
            flex={1}
            variant="outline"
            onPress={handleCancel}
            backgroundColor="white"
            borderColor="rgba(142, 15, 255, 0.15)"
            borderRadius={wp(10)}
            paddingVertical={hp(14)}
          >
            <Text color="#1C1C1E" fontWeight="600" fontSize={fp(15)} letterSpacing={-0.2}>
              Cancel
            </Text>
          </Button>

          <Button
            flex={1}
            variant="primary"
            onPress={handleApply}
            backgroundColor="#8E0FFF"
            borderRadius={wp(10)}
            paddingVertical={hp(14)}
            disabled={!canApply}
            opacity={!canApply ? 0.5 : 1}
          >
            <Text color="white" fontWeight="600" fontSize={fp(15)} letterSpacing={-0.2}>
              Apply
            </Text>
          </Button>
        </XStack>
          </YStack>
        </Animated.View>
      </LinearGradient>
    </BottomSheet>
  );
}
