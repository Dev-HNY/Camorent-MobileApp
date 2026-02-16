import { SKU } from "@/types/products/product";

export interface APICartSkuItem {
  sku_id: string;
  quantity: number;
  price_per_day: string;
  added_at: string;
}

export interface APICartCrewItem {
  crew_type_id: string;
  quantity: number;
  price_per_day: string;
  added_at: string;
}

export interface APICartResponse {
  cart_id: string;
  user_id: string;
  sku_items: APICartSkuItem[];
  crew_items: APICartCrewItem[];
  total_items: number;
  total_amount: string;
  sku_amount: number;
  crew_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: SKU;
  quantity: number;
  totalPrice: number;
  addedAt: Date;
}

export interface CrewCartItem {
  id: string;
  crew_name: string;
  crew_type_id: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  crew_price_0_12: string;
  crew_price_12_18: string;
  crew_price_18_24: string;
}

export interface CartSummary {
  itemsSubtotal: number; // Products only
  crewSubtotal: number; // Crew only
  //  camocarePrice: number; // Camocare add-on
  subtotal: number; // itemsSubtotal + crewSubtotal + camocarePrice

  total: number;
  itemCount: number;
  crewCount: number;
  totalDays: number;
}

export interface RentalDateRange {
  startDate: string;
  endDate: string;
}
