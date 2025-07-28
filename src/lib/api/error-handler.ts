import { toast } from "sonner";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * User-friendly error messages for common API errors
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: "Unable to connect to the server. Please check your internet connection.",
  TIMEOUT: "The request took too long. Please try again.",
  
  // Auth errors
  UNAUTHORIZED: "You need to be logged in to perform this action.",
  FORBIDDEN: "You don't have permission to perform this action.",
  
  // Client errors
  BAD_REQUEST: "Invalid request. Please check your input and try again.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "This action conflicts with existing data.",
  
  // Server errors
  INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable. Please try again later.",
  
  // Business logic errors
  OUT_OF_STOCK: "This item is currently out of stock.",
  INVALID_PROMO_CODE: "The promo code you entered is invalid or expired.",
  MINIMUM_ORDER_NOT_MET: "Your order doesn't meet the minimum requirement.",
  DELIVERY_UNAVAILABLE: "Delivery is not available to your location.",
};

/**
 * Get a user-friendly error message based on error code or status
 */
export function getUserFriendlyErrorMessage(error: ApiError): string {
  // Check for specific error code
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  // Check for HTTP status codes
  if (error.status) {
    switch (error.status) {
      case 400:
        return ERROR_MESSAGES.BAD_REQUEST;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 409:
        return ERROR_MESSAGES.CONFLICT;
      case 500:
        return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      case 503:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      default:
        if (error.status >= 500) {
          return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
        }
    }
  }
  
  // Return the original message if no mapping found
  return error.message || "An unexpected error occurred. Please try again.";
}

/**
 * Global error handler for API errors
 */
export function handleApiError(error: ApiError, showToast = true): void {
  const userMessage = getUserFriendlyErrorMessage(error);
  
  // Log the full error for debugging
  console.error("API Error:", {
    message: error.message,
    code: error.code,
    status: error.status,
    details: error.details,
  });
  
  // Show user-friendly toast notification
  if (showToast) {
    toast.error(userMessage);
  }
}

/**
 * React Query error handler
 */
export function queryErrorHandler(error: unknown): void {
  if (error && typeof error === 'object' && 'message' in error) {
    handleApiError(error as ApiError);
  } else {
    toast.error("An unexpected error occurred. Please try again.");
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}