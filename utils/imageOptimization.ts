/**
 * Image Optimization Utilities
 * Provides image caching, compression, and loading strategies
 */

import { Image } from 'expo-image';
import { Platform } from 'react-native';

/**
 * Image Cache Policies
 */
export const ImageCachePolicy = {
  MEMORY: 'memory' as const,
  DISK: 'disk' as const,
  MEMORY_DISK: 'memory-disk' as const,
  NONE: 'none' as const,
};

/**
 * Image Content Fit Modes
 */
export const ImageContentFit = {
  COVER: 'cover' as const,
  CONTAIN: 'contain' as const,
  FILL: 'fill' as const,
  NONE: 'none' as const,
  SCALE_DOWN: 'scale-down' as const,
};

/**
 * Get optimized image cache policy based on image type
 */
export const getImageCachePolicy = (imageType: 'product' | 'avatar' | 'banner' | 'thumbnail') => {
  switch (imageType) {
    case 'product':
      return ImageCachePolicy.MEMORY_DISK; // Cache products aggressively
    case 'avatar':
      return ImageCachePolicy.MEMORY; // Small, keep in memory
    case 'banner':
      return ImageCachePolicy.DISK; // Large, save to disk
    case 'thumbnail':
      return ImageCachePolicy.MEMORY_DISK; // Small, cache everywhere
    default:
      return ImageCachePolicy.MEMORY_DISK;
  }
};

/**
 * Optimized image props for different use cases
 */
export const optimizedImageProps = {
  /**
   * Product images - high quality with caching
   */
  product: {
    contentFit: 'cover' as const,
    transition: 300,
    cachePolicy: 'memory-disk' as const,
    priority: 'normal' as const,
    recyclingKey: undefined, // Let Expo manage
  },

  /**
   * Thumbnails - fast loading, aggressive caching
   */
  thumbnail: {
    contentFit: 'cover' as const,
    transition: 200,
    cachePolicy: 'memory-disk' as const,
    priority: 'high' as const,
  },

  /**
   * Hero/Banner images - quality over speed
   */
  hero: {
    contentFit: 'cover' as const,
    transition: 400,
    cachePolicy: 'disk' as const,
    priority: 'high' as const,
  },

  /**
   * Avatar images - small, memory cache
   */
  avatar: {
    contentFit: 'cover' as const,
    transition: 200,
    cachePolicy: 'memory' as const,
    priority: 'normal' as const,
  },

  /**
   * Background images - low priority
   */
  background: {
    contentFit: 'cover' as const,
    transition: 500,
    cachePolicy: 'disk' as const,
    priority: 'low' as const,
  },
};

/**
 * Preload images for better UX
 */
export const preloadImages = async (imageUrls: string[]) => {
  try {
    await Promise.all(
      imageUrls.map(url =>
        Image.prefetch(url, {
          cachePolicy: 'memory-disk',
        })
      )
    );
  } catch (error) {
    console.warn('Image preload failed:', error);
  }
};

/**
 * Clear image cache
 */
