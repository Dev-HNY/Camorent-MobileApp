import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKVStorage } from "@/lib/mmkv";
import {
  CartItem,
  CartSummary,
  CrewCartItem,
  RentalDateRange,
} from "@/types/cart/cart";
import { SKU } from "@/types/products/product";
import { BaseStoreState, BaseStoreActions } from "@/types/store/common";
import { calculateRentalDays } from "@/utils/date";

type CartProduct = SKU;

interface CartStore extends BaseStoreState, BaseStoreActions {
  items: CartItem[];
  crewItems: CrewCartItem[];
  summary: CartSummary;
  rentalDates: RentalDateRange | null;
  shootName: string;
  // isCamocareAdded: boolean;
  bookingId: string | null;
  draftAddress: {
    name?: string;
    district?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  selectedAddress: {
    address_id?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode?: string;
    full_name: string;
    mobile_number: string;
    is_self_pickup: boolean;
  } | null;

  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  getCartItem: (productId: string) => CartItem | undefined;
  getCartItemCount: () => number;
  getTotalPrice: () => number;

  setRentalDates: (dates: RentalDateRange) => void;
  setShootName: (name: string) => void;
  calculateRentalDays: () => number;
  calculateSummary: () => void;
  recalculateAllItemPrices: () => void;
  generateCartItemId: (productId: string) => string;
  validateAndUpdateDates: () => void;

  // toggleCamocare: () => void;

  // Crew-specific methods
  addOrUpdateCrew: (crew: CrewCartItem) => void;
  removeCrew: () => void;
  getCrewItem: () => CrewCartItem | undefined;
  updateCrewQuantity: (crewId: string, quantity: number) => void;

  // Booking methods
  setBookingId: (bookingId: string) => void;
  clearBookingId: () => void;

  // Draft address methods
  setDraftAddress: (address: {
    name?: string;
    district?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  clearDraftAddress: () => void;
  setSelectedAddress: (address: {
    address_id?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode?: string;
    full_name: string;
    mobile_number: string;
    is_self_pickup: boolean;
  }) => void;
  clearSelectedAddress: () => void;
}

const STORAGE_KEY = "camorent-cart-store";

const initialSummary: CartSummary = {
  itemsSubtotal: 0,
  crewSubtotal: 0,
  // camocarePrice: 0,
  subtotal: 0,
  total: 0,
  itemCount: 0,
  crewCount: 0,
  totalDays: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      crewItems: [],
      summary: initialSummary,
      rentalDates: null,
      shootName: "",
      // isCamocareAdded: false,
      bookingId: null,
      draftAddress: null,
      selectedAddress: null,
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setBookingId: (bookingId: string) => set({ bookingId }),
      clearBookingId: () => set({ bookingId: null }),

      setDraftAddress: (address) => set({ draftAddress: address }),
      clearDraftAddress: () => set({ draftAddress: null }),
      setSelectedAddress: (address) => set({ selectedAddress: address }),
      clearSelectedAddress: () => set({ selectedAddress: null }),

      setShootName: (name: string) => set({ shootName: name }),

      addToCart: (product: CartProduct, quantity = 1) => {
        const state = get();
        const productId = product.id;
        const existingItem = state.getCartItem(productId);
        const rentalDays = state.calculateRentalDays() || 1;

        if (existingItem) {
          const updatedItems = state.items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  totalPrice: calculateItemPrice(
                    product,
                    item.quantity + quantity,
                    rentalDays
                  ),
                }
              : item
          );
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: state.generateCartItemId(productId),
            productId: product.id,
            product: product,
            quantity,
            totalPrice: calculateItemPrice(product, quantity, rentalDays),
            addedAt: new Date(),
          };
          set({ items: [...state.items, newItem] });
        }

        get().calculateSummary();
      },

