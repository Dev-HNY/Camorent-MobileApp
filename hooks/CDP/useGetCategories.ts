import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { CategoriesResponse } from "@/types/category/category";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get<CategoriesResponse>("/skus/categories");
      return res.data;
    },
    // staleTime: Infinity,
  });
};
