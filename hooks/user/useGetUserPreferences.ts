import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetUserPreferences = () => {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me/preferences");
      return res.data;
    },
  });
};
