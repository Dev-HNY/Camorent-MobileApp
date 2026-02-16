import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { APICartResponse } from "@/types/cart/cart";

export const useGetCart = () => {
  return useQuery<APICartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await apiClient.get(`/cart/`);
      return res.data;
    },
    refetchOnWindowFocus: "always",
  });
};
