import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddToWishlistRequest,
  AddToWishlistResponse,
  GetWishlistResponse,
  WishlistItem,
} from "@/types/wishlist/wishlist";

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AddToWishlistRequest) => {
      const res = await apiClient.post<AddToWishlistResponse>(
        "/users/wishlist",
        request
      );
      return res.data;
    },
    onMutate: async (request) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData<GetWishlistResponse>([
        "wishlist",
      ]);

      // Guard: skip optimistic update if item already in cache (prevents duplicate UI)
      const alreadyExists = previousWishlist?.items.some(
        (item) => item.sku_id === request.sku_id
      );
      if (alreadyExists) return { previousWishlist };

      // Optimistically add the item (with minimal data)
      const tempId = `temp-${request.sku_id}-${Date.now()}`;
      const optimisticItem: WishlistItem = {
        id: tempId,
        wishlist_id: tempId,
        sku_name: request.sku_name,
        sku_category: "",
        user_id: "",
        sku_id: request.sku_id,
        created_at: new Date().toISOString(),
      };

      // Update cache with optimistic item (initialize as empty object if no data)
      queryClient.setQueryData<GetWishlistResponse>(
        ["wishlist"],
        previousWishlist
          ? {
              items: [...previousWishlist.items, optimisticItem],
              total: previousWishlist.total + 1,
            }
          : { items: [optimisticItem], total: 1 }
      );

      return { previousWishlist };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousWishlist !== undefined) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch wishlist to get updated data with full SKU details
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
