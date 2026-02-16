import React from "react";
import { XStack, YStack, Text, Separator } from "tamagui";
import { Clock, ShieldCheck } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";

const InfoRow = ({
  icon: Icon,
  iconColor,
  title,
  subtitle,
}: {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
}) => (
  <XStack alignItems="center" gap={wp(10)} flex={1}>
    <XStack
      width={wp(34)}
      height={wp(34)}
      borderRadius={wp(8)}
      backgroundColor="#F9FAFB"
      justifyContent="center"
      alignItems="center"
    >
      <Icon size={wp(18)} color={iconColor} strokeWidth={1.8} />
    </XStack>
    <YStack flex={1} gap={hp(1)}>
      <Text fontSize={fp(12)} fontWeight="600" color="#121217">
        {title}
      </Text>
      <Text fontSize={fp(11)} fontWeight="400" color="#6B7280" lineHeight={fp(15)}>
        {subtitle}
      </Text>
    </YStack>
  </XStack>
);

export const RentNowPayLater = () => null;
export const FreeCancellation = () => null;

export const RentInfoBanner = () => (
  <XStack
    borderWidth={1}
    borderColor="#E5E7EB"
    borderRadius={wp(12)}
    paddingHorizontal={wp(12)}
    paddingVertical={hp(10)}
    backgroundColor="#FFFFFF"
    alignItems="center"
    gap={wp(8)}
  >
    <InfoRow
      icon={Clock}
      iconColor="#8E0FFF"
      title="Rent Now, Pay Later"
      subtitle="Pay anytime before delivery"
    />
    <Separator vertical borderColor="#E5E7EB" height={hp(32)} />
    <InfoRow
      icon={ShieldCheck}
      iconColor="#17663A"
      title="Free Cancellation"
      subtitle="Cancel before delivery"
    />
  </XStack>
);
