import { SKU, SKUDetail } from "@/types/products/product";

/**
 * Converts SKUDetail to SKU format for cart operations
 */
export function skuDetailToSKU(skuDetail: SKUDetail): SKU {
  return {
    sku_id: skuDetail.sku_id,
    name: skuDetail.name,
    id: skuDetail.id,
    brand: skuDetail.brand,
    category_id: skuDetail.category_id,
    subcategory_id: skuDetail.subcategory_id,
    price_per_day: skuDetail.price_per_day,
    primary_image_url: skuDetail.primary_image_url?.image_url,
    tags: skuDetail.tags,
    is_active: skuDetail.is_active,
    avg_rating: skuDetail.avg_rating,
    review_count: skuDetail.review_count,
  };
}
