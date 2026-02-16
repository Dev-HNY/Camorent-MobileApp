import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKVStorage } from "@/lib/mmkv";
import { Coupon, AppliedCoupon } from "@/types/coupon/coupon";
import { BaseStoreState, BaseStoreActions } from "@/types/store/common";

interface CouponStore extends BaseStoreState, BaseStoreActions {
  coupons: Coupon[];
  appliedCoupon: AppliedCoupon | null;

  loadCoupons: () => void;
  applyCoupon: (couponCode: string, cartTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (coupon: Coupon, cartTotal: number) => number;
  validateCoupon: (coupon: Coupon, cartTotal: number) => { valid: boolean; message: string };
}

const STORAGE_KEY = "camorent-coupon-store";

// Sample coupon data - replace with API call
const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "RAINY50",
    title: "Get flat 50% off",
    description: "Use code RAINY50 to get 50% off on your order",
    discount: 50,
    discountType: "percentage",
    minAmount: 5000,
    maxDiscount: 2000,
    validFrom: "01-01-2025",
    validTill: "31-12-2025",
    isActive: true,
  },
  {
    id: "2",
    code: "ICICI30",
    title: "Get flat 30% off",
    description: "Use ICICI debit card to claim this offer",
    discount: 30,
    discountType: "percentage",
    minAmount: 3000,
    maxDiscount: 1500,
    validFrom: "01-01-2025",
    validTill: "23-07-2026",
    isActive: true,
  },
  {
    id: "3",
    code: "FIRST500",
    title: "Get ₹500 off",
    description: "First time user discount of ₹500",
    discount: 500,
    discountType: "flat",
    minAmount: 2000,
    validFrom: "01-01-2025",
    validTill: "31-12-2025",
    isActive: true,
  },
  {
    id: "4",
    code: "HDFC25",
    title: "Get flat 25% off",
    description: "Use HDFC credit card to claim this offer",
    discount: 25,
    discountType: "percentage",
    minAmount: 2500,
    maxDiscount: 1000,
    validFrom: "01-01-2025",
    validTill: "30-06-2026",
    isActive: true,
  },
  {
    id: "5",
    code: "FLAT1000",
    title: "Get ₹1000 off",
    description: "Flat ₹1000 discount on orders above ₹8000",
    discount: 1000,
    discountType: "flat",
    minAmount: 8000,
    validFrom: "01-01-2025",
    validTill: "31-12-2025",
    isActive: true,
  },
  {
    id: "6",
    code: "CAMERA20",
    title: "Get 20% off on cameras",
    description: "Special discount on camera rentals",
    discount: 20,
    discountType: "percentage",
    minAmount: 4000,
    maxDiscount: 1200,
    validFrom: "01-01-2025",
    validTill: "31-12-2025",
    isActive: true,
  },
  {
    id: "7",
    code: "WEEKEND15",
    title: "Get 15% off on weekend bookings",
    description: "Valid for Saturday and Sunday bookings",
    discount: 15,
    discountType: "percentage",
    minAmount: 3000,
    maxDiscount: 800,
    validFrom: "01-01-2025",
    validTill: "31-12-2025",
    isActive: true,
  },
];

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: [],
      appliedCoupon: null,
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      loadCoupons: () => {
        // In real app, this would be an API call
        set({ coupons: mockCoupons });
      },

      validateCoupon: (coupon: Coupon, cartTotal: number) => {
        if (!coupon.isActive) {
          return { valid: false, message: "This coupon is not active" };
        }

        // Check minimum amount
        if (cartTotal < coupon.minAmount) {
          return {
            valid: false,
            message: `Add items worth ₹${coupon.minAmount - cartTotal} more to apply this coupon`,
          };
        }

        // Check date validity
        const today = new Date();
        const validFrom = parseDateString(coupon.validFrom);
        const validTill = parseDateString(coupon.validTill);

        if (today < validFrom) {
          return { valid: false, message: "This coupon is not valid yet" };
        }

        if (today > validTill) {
          return { valid: false, message: "This coupon has expired" };
        }

        return { valid: true, message: "Coupon is valid" };
      },

      calculateDiscount: (coupon: Coupon, cartTotal: number) => {
        if (coupon.discountType === "flat") {
          return coupon.discount;
        } else {
          // Percentage discount
          const discountAmount = (cartTotal * coupon.discount) / 100;
          if (coupon.maxDiscount) {
            return Math.min(discountAmount, coupon.maxDiscount);
          }
          return discountAmount;
        }
      },

      applyCoupon: (couponCode: string, cartTotal: number) => {
        const state = get();
        const coupon = state.coupons.find(
          (c) => c.code.toLowerCase() === couponCode.toLowerCase()
        );

        if (!coupon) {
          return { success: false, message: "Invalid coupon code" };
        }

        const validation = state.validateCoupon(coupon, cartTotal);
        if (!validation.valid) {
          return { success: false, message: validation.message };
        }

        const discountAmount = state.calculateDiscount(coupon, cartTotal);

        set({
          appliedCoupon: {
            coupon,
            discountAmount,
            appliedAt: new Date(),
          },
        });

        // Trigger cart summary recalculation
        try {
          const { useCartStore } = require('@/store/cart/cart');
          useCartStore.getState().calculateSummary();
        } catch (error) {
          // Cart store not available
        }

        return {
          success: true,
          message: `Coupon applied! You saved ₹${Math.round(discountAmount)}`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });

        // Trigger cart summary recalculation
        try {
          const { useCartStore } = require('@/store/cart/cart');
          useCartStore.getState().calculateSummary();
        } catch (error) {
          // Cart store not available
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => MMKVStorage),
      partialize: (state) => ({
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);

function parseDateString(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
