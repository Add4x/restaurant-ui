// Server-only API Configuration
// This file should NEVER be imported in client components

// Backend API URL - only accessible server-side
export const BACKEND_API_URL = process.env.API_BASE_URL || 'http://localhost:8080';
export const API_VERSION = process.env.API_VERSION || 'v1';

// Construct full backend API URL
export function getBackendApiUrl(endpoint: string): string {
  const baseVersion = API_VERSION.replace(/^\/|\/$/g, '');
  return `${BACKEND_API_URL}/api/${baseVersion}${endpoint}`;
}

// API timeout in milliseconds
export const API_TIMEOUT = 30000; // 30 seconds

// Validate that this is only used server-side
if (typeof window !== 'undefined') {
  throw new Error('api-config.server.ts cannot be imported in client-side code');
}