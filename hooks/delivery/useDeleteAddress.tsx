import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: async (address_id: string) => {
      const res = await apiClient.delete(`users/me/addresses/${address_id}`);
      return res.data;
    },
  });
};
