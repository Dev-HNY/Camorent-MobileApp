import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: async ({ sku_id }: { sku_id: string }) => {
      const res = await apiClient.delete(`/cart/remove/${sku_id}`);
      return res.data;
    },
  });
};
