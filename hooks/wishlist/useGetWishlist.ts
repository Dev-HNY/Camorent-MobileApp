import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { GetWishlistResponse } from "@/types/wishlist/wishlist";

export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await apiClient.get<GetWishlistResponse>("/users/wishlist");
      return res.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
