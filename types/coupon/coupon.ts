export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number; // percentage or flat amount
  discountType: "percentage" | "flat";
  minAmount: number;
  maxDiscount?: number; // max discount amount for percentage type
  validFrom: string;
  validTill: string;
  isActive: boolean;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
  appliedAt: Date;
}
