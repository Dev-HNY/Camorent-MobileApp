import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { BodySmall, BodyText } from "../ui/Typography";

interface RentNowPayLaterProps {
  onLearnMore: () => void;
}

export function RentNowPayLater({ onLearnMore }: RentNowPayLaterProps) {
  return (
    <YStack
      borderRadius={wp(12)}
      borderWidth={1}
      borderColor="#EBEBEF"
      paddingVertical={hp(8)}
      paddingHorizontal={wp(16)}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <YStack flex={1} gap={hp(4)}>
          <BodySmall fontWeight="600" color="#121217">
            Rent Now, Pay later
          </BodySmall>
          <Text
            fontSize={fp(10)}
            fontWeight={"400"}
            color="#121217"
            lineHeight={hp(12)}
          >
            Pay anytime before delivery.
          </Text>
        </YStack>

        <Pressable onPress={onLearnMore}>
          <XStack
            borderWidth={1}
            borderColor="#8E0FFF"
            borderRadius={wp(8)}
            paddingHorizontal={wp(12)}
            paddingVertical={hp(8)}
          >
            <BodyText fontWeight="500" color="#8E0FFF">
              Learn more
            </BodyText>
          </XStack>
        </Pressable>
      </XStack>
    </YStack>
  );
}
