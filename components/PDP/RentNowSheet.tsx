import { Separator, XStack, YStack } from "tamagui";
import { BottomSheet } from "../ui/BottomSheet";
import { BodySmall, BodyText, Heading2 } from "../ui/Typography";
import { hp, wp } from "@/utils/responsive";

interface RentNowSheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export function RentNowSheet({ isOpen, onClose }: RentNowSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[25]}>
      <YStack gap={hp(16)} paddingHorizontal={wp(16)} paddingVertical={hp(24)}>
        <YStack gap={hp(16)}>
          <XStack>
            <Heading2>Rent Now Pay Later</Heading2>
          </XStack>
          <XStack>
            <BodySmall>
              You can pay rent in 14 days before the shoot begins, Just pay your
              refundable deposit to place your order.
            </BodySmall>
          </XStack>
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
