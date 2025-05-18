---
description: Next.js API Client - Base Implementation
globs: src/lib/api-client.ts
---

# Next.js API Client - Base Implementation

<rule>
name: nextjs_api_client_base
description: Base API client implementation with error handling and types
filters:
  - type: file_path
    pattern: "src/(lib|utils)/api-client\\.ts$"
  - type: intent
    pattern: "api_client|http_client"

actions:
  - type: suggest
    message: |
      ## Base API Client Implementation

      ### ApiError Class
      ```typescript
      // src/lib/api-client.ts
      export class ApiError extends Error {
        status: number;
        code?: string;
        
        constructor(message: string, status: number, code?: string) {
          super(message);
          this.name = 'ApiError';
          this.status = status;
          this.code = code;
          
          // Maintain proper stack trace
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
          }
        }
      }
      
      // Helper to create specific error types
      export class UnauthorizedError extends ApiError {
        constructor(message = 'Unauthorized') {
          super(message, 401, 'UNAUTHORIZED');
        }
      }
      
      export class ForbiddenError extends ApiError {
        constructor(message = 'Forbidden') {
          super(message, 403, 'FORBIDDEN');
        }
      }
      
      export class ValidationError extends ApiError {
        errors: Record<string, string[]>;
        
        constructor(errors: Record<string, string[]>) {
          super('Validation failed', 400, 'VALIDATION_ERROR');
          this.errors = errors;
        }
      }
      ```

      ### Base API Client
      ```typescript
      // src/lib/api-client.ts
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      export async function fetchApi<T>(
        endpoint: string,
        options: RequestInit = {}
      ): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...options.headers,
            },
            credentials: 'include',
          });
          
          if (!response.ok) {
            let errorMessage = `API error: ${response.status}`;
            let errorCode: string | undefined;
            
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
              errorCode = errorData.code;
            } catch (e) {
              // If we can't parse JSON, use status text
              errorMessage = response.statusText || errorMessage;
            }
            
            // Throw appropriate error type based on status
            if (response.status === 401) {
              throw new UnauthorizedError(errorMessage);
            } else if (response.status === 403) {
              throw new ForbiddenError(errorMessage);
            } else {
              throw new ApiError(errorMessage, response.status, errorCode);
            }
          }
          
          // Handle 204 No Content
          if (response.status === 204) {
            return undefined as unknown as T;
          }
          
          return response.json();
        } catch (error) {
          if (error instanceof ApiError) {
            throw error;
          }
          
          // Handle network errors
          if (error instanceof TypeError) {
            throw new ApiError(
              'Network error. Please check your connection and try again.',
              0,
              'NETWORK_ERROR'
            );
          }
          
          // Re-throw any other errors
          throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error',
            500,
            'UNKNOWN_ERROR'
          );
        }
      }
      
      // Helper methods for common HTTP methods
      export const api = {
        get: <T>(endpoint: string, options: RequestInit = {}) => 
          fetchApi<T>(endpoint, { ...options, method: 'GET' }),
          
        post: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
          fetchApi<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
          }),
          
        put: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
          fetchApi<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
          }),
          
        delete: <T>(endpoint: string, options: RequestInit = {}) =>
          fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
          
        patch: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
          fetchApi<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
          }),
      };
      ```

      ### Usage Example
      ```typescript
      // Example usage in a service or hook
      import { api, UnauthorizedError } from '@/lib/api-client';
      
      export async function fetchMenuItems() {
        try {
          return await api.get<MenuItem[]>('/api/menu');
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            // Handle unauthorized error (e.g., redirect to login)
            window.location.href = '/login';
          }
          throw error; // Re-throw to let the caller handle it
        }
      }
      
      // In a React component or hook
      async function createMenuItem(item: MenuItem) {
        try {
          const newItem = await api.post<MenuItem>('/api/menu', item);
          return newItem;
        } catch (error) {
          console.error('Failed to create menu item:', error);
          throw error;
        }
      }
      ```

      ### Key Features
      - Type-safe API client with TypeScript support
      - Built-in error handling with custom error types
      - Support for all HTTP methods
      - Automatic JSON parsing
      - Credentials included by default
      - Environment-based API URL configuration

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications with TypeScript"
</rule>
