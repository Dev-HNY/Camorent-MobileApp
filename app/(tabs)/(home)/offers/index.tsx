import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Card, Text, ScrollView, Spinner } from "tamagui";
import { Heading1, Heading2 } from "@/components/ui/Typography";
import { Offer, useGetAllOffers } from "@/hooks/offers/useGetAllOffers";
import { ArrowLeft, Tag, Calendar } from "lucide-react-native";
import { router } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { Pressable } from "react-native";

export default function Offers() {
  const { data: offersData, isLoading: isLoadingOffers } = useGetAllOffers();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingHorizontal={wp(16)} paddingTop={hp(12)}>
        <Animated.View entering={FadeIn.duration(DURATION.normal)}>
          <XStack alignItems="center" marginBottom={hp(16)}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                borderRadius: wp(28),
                borderWidth: 1,
                padding: wp(8),
                borderColor: "#EBEBEF",
              }}
            >
              <ArrowLeft size={18} color="#121217" />
            </Pressable>
            <Heading2 color="#121217" marginLeft={wp(103)}>
              All Offers
            </Heading2>
          </XStack>
        </Animated.View>

        {isLoadingOffers ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color={"#8E0FFF"} />
          </YStack>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap={hp(12)}>
              {offersData?.map((offer: Offer, index: number) => (
                <Animated.View
                  key={offer.offer_id}
                  entering={FadeInDown.delay(index * 100)
                    .springify()
                    .damping(18)
                    .stiffness(250)}
                >
                  <Card
                    backgroundColor="white"
                    padding={wp(16)}
                    paddingVertical={hp(16)}
                    borderRadius={wp(12)}
                    borderWidth={1}
                    borderColor={"#EBEBEF"}
                    boxShadow={"0 1px 2px 0 rgba(18, 18, 23, 0.05)"}
                    pressStyle={{
                      opacity: 0.9,
                    }}
                  >
                  <XStack
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={wp(12)}
                  >
                    <YStack flex={1} gap={hp(8)}>
                      <Text
                        fontSize={fp(16)}
                        fontWeight="700"
                        color="#121217"
                        lineHeight={hp(22)}
                      >
                        {offer.title}
                      </Text>

                      <Text
                        fontSize={fp(12)}
                        fontWeight="400"
                        color="#6C6C89"
                        lineHeight={hp(18)}
                        numberOfLines={2}
                      >
                        {offer.description}
                      </Text>

                      <LinearGradient
                        colors={["#F8F5FF", "#FFFFFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: wp(8),
                          paddingVertical: hp(6),
                          paddingHorizontal: wp(10),
                          alignSelf: "flex-start",
                        }}
                      >
                        <XStack gap={wp(6)} alignItems="center">
                          <Tag size={12} color="#8E0FFF" />
                          <Text
                            fontSize={fp(11)}
                            fontWeight="500"
                            color="#8E0FFF"
                            lineHeight={hp(14)}
                            textTransform="capitalize"
                          >
                            {offer.discount_type}
                          </Text>
                        </XStack>
                      </LinearGradient>

                      <XStack gap={wp(6)} alignItems="center" marginTop={hp(4)}>
                        <Calendar size={13} color="#FF8C00" />
                        <Text
                          fontSize={fp(11)}
                          fontWeight="500"
                          color="#6C6C89"
                          lineHeight={hp(14)}
                        >
                          Valid till {offer.valid_till}
                        </Text>
                      </XStack>
                    </YStack>

                    <YStack
                      backgroundColor="#D50B3E"
                      paddingHorizontal={wp(16)}
                      paddingVertical={hp(12)}
                      borderRadius={wp(10)}
                      justifyContent="center"
                      alignItems="center"
                      minWidth={wp(70)}
                    >
                      <Text
                        fontSize={fp(20)}
                        fontWeight="700"
                        color="white"
                        lineHeight={hp(26)}
                      >
                        {offer.discount_value}
                      </Text>
                      <Text
                        fontSize={fp(10)}
                        fontWeight="600"
                        color="white"
                        lineHeight={hp(12)}
                        letterSpacing={0.5}
                      >
                        OFF
                      </Text>
                    </YStack>
                  </XStack>
                </Card>
                </Animated.View>
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </SafeAreaView>
  );
}
