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
      colors={["#FFFDE8", "#FFFFFF"]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F9DF7B",
        shadowColor: "#F9DF7B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Top section: icon + label */}
      <XStack
        alignItems="center"
        gap={wp(8)}
        paddingHorizontal={wp(14)}
        paddingTop={hp(12)}
        paddingBottom={hp(12)}
      >
        <XStack
          width={28}
          height={28}
          borderRadius={7}
          backgroundColor="rgba(249,223,123,0.25)"
          alignItems="center"
          justifyContent="center"
        >
          <CalendarDays size={15} color="#B8860B" strokeWidth={2} />
        </XStack>
        <Text fontSize={fp(14)} fontWeight="600" color="#121217" flex={1}>
          Shoot date & time
        </Text>
        {!hideEdit && (
          <Pressable onPress={onEdit} hitSlop={8}>
            <XStack
              backgroundColor="rgba(249,223,123,0.3)"
              borderRadius={20}
              paddingHorizontal={wp(10)}
              paddingVertical={hp(4)}
              alignItems="center"
              gap={wp(4)}
            >
              <Edit2 size={11} color="#B8860B" strokeWidth={2} />
              <Text fontSize={fp(11)} fontWeight="600" color="#B8860B">Edit</Text>
            </XStack>
          </Pressable>
        )}
      </XStack>

      {/* Divider */}
      <YStack height={1} backgroundColor="#F9DF7B" />

      {/* Bottom: details */}
      <YStack
        paddingHorizontal={wp(14)}
        paddingTop={hp(10)}
        paddingBottom={hp(12)}
        gap={hp(8)}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={fp(12)} color="#92754A" fontWeight="500">Shoot dates</Text>
          <Text fontSize={fp(13)} color="#121217" fontWeight="600" textAlign="right">{dates}</Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={fp(12)} color="#92754A" fontWeight="500">Start time</Text>
          <Text fontSize={fp(13)} color="#121217" fontWeight="600">{startTime}</Text>
        </XStack>
      </YStack>
    </LinearGradient>
  );
};
