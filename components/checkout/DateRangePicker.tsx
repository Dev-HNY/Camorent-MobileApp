import React, { useState, useEffect, useRef, useCallback } from "react";
import { XStack, Text } from "tamagui";
import { Calendar } from "lucide-react-native";
import {
  Keyboard,
  Pressable,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
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

  // Animation values
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(300)).current;
  // Track closing so we hide the heavy calendar immediately while the sheet animates out
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (startDate) setTempStart(dayjs(startDate, "DD-MM-YYYY"));
    if (endDate) setTempEnd(dayjs(endDate, "DD-MM-YYYY"));
  }, [startDate, endDate]);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateOut = useCallback((onDone: () => void) => {
    setIsClosing(true);
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 300,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsClosing(false);
      onDone();
    });
  }, []);

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
    setTempStart(startDate ? dayjs(startDate, "DD-MM-YYYY") : undefined);
    setTempEnd(endDate ? dayjs(endDate, "DD-MM-YYYY") : undefined);
    overlayAnim.setValue(0);
    sheetAnim.setValue(300);
    setIsOpen(true);
    requestAnimationFrame(animateIn);
  };

  const handleClose = () => {
    animateOut(() => setIsOpen(false));
  };

  const handleApply = () => {
    if (!tempStart || !tempEnd) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDateRangeChange({
      startDate: tempStart.format("DD-MM-YYYY"),
      endDate: tempEnd.format("DD-MM-YYYY"),
    });
    animateOut(() => setIsOpen(false));
  };

  const rentalDays =
    tempStart && tempEnd ? tempEnd.diff(tempStart, "day") : 0;

  const canApply = !!tempStart && !!tempEnd && rentalDays > 0;

  return (
    <>
      {/* Trigger field */}
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

      {/* Native Modal — zero JS-thread overhead on open/close */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
          </TouchableWithoutFeedback>

          {/* Sheet */}
          <Animated.View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, hp(16)) },
              { transform: [{ translateY: sheetAnim }] },
            ]}
          >
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.headerRow}>
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
            </View>

            {/* Date chips */}
            <View style={styles.chips}>
              <View style={styles.chipSide}>
                <Text style={styles.chipLabel}>START</Text>
                <Text style={[styles.chipDate, !tempStart && styles.chipDateEmpty]}>
                  {tempStart ? tempStart.format("ddd, MMM D") : "Select date"}
                </Text>
              </View>
              <View style={styles.chipDivider} />
              <View style={styles.chipSide}>
                <Text style={styles.chipLabel}>END</Text>
                <Text style={[styles.chipDate, !tempEnd && styles.chipDateEmpty]}>
                  {tempEnd ? tempEnd.format("ddd, MMM D") : "Select date"}
                </Text>
              </View>
            </View>

            {/* Calendar — hidden immediately on close to avoid unmount jank during animation */}
            <View style={styles.calendarWrap}>
              {!isClosing && (
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
              )}
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <Pressable
                onPress={handleClose}
                style={styles.btnCancel}
              >
                <Text style={styles.btnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleApply}
                disabled={!canApply}
                style={[styles.btnApply, !canApply && styles.btnApplyDisabled]}
              >
                <Text style={[styles.btnApplyText, !canApply && styles.btnApplyTextDisabled]}>
                  Apply
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    paddingHorizontal: wp(16),
    paddingTop: hp(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: wp(36),
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1D1D6",
    alignSelf: "center",
    marginBottom: hp(16),
  },
  headerRow: {
    gap: hp(4),
    marginBottom: hp(16),
  },
  chips: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: wp(10),
    padding: wp(12),
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(16),
  },
  chipSide: {
    flex: 1,
    alignItems: "center",
  },
  chipLabel: {
    fontSize: fp(11),
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  chipDate: {
    fontSize: fp(14),
    fontWeight: "600",
    color: "#121217",
    marginTop: hp(2),
  },
  chipDateEmpty: {
    color: "#D1D5DB",
  },
  chipDivider: {
    width: wp(28),
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  calendarWrap: {
    backgroundColor: "#FAFAFA",
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    padding: wp(8),
    marginBottom: hp(16),
  },
  btnRow: {
    flexDirection: "row",
    gap: wp(12),
    paddingTop: hp(4),
  },
  btnCancel: {
    flex: 1,
    paddingVertical: hp(14),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: fp(15),
  },
  btnApply: {
    flex: 1,
    paddingVertical: hp(14),
    borderRadius: wp(10),
    backgroundColor: "#8E0FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyDisabled: {
    backgroundColor: "#E5E7EB",
  },
  btnApplyText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: fp(15),
  },
  btnApplyTextDisabled: {
    color: "#9CA3AF",
  },
});
