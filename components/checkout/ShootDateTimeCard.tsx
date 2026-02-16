import React from "react";
import { YStack, XStack, Separator } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, Edit } from "lucide-react-native";
import { wp, hp } from "@/utils/responsive";
import { BodyText, Heading2 } from "@/components/ui/Typography";

interface ShootDateTimeCardProps {
  dates: string;
  startTime: string;
  onEdit: () => void;
}

export const ShootDateTimeCard = ({
  dates,
  startTime,
  onEdit,
}: ShootDateTimeCardProps) => {
  return (
    <LinearGradient
      colors={["#FFF9EB", "#FFFFFF"]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FFDA85",
      }}
    >
      <YStack padding={wp(16)} borderRadius={wp(12)} gap={hp(12)}>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap={wp(8)}>
            <Clock size={wp(18)} color="#6C6C70" strokeWidth={2} />
            <Heading2 color="#1C1C1E">Shoot date & time</Heading2>
          </XStack>
        </XStack>
        <Separator borderColor={"#FFDA85"} />
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack gap={hp(6)} flex={1}>
            <BodyText lineHeight={hp(20)} color="#1C1C1E">
              <BodyText fontWeight="600" color="#1C1C1E">Shoot dates: </BodyText>
              <BodyText fontWeight="400" color="#6C6C70">{dates}</BodyText>
            </BodyText>
            <BodyText lineHeight={hp(20)} color="#1C1C1E">
              <BodyText fontWeight="600" color="#1C1C1E">Shoot start time: </BodyText>
              <BodyText fontWeight="400" color="#6C6C70">{startTime}</BodyText>
            </BodyText>
          </YStack>
          <XStack
            gap={wp(6)}
            alignItems="center"
            onPress={onEdit}
            paddingLeft={wp(12)}
          >
            <BodyText color={"#8E0FFF"} fontWeight="500">
              Edit
            </BodyText>
            <Edit size={wp(16)} color="#8E0FFF" strokeWidth={2} />
          </XStack>
        </XStack>
      </YStack>
    </LinearGradient>
  );
};
