import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { BookingDetails } from "@/types/shoots/shoots";

export const useGetBookingById = (booking_id: string, enablePolling: boolean = false) => {
  return useQuery<BookingDetails>({
    queryKey: ["bookings", booking_id],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/${booking_id}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: enablePolling ? 5000 : false, // Poll every 5 seconds when enabled
  });
};
