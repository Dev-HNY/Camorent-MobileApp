import { YStack, XStack, Text } from "tamagui";
import { hp, wp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import { memo } from "react";

interface FeatureCardProps {
  iconSource: any;
  title: string;
  description: string;
}

const FeatureCard = memo(({ iconSource, title, description }: FeatureCardProps) => {
  return (
    <XStack
      backgroundColor="#F5F5F7"
      borderRadius={wp(16)}
      padding={wp(16)}
      gap={wp(12)}
      alignItems="flex-start"
    >
      {/* Icon Container */}
      <YStack
        backgroundColor="#EDE7F6"
        borderRadius={wp(12)}
        width={wp(64)}
        height={wp(64)}
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Image
          source={iconSource}
          contentFit="contain"
          style={{ width: wp(40), height: wp(40) }}
          cachePolicy="memory-disk"
          priority="normal"
        />
      </YStack>

      {/* Text Content */}
      <YStack flex={1} gap={hp(4)}>
        <Text
          fontSize={fp(18)}
          fontWeight="600"
          color="#121217"
          lineHeight={fp(24)}
        >
          {title}
        </Text>
        <Text
          fontSize={fp(14)}
          color="#6C6C89"
          lineHeight={fp(20)}
        >
          {description}
        </Text>
      </YStack>
    </XStack>
  );
});

export function RentSmartSection() {
  return (
    <YStack gap={hp(24)} paddingHorizontal={wp(16)}>
      {/* Section Title */}
      <Text
        fontSize={fp(28)}
        fontWeight="700"
        color="#121217"
        lineHeight={fp(36)}
      >
        Rent smart with Camorent
      </Text>

      {/* Feature Cards */}
      <YStack gap={hp(16)}>
        <FeatureCard
          iconSource={require("@/assets/new/icons/rent-smart-1.svg")}
          title="More creating, Less owning"
          description="Focus on your craft, not the cost of ownership."
        />

        <FeatureCard
          iconSource={require("@/assets/new/icons/rent-smart-2.svg")}
          title="Stay updated, Always"
          description="Get the latest gear without the upgrade hassle."
        />

        <FeatureCard
          iconSource={require("@/assets/new/icons/rent-smart-3.svg")}
          title="Anytime Anywhere"
          description="Access equipment whenever you need it."
        />
      </YStack>
    </YStack>
  );
}
