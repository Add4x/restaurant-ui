---
description: Next.js - API Client Testing
globs: src/**/*.test.ts
---

# Next.js - API Client Testing

<rule>
name: nextjs_api_testing
description: Testing patterns for API clients, React Query hooks, and server actions
filters:
  - type: file_extension
    pattern: "\\.test\\.(ts|tsx)$"
  - type: intent
    pattern: "testing|jest|msw|mock"

actions:
  - type: suggest
    message: |
      ## Testing API Clients and Hooks

      This guide covers testing patterns for the API client, React Query hooks, and server actions.

      ### Setup MSW (Mock Service Worker)
      ```typescript
      // src/mocks/server.ts
      import { setupServer } from 'msw/node';
      import { rest } from 'msw';
      
      export const handlers = [
        // Mock successful response
        rest.get('http://localhost:8080/api/menu', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              { id: '1', name: 'Pizza', price: 12.99 },
              { id: '2', name: 'Pasta', price: 10.99 },
            ])
          );
        }),
        
        // Mock error response
        rest.get('http://localhost:8080/api/error', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ message: 'Internal server error' })
          );
        }),
      ];
      
      export const server = setupServer(...handlers);
      
      // Setup and teardown
      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());
      ```

      ### Testing the API Client
      ```typescript
      // src/lib/__tests__/api-client.test.ts
      import { api } from '../api-client';
      import { server } from '@/mocks/server';
      import { rest } from 'msw';
      import { ApiError } from '../api-client';
      
      describe('api-client', () => {
        it('should make a successful GET request', async () => {
          const data = await api.get<Array<{ id: string; name: string }>>('/api/menu');
          expect(data).toEqual([
            { id: '1', name: 'Pizza' },
            { id: '2', name: 'Pasta' },
          ]);
        });
        
        it('should handle API errors', async () => {
          await expect(api.get('/api/error')).rejects.toThrow(
            expect.objectContaining({
              status: 500,
              message: 'Internal server error',
            })
          );
        });
        
        it('should throw ApiError on network errors', async () => {
          server.use(
            rest.get('http://localhost:8080/api/network-error', (req) => {
              return req.networkError('Failed to connect');
            })
          );
          
          await expect(api.get('/api/network-error')).rejects.toThrow(ApiError);
        });
      });
      ```

      ### Testing React Query Hooks
      ```typescript
      // src/hooks/__tests__/use-menu-items.test.tsx
      import { renderHook, waitFor } from '@testing-library/react';
      import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
      import { server } from '@/mocks/server';
      import { rest } from 'msw';
      import { useMenuItems } from '../use-menu-items';
      
      const createWrapper = () => {
        const queryClient = new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        });
        
        return ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      };
      
      describe('useMenuItems', () => {
        it('should fetch menu items', async () => {
          const { result } = renderHook(() => useMenuItems(), {
            wrapper: createWrapper(),
          });
          
          await waitFor(() => expect(result.current.isSuccess).toBe(true));
          
          expect(result.current.data).toEqual([
            { id: '1', name: 'Pizza', price: 12.99 },
            { id: '2', name: 'Pasta', price: 10.99 },
          ]);
        });
        
        it('should handle errors', async () => {
          server.use(
            rest.get('http://localhost:8080/api/menu', (req, res, ctx) => {
              return res(ctx.status(500));
            })
          );
          
          const { result } = renderHook(() => useMenuItems(), {
            wrapper: createWrapper(),
          });
          
          await waitFor(() => expect(result.current.isError).toBe(true));
          expect(result.current.error).toBeDefined();
        });
      });
      ```

      ### Testing Mutations
      ```typescript
      // src/hooks/__tests__/use-create-menu-item.test.tsx
      import { renderHook, waitFor } from '@testing-library/react';
      import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
      import { server } from '@/mocks/server';
      import { rest } from 'msw';
      import { useCreateMenuItem } from '../use-create-menu-item';
      
      const wrapper = ({ children }: { children: React.ReactNode }) => {
        const queryClient = new QueryClient();
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      };
      
      describe('useCreateMenuItem', () => {
        it('should create a menu item', async () => {
          const newItem = { name: 'Burger', price: 8.99 };
          
          server.use(
            rest.post('http://localhost:8080/api/menu', async (req, res, ctx) => {
              const body = await req.json();
              return res(
                ctx.status(201),
                ctx.json({ id: '3', ...body })
              );
            })
          );
          
          const { result } = renderHook(() => useCreateMenuItem(), { wrapper });
          
          await act(async () => {
            await result.current.mutateAsync(newItem);
          });
          
          expect(result.current.isSuccess).toBe(true);
          expect(result.current.data).toEqual({
            id: '3',
            name: 'Burger',
            price: 8.99,
          });
        });
        
        it('should handle errors', async () => {
          server.use(
            rest.post('http://localhost:8080/api/menu', (req, res, ctx) => {
              return res(
                ctx.status(400),
                ctx.json({ message: 'Validation failed' })
              );
            })
          );
          
          const { result } = renderHook(() => useCreateMenuItem(), { wrapper });
          
          await act(async () => {
            await expect(
              result.current.mutateAsync({ name: '', price: 0 })
            ).rejects.toBeDefined();
          });
          
          expect(result.current.isError).toBe(true);
        });
      });
      ```

      ### Testing Server Actions
      ```typescript
      // src/actions/__tests__/register-user.test.ts
      import { registerUser } from '../auth/register';
      import { server } from '@/mocks/server';
      import { rest } from 'msw';
      
      // Mock next/headers
      jest.mock('next/headers', () => ({
        cookies: () => ({
          set: jest.fn(),
        }),
      }));
      
      describe('registerUser', () => {
        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('password', 'password123');
        formData.append('name', 'Test User');
        
        it('should register a user successfully', async () => {
          server.use(
            rest.post('http://localhost:8080/api/auth/register', (req, res, ctx) => {
              return res(
                ctx.status(201),
                ctx.json({ id: '1', email: 'test@example.com', name: 'Test User' })
              );
            })
          );
          
          const result = await registerUser(formData);
          
          expect(result).toEqual({
            success: true,
            data: { userId: '1' },
          });
        });
        
        it('should handle validation errors', async () => {
          const invalidFormData = new FormData();
          invalidFormData.append('email', 'invalid-email');
          
          const result = await registerUser(invalidFormData);
          
          expect(result).toEqual({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            fieldErrors: {
              email: ['Invalid email address'],
              password: ['Required'],
              name: ['Name is required'],
            },
          });
        });
        
        it('should handle API errors', async () => {
          server.use(
            rest.post('http://localhost:8080/api/auth/register', (req, res, ctx) => {
              return res(
                ctx.status(400),
                ctx.json({ message: 'Email already in use' })
              );
            })
          );
          
          const result = await registerUser(formData);
          
          expect(result).toEqual({
            success: false,
            error: 'Email already in use',
            code: 'EMAIL_IN_USE',
            status: 400,
          });
        });
      });
      ```

      ### Testing Error Boundaries
      ```typescript
      // src/components/__tests__/error-boundary.test.tsx
      import { render, screen } from '@testing-library/react';
      import userEvent from '@testing-library/user-event';
      import { ErrorBoundary } from '../error-boundary';
      
      // A component that throws an error
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      describe('ErrorBoundary', () => {
        beforeEach(() => {
          // Suppress console.error during tests
          jest.spyOn(console, 'error').mockImplementation(() => {});
        });
        
        afterEach(() => {
          jest.restoreAllMocks();
        });
        
        it('renders fallback when error is thrown', () => {
          render(
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <ThrowError />
            </ErrorBoundary>
          );
          
          expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
        
        it('calls onError callback', () => {
          const onError = jest.fn();
          
          render(
            <ErrorBoundary onError={onError}>
              <ThrowError />
            </ErrorBoundary>
          );
          
          expect(onError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.any(Object) // React error info
          );
        });
        
        it('resets when reset is called', async () => {
          const user = userEvent.setup();
          
          render(
            <ErrorBoundary 
              fallback={({ error, resetErrorBoundary }) => (
                <div>
                  <p>Error: {error.message}</p>
                  <button onClick={resetErrorBoundary}>Try again</button>
                </div>
              )}
            >
              <ThrowError />
            </ErrorBoundary>
          );
          
          expect(screen.getByText(/Error: Test error/)).toBeInTheDocument();
          
          await user.click(screen.getByRole('button', { name: /try again/i }));
          
          // The error boundary should re-render the children
          expect(screen.queryByText(/Error: Test error/)).not.toBeInTheDocument();
        });
      });
      ```

      ### Best Practices for API Testing
      1. **Mock External Dependencies**: Use MSW to mock API responses
      2. **Test Error Cases**: Ensure your code handles errors gracefully
      3. **Test Loading States**: Verify loading states are shown appropriately
      4. **Test Success States**: Verify data is displayed correctly
      5. **Test Edge Cases**: Empty states, network errors, timeouts
      6. **Use Realistic Data**: Mock data should match your API's response format
      7. **Test Authentication**: Verify protected routes and error handling
      8. **Clean Up**: Reset mocks and cleanup after tests

      ### Testing Setup
      ```typescript
      // jest.setup.ts
      import '@testing-library/jest-dom';
      import { server } from './src/mocks/server';
      
      // Mock next/navigation
      jest.mock('next/navigation', () => ({
        useRouter() {
          return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
          };
        },
        useSearchParams() {
          return {
            get: jest.fn(),
          };
        },
      }));
      
      // Mock next-auth/react
      jest.mock('next-auth/react', () => ({
        useSession: () => ({
          data: null,
          status: 'unauthenticated',
        }),
        signIn: jest.fn(),
        signOut: jest.fn(),
      }));
      
      // Establish API mocking before all tests
      beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
      });
      
      // Reset any request handlers that we may add during the tests
      afterEach(() => {
        server.resetHandlers();
        // Clear all mocks between tests
        jest.clearAllMocks();
      });
      
      // Clean up after all tests are done
      afterAll(() => {
        server.close();
      });
      ```

      ### Mocking Environment Variables
      ```typescript
      // In your test file or setup file
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
      
      // If you need to mock environment variables for specific tests
      describe('with specific env vars', () => {
        const OLD_ENV = process.env;
        
        beforeEach(() => {
          jest.resetModules();
          process.env = { ...OLD_ENV };
          process.env.NEXT_PUBLIC_FEATURE_FLAG = 'true';
        });
        
        afterAll(() => {
          process.env = OLD_ENV;
        });
        
        it('should use the feature flag', () => {
          // Your test here
        });
      });
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications with API testing"
</rule>
