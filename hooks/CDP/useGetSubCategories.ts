import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SubCategoriesResponse } from "@/types/category/category";

export const useGetSubCategories = (categoryId: string) => {
  return useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: async () => {
      const res = await apiClient.get<SubCategoriesResponse>(
        `/skus/subcategories?category_id=${categoryId}`
      );
      return res.data;
    },
    enabled: !!categoryId,
    //  staleTime: Infinity,
  });
};
