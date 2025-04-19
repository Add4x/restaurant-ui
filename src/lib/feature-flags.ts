/**
 * Utility functions for feature flags
 */

export function isCartEnabled(): boolean {
  // Default to false if environment variable is not set
  return process.env.NEXT_PUBLIC_ENABLE_CART === "true";
}
