import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetFaqs = (sku_id) => {
  return useQuery({
    queryKey: ["faqs", sku_id],
    queryFn: async () => {
      const res = await apiClient.get(`/skus/${sku_id}/faqs`);
      return res.data;
    },
  });
};
