import React from "react";
import { XStack, YStack, Text, Card } from "tamagui";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Heading1, BodyText, Heading2 } from "@/components/ui/Typography";
import { router } from "expo-router";
import { Truck, MapPin } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { fp, hp, wp } from "@/utils/responsive";
import { VerifiedIcon } from "../ui/VerifiedIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DeliveryOptionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryOptionsSheet({
  isOpen,
  onClose,
}: DeliveryOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const handleSelfPickup = () => {
    onClose();
    router.push("/checkout/crew/self-pickup");
  };

  const handleCamorentDelivery = () => {
    onClose();
    router.push("/checkout/crew/camorent-delivery");
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[45]}>
      <YStack
        flex={1}
        gap={hp(16)}
        paddingVertical={hp(24)}
        paddingBottom={insets.bottom + 4}
        paddingHorizontal={wp(16)}
      >
        <YStack gap={hp(4)}>
          <Heading2>Delivery options</Heading2>
          <BodyText color={"#8A8AA3"}>
            Camorent delivery is not applicable without crew.
          </BodyText>
        </YStack>

        <YStack gap={hp(12)}>
          {/* Self Pickup Option */}
          {/* <Card
            padding={wp(12)}
            borderRadius={wp(12)}
            borderWidth={1}
            borderColor="#D1D1DB"
            onPress={handleSelfPickup}
          >
            <XStack gap={wp(16)} alignItems="center">
              <Card
                width={48}
                height={48}
                backgroundColor="$primary"
                borderRadius={wp(12)}
                alignItems="center"
                justifyContent="center"
              >
                <MapPin color="white" size={20} />
              </Card>

              <YStack flex={1} gap={hp(6)}>
                <YStack gap={hp(4)}>
                  <Heading2>Self pickup</Heading2>
                  <BodyText color={"#282833"}>
                    You or someone on your behalf will collect the equipment
                    from our location.
                  </BodyText>
                </YStack>
                <XStack gap={wp(16)}>
                  <XStack gap={wp(4)} alignItems="center">
                    <Svg
                      width={wp(20)}
                      height={wp(20)}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <Path
                        d="M10.0002 6.66683V10.0002L11.6668 11.6668M16.0418 10.0002C16.0418 13.3369 13.3369 16.0418 10.0002 16.0418C6.66344 16.0418 3.9585 13.3369 3.9585 10.0002C3.9585 6.66344 6.66344 3.9585 10.0002 3.9585C13.3369 3.9585 16.0418 6.66344 16.0418 10.0002Z"
                        stroke="#8A8AA3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text
                      fontSize={fp(10)}
                      fontWeight={"400"}
                      lineHeight={hp(13)}
                      color={"#6C6C89"}
                    >
                      Flexible timing
                    </Text>
                  </XStack>
                  <XStack gap={wp(4)} alignItems="center">
                    <Svg
                      width={wp(20)}
                      height={wp(20)}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <Path
                        d="M15.2082 9.16683C15.2082 12.5002 9.99984 16.0418 9.99984 16.0418C9.99984 16.0418 4.7915 12.5002 4.7915 9.16683C4.7915 6.25016 7.23841 3.9585 9.99984 3.9585C12.7613 3.9585 15.2082 6.25016 15.2082 9.16683Z"
                        stroke="#8A8AA3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M11.8748 9.16683C11.8748 10.2024 11.0354 11.0418 9.99984 11.0418C8.9643 11.0418 8.12484 10.2024 8.12484 9.16683C8.12484 8.1313 8.9643 7.29183 9.99984 7.29183C11.0354 7.29183 11.8748 8.1313 11.8748 9.16683Z"
                        stroke="#8A8AA3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text
                      fontSize={fp(10)}
                      fontWeight={"400"}
                      lineHeight={hp(13)}
                      color={"#6C6C89"}
                    >
                      Multiple Locations
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </XStack>
          </Card> */}

          {/* Camorent Delivery Option */}
          <Card
            padding={wp(12)}
            borderRadius={wp(12)}
            borderWidth={1}
            borderColor="#D1D1DB"
            onPress={handleCamorentDelivery}
          >
            <XStack gap={hp(16)} alignItems="center">
              <Card
                width={48}
                height={48}
                backgroundColor="$primary"
                borderRadius="$3"
                alignItems="center"
                justifyContent="center"
              >
                <Truck color="white" size={20} />
              </Card>

              <YStack flex={1} gap={hp(6)}>
                <YStack gap={hp(4)}>
                  <Heading2>Camorent delivery</Heading2>
                  <BodyText color={"#282833"}>
                    We’ll deliver the equipment directly to your specified
                    address.
                  </BodyText>
                </YStack>
                <XStack gap={wp(16)}>
                  <XStack gap={wp(4)} alignItems="center">
                    <Svg
                      width={wp(20)}
                      height={wp(20)}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <Path
                        d="M10.0002 6.66683V10.0002L11.6668 11.6668M16.0418 10.0002C16.0418 13.3369 13.3369 16.0418 10.0002 16.0418C6.66344 16.0418 3.9585 13.3369 3.9585 10.0002C3.9585 6.66344 6.66344 3.9585 10.0002 3.9585C13.3369 3.9585 16.0418 6.66344 16.0418 10.0002Z"
                        stroke="#8A8AA3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text
                      fontSize={fp(10)}
                      fontWeight={"400"}
                      lineHeight={hp(13)}
                      color={"#6C6C89"}
                    >
                      On time delivery
                    </Text>
                  </XStack>
                  <XStack gap={wp(4)} alignItems="center">
                    <VerifiedIcon color="gray" />
                    <Text
                      fontSize={fp(10)}
                      fontWeight={"400"}
                      lineHeight={hp(13)}
                      color={"#6C6C89"}
                    >
                      Insured delivery
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            </XStack>
          </Card>
        </YStack>
      </YStack>
    </BottomSheet>
  );
}
