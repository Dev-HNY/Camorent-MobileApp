import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface DeleteReviewProps {
  review_id: string;
}

export const useDeleteReviewsMutation = () => {
  return useMutation({
    mutationFn: async ({ review_id }: DeleteReviewProps) => {
      const res = await apiClient.delete(`/reviews/${review_id}`);
      return res.data;
    },
  });
};
