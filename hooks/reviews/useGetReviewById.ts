import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetReviewById = (review_id: string) => {
  return useQuery({
    queryKey: ["review", review_id],
    queryFn: async () => {
      const res = await apiClient.get(`/reviews/${review_id}`);
      return res.data;
    },
  });
};
