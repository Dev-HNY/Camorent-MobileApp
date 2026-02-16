import React from "react";
import { YStack, Text, ScrollView } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Heading1, BodyText, Heading2 } from "@/components/ui/Typography";
import { hp, wp } from "@/utils/responsive";

interface CancellationPolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CancellationPolicySheet({
  isOpen,
  onClose,
}: CancellationPolicySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[40]}>
      <YStack
        flex={1}
        gap={hp(6)}
        paddingHorizontal={wp(16)}
        paddingVertical={hp(24)}
      >
        <Heading2 marginBottom="$2">Cancellation Policy</Heading2>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap={hp(12)} paddingBottom="$4">
            <YStack gap={hp(8)}>
              <BodyText color="$color">
                • Cancel within 24 hrs of booking → Full refund
              </BodyText>
              <BodyText color="$color">
                • 48+ hrs before shoot → 100% refund
              </BodyText>
              <BodyText color="$color">
                • 24–48 hrs before shoot → 50% refund
              </BodyText>
              <BodyText color="$color">
                • &lt; 24 hrs before shoot → No refund (50% credit for next
                booking)
              </BodyText>
              <BodyText color="$color">
                • Crew cancellation → Same as above, plus blocking fee if &lt;
                24 hrs
              </BodyText>
              <BodyText color="$color">
                • Reschedule → Free once, up to 12 hrs before start
              </BodyText>
              {/* <BodyText color="$color">
                • Camocare users → One free reschedule anytime
              </BodyText> */}
              <BodyText color="$color">
                💡 Refunds in 5–7 business days
              </BodyText>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </BottomSheet>
  );
}