      removeFromCart: (itemId: string) => {
        const items = get().items.filter((item) => item.id !== itemId);
        set({ items });
        get().calculateSummary();
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const rentalDays = get().calculateRentalDays() || 1;
        const items = get().items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                totalPrice: calculateItemPrice(
                  item.product,
                  quantity,
                  rentalDays
                ),
              }
            : item
        );
        set({ items });
        get().calculateSummary();
      },

      clearCart: () => {
        set({
          items: [],
          crewItems: [],
          summary: initialSummary,
          rentalDates: null,
          shootName: "",
          // isCamocareAdded: false,
          bookingId: null,
          draftAddress: null,
          selectedAddress: null,
        });
      },

      // toggleCamocare: () => {
      //   // set({ isCamocareAdded: !get().isCamocareAdded });
      //   get().calculateSummary(); // Recalculate summary when camocare is toggled
      // },

      getCartItem: (productId: string) => {
        return get().items.find((item) => item.productId === productId);
      },

      getCartItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().summary.total;
      },

      setRentalDates: (dates: RentalDateRange) => {
        set({ rentalDates: dates });
        // Recalculate all item prices with new rental days
        get().recalculateAllItemPrices();
        get().calculateSummary();
      },

      calculateRentalDays: () => {
        const { rentalDates } = get();
        if (!rentalDates) return 0;

        return calculateRentalDays(rentalDates);
      },

      recalculateAllItemPrices: () => {
        const state = get();
        const rentalDays = state.calculateRentalDays() || 1;

        const updatedItems = state.items.map((item) => ({
          ...item,
          totalPrice: calculateItemPrice(
            item.product,
            item.quantity,
            rentalDays
          ),
        }));

        set({ items: updatedItems });
      },

      calculateSummary: () => {
        const { items, crewItems } = get();

        // Calculate subtotals
        const itemsSubtotal = items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        const crewSubtotal = crewItems.reduce(
          (sum, crew) => sum + crew.totalPrice,
          0
        );
        //    const camocarePrice = isCamocareAdded ? 65 : 0; // Rs 65 for camocare
        const subtotal = itemsSubtotal + crewSubtotal;
        const total = subtotal;

        const itemCount = items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        const crewCount = crewItems.reduce(
          (count, crew) => count + crew.quantity,
          0
        );
        const totalDays = get().calculateRentalDays();

        set({
          summary: {
            itemsSubtotal,
            crewSubtotal,
            // camocarePrice,
            subtotal,
            total,
            itemCount,
            crewCount,
            totalDays,
          },
        });
      },

      generateCartItemId: (productId: string) => {
        return `cart_item_${productId}_${Date.now()}`;
      },

      // Crew-specific methods
      getCrewItem: () => {
        return get().crewItems[0]; // Only one crew allowed
      },

      addOrUpdateCrew: (crew: CrewCartItem) => {
        const state = get();
        const rentalDays = state.calculateRentalDays() || 1;

        // Calculate total price
        const totalPrice = crew.price_per_day * crew.quantity * rentalDays;

        // Only one crew allowed, so replace existing
        set({ crewItems: [{ ...crew, totalPrice }] });
        get().calculateSummary();
      },

      updateCrewQuantity: (crewId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeCrew();
          return;
        }

        const rentalDays = get().calculateRentalDays() || 1;
        const crewItems = get().crewItems.map((crew) =>
          crew.id === crewId
            ? {
                ...crew,
                quantity,
                totalPrice: crew.price_per_day * quantity * rentalDays,
              }
            : crew
        );
        set({ crewItems });
        get().calculateSummary();
      },

      removeCrew: () => {
        set({ crewItems: [] });
        get().calculateSummary();
      },

      validateAndUpdateDates: () => {
        const { rentalDates } = get();
        if (!rentalDates) return;

        // Parse the stored dates (format: DD-MM-YYYY)
        const parseDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day);
        };

        const startDate = parseDate(rentalDates.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If start date is in the past, update to today and tomorrow
        if (startDate < today) {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          const formatDate = (date: Date) => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          };

          const updatedDates: RentalDateRange = {
            startDate: formatDate(today),
            endDate: formatDate(tomorrow),
          };

          set({ rentalDates: updatedDates });
          get().recalculateAllItemPrices();
          get().calculateSummary();
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => MMKVStorage),
      partialize: (state) => ({
        items: state.items,
        crewItems: state.crewItems,
        summary: state.summary,
        //rentalDates: state.rentalDates,
        shootName: state.shootName,
        //  isCamocareAdded: state.isCamocareAdded,
        bookingId: state.bookingId,
        // draftAddress: state.draftAddress,
        // selectedAddress: state.selectedAddress,
      }),
    }
  )
);

function calculateItemPrice(
  product: SKU,
  quantity: number,
  rentalDays: number = 1
): number {
  if (!product.price_per_day) return 0;
  const priceStr =
    typeof product.price_per_day === "string"
      ? product.price_per_day
      : String(product.price_per_day);
  const basePrice = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  // For regular products, multiply by rental days
  return basePrice * quantity * rentalDays;
}
