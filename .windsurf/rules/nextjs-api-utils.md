---
description: Next.js - API Utilities & Error Handling
globs: src/lib/api-utils.ts,src/utils/errors.ts
---

# Next.js - API Utilities & Error Handling

<rule>
name: nextjs_api_utils
description: Reusable utilities for API routes and error handling
filters:
  - type: file_path
    pattern: "src/(lib|utils)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "error_handling|api_utils|validation"

actions:
  - type: suggest
    message: |
      ## API Utilities & Error Handling

      ### Custom Error Classes
      ```typescript
      // src/lib/errors.ts
      export class ApiError extends Error {
        statusCode: number;
        code: string;
        details?: any;
        
        constructor(
          message: string, 
          statusCode: number = 500, 
          code: string = 'INTERNAL_ERROR',
          details?: any
        ) {
          super(message);
          this.name = 'ApiError';
          this.statusCode = statusCode;
          this.code = code;
          this.details = details;
          
          // Maintain proper stack trace
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
          }
        }
        
        toJSON() {
          return {
            error: this.message,
            code: this.code,
            ...(this.details && { details: this.details })
          };
        }
      }
      
      // Common error types
      export class NotFoundError extends ApiError {
        constructor(resource: string, id?: string) {
          super(
            id ? `${resource} with ID ${id} not found` : `${resource} not found`,
            404,
            'NOT_FOUND'
          );
        }
      }
      
      export class ValidationError extends ApiError {
        constructor(errors: Record<string, string[]>) {
          super('Validation failed', 400, 'VALIDATION_ERROR', { errors });
        }
      }
      
      export class UnauthorizedError extends ApiError {
        constructor(message: string = 'Unauthorized') {
          super(message, 401, 'UNAUTHORIZED');
        }
      }
      
      export class ForbiddenError extends ApiError {
        constructor(message: string = 'Forbidden') {
          super(message, 403, 'FORBIDDEN');
        }
      }
      
      export class RateLimitError extends ApiError {
        constructor(message: string = 'Too many requests') {
          super(message, 429, 'RATE_LIMIT_EXCEEDED');
        }
      }
      ```

      ### Error Handler Middleware
      ```typescript
      // src/middleware/error-handler.ts
      import { NextResponse } from 'next/server';
      import { ApiError, ValidationError } from '@/lib/errors';
      
      export function withErrorHandler(handler: Function) {
        return async function (request: Request, ...args: any[]) {
          try {
            return await handler(request, ...args);
          } catch (error) {
            console.error('API Error:', error);
            
            // Handle known error types
            if (error instanceof ApiError) {
              return NextResponse.json(
                error.toJSON(),
                { status: error.statusCode }
              );
            }
            
            // Handle Zod validation errors
            if (error.name === 'ZodError') {
              const validationError = new ValidationError(
                error.errors.reduce((acc: Record<string, string[]>, curr: any) => {
                  const path = curr.path.join('.');
                  if (!acc[path]) acc[path] = [];
                  acc[path].push(curr.message);
                  return acc;
                }, {})
              );
              
              return NextResponse.json(
                validationError.toJSON(),
                { status: validationError.statusCode }
              );
            }
            
            // Handle Prisma errors
            if (error.code?.startsWith('P')) {
              // Handle specific Prisma errors
              if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'field';
                return NextResponse.json(
                  {
                    error: `${field} already exists`,
                    code: 'DUPLICATE_ENTRY',
                  },
                  { status: 409 }
                );
              }
              
              if (error.code === 'P2025') {
                return NextResponse.json(
                  { error: 'Record not found', code: 'NOT_FOUND' },
                  { status: 404 }
                );
              }
            }
            
            // Default error response
            return NextResponse.json(
              { 
                error: 'Internal server error',
                code: 'INTERNAL_SERVER_ERROR',
                // Only include stack in development
                ...(process.env.NODE_ENV === 'development' && { 
                  stack: error.stack,
                  message: error.message 
                })
              },
              { status: 500 }
            );
          }
        };
      }
      ```

      ### Request Validation
      ```typescript
      // src/lib/validation.ts
      import { z } from 'zod';
      import { ValidationError } from './errors';
      
      // Common validation schemas
      export const paginationSchema = z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).default('asc'),
      });
      
      export const idParamSchema = z.object({
        id: z.string().uuid('Invalid ID format'),
      });
      
      // Validate request body
      export async function validateRequest<T>(
        schema: z.ZodSchema<T>,
        data: unknown
      ): Promise<T> {
        const result = schema.safeParse(data);
        
        if (!result.success) {
          const errors = result.error.errors.reduce((acc, curr) => {
            const path = curr.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(curr.message);
            return acc;
          }, {} as Record<string, string[]>);
          
          throw new ValidationError(errors);
        }
        
        return result.data;
      }
      
      // Validate request query parameters
      export function validateQuery<T>(
        schema: z.ZodSchema<T>,
        searchParams: URLSearchParams
      ): T {
        const query = Object.fromEntries(searchParams.entries());
        return validateRequest(schema, query);
      }
      
      // Validate route parameters
      export function validateParams<T>(
        schema: z.ZodSchema<T>,
        params: Record<string, string | string[] | undefined>
      ): T {
        return validateRequest(schema, params);
      }
      ```

      ### API Response Helpers
      ```typescript
      // src/lib/api-response.ts
      import { NextResponse } from 'next/server';
      
      // Success responses
      export function ok<T>(data: T, status = 200) {
        return NextResponse.json({ data }, { status });
      }
      
      export function created<T>(data: T) {
        return ok(data, 201);
      }
      
      export function noContent() {
        return new NextResponse(null, { status: 204 });
      }
      
      // Error responses (for use in route handlers)
      export function badRequest(message: string, code?: string) {
        return NextResponse.json(
          { error: message, ...(code && { code }) },
          { status: 400 }
        );
      }
      
      export function unauthorized(message = 'Unauthorized') {
        return NextResponse.json(
          { error: message, code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }
      
      export function forbidden(message = 'Forbidden') {
        return NextResponse.json(
          { error: message, code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
      
      export function notFound(message = 'Resource not found') {
        return NextResponse.json(
          { error: message, code: 'NOT_FOUND' },
          { status: 404 }
        );
      }
      
      export function conflict(message: string, code = 'CONFLICT') {
        return NextResponse.json(
          { error: message, code },
          { status: 409 }
        );
      }
      
      export function tooManyRequests(message = 'Too many requests') {
        return NextResponse.json(
          { error: message, code: 'RATE_LIMIT_EXCEEDED' },
          { status: 429 }
        );
      }
      
      export function serverError(message = 'Internal server error') {
        return NextResponse.json(
          { error: message, code: 'INTERNAL_SERVER_ERROR' },
          { status: 500 }
        );
      }
      ```

      ### API Route Example with Utilities
      ```typescript
      // src/app/api/users/[id]/route.ts
      import { NextRequest, NextResponse } from 'next/server';
      import { withErrorHandler } from '@/middleware/error-handler';
      import { validateParams, validateRequest } from '@/lib/validation';
      import { idParamSchema, updateUserSchema } from '@/schemas/user';
      import { ok, notFound } from '@/lib/api-response';
      import { prisma } from '@/lib/prisma';
      
      // GET /api/users/:id
      export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
        // Validate route parameters
        const { id } = await validateParams(idParamSchema, params);
        
        // Fetch user
        const user = await prisma.user.findUnique({
          where: { id },
          select: { id: true, name: true, email: true, role: true },
        });
        
        if (!user) {
          return notFound('User not found');
        }
        
        return ok(user);
      });
      
      // PATCH /api/users/:id
      export const PATCH = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
        // Validate route parameters
        const { id } = await validateParams(idParamSchema, params);
        
        // Parse and validate request body
        const body = await request.json();
        const data = await validateRequest(updateUserSchema, body);
        
        // Update user
        const user = await prisma.user.update({
          where: { id },
          data,
          select: { id: true, name: true, email: true, role: true },
        });
        
        return ok(user);
      });
      
      // DELETE /api/users/:id
      export const DELETE = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
        // Validate route parameters
        const { id } = await validateParams(idParamSchema, params);
        
        // Delete user
        await prisma.user.delete({
          where: { id },
        });
        
        return new NextResponse(null, { status: 204 });
      });
      ```

      ### Testing Utilities
      ```typescript
      // src/tests/test-utils.ts
      import { NextRequest } from 'next/server';
      import { NextApiRequest, NextApiResponse } from 'next';
      import { createMocks } from 'node-mocks-http';
      
      // Create a mock Next.js API request
      export function createApiRequest(
        method: string = 'GET',
        body: any = null,
        query: Record<string, string> = {},
        headers: Record<string, string> = {}
      ) {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
          method,
          query,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          ...(body && { body: JSON.stringify(body) }),
        });
        
        return { req, res };
      }
      
      // Create a mock Next.js App Router request
      export function createAppRequest(
        url: string,
        init: RequestInit = {}
      ): NextRequest {
        const { method = 'GET', headers, body } = init;
        
        return new NextRequest(new URL(url, 'http://localhost:3000'), {
          method,
          headers: headers as HeadersInit,
          body,
        });
      }
      
      // Test error handling
      export async function expectError(
        fn: () => Promise<any>,
        expectedStatus: number,
        expectedCode?: string
      ) {
        let error: Error | null = null;
        
        try {
          await fn();
        } catch (err) {
          error = err as Error;
        }
        
        expect(error).toBeInstanceOf(Error);
        
        if (expectedStatus) {
          expect((error as any).statusCode || (error as any).status).toBe(expectedStatus);
        }
        
        if (expectedCode) {
          expect((error as any).code).toBe(expectedCode);
        }
        
        return error;
      }
      ```

      ### Best Practices
      1. **Consistent Error Format**: Use a standard error response format across your API
      2. **Proper HTTP Status Codes**: Use appropriate status codes for different scenarios
      3. **Input Validation**: Validate all user input using Zod or similar
      4. **Type Safety**: Use TypeScript for type safety throughout your API
      5. **Error Logging**: Log errors with appropriate context
      6. **Security**: Never expose sensitive information in error responses
      7. **Documentation**: Document your API endpoints and error responses
      8. **Testing**: Write tests for both success and error cases
      9. **Rate Limiting**: Protect your API from abuse
      10. **Monitoring**: Set up monitoring for API errors and performance

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js API routes and utilities"
</rule>
