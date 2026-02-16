/**
 * Booking data formatting utilities
 * Transforms backend booking data into UI-ready formats
 */

import type { Address } from "@/types/address";
import { formatBookingDate, formatDateRange } from "./dateFormatters";

// Types for formatted data
export interface FormattedShootData {
  dates: string;
  startTime: string;
}

export interface FormattedAddressData {
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface FormattedProductData {
  id: string;
  name: string;
  quantity: number;
  days: number;
  price: number;
}

export interface FormattedCrewData {
  id: string;
  name: string;
  quantity: number;
  days: number;
  price: number;
  image: string;
}

export interface FormattedBillDetails {
  itemTotal: number;
  crewTotal: number;
  gstCharges: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount: number;
}

/**
 * Formats shoot data for display
 */
export function formatShootData(
  bookingDetails?: {
    rental_start_date: string;
    rental_end_date: string;
  },
  rentalDates?: {
    startDate: string;
    endDate: string;
  }
): FormattedShootData {
  const dates = bookingDetails
    ? formatDateRange(
        formatBookingDate(bookingDetails.rental_start_date),
        formatBookingDate(bookingDetails.rental_end_date)
      )
    : rentalDates
    ? formatDateRange(rentalDates.startDate, rentalDates.endDate)
    : "";

  return {
    dates,
    startTime: "8:00 am", // TODO: Make this dynamic if needed
  };
}

/**
 * Formats address data for display
 */
export function formatAddressData(
  addresses?: Address[],
  addressId?: string
): FormattedAddressData {
  if (!addresses || !addressId) {
    return {
      address: "No address selected",
      city: "-",
      state: "-",
      pinCode: "-",
    };
  }

  const deliveryAddress = addresses.find(
    (addr) => addr.address_id === addressId
  );

  if (!deliveryAddress) {
    return {
      address: "No address selected",
      city: "-",
      state: "-",
      pinCode: "-",
    };
  }

  return {
    address: `${deliveryAddress.address_line1}${
      deliveryAddress.address_line2 ? ", " + deliveryAddress.address_line2 : ""
    }`,
    city: deliveryAddress.city,
    state: deliveryAddress.state,
    pinCode: deliveryAddress.pincode,
  };
}

/**
 * Formats product/SKU items for display
 */
export function formatProductData(
  skuItems?: Array<{
    id: string;
    name: string;
    quantity: number;
    total_price: string;
  }>,
  rentalDays?: number
): FormattedProductData[] {
  if (!skuItems) return [];

  return skuItems.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    days: rentalDays || 3,
    price: parseFloat(item.total_price),
  }));
}

/**
 * Formats crew items for display
 */
export function formatCrewData(
  crewItems?: Array<{
    crew_item_id: string;
    crew_type_name: string;
    quantity: number;
    total_price: string;
    crew_id: string;
  }>,
  rentalDays?: number
): FormattedCrewData[] {
  if (!crewItems) return [];

  return crewItems.map((crew) => ({
    id: crew.crew_item_id,
    name: crew.crew_type_name,
    quantity: crew.quantity,
    days: rentalDays || 3,
    price: parseFloat(crew.total_price),
    image: `https://img.camorent.co.in/crews/images/${crew.crew_id}.webp`,
  }));
}

/**
 * Formats bill details for display
 */
export function formatBillDetails(
  bookingDetails?: {
    sku_amount?: string;
    crew_amount?: string;
    gstCharges?: string;
    CGST_amount?: string;
    SGST_amount?: string;
    IGST_amount?: string;
    total_amount: string;
  },
  summary?: {
    itemsSubtotal: number;
    crewSubtotal: number;
    gstCharges: number;
    total: number;
  }
): FormattedBillDetails {
  if (bookingDetails) {
    const cgst = bookingDetails.CGST_amount
      ? parseFloat(bookingDetails.CGST_amount)
      : 0;
    const sgst = bookingDetails.SGST_amount
      ? parseFloat(bookingDetails.SGST_amount)
      : 0;
    const igst = bookingDetails.IGST_amount
      ? parseFloat(bookingDetails.IGST_amount)
      : 0;

    // Calculate total GST charges
    const totalGst = cgst + sgst + igst;

    return {
      itemTotal: Math.round(
        parseFloat(bookingDetails.sku_amount || "0")
      ),
      crewTotal: Math.round(
        parseFloat(bookingDetails.crew_amount || "0")
      ),
      gstCharges: Math.round(totalGst),
      cgstAmount: cgst > 0 ? Math.round(cgst) : undefined,
      sgstAmount: sgst > 0 ? Math.round(sgst) : undefined,
      igstAmount: igst > 0 ? Math.round(igst) : undefined,
      totalAmount: Math.round(parseFloat(bookingDetails.total_amount)),
    };
  }

  if (summary) {
    return {
      itemTotal: Math.round(summary.itemsSubtotal),
      crewTotal: Math.round(summary.crewSubtotal),
      gstCharges: Math.round(summary.gstCharges),
      totalAmount: Math.round(summary.total),
    };
  }

  return {
    itemTotal: 0,
    crewTotal: 0,
    gstCharges: 0,
    totalAmount: 0,
  };
}

/**
 * All-in-one formatter for booking payment data
 * Returns all formatted data needed for payment page
 */
export function formatBookingPaymentData(
  bookingDetails?: any,
  rentalDates?: any,
  addresses?: Address[],
  summary?: any,
  calculateRentalDays?: () => number
) {
  const rentalDays =
    bookingDetails?.total_rental_days || calculateRentalDays?.() || 3;

  return {
    shootData: formatShootData(bookingDetails, rentalDates),
    addressData: formatAddressData(addresses, bookingDetails?.address_id),
    productData: formatProductData(bookingDetails?.sku_items, rentalDays),
    crewData: formatCrewData(bookingDetails?.crew_items, rentalDays),
    billDetails: formatBillDetails(bookingDetails, summary),
    rentalDays,
  };
}
