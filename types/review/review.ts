export interface UpdateReviewRequest {
  rating: number;
  comment?: string;
  phone_num?: string;
  email?: string;
}
export interface Review {
  review_id: string;
  user_id: string;
  sku_id: string;
  comment: string;
  booking_id: string;
  rating: number;
  phone_num: string;
  email: string;
  user_name: string;
  user_role: string;
  created_at: string;
  updated_at: string;
}
