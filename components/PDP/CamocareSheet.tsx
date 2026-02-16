import { Separator, Text, YStack } from "tamagui";
import { BottomSheet } from "../ui/BottomSheet";
import { hp, wp, fp } from "@/utils/responsive";
import { ScrollView } from "react-native";

interface CamocareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  handleShowAdd: boolean;
}
export function CamocareSheet({
  isOpen,
  onClose,
}: CamocareSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[75, 90]}>
      <YStack
        flex={1}
        paddingHorizontal={wp(20)}
        paddingTop={hp(16)}
        paddingBottom={hp(20)}
      >
        {/* Header */}
        <YStack marginBottom={hp(16)}>
          <Text
            fontSize={fp(20)}
            fontWeight="700"
            color="#121217"
            textAlign="center"
            marginBottom={hp(8)}
          >
            What is Camocare?
          </Text>
          <Separator borderColor="#E5E7EB" />
        </YStack>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(10) }}
        >
          <YStack gap={hp(20)}>
            {/* Introduction */}
            <Text
              fontSize={fp(14)}
              fontWeight="400"
              color="#6B7280"
              textAlign="center"
              lineHeight={fp(20)}
            >
              Protect your rental with comprehensive insurance coverage. Insure your rentals @ ₹64/shoot and get 100% damage waiver.
            </Text>

            {/* Benefits List */}
            <YStack gap={hp(14)}>
              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Damage Coverage
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  Protection against accidental damage during the rental period.
                </Text>
              </YStack>

              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Zero Extra Cost on Minor Repairs
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  No surprise repair bills.
                </Text>
              </YStack>

              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Priority Replacement
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  Instant backup gear if something fails.
                </Text>
              </YStack>

              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Theft Protection (Optional)
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  Peace of mind for high-value shoots.
                </Text>
              </YStack>

              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Hassle-Free Claims
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  No complicated paperwork or hidden conditions.
                </Text>
              </YStack>

              <YStack gap={hp(4)}>
                <Text fontSize={fp(15)} fontWeight="600" color="#121217" lineHeight={fp(22)}>
                  Full Project Support
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280" lineHeight={fp(19)}>
                  We keep your shoot running, no matter what.
                </Text>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </BottomSheet>
  );
}
