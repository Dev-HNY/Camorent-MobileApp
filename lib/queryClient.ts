/**
 * Centralized React Query Configuration
 *
 * Features:
 * - Optimized caching strategy
 * - Automatic background refetch
 * - Retry logic for failed requests
 * - Memory-efficient settings
 * - Offline support
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache Configuration
      gcTime: 1000 * 60 * 5, // 5 minutes - garbage collection time
      staleTime: 1000 * 60 * 2, // 2 minutes - data stays fresh

      // Refetch Configuration
      refetchOnWindowFocus: true, // Refetch when app comes to foreground
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: true, // Refetch when component mounts

      // Retry Configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, 404
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 403) return false;
        if (error?.response?.status === 404) return false;

        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Performance
      networkMode: 'offlineFirst', // Works offline with cached data
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,

      // Network mode
      networkMode: 'online', // Only run mutations when online
    },
  },
});

/**
 * Query Keys - Centralized for easy cache invalidation
 */
export const queryKeys = {
  // Auth
  currentUser: ['currentUser'] as const,
  userPreferences: ['userPreferences'] as const,

  // Products
  products: (params?: any) => ['products', params] as const,
  product: (id: string) => ['product', id] as const,
  productReviews: (skuId: string) => ['productReviews', skuId] as const,
  productRatingStats: (skuId: string) => ['productRatingStats', skuId] as const,

  // Cart
  cart: ['cart'] as const,

  // Wishlist
  wishlist: ['wishlist'] as const,
  wishlistCount: ['wishlistCount'] as const,

  // Bookings/Shoots
  bookings: ['bookings'] as const,
  booking: (id: string) => ['booking', id] as const,
  bookingInvoice: (bookingId: string, invoiceId: string) =>
    ['bookingInvoice', bookingId, invoiceId] as const,

  // Addresses
  addresses: ['addresses'] as const,

  // Cities
  cities: ['cities'] as const,

  // Categories & Brands
  categories: ['categories'] as const,
  brands: ['brands'] as const,
} as const;

/**
 * Cache Invalidation Helpers
 */
export const invalidateQueries = {
  // Invalidate after cart operations
  afterCartUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart });
  },

  // Invalidate after wishlist operations
  afterWishlistUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlistCount });
  },

  // Invalidate after booking operations
  afterBookingUpdate: (bookingId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    if (bookingId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
    }
  },

  // Invalidate after user updates
  afterUserUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    queryClient.invalidateQueries({ queryKey: queryKeys.userPreferences });
  },

  // Clear all cache
  clearAll: () => {
    queryClient.clear();
  },
};

/**
 * Prefetch Helpers - Improve perceived performance
 */
export const prefetchQueries = {
  // Prefetch products when user is browsing
  products: async (params?: any) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products(params),
      staleTime: 1000 * 60 * 5, // Keep prefetched data for 5 minutes
    });
  },

  // Prefetch cart when user is shopping
  cart: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.cart,
      staleTime: 1000 * 60 * 2,
    });
  },
};

/**
 * Optimistic Update Helpers
 */
export const optimisticUpdates = {
  // Optimistic cart update
  updateCart: (updater: (old: any) => any) => {
    queryClient.setQueryData(queryKeys.cart, updater);
  },

  // Optimistic wishlist update
  updateWishlist: (updater: (old: any) => any) => {
    queryClient.setQueryData(queryKeys.wishlist, updater);
  },
};

/**
 * Cache Persistence Configuration
 * Uses MMKV for fast, secure storage
 */
export const cacheConfig = {
  // Maximum cache size (in bytes)
  maxSize: 1024 * 1024 * 10, // 10MB

  // Persist these queries to storage
  persistQueries: [
    'currentUser',
    'userPreferences',
    'cart',
    'wishlist',
    'addresses',
  ],

  // Don't persist these (too large or too dynamic)
  noPersistQueries: [
    'products', // Too large, fetch when needed
    'productReviews', // Dynamic content
  ],
};

export default queryClient;
