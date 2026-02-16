import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useGetBookingInvoice = ({
  bookingId,
  invoice_id,
}: {
  bookingId: string;
  invoice_id: string;
}) => {
  return useQuery({
    queryKey: ["invoice", bookingId, invoice_id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/bookings/${bookingId}/invoice/download`
      );
      return res.data;
    },
    enabled: !!invoice_id && !!bookingId,
  });
};
