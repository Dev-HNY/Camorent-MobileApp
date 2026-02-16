import { useMemo } from "react";
import { useGetWishlist } from "./useGetWishlist";
import { useAddToWishlist } from "./useAddToWishlist";
import { useRemoveFromWishlist } from "./useRemoveFromWishlist";

export const useWishlistStatus = (skuId: string, sku_name: string) => {
  const { data: wishlist, isLoading } = useGetWishlist();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const isInWishlist = useMemo(() => {
    if (!wishlist) return false;
    return wishlist.items.some((item) => item.sku_id === skuId);
  }, [wishlist, skuId]);

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeMutation.mutate(skuId);
    } else {
      addMutation.mutate({ sku_id: skuId, sku_name: sku_name });
    }
  };

  return {
    isInWishlist,
    isLoading,
    toggleWishlist,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
};
