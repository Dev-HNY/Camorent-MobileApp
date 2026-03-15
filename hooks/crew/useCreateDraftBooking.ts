import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface DraftCartItem {
  sku_id: string;
  quantity: number;
  addons: string[];
}
interface DraftCrewItem {
  crew_type_id: string;
  quantity: number;
}

export interface DraftBookingRequest {
  shoot_name?: string;
  items: DraftCartItem[];
  crews: DraftCrewItem[] | null;
  rental_start_date: string;
  rental_end_date: string;
  coupon_codes: string[];
  gstin?: string;
}

interface AppliedCoupon {
  [key: string]: any;
}

interface DraftBookingResponseSkuItem {
  sku_id: string;
  quantity: number;
  addons: string[];
  is_available: boolean;
  total_sku_price: string;
}

interface DraftBookingResponseCrewItem {
  crew_type_id: string;
  quantity: number;
  is_available: boolean;
  total_crew_type_price: string;
}

interface DraftBookingResponse {
  booking_id: string;
  status: string;
  rental_start_date: string;
  rental_end_date: string;
  total_rental_days: number;
  sku_items: DraftBookingResponseSkuItem[];
  crew_items: DraftBookingResponseCrewItem[];
  created_at: string;
  items_amount: string;
  discount_total: string;
  final_amount: string;
  applied_coupons: AppliedCoupon[];
}

export const useCreateDraftBooking = () => {
  return useMutation<DraftBookingResponse, Error, DraftBookingRequest>({
    mutationFn: async (draftBooking: DraftBookingRequest) => {
      const res = await apiClient.post(
        "/bookings/check-availability",
        draftBooking
      );
      return res.data;
    },
  });
};
