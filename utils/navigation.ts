import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

/**
 * Safe navigation helper with error handling and haptics
 */
export const navigate = {
  /**
   * Navigate to a route with haptic feedback
   */
  push: (href: string, options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push(href as any);
    } catch (error) {
      console.error('Navigation error (push):', error);
      // Fallback: try replace
      try {
        router.replace(href as any);
      } catch (fallbackError) {
        console.error('Navigation fallback failed:', fallbackError);
      }
    }
  },

  /**
   * Replace current route with haptic feedback
   */
  replace: (href: string, options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.replace(href as any);
    } catch (error) {
      console.error('Navigation error (replace):', error);
    }
  },

  /**
   * Go back with haptic feedback
   */
  back: (options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to home if can't go back
        router.replace('/(tabs)/(home)' as any);
      }
    } catch (error) {
      console.error('Navigation error (back):', error);
      // Fallback to home
      try {
        router.replace('/(tabs)/(home)' as any);
      } catch (fallbackError) {
        console.error('Navigation fallback failed:', fallbackError);
      }
    }
  },

  /**
   * Navigate to home screen
   */
  toHome: (options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.replace('/(tabs)/(home)' as any);
    } catch (error) {
      console.error('Navigation error (toHome):', error);
    }
  },

  /**
   * Navigate to product details
   */
  toProduct: (productId: string, options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push(`/product/${productId}` as any);
    } catch (error) {
      console.error('Navigation error (toProduct):', error);
    }
  },

  /**
   * Navigate to cart
   */
  toCart: (options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push('/cart' as any);
    } catch (error) {
      console.error('Navigation error (toCart):', error);
    }
  },

  /**
   * Navigate to categories with optional category filter
   */
  toCategories: (categoryId?: string, options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const href = categoryId
        ? `/categories?category=${categoryId}`
        : '/categories';
      router.push(href as any);
    } catch (error) {
      console.error('Navigation error (toCategories):', error);
    }
  },

  /**
   * Navigate to order details
   */
  toOrderDetails: (orderId: string, options?: { haptic?: boolean }) => {
    try {
      if (options?.haptic !== false) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push(`/(tabs)/(shoots)/order-details?orderId=${orderId}` as any);
    } catch (error) {
      console.error('Navigation error (toOrderDetails):', error);
    }
  },

  /**
   * Check if can go back
   */
  canGoBack: () => {
    try {
      return router.canGoBack();
    } catch (error) {
      console.error('Navigation error (canGoBack):', error);
      return false;
    }
  },

  /**
   * Navigate with dismiss (for modals)
   */
  dismiss: (count?: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.dismiss(count);
    } catch (error) {
      console.error('Navigation error (dismiss):', error);
      // Fallback to back
      try {
        router.back();
      } catch (fallbackError) {
        console.error('Navigation fallback failed:', fallbackError);
      }
    }
  },
};

/**
 * Deep link handling helpers
 */
export const deepLink = {
  /**
   * Parse deep link URL
   */
  parse: (url: string): { path: string; params: Record<string, string> } | null => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const params: Record<string, string> = {};

      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return { path, params };
    } catch (error) {
      console.error('Deep link parsing error:', error);
      return null;
    }
  },

  /**
   * Handle deep link navigation
   */
  handle: (url: string): boolean => {
    try {
      const parsed = deepLink.parse(url);
      if (!parsed) return false;

      const { path, params } = parsed;

      // Route mapping
      if (path.startsWith('/product/')) {
        const productId = path.split('/product/')[1];
        navigate.toProduct(productId);
        return true;
      }

      if (path === '/cart') {
        navigate.toCart();
        return true;
      }

      if (path.startsWith('/categories')) {
        navigate.toCategories(params.category);
        return true;
      }

      if (path.startsWith('/shoots/')) {
        const orderId = path.split('/shoots/')[1];
        navigate.toOrderDetails(orderId);
        return true;
      }

      // Default: try to navigate to the path
      router.push(path as any);
      return true;
    } catch (error) {
      console.error('Deep link handling error:', error);
      return false;
    }
  },
};

/**
 * Navigation guards
 */
export const navigationGuard = {
  /**
   * Check if user is authenticated before navigation
   */
  requireAuth: (
    nextRoute: string,
    isAuthenticated: boolean,
    loginRoute = '/(auth)/login'
  ): boolean => {
    if (!isAuthenticated) {
      router.replace(loginRoute as any);
      return false;
    }
    return true;
  },

  /**
   * Redirect if already authenticated
   */
  redirectIfAuth: (
    nextRoute: string,
    isAuthenticated: boolean,
    defaultRoute = '/(tabs)/(home)'
  ): boolean => {
    if (isAuthenticated) {
      router.replace(defaultRoute as any);
      return false;
    }
    return true;
  },
};
