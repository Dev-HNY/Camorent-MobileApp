import { useGetWishlist } from "./useGetWishlist";

export const useWishlistCount = () => {
  const { data: wishlist, isLoading } = useGetWishlist();

  return {
    count: wishlist?.total ?? 0,
    isLoading,
  };
};
