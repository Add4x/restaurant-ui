---
description: Error Handling - Server Actions
globs: src/actions/**/*.ts
---

# Server Action Error Handling

<rule>
name: error_handling_server_actions
description: Standards for error handling in server actions
filters:
  - type: file_path
    pattern: "src/actions/.*\\.ts$"
  - type: intent
    pattern: "server_actions|error_handling"

actions:
  - type: suggest
    message: |
      ## Server Action Error Handling

      ### Action Result Type
      Define this type in a shared location (e.g., `src/types/actions.ts`):
      ```typescript
      export type ActionResult<T> =
        | { success: true; data: T }
        | { success: false; error: string; code?: string; status?: number };
      ```

      ### Server Action Example
      ```typescript
      // src/actions/menu.ts
      import { fetchWithAuth, ApiError } from '@/lib/api-client';
      import { z } from 'zod';
      import type { ActionResult } from '@/types/actions';
      
      const menuItemSchema = z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
      });

      export async function getMenuItems(): Promise<ActionResult<MenuItem[]>> {
        try {
          const data = await fetchWithAuth<MenuItem[]>('/api/menu');
          const items = z.array(menuItemSchema).parse(data);
          return { success: true, data: items };
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              success: false,
              error: 'Invalid menu data received',
              code: 'INVALID_DATA',
              status: 500,
            };
          }
          
          if (error instanceof ApiError) {
            return {
              success: false,
              error: error.message,
              code: error.code,
              status: error.status,
            };
          }
          
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
          };
        }
      }
      ```

      ### Best Practices
      - Always use `try/catch` in server actions
      - Validate all inputs and outputs with Zod
      - Return consistent error responses
      - Include error codes for client-side handling
      - Log detailed errors server-side
      - Return user-friendly error messages

metadata:
  priority: high
  version: 1.0
</rule>
