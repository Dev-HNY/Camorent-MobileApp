import React from "react";
import { YStack, useTheme } from "tamagui";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { BodySmall, Heading2 } from "@/components/ui/Typography";
import { Clock } from "lucide-react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { hp, wp } from "@/utils/responsive";

interface KYCProcessingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToCrew: () => void;
}

export function KYCProcessingSheet({
  isOpen,
  onClose,
  onContinueToCrew,
}: KYCProcessingSheetProps) {
  const theme = useTheme();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[35]}>
      <YStack
        flex={1}
        justifyContent="space-between"
        paddingHorizontal={wp(16)}
        paddingVertical={hp(24)}
      >
        <YStack alignItems="center" gap="$2" flex={1} justifyContent="center">
          <YStack alignItems="center" gap="$4">
            <Clock size={56} color={theme.primary.get()} />
            <Heading2 textAlign="center">Thank you for Registering</Heading2>
            <BodySmall textAlign="center">
              Hang tight — we’re verifying your documents. While you wait,
              browse our crew.
            </BodySmall>
          </YStack>
        </YStack>

        <YStack>
          <BottomSheetButton variant="primary" onPress={onContinueToCrew}>
            Continue to crew
          </BottomSheetButton>
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
