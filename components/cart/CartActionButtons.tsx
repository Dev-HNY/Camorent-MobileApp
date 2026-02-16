import React, { memo } from "react";
import { XStack, Text } from "tamagui";
import { Pressable } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface CartActionButtonsProps {
  onAddMoreItems: () => void;
  onCompleteSetup: () => void;
}

export const CartActionButtons = memo(function CartActionButtons({
  onAddMoreItems,
  onCompleteSetup,
}: CartActionButtonsProps) {
  return (
    <XStack gap={wp(8)}>
      <XStack
        // flex={1}
        borderWidth={1}
        borderColor="#8E0FFF"
        borderRadius={wp(8)}
        paddingVertical={hp(6)}
        paddingHorizontal={wp(12)}
        justifyContent="center"
        alignItems="center"
        gap={wp(8)}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onAddMoreItems();
        }}
        backgroundColor="#FFFFFF"
      >
        <Text
          fontSize={fp(12)}
          fontWeight="500"
          lineHeight={hp(16)}
          color="#8E0FFF"
        >
          Add more items
        </Text>
        <Plus size={14} color="#8E0FFF" />
      </XStack>

      {/* <XStack
        // flex={1}
        borderWidth={1}
        borderColor="#8E0FFF"
        borderRadius={wp(8)}
        paddingVertical={hp(6)}
        paddingHorizontal={wp(12)}
        justifyContent="center"
        alignItems="center"
        gap={wp(8)}
        onPress={onCompleteSetup}
        backgroundColor="#FFFFFF"
      >
        <Text
          fontSize={fp(12)}
          fontWeight="500"
          lineHeight={hp(16)}
          color="#8E0FFF"
        >
          Complete your setup
        </Text>
        <Plus size={14} color="#8E0FFF" />
      </XStack> */}
    </XStack>
  );
});
