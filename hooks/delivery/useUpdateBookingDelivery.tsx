import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
interface Delivery {
  delivery_option: string;
  address_id?: string;
}
interface UpdateBookingDeliveryProps {
  deliveryUpdates: Delivery;
  booking_id: string;
}
interface UpdateBookingDeliveryResponse {
  booking_id: string;
  delivery_option: string;
  address_id: string;
}
export const useUpdateBookingDelivery = () => {
  return useMutation({
    mutationFn: async ({
      deliveryUpdates,
      booking_id,
    }: UpdateBookingDeliveryProps) => {
      const res = await apiClient.put<UpdateBookingDeliveryResponse>(
        `/bookings/${booking_id}/delivery`,
        deliveryUpdates
      );
      return res.data;
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
};
