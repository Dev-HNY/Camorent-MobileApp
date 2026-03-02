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
    enabled: !!booking_id,
    refetchOnWindowFocus: true,
    // Stop polling once a terminal state (approved or rejected) is reached
    refetchInterval: (query) => {
      if (!enablePolling) return false;
      const approval = (query.state.data as BookingDetails | undefined)?.admin_approval;
      if (approval === "True" || (approval && approval !== "pending" && approval !== "")) return false;
      return 2000;
    },
    staleTime: 0,
  });
};
