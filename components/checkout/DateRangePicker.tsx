import React, { useState, useEffect } from "react";
import { XStack, YStack, Text } from "tamagui";
import { Calendar } from "lucide-react-native";
import { Keyboard, Pressable } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { BottomSheet } from "@/components/ui/BottomSheet";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

dayjs.extend(customParseFormat);

// Static — defined once, never recreated on render
const calendarStyles = {
  day_cell: { padding: 2 },
  day: { borderRadius: 8 },
  day_label: { color: "#121217", fontSize: fp(13), fontWeight: "500" as const },
  header: { marginBottom: 8 },
  month_selector_label: {
    fontSize: fp(16),
    fontWeight: "700" as const,
    color: "#121217",
  },
  year_selector_label: {
    fontSize: fp(16),
    fontWeight: "700" as const,
    color: "#121217",
  },
  weekday_label: {
    fontSize: fp(11),
    textTransform: "uppercase" as const,
    color: "#9CA3AF",
    fontWeight: "600" as const,
  },
  button_next: {
    tintColor: "#121217",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
  },
  button_prev: {
    tintColor: "#121217",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
  },
  selected: { backgroundColor: "#8E0FFF" },
  selected_label: { color: "#FFFFFF", fontWeight: "600" as const },
  disabled_label: { color: "#D1D5DB" },
  outside_label: { color: "#D1D5DB" },
  today_label: { color: "#8E0FFF", fontWeight: "700" as const },
  month: { borderColor: "#E5E7EB", borderWidth: 1, borderRadius: 8 },
  month_label: { color: "#121217", fontSize: fp(12) },
  year: { borderColor: "#E5E7EB", borderWidth: 1, borderRadius: 8 },
  year_label: { color: "#121217", fontSize: fp(12) },
  selected_month: { backgroundColor: "#8E0FFF", borderColor: "#8E0FFF" },
  selected_month_label: { color: "#FFFFFF" },
  selected_year: { backgroundColor: "#8E0FFF", borderColor: "#8E0FFF" },
  selected_year_label: { color: "#FFFFFF" },
  active_year: { backgroundColor: "#F5EDFF", borderColor: "#8E0FFF" },
  active_year_label: { color: "#8E0FFF" },
};

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState<dayjs.Dayjs | undefined>(
    startDate ? dayjs(startDate, "DD-MM-YYYY") : undefined
  );
  const [tempEnd, setTempEnd] = useState<dayjs.Dayjs | undefined>(
    endDate ? dayjs(endDate, "DD-MM-YYYY") : undefined
  );

  useEffect(() => {
    if (startDate) setTempStart(dayjs(startDate, "DD-MM-YYYY"));
    if (endDate) setTempEnd(dayjs(endDate, "DD-MM-YYYY"));
  }, [startDate, endDate]);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr || typeof dateStr !== "string") return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [day, month, year] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayText = () => {
    if (!startDate && !endDate) return "Select rental dates";
    const s = startDate ? formatDateDisplay(startDate) : "Start";
    const e = endDate ? formatDateDisplay(endDate) : "End";
    return `${s}  →  ${e}`;
  };

  const handleOpen = () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reset temp to current values when opening
    setTempStart(startDate ? dayjs(startDate, "DD-MM-YYYY") : undefined);
    setTempEnd(endDate ? dayjs(endDate, "DD-MM-YYYY") : undefined);
    setIsOpen(true);
  };

  const handleApply = () => {
    if (!tempStart || !tempEnd) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDateRangeChange({
      startDate: tempStart.format("DD-MM-YYYY"),
      endDate: tempEnd.format("DD-MM-YYYY"),
    });
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const rentalDays =
    tempStart && tempEnd ? tempEnd.diff(tempStart, "day") : 0;

  const canApply = !!tempStart && !!tempEnd && rentalDays > 0;

  return (
    <>
      {/* Trigger field - clean, minimal */}
      <Pressable onPress={handleOpen}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#FAFAFA"
          borderRadius={wp(10)}
          borderWidth={1}
          borderColor={startDate && endDate ? "#E5E7EB" : "#D1D5DB"}
          paddingVertical={hp(12)}
          paddingHorizontal={wp(14)}
        >
          <Text
            fontSize={fp(14)}
            fontWeight="500"
            color={startDate && endDate ? "#121217" : "#9CA3AF"}
          >
            {getDisplayText()}
          </Text>
          <XStack
            backgroundColor="#F3F4F6"
            padding={wp(6)}
            borderRadius={wp(6)}
          >
            <Calendar size={hp(16)} color="#6B7280" strokeWidth={2} />
          </XStack>
        </XStack>
      </Pressable>

      {/* Single BottomSheet with side-by-side calendars */}
      <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoints={[75]}>
        <YStack
          paddingHorizontal={wp(16)}
          paddingTop={hp(20)}
          paddingBottom={hp(16)}
          gap={hp(16)}
          flex={1}
        >
          {/* Header */}
          <YStack gap={hp(4)}>
            <Text
              fontSize={fp(20)}
              fontWeight="700"
              color="#121217"
              letterSpacing={-0.3}
            >
              Select Rental Dates
            </Text>
            {rentalDays > 0 && (
              <Text fontSize={fp(13)} color="#6B7280">
                {rentalDays} {rentalDays === 1 ? "day" : "days"} rental
              </Text>
            )}
          </YStack>

          {/* Date chips showing selected range */}
          <XStack
            backgroundColor="#F9FAFB"
            borderRadius={wp(10)}
            padding={wp(12)}
            alignItems="center"
            justifyContent="space-between"
          >
            <YStack flex={1} alignItems="center">
              <Text fontSize={fp(11)} color="#9CA3AF" fontWeight="600" textTransform="uppercase">
                Start
              </Text>
              <Text
                fontSize={fp(14)}
                fontWeight="600"
                color={tempStart ? "#121217" : "#D1D5DB"}
                marginTop={hp(2)}
              >
                {tempStart
                  ? tempStart.format("ddd, MMM D")
                  : "Select date"}
              </Text>
            </YStack>
            <XStack
              backgroundColor="#E5E7EB"
              width={wp(28)}
              height={1}
            />
            <YStack flex={1} alignItems="center">
              <Text fontSize={fp(11)} color="#9CA3AF" fontWeight="600" textTransform="uppercase">
                End
              </Text>
              <Text
                fontSize={fp(14)}
                fontWeight="600"
                color={tempEnd ? "#121217" : "#D1D5DB"}
                marginTop={hp(2)}
              >
                {tempEnd
                  ? tempEnd.format("ddd, MMM D")
                  : "Select date"}
              </Text>
            </YStack>
          </XStack>

          {/* Single calendar with range selection */}
          <YStack flex={1}>
            <YStack
              backgroundColor="#FAFAFA"
              borderRadius={wp(10)}
              borderWidth={1}
              borderColor="#E5E7EB"
              overflow="hidden"
              padding={wp(8)}
            >
              <DateTimePicker
                {...{
                  mode: "range",
                  startDate: tempStart,
                  endDate: tempEnd,
                  minDate: dayjs(),
                  maxDate: dayjs().add(90, "day"),
                  onChange: (params: any) => {
                    if (params.startDate) {
                      setTempStart(dayjs(params.startDate));
                    }
                    if (params.endDate) {
                      setTempEnd(dayjs(params.endDate));
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  },
                  headerButtonSize: 20,
                  headerTextContainerStyle: { flexDirection: "column", alignItems: "center" },
                  styles: calendarStyles,
                } as any}
              />
            </YStack>
          </YStack>

          {/* Apply button */}
          <XStack
            gap={wp(12)}
            paddingTop={hp(4)}
            paddingBottom={Math.max(insets.bottom, hp(16))}
          >
            <Pressable
              onPress={handleClose}
              style={{
                flex: 1,
                paddingVertical: hp(14),
                borderRadius: wp(10),
                borderWidth: 1,
                borderColor: "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                color="#374151"
                fontWeight="600"
                fontSize={fp(15)}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              disabled={!canApply}
              style={{
                flex: 1,
                paddingVertical: hp(14),
                borderRadius: wp(10),
                backgroundColor: canApply ? "#8E0FFF" : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                color={canApply ? "#FFFFFF" : "#9CA3AF"}
                fontWeight="600"
                fontSize={fp(15)}
              >
                Apply
              </Text>
            </Pressable>
          </XStack>
        </YStack>
      </BottomSheet>
    </>
  );
}
