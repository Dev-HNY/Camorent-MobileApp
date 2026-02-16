import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import type {
  CreateTransactionParams,
  PaymentResponse,
} from "@/types/payments/payment";

export const useCreateTransaction = () => {
  return useMutation<PaymentResponse, Error, CreateTransactionParams>({
    mutationFn: async ({ paymentPayload, booking_id }) => {
      const res = await apiClient.post<PaymentResponse>(
        `/bookings/${booking_id}/payment/choose-method`,
        paymentPayload
      );
      return res.data;
    },
  });
};
