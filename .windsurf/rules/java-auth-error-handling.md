---
description: Java Auth - Error Handling & Validation
globs: src/lib/error-handler.ts
---

# Java Backend Authentication - Error Handling

<rule>
name: java_auth_error_handling
description: Error handling and validation for Java backend authentication
filters:
  - type: file_path
    pattern: "src/(lib|utils|errors)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "error_handling|validation|error_boundary"

actions:
  - type: suggest
    message: |
      ## Error Handling and Validation

      ### Custom Error Classes

      ```typescript
      // src/lib/errors.ts
      export class ApiError extends Error {
        statusCode: number;
        code?: string;
        
        constructor(message: string, statusCode: number, code?: string) {
          super(message);
          this.name = 'ApiError';
          this.statusCode = statusCode;
          this.code = code;
          
          // Maintain proper stack trace
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
          }
        }
      }
      
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

      ### Error Boundary Component

      ```tsx
      // src/components/ErrorBoundary.tsx
      'use client';
      
      import { Component, ErrorInfo, ReactNode } from 'react';
      
      interface ErrorBoundaryProps {
        children: ReactNode;
        fallback?: ReactNode;
      }
      
      interface ErrorBoundaryState {
        hasError: boolean;
        error: Error | null;
      }
      
      export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
        public state: ErrorBoundaryState = {
          hasError: false,
          error: null,
        };
      
        public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
          return { hasError: true, error };
        }
      
        public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
          console.error('Uncaught error:', error, errorInfo);
        }
      
        public render() {
          if (this.state.hasError) {
            return this.props.fallback || (
              <div className="p-4 bg-red-50 text-red-700 rounded">
                <h2 className="font-bold">Something went wrong</h2>
                <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
                >
                  Try again
                </button>
              </div>
            );
          }
      
          return this.props.children;
        }
      }
      ```

      ### API Error Handler

      ```typescript
      // src/lib/api-error-handler.ts
      import { NextResponse } from 'next/server';
      import { ApiError, UnauthorizedError, ValidationError } from './errors';
      
      export function handleApiError(error: unknown): NextResponse {
        console.error('API Error:', error);
        
        if (error instanceof UnauthorizedError) {
          return NextResponse.json(
            { 
              error: error.message,
              code: error.code,
            },
            { status: 401 }
          );
        }
        
        if (error instanceof ValidationError) {
          return NextResponse.json(
            {
              error: error.message,
              code: error.code,
              errors: error.errors,
            },
            { status: 400 }
          );
        }
        
        if (error instanceof ApiError) {
          return NextResponse.json(
            {
              error: error.message,
              code: error.code || 'INTERNAL_SERVER_ERROR',
            },
            { status: error.statusCode }
          );
        }
        
        // Handle unknown errors
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR',
          },
          { status: 500 }
        );
      }
      ```

      ### Form Validation

      ```typescript
      // src/lib/validation.ts
      import { z } from 'zod';
      import { ValidationError } from './errors';
      
      export const loginSchema = z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      });
      
      export function validateForm<T>(
        schema: z.ZodSchema<T>,
        data: unknown
      ): T {
        const result = schema.safeParse(data);
        
        if (!result.success) {
          const errors: Record<string, string[]> = {};
          
          result.error.errors.forEach((error) => {
            const path = error.path.join('.');
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(error.message);
          });
          
          throw new ValidationError(errors);
        }
        
        return result.data;
      }
      
      // Usage in form submission
      async function handleSubmit(data: unknown) {
        try {
          const validatedData = validateForm(loginSchema, data);
          // Proceed with validated data
        } catch (error) {
          if (error instanceof ValidationError) {
            // Handle validation errors
            return {
              success: false,
              errors: error.errors,
            };
          }
          throw error;
        }
      }
      ```

      ### Global Error Handler

      ```typescript
      // src/app/error.tsx
      'use client';
      
      import { useEffect } from 'react';
      
      export default function Error({
        error,
        reset,
      }: {
        error: Error & { digest?: string };
        reset: () => void;
      }) {
        useEffect(() => {
          // Log the error to an error reporting service
          console.error(error);
        }, [error]);
      
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Something went wrong!
              </h2>
              <p className="text-gray-700 mb-6">
                {error.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        );
      }
      ```

      ### Error Logging

      ```typescript
      // src/lib/logger.ts
      export class Logger {
        static error(error: unknown, context: Record<string, unknown> = {}) {
          const errorObj = error instanceof Error 
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : { message: String(error) };
          
          console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            ...errorObj,
            ...context,
          }));
        }
        
        static info(message: string, context: Record<string, unknown> = {}) {
          console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message,
            ...context,
          }));
        }
      }
      
      // Usage
      try {
        // Some operation
      } catch (error) {
        Logger.error(error, { userId: '123', action: 'login' });
        throw error;
      }
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Error handling and validation in Next.js applications"
</rule>
