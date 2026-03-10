export interface SKUImage {
  image_id: string;
  image_url: string;
  priority: number;
  image_type: string;
  alt_text: string;
  created_at: string;
}
export interface SearchSKUResult {
  sku_id: string;
  id: string;
  name: string;
  brand: string;
  primary_image: SKUImage;
}
export interface SKU {
  sku_id: string;
  name: string;
  id: string;
  brand: string;
  category_id: string;
  subcategory_id: string;
  price_per_day: string;
  primary_image_url: string | undefined;
  tags: string[] | null;
  is_active: boolean;
  avg_rating: string;
  review_count: number;
}

export interface SKUMetrics {
  times_used: number;
  avg_rating: string;
  review_count: number;
}

export interface SKUDetail {
  sku_id: string;
  name: string;
  id: string;
  brand: string;
  rating: number;
  model_id: string | null;
  category_id: string;
  subcategory_id: string;
  top_specs_list: string[];
  description: string;
  specifications: Record<string, unknown> | null;
  selection: string[];
  price_per_day: string;
  minimum_rental_duration: number;
  maximum_rental_duration: number;
  security_deposit: string;
  replacement_value: string;
  unit_of_measure: string;
  value_of_measure: string;
  warranty_period_months: number;
  images: SKUImage[];
  primary_image_url: SKUImage;
  instruction_manual_url: string | null;
  included_accessories: string[] | null;
  tags: string[] | null;
  notes: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  times_used: number;
  avg_rating: string;
  review_count: number;
}

export interface SKUsResponse {
  data: SKU[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_next?: boolean;
    has_prev?: boolean;
  };
}

export interface SKUQueryParams {
  category_id?: string;
  subcategory_id?: string;
  selection?: string;
  limit?: number;
  page?: number;
  is_active: boolean;
  brand?: string;
  q?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory?: string;
  brand: string;
  availability: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: string;
}

export type ProductSortBy = "name" | "price" | "rating" | "newest";
export type SortOrder = "asc" | "desc";
