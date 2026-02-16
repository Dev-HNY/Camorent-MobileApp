import React from "react";
import { YStack, XStack, Text, Card, Image, ScrollView } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { Heading2, BodyText } from "@/components/ui/Typography";
import Svg, { Path } from "react-native-svg";
import { fp, hp, wp } from "@/utils/responsive";

interface ShootCaptainSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShootCaptain: () => void;
}

export function ShootCaptainSheet({
  isOpen,
  onClose,
  onAddShootCaptain,
}: ShootCaptainSheetProps) {
  const benefits = [
    {
      icon: (
        <Svg width={wp(24)} height={wp(24)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
      title: "Gear and crew co-ordination",
      description: "All equipment and team managed",
    },
    {
      icon: (
        <Svg width={wp(24)} height={wp(24)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
            stroke="#7C3AED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 2L1 21H23L12 2Z"
            stroke="#7C3AED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M5 10H19M8 14H16M10 18H14"
            stroke="#7C3AED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
      title: "Transport & Setup",
      description: "Delivery setup and breakdown handles",
    },
    {
      icon: (
        <Svg width={wp(24)} height={wp(24)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"
            fill="#7C3AED"
          />
          <Path
            d="M12 18V10"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
      title: "On-site Troubleshooting",
      description: "Problem solving and backup plans",
    },
    {
      icon: (
        <Svg width={wp(24)} height={wp(24)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M21 21L16.65 16.65"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
      title: "Complete project Oversight",
      description: "End-to-end shoot management",
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[85]}>
      <YStack flex={1} paddingHorizontal={wp(16)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: hp(24) }}
        >
          {/* Badge */}
          <XStack marginBottom={hp(16)}>
            <XStack
              paddingVertical={hp(4)}
              paddingHorizontal={wp(8)}
              backgroundColor="#FFF9EB"
              borderRadius={wp(8)}
              borderColor="#FFDA85"
              borderWidth={1}
            >
              <BodyText color="#8A6100">Special Deal</BodyText>
            </XStack>
          </XStack>

          {/* Image and Title */}
          <YStack alignItems="center" gap={hp(12)} marginBottom={hp(12)}>
            <Card
              width={wp(116)}
              height={wp(116)}
              borderRadius={wp(16)}
              backgroundColor="#E0F2FE"
              borderColor="#BAE6FD"
              borderWidth={1}
              overflow="hidden"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                source={{
                  uri: "https://via.placeholder.com/200x200",
                }}
                width="100%"
                height="100%"
                resizeMode="cover"
              />
            </Card>

            <YStack alignItems="center" gap={hp(8)}>
              <YStack alignItems="center">
                <Text fontSize={fp(24)} fontWeight="600" color="#000">
                  Shoot captain
                </Text>
                <XStack gap={wp(6)} alignItems="center">
                  <Svg
                    width={wp(16)}
                    height={wp(16)}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <Path
                      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M22 4L12 14.01L9 11.01"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text fontSize={fp(14)} fontWeight="600" color="#7C3AED">
                    Verified Professional
                  </Text>
                </XStack>
              </YStack>

              <XStack alignItems="baseline" gap={wp(4)} marginTop={hp(4)}>
                <Text fontSize={fp(28)} fontWeight="700" color="#000">
                  5000
                </Text>
                <Text fontSize={fp(16)} fontWeight="400" color="#6C6C89">
                  rs /day
                </Text>
              </XStack>
            </YStack>
          </YStack>

          {/* Benefits List */}
          <YStack gap={hp(12)} marginBottom={hp(16)}>
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                backgroundColor="#F9FAFB"
                borderRadius={wp(12)}
                borderWidth={1}
                borderColor="#E5E7EB"
                paddingHorizontal={wp(16)}
                paddingVertical={hp(8)}
              >
                <XStack gap={wp(12)} alignItems="flex-start">
                  <YStack
                    width={wp(36)}
                    height={wp(36)}
                    borderRadius={wp(8)}
                    backgroundColor="transparent"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {benefit.icon}
                  </YStack>
                  <YStack flex={1} gap={hp(4)}>
                    <Text fontSize={fp(14)} fontWeight="600" color="#000">
                      {benefit.title}
                    </Text>
                    <Text fontSize={fp(12)} fontWeight="400" color="#6C6C89">
                      {benefit.description}
                    </Text>
                  </YStack>
                </XStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>

        {/* Action Button */}
        <YStack paddingBottom={hp(24)}>
          <BottomSheetButton size="lg" onPress={onAddShootCaptain}>
            Add Shoot Captain
          </BottomSheetButton>
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
