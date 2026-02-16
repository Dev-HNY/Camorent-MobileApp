import React from "react";
import { ShootSettingsSheet } from "@/components/checkout/ShootSettingsSheet";
import { DateTimePickerSheet } from "@/components/checkout/DateTimePickerSheet";

interface ShootSettingsManagerProps {
  // Shoot Settings Sheet
  isShootSettingsOpen: boolean;
  onCloseShootSettings: () => void;
  onDoneShootSettings: () => void;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  formatDateDisplay: (date: string) => string;

  // Date Time Picker Sheet
  isDateTimePickerOpen: boolean;
  onCloseDateTimePicker: () => void;
  onApplyDateTimePicker: (range: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }) => void;
  initialStartDate: string;
  initialEndDate: string;
  datePickerMode: "start" | "end";
}

export function ShootSettingsManager({
  isShootSettingsOpen,
  onCloseShootSettings,
  onDoneShootSettings,
  onStartDatePress,
  onEndDatePress,
  startDate,
  endDate,
  startTime,
  endTime,
  formatDateDisplay,
  isDateTimePickerOpen,
  onCloseDateTimePicker,
  onApplyDateTimePicker,
  initialStartDate,
  initialEndDate,
  datePickerMode,
}: ShootSettingsManagerProps) {
  return (
    <>
      <ShootSettingsSheet
        isOpen={isShootSettingsOpen}
        onClose={onCloseShootSettings}
        onDone={onDoneShootSettings}
        onStartDatePress={onStartDatePress}
        onEndDatePress={onEndDatePress}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        formatDateDisplay={formatDateDisplay}
      />
      <DateTimePickerSheet
        isOpen={isDateTimePickerOpen}
        onClose={onCloseDateTimePicker}
        onApply={onApplyDateTimePicker}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
        mode={datePickerMode}
      />
    </>
  );
}
