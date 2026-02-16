import { CartItem } from "@/types/cart/cart";

export interface CamocareOption {
  id: string;
  isSelected: boolean;
  price: number;
  coverage: {
    damageProtection: boolean;
    minorRepairs: boolean;
    priorityReplacement: boolean;
    theftProtection: boolean;
    hassleFreeClaims: boolean;
    projectSupport: boolean;
  };
}

export interface BookingItem {
  item_id: string;
  id: string;
  name: string;
  quantity: number;
  price_per_day: string;
  total_price: string;
  security_deposit: string;
  status: string;
  is_available: boolean;
}

export interface BookingCrewItem {
  crew_item_id: string;
  crew_type_id: string;
  crew_type_name: string;
  quantity: number;
  price_per_day: string;
  total_price: string;
  status: string;
  is_available: boolean | null;
}

export interface BookingDetails {
  booking_id: string;
  booking_reference: string;
  status: string;
  rental_start_date: string;
  rental_end_date: string;
  total_rental_days: number;
  sku_items: BookingItem[];
  crew_items: BookingCrewItem[];
  sku_amount: string;
  crew_amount: string;
  discount_amount: string;
  coupon_discount_amount: string;
  total_amount: string;
  delivery_type: string;
  address_id: string;
  start_otp: string;
  return_otp: string;
  start_otp_verified_at: string;
  return_otp_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface DraftBookingDetails {
  rentalStartDate: Date;
  rentalEndDate: Date;
  rentalDays: number;
  location?: string;
  notes?: string;
}

export interface BookingSummary {
  itemsSubtotal: number;
  // camocarePrice: number;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Booking {
  id: string;
  cartItems: CartItem[];
  // camocare: CamocareOption | null;
  crew: string | null;
  bookingDetails: DraftBookingDetails;
  summary: BookingSummary;
  status: "draft" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface BackendBookingPayload {
  products: CartItem[];
  // camocare: boolean;
  crew: string | null;
  bookingDetails: DraftBookingDetails;
}
