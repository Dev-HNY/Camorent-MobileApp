import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SKUQueryParams, SKUsResponse } from "@/types/products/product";

export const UseGetAllProducts = (params?: SKUQueryParams) => {
  return useQuery({
    queryKey: [
      "products",
      params?.category_id,
      params?.subcategory_id,
      params?.selection,
      params?.limit,
      params?.is_active,
      params?.brand,
      params?.q,
    ],
    queryFn: async () => {
      const res = await apiClient.get<SKUsResponse>("/skus", {
        params,
      });
      return res.data;
    },
    enabled: params !== undefined && (params.limit === undefined || params.limit > 0),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
};
