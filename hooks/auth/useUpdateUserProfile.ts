import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserProfileRequest, UserProfile } from "@/types/auth/auth";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateUserProfileRequest) => {
      const res = await apiClient.put<UserProfile>("/users/me", request);
      return res.data;
    },
    onError: (_err) => {
      console.error(_err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
