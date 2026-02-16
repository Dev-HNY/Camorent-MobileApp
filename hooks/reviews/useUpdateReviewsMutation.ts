import { apiClient } from "@/lib/api-client";
import { UpdateReviewRequest } from "@/types/review/review";
import { useMutation } from "@tanstack/react-query";

interface UpdateReviewProps {
  review_id: string;
  requestData: UpdateReviewRequest;
}
export const useUpdateReviewsMutation = () => {
  return useMutation({
    mutationFn: async ({ review_id, requestData }: UpdateReviewProps) => {
      const res = await apiClient.patch(`/reviews/${review_id}`, requestData);
      console.log(res.data);
      return res.data;
    },
  });
};
