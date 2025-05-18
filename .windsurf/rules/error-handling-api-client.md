---
description: Error Handling - API Client
globs: src/lib/api-client.ts
---

# API Client Error Handling

<rule>
name: error_handling_api_client
description: Standards for handling API client errors
filters:
  - type: file_path
    pattern: "src/lib/api-client.ts"
  - type: intent
    pattern: "api_client|error_handling"

actions:
  - type: suggest
    message: |
      ## API Client Error Handling

      ### ApiError Class
      ```typescript
      // src/lib/api-client.ts
      import { z } from 'zod';
      
      export class ApiError extends Error {
        code?: string;
        status: number;
        
        constructor(message: string, status: number, code?: string) {
          super(message);
          this.name = 'ApiError';
          this.status = status;
          this.code = code;
        }
      }
      ```

      ### Fetch Wrapper with Error Handling
      ```typescript
      export async function fetchWithAuth<T>(
        endpoint: string, 
        options: RequestInit = {}
      ): Promise<T> {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const url = `${baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          let errorMessage = `API error: ${response.status}`;
          let errorCode: string | undefined;
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            errorCode = errorData.code;
          } catch (e) {
            // If we can't parse JSON, use the status text
            errorMessage = response.statusText || errorMessage;
          }
          
          throw new ApiError(errorMessage, response.status, errorCode);
        }

        return response.json();
      }
      ```

      ### Best Practices
      - Always include credentials for authenticated requests
      - Parse and validate API responses with Zod
      - Throw typed errors for better error handling
      - Include original error details for debugging
      - Handle network errors separately from API errors

metadata:
  priority: high
  version: 1.0
</rule>
