import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { YStack, XStack, Text, ScrollView, Separator, Card } from "tamagui";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { fp, hp, wp } from "@/utils/responsive";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { renderStars } from "@/utils/renderStars";

export default function ProductReviewDetail() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"stories" | "reviews">("reviews");

  const {
    id,
    productId,
    rating,
    reviewer,
    review,
    avatar,
    productName,
    images,
  } = useLocalSearchParams<{
    id: string;
    productId: string;
    rating: string;
    reviewer: string;
    review: string;
    avatar: string;
    productName: string;
    images: string;
  }>();

  const handleBackPress = () => {
    router.back();
  };

  const handleWishlistPress = () => {
    // TODO: handle wishlist press
  };

  const ratingNumber = parseFloat(rating || "0");
  const reviewImages = images ? JSON.parse(images) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingTop={hp(12)}>
        <YStack paddingBottom={hp(12)}>
          <InsideScreenHeader onBackPress={handleBackPress} />
        </YStack>
        <YStack flex={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <YStack gap="$3" paddingHorizontal={wp(16)}>
              {/* Stories/Reviews Tabs */}
              <LinearGradient
                colors={["#F3E8FF", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.1127, y: 0 }}
                style={{
                  paddingHorizontal: wp(4),
                  paddingVertical: wp(2),
                  borderRadius: wp(30),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <XStack
                  flex={1}
                  paddingVertical={hp(8)}
                  paddingHorizontal={wp(12)}
                  justifyContent="center"
                  alignItems="center"
                  borderRadius={wp(30)}
                  backgroundColor={
                    activeTab === "stories" ? "#FFF" : "transparent"
                  }
                  onPress={() => setActiveTab("stories")}
                >
                  <BodySmall
                    fontWeight={"500"}
                    color={activeTab === "stories" ? "#8200FF" : "#121217"}
                  >
                    Stories
                  </BodySmall>
                </XStack>
                <XStack
                  flex={1}
                  paddingVertical={hp(8)}
                  paddingHorizontal={wp(12)}
                  justifyContent="center"
                  alignItems="center"
                  borderRadius={wp(30)}
                  backgroundColor={
                    activeTab === "reviews" ? "#FFF" : "transparent"
                  }
                  onPress={() => setActiveTab("reviews")}
                >
                  <BodySmall
                    fontWeight={"500"}
                    color={activeTab === "reviews" ? "#8200FF" : "#121217"}
                  >
                    Reviews
                  </BodySmall>
                </XStack>
              </LinearGradient>

              {/* Review Card */}
              <Card
                paddingVertical={hp(16)}
                borderRadius={wp(12)}
                style={{ boxShadow: " 0 1px 2px 0 rgba(18, 18, 23, 0.05)" }}
                borderWidth={wp(1)}
                borderColor={"#EBEBEF"}
                gap={hp(12)}
              >
                <XStack
                  paddingHorizontal={wp(12)}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <XStack alignItems="center" gap="$2">
                    <XStack gap={wp(4)}>{renderStars(ratingNumber)}</XStack>
                    <Text color="$color">{ratingNumber.toFixed(1)}</Text>
                  </XStack>

                  <YStack
                    borderColor={"#C5A4FF"}
                    paddingHorizontal={wp(8)}
                    paddingVertical={hp(4)}
                    borderWidth={0.5}
                    borderRadius={wp(6)}
                    backgroundColor={"#F3E8FF"}
                  >
                    <Text
                      fontSize={fp(9)}
                      fontWeight={"600"}
                      lineHeight={hp(12)}
                      color={"#6D00DA"}
                    >
                      Product review
                    </Text>
                  </YStack>
                </XStack>

                <YStack gap={hp(12)}>
                  <YStack paddingHorizontal={wp(12)} gap={hp(4)}>
                    <BodySmall color="#121217" fontWeight="600">
                      {reviewer}
                    </BodySmall>

                    <BodyText color={"#6C6C89"}>&quot;{review}&quot;</BodyText>
                  </YStack>

                  {/* Review Images - Vertical Scroll with Larger Size */}
                  {reviewImages && reviewImages.length > 0 && (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: wp(12),
                        gap: hp(12),
                      }}
                    >
                      <YStack gap={hp(12)}>
                        {reviewImages.map((imageUrl: string, index: number) => (
                          <Image
                            key={index}
                            source={imageUrl}
                            style={{
                              width: "100%",
                              height: hp(300),
                              borderRadius: wp(12),
                            }}
                            contentFit="cover"
                          />
                        ))}
                      </YStack>
                    </ScrollView>
                  )}

                  <XStack
                    paddingHorizontal={wp(12)}
                    justifyContent="space-between"
                  >
                    <YStack>
                      <Text
                        fontSize={fp(10)}
                        fontWeight={"400"}
                        lineHeight={hp(13)}
                        color={"#121217"}
                      >
                        June 12, 2025
                      </Text>
                    </YStack>
                    <YStack>
                      <BodyText>
                        Crew By: <Text color={"#6D00DA"}>Camorent</Text>
                      </BodyText>
                    </YStack>
                  </XStack>
                </YStack>
              </Card>
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
