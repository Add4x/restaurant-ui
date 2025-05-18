---
description: Next.js - ActionResult Pattern for Server Actions
globs: src/actions/**/*.ts
---

# Next.js - ActionResult Pattern

<rule>
name: nextjs_action_result_pattern
description: Implementation of the ActionResult pattern for type-safe server actions
filters:
  - type: file_path
    pattern: "src/actions/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "server_actions|action_result|form_handling"

actions:
  - type: suggest
    message: |
      ## ActionResult Pattern for Server Actions

      The ActionResult pattern provides a type-safe way to handle the results of server actions, including success/failure states and typed error handling.

      ### Base Types
      ```typescript
      // src/types/actions.ts
export type ActionResult<T> =
        | { success: true; data: T }
        | { 
            success: false; 
            error: string; 
            code?: string;
            status?: number;
            fieldErrors?: Record<string, string[]>;
            formError?: string;
          };
      
      // Helper function to create success result
      export function success<T>(data: T): ActionResult<T> {
        return { success: true, data };
      }
      
      // Helper function to create error result
      export function failure(
        error: string, 
        options: {
          code?: string;
          status?: number;
          fieldErrors?: Record<string, string[]>;
          formError?: string;
        } = {}
      ): ActionResult<never> {
        return { 
          success: false, 
          error,
          code: options.code,
          status: options.status,
          fieldErrors: options.fieldErrors,
          formError: options.formError,
        };
      }
      ```

      ### Form Handling with Zod Validation
      ```typescript
      // src/actions/forms.ts
      import { z } from 'zod';
      import { ActionResult, success, failure } from '@/types/actions';
      
      export async function handleFormAction<T>(
        formData: FormData,
        schema: z.ZodSchema<T>,
        action: (data: T) => Promise<ActionResult<any>>
      ): Promise<ActionResult<any>> {
        try {
          // Parse form data
          const data = Object.fromEntries(formData.entries());
          
          // Validate with Zod
          const result = schema.safeParse(data);
          
          if (!result.success) {
            // Format Zod errors
            const fieldErrors = result.error.flatten().fieldErrors;
            return failure('Validation failed', {
              code: 'VALIDATION_ERROR',
              status: 400,
              fieldErrors,
            });
          }
          
          // Call the action with validated data
          return await action(result.data);
          
        } catch (error) {
          console.error('Form action error:', error);
          return failure(
            error instanceof Error ? error.message : 'An unknown error occurred',
            { code: 'INTERNAL_ERROR', status: 500 }
          );
        }
      }
      ```

      ### Example: User Registration
      ```typescript
      // src/actions/auth/register.ts
      'server-only';
      
      import { z } from 'zod';
      import { success, failure } from '@/types/actions';
      import { hashPassword } from '@/lib/auth-utils';
      import { db } from '@/lib/db';
      
      const registerSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string()
          .min(8, 'Password must be at least 8 characters')
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
          ),
        name: z.string().min(1, 'Name is required'),
      });
      
      export async function registerUser(
        formData: FormData
      ): Promise<ActionResult<{ userId: string }>> {
        return handleFormAction(formData, registerSchema, async (data) => {
          try {
            // Check if user already exists
            const existingUser = await db.user.findUnique({
              where: { email: data.email },
            });
            
            if (existingUser) {
              return failure('Email already in use', {
                code: 'EMAIL_IN_USE',
                status: 400,
              });
            }
            
            // Hash password
            const hashedPassword = await hashPassword(data.password);
            
            // Create user
            const user = await db.user.create({
              data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
              },
              select: { id: true },
            });
            
            return success({ userId: user.id });
            
          } catch (error) {
            console.error('Registration error:', error);
            return failure('Failed to create user', {
              code: 'REGISTRATION_FAILED',
              status: 500,
            });
          }
        });
      }
      ```

      ### Client-Side Form Handling
      ```tsx
      // src/components/RegisterForm.tsx
      'use client';
      
      import { useFormState, useFormStatus } from 'react-dom';
      import { registerUser } from '@/actions/auth/register';
      import { useEffect } from 'react';
      import { useRouter } from 'next/navigation';
      import Link from 'next/link';
      
      const initialState = {
        success: false,
        error: null,
        fieldErrors: {},
        formError: null,
      };
      
      export function RegisterForm() {
        const [state, formAction] = useFormState(registerUser, initialState);
        const { pending } = useFormStatus();
        const router = useRouter();
        
        // Redirect on success
        useEffect(() => {
          if (state?.success) {
            router.push('/dashboard');
          }
        }, [state, router]);
        
        return (
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.name[0]}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>
            
            {state?.formError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {state.formError}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={pending}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {pending ? 'Creating account...' : 'Create account'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        );
      }
      ```

      ### API Route Handler
      ```typescript
      // src/app/api/register/route.ts
      import { NextResponse } from 'next/server';
      import { registerUser } from '@/actions/auth/register';
      
      export async function POST(request: Request) {
        try {
          const formData = await request.formData();
          const result = await registerUser(formData);
          
          if (!result.success) {
            return NextResponse.json(
              { 
                error: result.error,
                code: result.code,
                fieldErrors: result.fieldErrors,
              },
              { status: result.status || 400 }
            );
          }
          
          return NextResponse.json(
            { data: result.data },
            { status: 201 }
          );
          
        } catch (error) {
          console.error('Registration error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### Benefits of This Pattern
      - Type safety throughout the entire stack
      - Consistent error handling
      - Reusable validation logic
      - Clear separation of concerns
      - Easy to test
      - Works with both server and client components

      ### Best Practices
      1. Always validate input on both client and server
      2. Use Zod for runtime type checking
      3. Keep error messages user-friendly
      4. Log detailed errors on the server
      5. Use proper HTTP status codes
      6. Sanitize all user input
      7. Implement rate limiting for sensitive actions

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using server actions"
</rule>
