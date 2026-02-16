import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@/types/auth/auth";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await apiClient.get<UserProfile>("/auth/me");
      return res.data;
    },
  });
};
