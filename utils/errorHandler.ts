import * as Haptics from 'expo-haptics';

/**
 * Error types for better classification
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Structured error interface
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
  retryable?: boolean;
}

/**
 * Parse error from various sources
 */
export function parseError(error: unknown): AppError {
  // Handle null/undefined
  if (!error) {
    return {
      type: ErrorType.UNKNOWN,
      message: 'An unknown error occurred',
      retryable: false,
    };
  }

  // Handle AppError
  if (isAppError(error)) {
    return error;
  }

  // Handle Error instances
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      originalError: error,
      retryable: false,
    };
  }

  // Handle API errors (Axios/Fetch)
  if (isApiError(error)) {
    const statusCode = error.response?.status || error.status;
    const message = error.response?.data?.message || error.message || 'Request failed';

    // Classify based on status code
    let type = ErrorType.UNKNOWN;
    let retryable = false;

    if (!statusCode) {
      type = ErrorType.NETWORK;
      retryable = true;
    } else if (statusCode === 401 || statusCode === 403) {
      type = ErrorType.AUTHENTICATION;
      retryable = false;
    } else if (statusCode === 404) {
      type = ErrorType.NOT_FOUND;
      retryable = false;
    } else if (statusCode >= 400 && statusCode < 500) {
      type = ErrorType.VALIDATION;
      retryable = false;
    } else if (statusCode >= 500) {
      type = ErrorType.SERVER;
      retryable = true;
    }

    return {
      type,
      message,
      originalError: error,
      statusCode,
      retryable,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
      retryable: false,
    };
  }

  // Fallback
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    originalError: error,
    retryable: false,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const appError = parseError(error);

  switch (appError.type) {
    case ErrorType.NETWORK:
      return 'No internet connection. Please check your network and try again.';
    case ErrorType.AUTHENTICATION:
      return 'Session expired. Please log in again.';
    case ErrorType.VALIDATION:
      return appError.message || 'Please check your input and try again.';
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.SERVER:
      return 'Server error. Please try again later.';
    case ErrorType.UNKNOWN:
    default:
      return appError.message || 'Something went wrong. Please try again.';
  }
}

/**
 * Handle error with haptic feedback and optional logging
 */
export async function handleError(
  error: unknown,
  options: {
    showToast?: boolean;
    haptic?: boolean;
    logToConsole?: boolean;
  } = {}
) {
  const { showToast = false, haptic = true, logToConsole = __DEV__ } = options;

  const appError = parseError(error);

  // Haptic feedback for errors
  if (haptic) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  // Log in development
  if (logToConsole) {
    console.error('Error handled:', appError);
    if (appError.originalError) {
      console.error('Original error:', appError.originalError);
    }
  }

  // In production, you would send to error tracking service
  // Example: Sentry.captureException(appError.originalError || error);

  return appError;
}

/**
 * Type guards
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error
  );
}

function isApiError(error: unknown): error is {
  response?: { status?: number; data?: { message?: string } };
  status?: number;
  message?: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'status' in error)
  );
}

/**
 * Retry logic helper
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const appError = parseError(error);

      // Don't retry if error is not retryable
      if (!appError.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));

      if (__DEV__) {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      }
    }
  }

  throw lastError;
}
