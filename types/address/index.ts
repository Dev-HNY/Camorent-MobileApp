import { z } from "zod";

// Address form schemas
export const deliveryAddressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  pincode: z.string().min(1, "Pincode is required").regex(/^\d{6}$/, "Pincode must be 6 digits"),
  city: z.string().min(1, "City is required"),
  state_country: z.string().min(1, "State & Country is required"),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  mobile_number: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  delivery_instructions: z.string().optional(),
  is_self_pickup: z.boolean().default(false).optional(),
  full_name: z.string().optional(),
});

export const pickupPersonSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  mobile_number: z.string().optional(),
  is_self_pickup: z.boolean().default(false).optional(),
  pickup_location_id: z.string().min(1, "Please select a pickup location"),
});

// TypeScript types
export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;
export type PickupPersonFormData = z.infer<typeof pickupPersonSchema>;

// API response types
export interface Address {
  address_id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "delivery" | "billing";
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}
