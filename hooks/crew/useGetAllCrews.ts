import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
export interface Crew {
  id: string;
  crew_name: string;
  crew_type_id: string;
  description: string;
  image_url: string;
  is_active: boolean;
  crew_price_0_12: Float;
  crew_price_12_18: Float;
  crew_price_18_24: Float;
}
export const useGetAllCrews = () => {
  return useQuery({
    queryKey: ["crews"],
    queryFn: async () => {
      const res = await apiClient.get("/skus/crews");
      return res.data;
    },
  });
};
