---
description: Next.js - React Query Integration
globs: src/hooks/**/*.ts
---

# Next.js - React Query Integration

<rule>
name: nextjs_react_query_integration
description: Integration between React Query and the API client with proper typing and error handling
filters:
  - type: file_path
    pattern: "src/hooks/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "react_query|tanstack_query|data_fetching"

actions:
  - type: suggest
    message: |
      ## React Query Integration Guide

      This guide shows how to integrate React Query with the API client for type-safe data fetching and mutations.

      ### Query Client Setup
      ```typescript
      // src/providers/query-provider.tsx
      'use client';
      
      import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
      import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
      import { useState } from 'react';
      
      export function QueryProvider({ children }: { children: React.ReactNode }) {
        const [queryClient] = useState(
          () =>
            new QueryClient({
              defaultOptions: {
                queries: {
                  staleTime: 60 * 1000, // 1 minute
                  retry: (failureCount, error: any) => {
                    // Don't retry on 4xx errors
                    if (error?.status && error.status >= 400 && error.status < 500) {
                      return false;
                    }
                    // Retry 3 times for other errors
                    return failureCount < 3;
                  },
                },
                mutations: {
                  onError: (error: any) => {
                    console.error('Mutation error:', error);
                  },
                },
              },
            })
        );
      
        return (
          <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        );
      }
      ```

      ### Custom Hook Factory
      ```typescript
      // src/hooks/use-query-wrapper.ts
      import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
      import { ApiError } from '@/lib/api-client';
      
      export function useApiQuery<TData>(
        queryKey: QueryKey,
        queryFn: () => Promise<TData>,
        options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
      ): UseQueryResult<TData, ApiError> {
        return useQuery<TData, ApiError>({
          queryKey,
          queryFn: async () => {
            try {
              return await queryFn();
            } catch (error) {
              // Ensure all errors are properly typed as ApiError
              if (error instanceof ApiError) {
                throw error;
              }
              throw new ApiError(
                error instanceof Error ? error.message : 'Unknown error',
                500,
                'UNKNOWN_ERROR'
              );
            }
          },
          ...options,
        });
      }
      ```

      ### Data Fetching Hooks
      ```typescript
      // src/hooks/use-menu-items.ts
      import { useApiQuery } from './use-query-wrapper';
      import { api } from '@/lib/api-client';
      import { MenuItem } from '@/types';
      
      const MENU_ITEMS_QUERY_KEY = ['menu-items'];
      
      export function useMenuItems(options = {}) {
        return useApiQuery<MenuItem[]>(
          MENU_ITEMS_QUERY_KEY,
          () => api.get<MenuItem[]>('/api/menu'),
          {
            staleTime: 5 * 60 * 1000, // 5 minutes
            ...options,
          }
        );
      }
      
      // Example with parameters
      export function useMenuItem(id: string, options = {}) {
        return useApiQuery<MenuItem>(
          [...MENU_ITEMS_QUERY_KEY, id],
          () => api.get<MenuItem>(`/api/menu/${id}`),
          {
            enabled: !!id, // Only run the query if id exists
            ...options,
          }
        );
      }
      ```

      ### Mutation Hooks
      ```typescript
      // src/hooks/use-create-menu-item.ts
      import { useMutation, useQueryClient } from '@tanstack/react-query';
      import { api } from '@/lib/api-client';
      import { MenuItem, CreateMenuItemDto } from '@/types';
      import { MENU_ITEMS_QUERY_KEY } from './use-menu-items';
      
      export function useCreateMenuItem() {
        const queryClient = useQueryClient();
        
        return useMutation<MenuItem, ApiError, CreateMenuItemDto>(
          async (newItem) => {
            const created = await api.post<MenuItem>('/api/menu', newItem);
            return created;
          },
          {
            onSuccess: () => {
              // Invalidate and refetch
              queryClient.invalidateQueries({ queryKey: MENU_ITEMS_QUERY_KEY });
            },
          }
        );
      }
      
      // Optimistic updates example
      export function useUpdateMenuItem() {
        const queryClient = useQueryClient();
        
        return useMutation<MenuItem, ApiError, { id: string; data: Partial<MenuItem> }>(
          async ({ id, data }) => {
            const updated = await api.put<MenuItem>(`/api/menu/${id}`, data);
            return updated;
          },
          {
            onMutate: async (variables) => {
              // Cancel any outgoing refetches
              await queryClient.cancelQueries({ queryKey: [...MENU_ITEMS_QUERY_KEY, variables.id] });
              
              // Snapshot the previous value
              const previousItem = queryClient.getQueryData<MenuItem>([...MENU_ITEMS_QUERY_KEY, variables.id]);
              
              // Optimistically update to the new value
              if (previousItem) {
                queryClient.setQueryData<MenuItem>(
                  [...MENU_ITEMS_QUERY_KEY, variables.id],
                  { ...previousItem, ...variables.data }
                );
              }
              
              // Return a context with the previous value
              return { previousItem };
            },
            onError: (error, variables, context) => {
              // If the mutation fails, use the context to roll back
              if (context?.previousItem) {
                queryClient.setQueryData<MenuItem>(
                  [...MENU_ITEMS_QUERY_KEY, variables.id],
                  context.previousItem
                );
              }
            },
            onSettled: (data, error, variables) => {
              // Always refetch after error or success
              queryClient.invalidateQueries({ queryKey: [...MENU_ITEMS_QUERY_KEY, variables.id] });
            },
          }
        );
      }
      ```

      ### Using Hooks in Components
      ```tsx
      // src/app/menu/page.tsx
      'use client';
      
      import { useMenuItems, useCreateMenuItem } from '@/hooks/use-menu-items';
      import { Button } from '@/components/ui/button';
      import { Skeleton } from '@/components/ui/skeleton';
      import { MenuItemCard } from '@/components/menu-item-card';
      
      export default function MenuPage() {
        const { data: menuItems, isLoading, error } = useMenuItems();
        const createMutation = useCreateMenuItem();
        
        const handleAddItem = async () => {
          try {
            await createMutation.mutateAsync({
              name: 'New Item',
              price: 9.99,
              description: 'A delicious new item',
              category: 'mains',
            });
          } catch (error) {
            // Error is already handled by the mutation
          }
        };
        
        if (isLoading) {
          return (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          );
        }
        
        if (error) {
          return (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load menu: {error.message}
                  </h3>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Menu</h1>
              <Button 
                onClick={handleAddItem}
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menuItems?.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      }
      ```

      ### Server-Side Data Fetching
      ```typescript
      // src/app/menu/page.tsx (Server Component)
      import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
      import { api } from '@/lib/api-client';
      import { Menu } from './menu-client';
      
      export default async function MenuPage() {
        const queryClient = new QueryClient();
        
        await queryClient.prefetchQuery({
          queryKey: ['menu-items'],
          queryFn: () => api.get('/api/menu'),
        });
        
        return (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Menu />
          </HydrationBoundary>
        );
      }
      
      // src/app/menu/menu-client.tsx
      'use client';
      
      import { useMenuItems } from '@/hooks/use-menu-items';
      
      export function Menu() {
        const { data: menuItems } = useMenuItems();
        
        // Render your component with the data
        return (
          <div>
            {/* Your component JSX */}
          </div>
        );
      }
      ```

      ### Best Practices
      1. **Query Keys**: Use array-based query keys for better type safety and invalidation
      2. **Stale Time**: Set appropriate stale times to balance freshness and performance
      3. **Error Boundaries**: Wrap components with error boundaries to handle errors gracefully
      4. **Loading States**: Always handle loading and error states
      5. **Optimistic Updates**: Use for better UX with mutations
      6. **Pagination/Infinite Query**: For large datasets
      7. **Selectors**: Use selectors to transform data in the query
      8. **Prefetching**: Prefetch data when possible for better perceived performance

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using React Query"
</rule>
