import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me/addresses");
      console.log("get address data :", res.data);
      return res.data;
    },
  });
};
