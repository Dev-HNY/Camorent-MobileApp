import React from "react";
import { YStack } from "tamagui";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { BodyText, Heading2 } from "@/components/ui/Typography";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { hp, wp } from "@/utils/responsive";

interface KYCInitialSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function KYCInitialSheet({
  isOpen,
  onClose,
  onRegister,
}: KYCInitialSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[25]}>
      <YStack
        flex={1}
        justifyContent="space-between"
        paddingHorizontal={wp(16)}
        paddingVertical={hp(24)}
      >
        <YStack gap="$6" flex={1} justifyContent="center">
          <YStack gap={hp(12)}>
            <Heading2>Verify Now</Heading2>
            <BodyText color={"#6C6C89"}>
              Keep your documents handy for KYC verification
            </BodyText>
          </YStack>
        </YStack>

        <YStack paddingBottom="$2">
          <BottomSheetButton size="lg" variant="primary" onPress={onRegister}>
            Verify Now
          </BottomSheetButton>
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
