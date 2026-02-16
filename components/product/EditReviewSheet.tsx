import { YStack, XStack, Text, ScrollView, Spinner } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Heading2, BodyText } from "@/components/ui/Typography";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/StarIcon";
import { useEffect } from "react";
import { fp, hp, wp } from "@/utils/responsive";
import { UpdateReviewRequest } from "@/types/review/review";
import { Review } from "@/types/products/product";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "react-native";

const editReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  phone_num: z.string().optional(),
  email: z.email("Invalid email address").optional().or(z.literal("")),
});

type EditReviewForm = z.infer<typeof editReviewSchema>;

interface EditReviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSubmit: (reviewId: string, data: UpdateReviewRequest) => void;
  isLoading?: boolean;
}

export function EditReviewSheet({
  isOpen,
  onClose,
  review,
  onSubmit,
  isLoading = false,
}: EditReviewSheetProps) {
  const { control, handleSubmit, reset } = useForm<EditReviewForm>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      phone_num: "",
      email: "",
    },
  });

  // Update form when review changes
  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating,
        comment: review.review_text || "",
        phone_num: review.phone_num || "",
        email: review.email || "",
      });
    }
  }, [review, reset]);

  const onFormSubmit = (data: EditReviewForm) => {
    if (!review) return;

    const requestData: UpdateReviewRequest = {
      rating: data.rating,
      ...(data.comment && { comment: data.comment }),
      ...(data.phone_num && { phone_num: data.phone_num }),
      ...(data.email && { email: data.email }),
    };

    onSubmit(review.review_id, requestData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoints={[85]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4" paddingHorizontal={wp(16)} paddingVertical={hp(20)}>
          <Heading2>Edit Review</Heading2>

          {/* Rating Section */}
          <Controller
            control={control}
            name="rating"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <YStack gap="$2">
                <BodyText fontWeight="600">Rating *</BodyText>
                <XStack gap={wp(8)} alignItems="center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <YStack
                      key={star}
                      onPress={() => onChange(star)}
                      cursor="pointer"
                    >
                      <StarIcon
                        width={32}
                        height={32}
                        fill={star <= value ? "#FFC233" : "#E2E8F0"}
                      />
                    </YStack>
                  ))}
                  <Text
                    fontSize={fp(16)}
                    fontWeight="600"
                    color="#121217"
                    marginLeft={wp(8)}
                  >
                    {value.toFixed(1)}
                  </Text>
                </XStack>
                {error && (
                  <Text color="$red10" fontSize="$3">
                    {error.message}
                  </Text>
                )}
              </YStack>
            )}
          />

          {/* Comment Section */}
          <Controller
            control={control}
            name="comment"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <YStack gap="$2">
                <BodyText fontWeight="600">Review Comment</BodyText>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: error ? "#ef4444" : "#d1d1db",
                    borderRadius: wp(8),
                    paddingHorizontal: wp(8),
                    paddingVertical: hp(12),
                    fontSize: fp(14),
                    fontWeight: "400",
                    lineHeight: hp(19),
                    backgroundColor: "white",
                    height: hp(100),
                    textAlignVertical: "top",
                  }}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your experience..."
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                {error && (
                  <Text color="$red10" fontSize="$3">
                    {error.message}
                  </Text>
                )}
              </YStack>
            )}
          />

          {/* Phone Number Section */}
          <FormField
            name="phone_num"
            control={control}
            label="Phone Number"
            placeholder="+1234567890"
            keyboardType="phone-pad"
          />

          {/* Email Section */}
          <FormField
            name="email"
            control={control}
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
          />

          {/* Action Buttons */}
          <XStack gap="$3" marginTop={hp(12)}>
            <YStack flex={1}>
              <Button
                variant="outline"
                size="lg"
                onPress={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </YStack>
            <YStack flex={1}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit(onFormSubmit)}
                disabled={isLoading}
              >
                {isLoading ? <Spinner color="white" /> : "Update Review"}
              </Button>
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </BottomSheet>
  );
}
