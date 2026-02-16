import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export interface Offer {
  offer_id: string;
  title: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_discount: number;
  min_order_value: number;
  is_active: boolean;
  valid_from: string;
  valid_till: string;
  created_at: string;
}

export const useGetAllOffers = () => {
  return useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await apiClient.get("/offers/active_offers");
      return res.data;
    },
  });
};
