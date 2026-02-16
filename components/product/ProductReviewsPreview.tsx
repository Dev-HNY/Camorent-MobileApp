import { YStack, XStack, Card, Text, Spinner } from "tamagui";
import { useState } from "react";
import { BodySmall, BodyText, Heading2 } from "../ui/Typography";
import { fp, hp, wp } from "@/utils/responsive";
import { formatDate } from "@/utils/date";
import { renderStars } from "@/utils/renderStars";
import { useGetSkuReviews } from "@/hooks/reviews/useGetSkuReviews";
import { useGetSkuRatingStats } from "@/hooks/product/useGetSkuRatingStats";
interface ProductReviewsPreviewProps {
  onViewAllPress: () => void;
  sku_id: string;
}

export function ProductReviewsPreview({
  onViewAllPress,
  sku_id,
}: ProductReviewsPreviewProps) {
  // const reviewTags = ["Product review", "Service review", "Crew review"];
  // const [activeTagIndex, setActiveTagIndex] = useState(0);
  const { data: reviewsData, isLoading } = useGetSkuReviews({
    sku_id,
    limit: 1,
  });
  const { data: ratingStats, isLoading: isLoadingRatingStats } =
    useGetSkuRatingStats(sku_id);
  const reviews = reviewsData?.data;
  // console.log(reviews);

  if (isLoading) {
    return (
      <YStack gap="$3" marginTop="$4" paddingHorizontal={wp(16)}>
        <Heading2 fontWeight={"500"}>Reviews and Ratings</Heading2>
        <Spinner color="#8E0FFF" />
      </YStack>
    );
  }

  return (
    <YStack gap="$3" paddingHorizontal={wp(16)}>
      <YStack gap={"$1"}>
        <XStack>
          <Heading2 fontWeight={"500"}>Reviews and Ratings</Heading2>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <Text
            fontSize={fp(18)}
            fontWeight={"600"}
            lineHeight={hp(22)}
            color={"#121217"}
          >
            {ratingStats?.avg_rating}
          </Text>
          <XStack gap={wp(4)}>{renderStars(ratingStats?.avg_rating)}</XStack>
        </XStack>
        <XStack justifyContent="space-between">
          <BodyText>Based on {ratingStats?.review_count} Reviews</BodyText>
          {ratingStats?.review_count > 0 && (
            <XStack onPress={onViewAllPress}>
              <BodyText fontWeight={"500"}>View All</BodyText>
            </XStack>
          )}
        </XStack>
      </YStack>
      {/* <XStack gap="$2" flexWrap="wrap" justifyContent="space-between">
        {reviewTags?.map((tag, index) => {
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
      {reviews?.[0] && (
        <Card
          key={reviews[0].review_id}
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
              <XStack gap={wp(4)}>{renderStars(reviews?.[0].rating)}</XStack>
              <Text color="$color">{reviews[0].rating}</Text>
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
                Product review
              </Text>
            </YStack> */}
          </XStack>
          <YStack gap={hp(12)}>
            <YStack paddingHorizontal={wp(12)} gap={hp(4)}>
              <BodySmall color="#121217" fontWeight="600">
                {reviews[0].user_name} - {reviews[0].user_role}
              </BodySmall>

              <BodyText color={"#6C6C89"}>{reviews[0].comment}</BodyText>
            </YStack>
            {/* <FlashList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={reviewImages}
              ItemSeparatorComponent={() => <YStack width={wp(10)} />}
              contentContainerStyle={{
                paddingLeft: wp(16),
              }}
              estimatedItemSize={200}
              renderItem={(e) => {
                return (
                  <Image
                    source={e.item}
                    style={{
                      width: wp(78),
                      height: hp(78),
                      borderRadius: wp(8),
                    }}
                    contentFit="cover"
                  />
                );
              }}
            /> */}
            <XStack paddingHorizontal={wp(12)} justifyContent="space-between">
              <YStack>
                <Text
                  fontSize={fp(10)}
                  fontWeight={"400"}
                  lineHeight={hp(13)}
                  color={"#121217"}
                >
                  {formatDate(reviews[0].created_at, "long")}
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
      )}
    </YStack>
  );
}
