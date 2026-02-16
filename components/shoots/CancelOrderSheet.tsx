import { Sheet, YStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp, fp } from "@/utils/responsive";
import { BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

interface CancelOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCancel: () => void;
}

export function CancelOrderSheet({
  open,
  onOpenChange,
  onConfirmCancel,
}: CancelOrderSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      modal
      animation="quick"
    >
      <Sheet.Overlay
        backgroundColor="rgba(0, 0, 0, 0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="white"
        borderTopLeftRadius={wp(24)}
        borderTopRightRadius={wp(24)}
        paddingHorizontal={wp(16)}
        paddingTop={hp(24)}
        paddingBottom={Math.max(insets.bottom, hp(24))}
      >
        <YStack gap={hp(24)} alignItems="center">
          <YStack gap={hp(12)} alignItems="center">
            <Text
              fontSize={fp(18)}
              fontWeight="600"
              lineHeight={hp(24)}
              color="black"
              textAlign="center"
            >
              Are you sure you want to cancel this order?
            </Text>
            <BodyText color="#6C6C89" textAlign="center">
              The order is fully refundable.
            </BodyText>
          </YStack>

          <YStack width="100%" gap={hp(12)}>
            <Button
              variant="primary"
              size="lg"
              onPress={onConfirmCancel}
              backgroundColor="#6D00DA"
            >
              <Text fontSize={fp(14)} fontWeight="600" color="white">
                Cancel with full refund
              </Text>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onPress={() => onOpenChange(false)}
              borderColor="#6D00DA"
            >
              <Text fontSize={fp(14)} fontWeight="600" color="#6D00DA">
                No Wait!
              </Text>
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
