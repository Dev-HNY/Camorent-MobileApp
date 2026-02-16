import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetSkuRatingStats = (sku_id: string | undefined) => {
  return useQuery({
    queryKey: ["rating-stats", sku_id],
    queryFn: async () => {
      const res = await apiClient.get(`reviews/sku/${sku_id}/stats`);
      return res.data;
    },
    enabled: !!sku_id,
  });
};
