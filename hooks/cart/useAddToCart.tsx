import { apiClient } from "@/lib/api-client";
import { APICartResponse } from "@/types/cart/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface addToCartProps {
  item_id: string;
  item_quantity: number;
  itemType?: "sku" | "crew"; // Optional: for optimistic updates
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqAddToCart: addToCartProps) => {
      // Don't send itemType to backend
      const { itemType, ...payload } = reqAddToCart;
      const res = await apiClient.post("/cart/add", payload);
      return res.data;
    },
    onMutate: async (newItem: addToCartProps) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<APICartResponse>(["cart"]);

      // Optimistic update if itemType is provided
      if (newItem.itemType && previousCart) {
        queryClient.setQueryData<APICartResponse>(["cart"], (old) => {
          if (!old) return old;

          const newCart = { ...old };

          if (newItem.itemType === "sku") {
            // Check if item already exists
            const existingIndex = old.sku_items.findIndex(
              (item) => item.sku_id === newItem.item_id
            );

            if (existingIndex >= 0) {
              // Update existing item quantity
              newCart.sku_items = [...old.sku_items];
              newCart.sku_items[existingIndex] = {
                ...newCart.sku_items[existingIndex],
                quantity: newCart.sku_items[existingIndex].quantity + newItem.item_quantity,
              };
            } else {
              // Add new item
              newCart.sku_items = [
                ...old.sku_items,
                {
                  sku_id: newItem.item_id,
                  quantity: newItem.item_quantity,
                  price_per_day: "0",
                  added_at: new Date().toISOString(),
                },
              ];
            }
          } else if (newItem.itemType === "crew") {
            // Check if crew already exists
            const existingIndex = old.crew_items.findIndex(
              (item) => item.crew_type_id === newItem.item_id
            );

            if (existingIndex >= 0) {
              // Update existing crew quantity
              newCart.crew_items = [...old.crew_items];
              newCart.crew_items[existingIndex] = {
                ...newCart.crew_items[existingIndex],
                quantity: newCart.crew_items[existingIndex].quantity + newItem.item_quantity,
              };
            } else {
              // Add new crew
              newCart.crew_items = [
                ...old.crew_items,
                {
                  crew_type_id: newItem.item_id,
                  quantity: newItem.item_quantity,
                  price_per_day: "0",
                  added_at: new Date().toISOString(),
                },
              ];
            }
          }

          newCart.total_items = old.total_items + newItem.item_quantity;
          return newCart;
        });
      }

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      console.error("Failed to add to cart:", error);
    },
  });
};
