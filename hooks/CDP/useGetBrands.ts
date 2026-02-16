import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await apiClient.get("/skus/brands");
      return res.data.data;
    },
  });
};
