import { apiClient } from "@/lib/api-client";
import { Review } from "@/types/review/review";
import { useQuery } from "@tanstack/react-query";
interface GetReviewsResponse {
  data: Review[];
  meta: any;
}
export const useGetSkuReviews = ({
  sku_id,
  limit,
}: {
  sku_id: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["reviews", sku_id, limit],
    queryFn: async () => {
      const res = await apiClient.get<GetReviewsResponse>(
        `/reviews/sku/${sku_id}`,
        { params: { limit } }
      );
      return res.data;
    },
    enabled: !!sku_id,
  });
};
