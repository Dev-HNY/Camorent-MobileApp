import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export const useCLearCart = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete(`/cart/clear`);
      return res.data;
    },
  });
};
