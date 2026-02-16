import React from "react";
import { XStack, Text } from "tamagui";
import { LucideIcon } from "lucide-react-native";
import { wp, fp, hp } from "@/utils/responsive";

interface BillDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  valueColor?: string;
}

export const BillDetailRow: React.FC<BillDetailRowProps> = ({
  icon: Icon,
  label,
  value,
  valueColor = "#1C1C1E",
}) => {
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <XStack alignItems="center" gap={wp(10)}>
        <Icon size={wp(16)} color="#8E8E93" strokeWidth={1.5} />
        <Text fontSize={fp(14)} fontWeight="400" color="#6C6C70" lineHeight={hp(20)}>
          {label}
        </Text>
      </XStack>
      <Text fontSize={fp(14)} fontWeight="500" color={valueColor} lineHeight={hp(20)}>
        {value}
      </Text>
    </XStack>
  );
};
