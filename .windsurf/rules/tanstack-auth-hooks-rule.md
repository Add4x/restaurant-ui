---
description: TanStack Query Authentication - Base Hooks
globs: src/hooks/use-*.ts
---

# TanStack Query Authentication Hooks

<rule>
name: tanstack_auth_hooks
description: Base authentication hooks for TanStack Query
filters:
  - type: file_path
    pattern: "src/hooks/use-*.ts"
  - type: intent
    pattern: "auth_hooks|tanstack_auth"

actions:
  - type: suggest
    message: |
      ## Base Authentication Hooks

      ### useAuthenticatedQuery Hook
      ```typescript
      // src/hooks/use-authenticated-query.ts
      'use client'

      import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query'
      import { useRouter } from 'next/navigation'

      export function useAuthenticatedQuery<TData, TError = Error>(
        queryKey: QueryKey,
        queryFn: () => Promise<TData>,
        options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
      ) {
        const router = useRouter()

        return useQuery<TData, TError>({
          queryKey,
          queryFn: async () => {
            try {
              return await queryFn()
            } catch (error) {
              if (error instanceof Error && 
                 (error.message.includes('401') || 
                  error.message.includes('unauthorized'))) {
                router.push('/api/auth')
              }
              throw error
            }
          },
          ...options,
        })
      }
      ```

      ### useAuthenticatedMutation Hook
      ```typescript
      // src/hooks/use-authenticated-mutation.ts
      'use client'

      import { useMutation, UseMutationOptions } from '@tanstack/react-query'
      import { useRouter } from 'next/navigation'

      export function useAuthenticatedMutation<
        TData = unknown,
        TError = Error,
        TVariables = void,
        TContext = unknown
      >(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
        const router = useRouter()
        
        return useMutation<TData, TError, TVariables, TContext>({
          ...options,
          onError: (error, variables, context) => {
            if (error instanceof Error && 
               (error.message.includes('401') || 
                error.message.includes('unauthorized'))) {
              router.push('/api/auth')
            }
            options.onError?.(error, variables, context)
          }
        })
      }
      ```

metadata:
  priority: high
  version: 1.0
</rule>
