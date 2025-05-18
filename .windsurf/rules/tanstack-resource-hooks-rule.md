---
description: TanStack Query - Resource Hooks
globs: src/hooks/use-*.ts
---

# Resource Hooks for TanStack Query

<rule>
name: tanstack_resource_hooks
description: Standard patterns for resource hooks
filters:
  - type: file_path
    pattern: "src/hooks/use-*.ts"
  - type: intent
    pattern: "resource_hooks|query_hooks"

actions:
  - type: suggest
    message: |
      ## Resource Hook Patterns

      ### Query Hook Example
      ```typescript
      // src/hooks/use-menu-items.ts
      'use client'

      import { useAuthenticatedQuery } from './use-authenticated-query'
      import { fetchApi } from '@/lib/api-client'

      export interface MenuItem {
        id: string
        name: string
        description: string
        price: number
      }

      export function useMenuItems() {
        return useAuthenticatedQuery<MenuItem[]>(
          ['menu-items'],
          () => fetchApi('/api/menu')
        )
      }

      export function useMenuItem(id: string) {
        return useAuthenticatedQuery<MenuItem>(
          ['menu-items', id],
          () => fetchApi(`/api/menu/${id}`)
        )
      }
      ```

      ### Mutation Hook Example
      ```typescript
      // src/hooks/use-menu-mutations.ts
      'use client'

      import { useQueryClient } from '@tanstack/react-query'
      import { useAuthenticatedMutation } from './use-authenticated-query'
      import { fetchApi } from '@/lib/api-client'
      import { MenuItem } from './use-menu-items'

      export function useCreateMenuItem() {
        const queryClient = useQueryClient()

        return useAuthenticatedMutation<MenuItem, Error, Omit<MenuItem, 'id'>>({
          mutationFn: (newItem) => 
            fetchApi('/api/menu', {
              method: 'POST',
              body: JSON.stringify(newItem),
            }),
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] })
          },
        })
      }
      ```

metadata:
  priority: high
  version: 1.0
</rule>
