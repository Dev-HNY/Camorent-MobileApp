import { SortOption } from "@/components/CDP/SortSheet";
import { getPriceValue } from "./product-filters";
import { SKU } from "@/types/products/product";

interface Product {
  id: number;
  name: string;
  price_per_day: string;
}

export const applySorting = (
  products: SKU[],
  sortOption: SortOption
): SKU[] => {
  return [...products].sort((a, b) => {
    switch (sortOption.type) {
      case "price": {
        const priceA = getPriceValue(a.price_per_day);
        const priceB = getPriceValue(b.price_per_day);
        return sortOption.order === "asc" ? priceA - priceB : priceB - priceA;
      }

      case "name":
        return sortOption.order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      // case "recent":
      //   return sortOption.order === "desc" ? b.something for recent? - a.id : a.id - b.id;

      default:
        return 0;
    }
  });
};

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { type: "price", order: "asc", label: "Price: Low to High" },
  { type: "price", order: "desc", label: "Price: High to Low" },
  { type: "name", order: "asc", label: "Name: A to Z" },
  { type: "name", order: "desc", label: "Name: Z to A" },
  { type: "recent", order: "desc", label: "Most Recent" },
];

export const DEFAULT_SORT_OPTION: SortOption = {
  type: "recent",
  order: "desc",
  label: "Most Recent",
};
