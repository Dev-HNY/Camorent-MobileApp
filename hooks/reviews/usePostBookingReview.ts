import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface PostBookingReviewProps {
  booking_id: string;
  reviewData: { review: string; rating: number; sku_id?: string };
}
export const usePostBookingReview = () => {
  return useMutation({
    mutationFn: async ({ booking_id, reviewData }: PostBookingReviewProps) => {
      const res = await apiClient.post(`/reviews`, {
        booking_id,
        rating: reviewData.rating,
        comment: reviewData.review,
        sku_id: reviewData.sku_id,
      });
      return res.data;
    },
  });
};
