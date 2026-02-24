import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Spinner } from "tamagui";
import { Offer, useGetAllOffers } from "@/hooks/offers/useGetAllOffers";
import { ChevronLeft, Tag, Calendar, Percent } from "lucide-react-native";
import { router } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function Offers() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data: offersData, isLoading: isLoadingOffers } = useGetAllOffers();

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(DURATION.normal)}>
        <XStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={wp(20)}
          paddingTop={hp(10)}
          paddingBottom={hp(14)}
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F2F2F7"
          position="relative"
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backBtn}
          >
            <ChevronLeft size={hp(20)} color="#1C1C1E" strokeWidth={2.5} />
          </Pressable>
          <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.3}>
            All Offers
          </Text>
        </XStack>
      </Animated.View>

      {isLoadingOffers ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="#8E0FFF" />
        </YStack>
      ) : (
        <>
          <Text style={styles.sectionLabel}>ACTIVE OFFERS</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: wp(16),
              paddingBottom: tabBarHeight + hp(24),
              paddingTop: hp(4),
            }}
          >
            <YStack gap={hp(10)}>
              {offersData?.map((offer: Offer, index: number) => (
                <Animated.View
                  key={offer.offer_id}
                  entering={FadeInDown.delay(index * 60)
                    .springify()
                    .damping(20)
                    .stiffness(260)}
                >
                  <YStack style={styles.card}>
                    <XStack justifyContent="space-between" alignItems="flex-start" gap={wp(14)}>
                      {/* Left content */}
                      <YStack flex={1} gap={hp(6)}>
                        {/* Discount badge */}
                        <XStack alignItems="center" gap={wp(8)}>
                          <YStack style={styles.discountBadge}>
                            <Text fontSize={fp(15)} fontWeight="800" color="#8E0FFF" letterSpacing={-0.3}>
                              {offer.discount_type === "percentage"
                                ? `${offer.discount_value}%`
                                : `₹${offer.discount_value}`}
                            </Text>
                            <Text fontSize={fp(9)} fontWeight="600" color="#8E0FFF" letterSpacing={0.3}>
                              OFF
                            </Text>
                          </YStack>
                          <YStack gap={hp(2)}>
                            <Text fontSize={fp(15)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.2} numberOfLines={1}>
                              {offer.title}
                            </Text>
                            <XStack alignItems="center" gap={wp(5)}>
                              <YStack style={styles.typePill}>
                                <Tag size={10} color="#8E0FFF" strokeWidth={2} />
                                <Text fontSize={fp(10)} fontWeight="500" color="#8E0FFF" textTransform="capitalize">
                                  {offer.discount_type}
                                </Text>
                              </YStack>
                            </XStack>
                          </YStack>
                        </XStack>

                        <Text fontSize={fp(13)} color="#8E8E93" numberOfLines={2} lineHeight={fp(18)}>
                          {offer.description}
                        </Text>

                        <XStack alignItems="center" gap={wp(5)}>
                          <Calendar size={12} color="#C7C7CC" strokeWidth={2} />
                          <Text fontSize={fp(11)} color="#C7C7CC" fontWeight="400">
                            Valid till {offer.valid_till}
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>
                  </YStack>
                </Animated.View>
              ))}

              {(!offersData || offersData.length === 0) && (
                <YStack paddingVertical={hp(60)} alignItems="center" gap={hp(12)}>
                  <YStack style={styles.emptyIcon}>
                    <Percent size={hp(28)} color="#C7C7CC" strokeWidth={1.5} />
                  </YStack>
                  <Text fontSize={fp(16)} fontWeight="600" color="#1C1C1E">No offers right now</Text>
                  <Text fontSize={fp(13)} color="#8E8E93" textAlign="center">
                    Check back soon for exclusive deals
                  </Text>
                </YStack>
              )}
            </YStack>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  backBtn: {
    position: "absolute",
    left: wp(16),
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(10),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(14),
    padding: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  discountBadge: {
    backgroundColor: "#F5EEFF",
    borderRadius: wp(10),
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    alignItems: "center",
    justifyContent: "center",
    minWidth: wp(56),
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    backgroundColor: "#F5EEFF",
    borderRadius: wp(8),
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
  },
  emptyIcon: {
    width: wp(72),
    height: wp(72),
    borderRadius: wp(36),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});
