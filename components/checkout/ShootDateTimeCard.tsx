import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays, Edit2 } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";

interface ShootDateTimeCardProps {
  dates: string;
  startTime: string;
  onEdit: () => void;
  hideEdit?: boolean;
}

export const ShootDateTimeCard = ({
  dates,
  startTime,
  onEdit,
  hideEdit = false,
}: ShootDateTimeCardProps) => {
  return (
    <LinearGradient
      colors={["#FFFBF0", "#FFF8E7", "#FFFFFF"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#FFE08A",
        shadowColor: "#F59E0B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <YStack padding={wp(16)} gap={hp(14)}>
        {/* Header */}
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap={wp(8)}>
            <XStack
              width={32}
              height={32}
              borderRadius={8}
              backgroundColor="rgba(245, 158, 11, 0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <CalendarDays size={16} color="#D97706" strokeWidth={2} />
            </XStack>
            <Text fontSize={fp(15)} fontWeight="600" color="#1C1C1E">
              Shoot date & time
            </Text>
          </XStack>
          {!hideEdit && (
            <Pressable onPress={onEdit} hitSlop={8}>
              <XStack alignItems="center" gap={wp(4)}>
                <Edit2 size={13} color="#8E0FFF" strokeWidth={2} />
                <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">
                  Edit
                </Text>
              </XStack>
            </Pressable>
          )}
        </XStack>

        {/* Divider */}
        <YStack height={1} backgroundColor="rgba(255, 218, 133, 0.5)" />

        {/* Details */}
        <YStack gap={hp(10)}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={fp(13)} color="#92754A" fontWeight="500">
              Shoot dates
            </Text>
            <Text fontSize={fp(14)} color="#1C1C1E" fontWeight="600" textAlign="right">
              {dates}
            </Text>
          </XStack>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={fp(13)} color="#92754A" fontWeight="500">
              Start time
            </Text>
            <Text fontSize={fp(14)} color="#1C1C1E" fontWeight="600">
              {startTime}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </LinearGradient>
  );
};
