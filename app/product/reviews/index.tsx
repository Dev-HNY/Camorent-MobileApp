import { InsideScreenHeader } from "@/components/ui/InsideScreenHeader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { YStack, XStack, Card, Text, ScrollView, Spinner } from "tamagui";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { useLocalSearchParams } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { useState } from "react";
import { useGetSkuById } from "@/hooks/product/useGetSkuById";
import { formatDate } from "@/utils/date";
import { useGetCurrentUser } from "@/hooks/auth";
import { useUpdateReviewsMutation } from "@/hooks/reviews/useUpdateReviewsMutation";
import { useDeleteReviewsMutation } from "@/hooks/reviews/useDeleteReviewsMutation";
import { EditReviewSheet } from "@/components/product/EditReviewSheet";
import { Review, UpdateReviewRequest } from "@/types/review/review";
import { useQueryClient } from "@tanstack/react-query";
import { renderStars } from "@/utils/renderStars";
import { useGetSkuReviews } from "@/hooks/reviews/useGetSkuReviews";
import { useGetSkuRatingStats } from "@/hooks/product/useGetSkuRatingStats";

export default function ProductReviews() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const queryClient = useQueryClient();
  const { data: reviewsData } = useGetSkuReviews({ sku_id: id });
  const { data: product } = useGetSkuById(id as string);
  const { data: user } = useGetCurrentUser();
  const updateReviewMutation = useUpdateReviewsMutation();
  const deleteReviewMutation = useDeleteReviewsMutation();
  const { data: ratingStats, isLoading: isLoadingRatingStats } =
    useGetSkuRatingStats(product?.sku_id);

  // const reviewTags = ["Product review", "Service review", "Crew review"];
  if (isLoadingRatingStats) {
    return <Spinner />;
  }
  const reviews = reviewsData?.data;

  const averageRating = ratingStats?.avg_rating;
  const totalReviews = ratingStats?.review_count;

  const handleEditPress = (review: Review) => {
    setSelectedReview(review);
    setIsEditSheetOpen(true);
  };

  const handleUpdateReview = (reviewId: string, data: UpdateReviewRequest) => {
    updateReviewMutation.mutate(
      {
        review_id: reviewId,
        requestData: data,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["reviews", id] });
          setIsEditSheetOpen(false);
          setSelectedReview(null);
        },
        onError: (error) => {
        },
      }
    );
  };

  const handleDeletePress = (reviewId: string) => {
    deleteReviewMutation.mutate(
      {
        review_id: reviewId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["sku", id] });
        },
        onError: (error) => {
        },
      }
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingTop={hp(12)}>
        <YStack paddingBottom={hp(16)}>
          <InsideScreenHeader />
        </YStack>
        <YStack flex={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + hp(60) }}
          >
            <YStack gap="$3" paddingHorizontal={wp(16)}>
              <YStack gap={"$1"} marginBottom="$2">
                <Heading2 fontWeight={"500"}>Reviews and Ratings</Heading2>
                <XStack alignItems="center" gap="$2">
                  <Text
                    fontSize={fp(18)}
                    fontWeight={"600"}
                    lineHeight={hp(22)}
                    color={"#121217"}
                  >
                    {averageRating}
                  </Text>
                  <XStack gap={wp(4)}>
                    {renderStars(averageRating as number)}
                  </XStack>
                </XStack>
                <BodyText>Based on {totalReviews} Reviews</BodyText>
              </YStack>

              {/* Review Tags */}
              {/* <XStack
                gap="$2"
                flexWrap="wrap"
                justifyContent="space-between"
                marginBottom="$2"
              >
                {reviewTags.map((tag, index) => {
                  const isActive = activeTagIndex === index;
                  return (
                    <YStack
                      key={index}
                      borderColor={isActive ? "#8E0FFF" : "#E2E8F0"}
                      paddingHorizontal={wp(8)}
                      paddingVertical={hp(6)}
                      borderWidth={1}
                      borderRadius={wp(8)}
                      backgroundColor={isActive ? "#F4F1FD" : "#FFF"}
                      onPress={() => setActiveTagIndex(index)}
                      style={{
                        boxShadow: isActive
                          ? " 0 0 0 1px #E2E8F0"
                          : "0 1px 2px 0 rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Text
                        fontSize={fp(11)}
                        fontWeight={"500"}
                        lineHeight={hp(14)}
                        color={isActive ? "#8200FF" : "#6C6C89"}
                      >
                        {tag}
                      </Text>
                    </YStack>
                  );
                })}
              </XStack> */}

              {/* Review Cards */}
              {reviews?.map((review) => (
                <Card
                  key={review.review_id}
                  paddingVertical={hp(16)}
                  borderRadius={wp(12)}
                  style={{ boxShadow: " 0 1px 2px 0 rgba(18, 18, 23, 0.05)" }}
                  borderWidth={wp(1)}
                  borderColor={"#EBEBEF"}
                  gap={hp(12)}
                  // onPress={() =>
                  //   router.push({
                  //     pathname: "/product/reviews/review/[id]",
                  //     params: {
                  //       id: review.review_id,
                  //       productId: id,
                  //       rating: review.rating.toString(),
                  //       reviewer: review.user_id,
                  //       review: review.review_text,
                  //       avatar: review.avatar,
                  //       productName: product?.name || "",
                  //     },
                  //   })
                  // }
                >
                  <XStack
                    paddingHorizontal={wp(12)}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <XStack alignItems="center" gap="$2">
                      <XStack gap={wp(4)}>{renderStars(review.rating)}</XStack>
                      <Text color="$color">{review.rating}</Text>
                    </XStack>

                    {/* <YStack
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
                        {reviewTags[activeTagIndex]}
                      </Text>
                    </YStack> */}
                  </XStack>

                  <YStack gap={hp(12)}>
                    <YStack paddingHorizontal={wp(12)} gap={hp(4)}>
                      <BodySmall color="#121217" fontWeight="600">
                        {review.user_name}-{review.user_role}
                      </BodySmall>

                      <BodyText color={"#6C6C89"}>{review.comment}</BodyText>
                    </YStack>

                    {/* Review Images */}
                    {/* {review.images && review.images.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingLeft: wp(12),
                        }}
                      >
                        <XStack gap={wp(10)}>
                          {review.images.map((imageUrl, index) => (
                            <Image
                              key={index}
                              source={imageUrl}
                              style={{
                                width: wp(78),
                                height: hp(78),
                                borderRadius: wp(8),
                              }}
                              contentFit="cover"
                            />
                          ))}
                        </XStack>
                      </ScrollView>
                    )} */}

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
                          {formatDate(review.created_at, "long")}
                        </Text>
                      </YStack>
                      <YStack>
                        <BodyText>
                          Crew By: <Text color={"#6D00DA"}>Camorent</Text>
                        </BodyText>
                      </YStack>
                      {/* {user?.user_id === review.user_id && (
                        <XStack gap="$3">
                          <YStack onPress={() => handleEditPress(review)}>
                            <Text color="#8E0FFF" fontWeight="600">
                              Edit
                            </Text>
                          </YStack>
                          <YStack
                            onPress={() => handleDeletePress(review.review_id)}
                          >
                            <Text color="#FF0000" fontWeight="600">
                              Delete
                            </Text>
                          </YStack>
                        </XStack>
                      )} */}
                    </XStack>
                  </YStack>
                </Card>
              ))}
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>

      <EditReviewSheet
        isOpen={isEditSheetOpen}
        onClose={() => {
          setIsEditSheetOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
        onSubmit={handleUpdateReview}
        isLoading={updateReviewMutation.isPending}
      />
    </SafeAreaView>
  );
}
