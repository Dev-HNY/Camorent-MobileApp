import { FilterState } from "@/components/CDP/FilterSheet";
import { SKU } from "@/types/products/product";

export const getPriceValue = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

const matchesPriceRange = (price: number, range: string): boolean => {
  if (range === "₹0 - ₹500") return price >= 0 && price <= 500;
  if (range === "₹500 - ₹1000") return price > 500 && price <= 1000;
  if (range === "₹1000 - ₹2000") return price > 1000 && price <= 2000;
  if (range === "₹2000 - ₹5000") return price > 2000 && price <= 5000;
  if (range === "₹5000+") return price > 5000;
  return false;
};

interface FilterOptions {
  category?: string;
  subcategory?: string;
  filters: FilterState;
}

export const filterProducts = (
  products: SKU[],
  options: FilterOptions
): SKU[] => {
  return products.filter((product) => {
    if (options.category) {
      const productCategory = product.category_id;
      if (productCategory !== options.category) {
        return false;
      }
    }

    if (options.subcategory) {
      const productSubcategory = product.subcategory_id;
      if (productSubcategory !== options.subcategory) {
        return false;
      }
    }

    if (options.filters.priceRange.length > 0) {
      const priceString = product.price_per_day;
      const price = getPriceValue(priceString);
      const matchesPrice = options.filters.priceRange.some((range) =>
        matchesPriceRange(price, range)
      );
      if (!matchesPrice) return false;
    }

    if (options.filters.brands.length > 0) {
      if (!options.filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // Availability filter
    if (options.filters.availability.length > 0) {
      const availability =
        "available" in product
          ? product.available
            ? "In Stock"
            : "Out of Stock"
          : (product as any).availability;
      if (!options.filters.availability.includes(availability)) {
        return false;
      }
    }

    return true;
  });
};

export const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.priceRange.length > 0 ||
    filters.brands.length > 0 ||
    filters.availability.length > 0
  );
};

export const getActiveFilterCount = (filters: FilterState): number => {
  return (
    filters.priceRange.length +
    filters.brands.length +
    filters.availability.length
  );
};

export const createEmptyFilters = (): FilterState => ({
  priceRange: [],
  brands: [],
  availability: [],
});
