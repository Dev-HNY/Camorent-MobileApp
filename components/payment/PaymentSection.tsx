import { YStack, Card } from "tamagui";
import { Heading2, BodySmall } from "../ui/Typography";
import { ReactNode } from "react";
import { hp, wp } from "@/utils/responsive";

interface PaymentSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  withCard?: boolean;
}

export function PaymentSection({
  title,
  subtitle,
  children,
  withCard = true,
}: PaymentSectionProps) {
  return (
    <YStack gap="$3">
      <YStack>
        <Heading2>{title}</Heading2>
        {subtitle && (
          <BodySmall fontSize={14} color="#047857">
            {subtitle}
          </BodySmall>
        )}
      </YStack>

      {withCard ? (
        <Card
          paddingHorizontal={wp(12)}
          paddingVertical={hp(10)}
          borderRadius={wp(12)}
          borderWidth={1}
          borderColor="$gray4"
        >
          {children}
        </Card>
      ) : (
        children
      )}
    </YStack>
  );
}
