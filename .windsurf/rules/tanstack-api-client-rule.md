---
description: TanStack Query - API Client
globs: src/lib/api-client.ts
---

# API Client for TanStack Query

<rule>
name: tanstack_api_client
description: Standard API client for TanStack Query
filters:
  - type: file_path
    pattern: "src/lib/api-client.ts"
  - type: intent
    pattern: "api_client|fetch_wrapper"

actions:
  - type: suggest
    message: |
      ## API Client Implementation

      ```typescript
      // src/lib/api-client.ts
      'use client'

      export interface ApiError extends Error {
        status: number
        code?: string
      }

      export async function fetchApi<T>(
        endpoint: string,
        options: RequestInit = {}
      ): Promise<T> {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const url = `${baseUrl}${endpoint}`

        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const error = new ApiError(
            `API error: ${response.status} ${response.statusText}`
          )
          error.status = response.status
          
          try {
            const errorData = await response.json()
            error.message = errorData.message || error.message
            error.code = errorData.code
          } catch {
            // Ignore JSON parse errors
          }
          
          throw error
        }

        return response.json()
      }
      ```

metadata:
  priority: high
  version: 1.0
</rule>
