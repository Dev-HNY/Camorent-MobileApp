import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteWishlistResponse,
  GetWishlistResponse,
} from "@/types/wishlist/wishlist";

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skuId: string) => {
      const res = await apiClient.delete<DeleteWishlistResponse>(
        `/users/wishlist/${skuId}`
      );
      return res.data;
    },
    onMutate: async (skuId) => {
      // cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // snapshot previous value
      const previousWishlist = queryClient.getQueryData<GetWishlistResponse>([
        "wishlist",
      ]);

      // optimistically remove the item
      // If no previous data, set to empty object (user might be removing before query loaded)
      queryClient.setQueryData<GetWishlistResponse>(
        ["wishlist"],
        previousWishlist
          ? {
              items: previousWishlist.items.filter((item) => item.sku_id !== skuId),
              total: previousWishlist.total - 1,
            }
          : { items: [], total: 0 }
      );

      return { previousWishlist };
    },
    onError: (_err, _skuId, context) => {
      // Rollback on error
      if (context?.previousWishlist !== undefined) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
