import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APICartResponse } from "@/types/cart/cart";

export enum Operation {
  ADD = "increment",
  REMOVE = "decrement",
}

interface itemQuantityProps {
  sku_id: string;
  operation: Operation;
}

export const useModifyQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sku_id, operation }: itemQuantityProps) => {
      const res = await apiClient.put(`/cart/toggle/${sku_id}/${operation}`);
      return res.data;
    },
    onMutate: async ({ sku_id, operation }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<APICartResponse>(["cart"]);

      // Optimistically update cart
      if (previousCart) {
        queryClient.setQueryData<APICartResponse>(["cart"], (old) => {
          if (!old) return old;

          const updatedSkuItems = old.sku_items
            .map((item) => {
              if (item.sku_id === sku_id) {
                const newQuantity =
                  operation === Operation.ADD
                    ? item.quantity + 1
                    : Math.max(0, item.quantity - 1);

                return {
                  ...item,
                  quantity: newQuantity,
                };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);

          const totalSkuItems = updatedSkuItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalCrewItems = (old.crew_items || []).reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            ...old,
            sku_items: updatedSkuItems,
            total_items: totalSkuItems + totalCrewItems,
          };
        });
      }

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      console.error("Failed to update quantity:", err);
    },
  });
};
