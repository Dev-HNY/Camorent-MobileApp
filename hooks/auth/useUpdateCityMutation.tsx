import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateCityParams {
  preferred_city: string;
}

export const useUpdateCityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (city: UpdateCityParams) => {
      const res = await apiClient.put("/users/me/preferences", city);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
};
