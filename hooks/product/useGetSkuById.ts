import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SKUDetail } from "@/types/products/product";

export const useGetSkuById = (sku_id: string) => {
  return useQuery({
    queryKey: ["sku", sku_id],
    queryFn: async () => {
      const res = await apiClient.get<SKUDetail>(`/skus/${sku_id}`);
      return res.data;
    },
    enabled: !!sku_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
