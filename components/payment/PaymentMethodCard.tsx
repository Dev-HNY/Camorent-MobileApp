import { Text, XStack, YStack } from "tamagui";
import { BodySmall, BodyText } from "../ui/Typography";
import { ReactNode } from "react";
import { fp, hp, wp } from "@/utils/responsive";

interface PaymentMethodCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
}

export function PaymentMethodCard({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
}: PaymentMethodCardProps) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={hp(12)}
      paddingHorizontal={wp(12)}
      borderColor={"#EBEBEF"}
      borderWidth={1}
      borderRadius={wp(8)}
      onPress={onPress}
    >
      <XStack alignItems="center" gap={wp(12)} flex={1}>
        <XStack
          paddingVertical={hp(4)}
          paddingHorizontal={wp(8)}
          justifyContent="center"
          alignItems="center"
          borderWidth={wp(0.5)}
          borderRadius={wp(4)}
          borderColor={"#EBEBEF"}
        >
          {icon}
        </XStack>
        <YStack flex={1} gap={hp(2)}>
          <BodyText fontWeight={"600"}>{title}</BodyText>
          {subtitle && (
            <Text
              fontSize={fp(10)}
              fontWeight={"400"}
              lineHeight={hp(12)}
              color="#6C6C89"
            >
              {subtitle}
            </Text>
          )}
        </YStack>
      </XStack>

      {rightElement}
    </XStack>
  );
}
