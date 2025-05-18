---
description: TanStack Query Authentication - Provider Setup
globs: src/**/providers.tsx
---

# TanStack Query Provider Setup

<rule>
name: tanstack_query_provider
description: Standard setup for QueryClientProvider
filters:
  - type: file_name
    pattern: "providers.tsx"
  - type: intent
    pattern: "query_provider|tanstack_setup"

actions:
  - type: suggest
    message: |
      ## Query Client Provider Setup

      ```tsx
      // src/app/providers.tsx
      'use client'

      import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
      import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
      import { useState } from 'react'

      export function Providers({ children }: { children: React.ReactNode }) {
        const [queryClient] = useState(() => new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 60 * 1000, // 1 minute
              retry: 1,
              refetchOnWindowFocus: true,
            },
          },
        }))

        return (
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        )
      }
      ```

metadata:
  priority: high
  version: 1.0
</rule>
