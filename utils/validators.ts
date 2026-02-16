/**
 * Input Validation & Sanitization Utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Phone number validation (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

/**
 * Name validation (no special characters)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Sanitize user input - removes potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove inline event handlers
    .replace(/script/gi, ''); // Remove script tags
};

/**
 * Validate and sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .slice(0, 100) // Limit length
    .replace(/[<>'"]/g, '') // Remove quotes and brackets
    .replace(/--/g, '') // Remove SQL comment syntax
    .replace(/;/g, ''); // Remove semicolons
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate price/amount
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 0 && amount < 10000000; // Max 1 crore
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate OTP
 */
export const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^\d{4,6}$/;
  return otpRegex.test(otp);
};

/**
 * Validate rating (1-5)
 */
export const isValidRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

/**
 * Validate PIN code (Indian)
 */
export const isValidPinCode = (pinCode: string): boolean => {
  const pinRegex = /^[1-9]\d{5}$/;
  return pinRegex.test(pinCode);
};

/**
 * Sanitize address input
 */
export const sanitizeAddress = (address: string): string => {
  return address
    .trim()
    .slice(0, 500) // Limit length
    .replace(/[<>]/g, '');
};

/**
 * Validate quantity
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100;
};

/**
 * Rate limiting helper - prevents spam
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts
   */
  clear(): void {
    this.attempts.clear();
  }
}

/**
 * Form validation helpers
 */
export const formValidators = {
  signup: {
    name: (name: string) => {
      if (!name || name.trim().length < 2) {
        return 'Name must be at least 2 characters';
      }
      if (!isValidName(name)) {
        return 'Name contains invalid characters';
      }
      return null;
    },
    email: (email: string) => {
      if (!email) {
        return 'Email is required';
      }
      if (!isValidEmail(email)) {
        return 'Invalid email format';
      }
      return null;
    },
    phone: (phone: string) => {
      if (!phone) {
        return 'Phone number is required';
      }
      if (!isValidPhone(phone)) {
        return 'Invalid phone number';
      }
      return null;
    },
  },
  address: {
    name: (name: string) => {
      if (!name || name.trim().length < 3) {
        return 'Address name must be at least 3 characters';
      }
      return null;
    },
    pinCode: (pinCode: string) => {
      if (!pinCode) {
        return 'PIN code is required';
      }
      if (!isValidPinCode(pinCode)) {
        return 'Invalid PIN code';
      }
      return null;
    },
  },
  review: {
    rating: (rating: number) => {
      if (!isValidRating(rating)) {
        return 'Please select a rating between 1 and 5';
      }
      return null;
    },
    comment: (comment: string) => {
      if (comment && comment.length > 1000) {
        return 'Comment is too long (max 1000 characters)';
      }
      return null;
    },
  },
};

/**
 * Secure data before sending to API
 */
export const securePayload = <T extends Record<string, any>>(payload: T): T => {
  const secured = { ...payload };

  Object.keys(secured).forEach(key => {
    const value = secured[key];

    if (typeof value === 'string') {
      secured[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      secured[key] = securePayload(value);
    }
  });

  return secured;
};

/**
 * Debounce function for search and API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
