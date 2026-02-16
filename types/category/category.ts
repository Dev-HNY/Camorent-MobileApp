export interface Category {
  category_id: string;
  name: string;
  id: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface SubCategory {
  subcategory_id: string;
  category_id: string;
  name: string;
  id: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  meta?: Record<string, unknown>;
}

export interface SubCategoriesResponse {
  data: SubCategory[];
  meta?: Record<string, unknown>;
}
