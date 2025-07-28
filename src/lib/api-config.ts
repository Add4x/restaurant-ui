// API Configuration
// Centralized configuration for API URLs and versions

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Construct full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}/api/${API_VERSION}${endpoint}`;
}

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// API timeout in milliseconds
export const API_TIMEOUT = 30000; // 30 seconds