export const clearImageCache = async () => {
  try {
    await Image.clearMemoryCache();
    await Image.clearDiskCache();
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
};

/**
 * Get image size from cache
 */
export const getCachedImageSize = async (uri: string) => {
  try {
    const cacheSize = await Image.getCachePathAsync(uri);
    return cacheSize;
  } catch {
    return null;
  }
};

/**
 * Optimized image component props generator
 */
export const getOptimizedImageProps = (
  uri: string,
  type: 'product' | 'thumbnail' | 'hero' | 'avatar' | 'background' = 'product'
) => {
  return {
    source: { uri },
    ...optimizedImageProps[type],
    placeholder: type === 'product' ? require('@/assets/placeholder-product.png') : undefined,
  };
};

/**
 * Image loading states manager
 */
export class ImageLoadManager {
  private loadingImages: Set<string> = new Set();
  private failedImages: Set<string> = new Set();

  /**
   * Mark image as loading
   */
  startLoading(uri: string): void {
    this.loadingImages.add(uri);
  }

  /**
   * Mark image as loaded successfully
   */
  finishLoading(uri: string): void {
    this.loadingImages.delete(uri);
    this.failedImages.delete(uri);
  }

  /**
   * Mark image as failed
   */
  markFailed(uri: string): void {
    this.loadingImages.delete(uri);
    this.failedImages.add(uri);
  }

  /**
   * Check if image is currently loading
   */
  isLoading(uri: string): boolean {
    return this.loadingImages.has(uri);
  }

  /**
   * Check if image failed to load
   */
  hasFailed(uri: string): boolean {
    return this.failedImages.has(uri);
  }

  /**
   * Reset all states
   */
  reset(): void {
    this.loadingImages.clear();
    this.failedImages.clear();
  }

  /**
   * Retry failed image
   */
  retry(uri: string): void {
    this.failedImages.delete(uri);
  }
}

/**
 * Image quality settings based on device
 */
export const getImageQuality = () => {
  // You can adjust based on device performance
  if (Platform.OS === 'ios') {
    return {
      quality: 0.9,
      format: 'webp',
    };
  }
  return {
    quality: 0.85,
    format: 'webp',
  };
};

/**
 * Generate responsive image URL with size parameters
 * (if your backend supports image resizing)
 */
export const getResponsiveImageUrl = (
  baseUrl: string,
  width: number,
  quality: number = 80
): string => {
  // Example: append size params if your CDN supports it
  // Adjust based on your actual image service
  if (baseUrl.includes('?')) {
    return `${baseUrl}&w=${width}&q=${quality}`;
  }
  return `${baseUrl}?w=${width}&q=${quality}`;
};

/**
 * Lazy load images with intersection observer
 */
export const shouldLoadImage = (index: number, visibleRange: number = 10): boolean => {
  // Load images within visible range for better performance
  return index < visibleRange;
};

/**
 * Image dimensions calculator
 */
export const calculateImageDimensions = (
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
  contentFit: 'cover' | 'contain' = 'cover'
) => {
  const containerRatio = containerWidth / containerHeight;
  const imageRatio = imageWidth / imageHeight;

  if (contentFit === 'cover') {
    if (imageRatio > containerRatio) {
      return {
        width: containerHeight * imageRatio,
        height: containerHeight,
      };
    }
    return {
      width: containerWidth,
      height: containerWidth / imageRatio,
    };
  }

  // contain
  if (imageRatio > containerRatio) {
    return {
      width: containerWidth,
      height: containerWidth / imageRatio,
    };
  }
  return {
    width: containerHeight * imageRatio,
    height: containerHeight,
  };
};

/**
 * Default placeholders by type
 */
export const placeholders = {
  product: require('@/assets/placeholder-product.png'),
  avatar: require('@/assets/placeholder-avatar.png'),
  banner: require('@/assets/placeholder-banner.png'),
};

/**
 * Image memory budget manager
 */
export class ImageMemoryBudget {
  private maxMemoryMB: number;
  private currentMemoryMB: number = 0;

  constructor(maxMemoryMB: number = 50) {
    this.maxMemoryMB = maxMemoryMB;
  }

  /**
   * Check if we can load more images
   */
  canLoadMore(imageSizeMB: number = 1): boolean {
    return this.currentMemoryMB + imageSizeMB <= this.maxMemoryMB;
  }

  /**
   * Track loaded image
   */
  trackImage(sizeMB: number): void {
    this.currentMemoryMB += sizeMB;
  }

  /**
   * Release image memory
   */
  releaseImage(sizeMB: number): void {
    this.currentMemoryMB = Math.max(0, this.currentMemoryMB - sizeMB);
  }

  /**
   * Reset memory tracking
   */
  reset(): void {
    this.currentMemoryMB = 0;
  }

  /**
   * Get current memory usage percentage
   */
  getUsagePercentage(): number {
    return (this.currentMemoryMB / this.maxMemoryMB) * 100;
  }
}

// Export singleton instances
export const imageLoadManager = new ImageLoadManager();
export const imageMemoryBudget = new ImageMemoryBudget(50); // 50MB budget
