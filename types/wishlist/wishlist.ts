import { SKU } from "../products/product";

export interface WishlistItem {
  wishlist_id: string;

  sku_id: string;
  user_id: string;
  id: string;
  sku_name: string;
  sku_category: string;
  created_at: string;
}

export interface AddToWishlistRequest {
  sku_id: string;
  sku_name: string;
}

export interface AddToWishlistResponse {
  wishlist_id: string;

  sku_id: string;
  user_id: string;
  id: string;
  sku_name: string;
  sku_category: string;
  created_at: string;
}

export interface GetWishlistResponse {
  items: WishlistItem[];
  total: number;
}

export type DeleteWishlistResponse = WishlistItem[];
