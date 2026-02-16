export type ShootStatus = "past" | "ongoing" | "upcoming";
export type ShootPaymentStatus = "paid" | "pending";
export type ShootConfirmationStatus =
  | "completed"
  | "in_progress"
  | "confirmed"
  | "awaiting_confirmation";

export interface ShootItem {
  id: string;
  name: string;
  image?: string;
  quantity?: number;
}

export interface Shoot {
  id: string;
  title: string;
  client: string;
  amount: number;
  currency: string;
  paymentStatus: ShootPaymentStatus;
  confirmationStatus: ShootConfirmationStatus;
  startDate: string;
  endDate: string;
  location?: string;
  items: ShootItem[];
  completedShootsCount?: number;
}

export interface ShootCategory {
  status: ShootStatus;
  shoots: Shoot[];
  count: number;
}

export interface MyShoots {
  past: ShootCategory;
  ongoing: ShootCategory;
  upcoming: ShootCategory;
}

export interface RescheduleData {
  shootId: string;
  newStartDate: string;
  newEndDate: string;
  reason?: string;
}

export interface OrderStatus {
  id: number;
  status: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isActive?: boolean;
}

export interface RatingCategory {
  title: string;
  rating: number;
  maxRating: number;
}

export interface ShootRating {
  shootId: string;
  overallRating: number;
  categories: RatingCategory[];
  reviewText?: string;
  additionalComments?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  image?: string;
  dayCount: number;
  price: number;
  action?: "replace" | "refund";
}

export interface OrderDetailsData {
  id: string;
  lastUpdated: string;
  handedOverTo: string;
  items: OrderItem[];
  totalPrice: number;
  priceBreakdown: {
    itemTotal: number;
    gst: number;
    deliveryFee: number;
    processingFee: number;
    finalTotal: number;
  };
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

export interface TrackingTimeline {
  id: number;
  status: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isActive?: boolean;
}

export interface TrackingInfo {
  canExtend: boolean;
  extendFromDate: string;
  extendToDate: string;
  maxExtensionDays: number;
  timeline: TrackingTimeline[];
}

export interface AlternativeGear {
  id: string;
  name: string;
  image?: string;
  price: number;
  discount?: number;
}

export interface BookingDetailsItem {
  item_id: string;
  id: string;
  name: string;
  quantity: number;
  price_per_day: string;
  total_price: string;
  status: string;
  is_available: boolean | null;
}

export interface BookingDetailsCrewItem {
  crew_item_id: string;
  crew_type_id: string;
  crew_id: string;
  crew_type_name: string;
  quantity: number;
  price_per_day: string;
  total_price: string;
}

export interface BookingDetails {
  booking_id: string;
  booking_reference: string;
  status: string;

  shoot_name: string;
  rating: number;
  review: string;

  rental_start_date: string;
  rental_end_date: string;
  total_rental_days: number;

  sku_items: BookingDetailsItem[];
  crew_items: BookingDetailsCrewItem[];

  admin_approval: string; // "True" | "False"

  invoice_status: string;
  invoice_id: string;

  sku_amount: string;
  crew_amount: string;
  coupon_discount_amount: string;

  CGST_amount: string;
  IGST_amount: string;
  SGST_amount: string;

  total_amount: string;
  advanced_amount: string;
  payment_type: string;
  final_amount: string;

  delivery_type: string;
  address_id: string;

  start_otp: string | null;
  return_otp: string | null;
  start_otp_verified_at: string | null;
  return_otp_verified_at: string | null;

  created_at: string;
  updated_at: string;
}
