import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export const useSyncInvoiceStatus = () => {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await apiClient.get(`/bookings/${bookingId}/invoice/sync`);
      return res.data as {
        invoice_status: string | null;
        booking_status: string;
        updated: boolean;
      };
    },
  });
};
