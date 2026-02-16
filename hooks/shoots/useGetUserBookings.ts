import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetUserBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings");
      return res.data.data;
    },
    refetchOnMount: "always",
  });
};
