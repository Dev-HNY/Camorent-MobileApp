import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/auth";

export const useGetUserPreferences = () => {
  const { setIsCitySelected, setCity } = useAuthStore();

  const query = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me/preferences");
      return res.data;
    },
  });

  // Sync city state from backend after fetch — outside render phase
  useEffect(() => {
    if (query.data?.preferred_city) {
      setIsCitySelected(true);
      setCity(query.data.preferred_city);
    }
  }, [query.data?.preferred_city]);

  return query;
};
