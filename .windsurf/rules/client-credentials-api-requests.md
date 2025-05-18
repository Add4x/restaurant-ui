---
description: Client Credentials - API Requests
globs: src/lib/api-client.ts
---

# Client Credentials Flow - API Requests

<rule>
name: client_credentials_api_requests
description: Making authenticated API requests with client credentials
filters:
  - type: file_path
    pattern: "src/(lib|utils)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "api_requests|client_credentials"

actions:
  - type: suggest
    message: |
      ## Making Authenticated API Requests

      Use this utility function to make authenticated API requests that automatically handle authentication:

      ```typescript
      // src/lib/api-client.ts
      import { cookies } from 'next/headers';

      const API_URL = process.env.API_URL || 'http://localhost:8080';

      /**
       * Make an authenticated API request (server-side)
       */
      export async function fetchWithAuth<T>(
        endpoint: string, 
        options: RequestInit = {}
      ): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        
        // Try the request with existing cookies
        let response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          // Forward the cookies from the incoming request to the API
          credentials: 'include',
        });

        // If unauthorized, try to authenticate and retry the request
        if (response.status === 401) {
          const authenticated = await authenticateServer();
          
          if (!authenticated) {
            throw new Error('Authentication failed');
          }
          
          // Retry the request with new authentication
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
            credentials: 'include',
          });
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        return response.json();
      }
      ```

      ### Usage Example

      ```typescript
      // In a server component or server action
      import { fetchWithAuth } from '@/lib/api-client';

      async function getMenuItems() {
        try {
          const menuItems = await fetchWithAuth<MenuItem[]>('/api/menu');
          return menuItems;
        } catch (error) {
          console.error('Failed to fetch menu items:', error);
          throw error;
        }
      }
      ```

      ### Key Features

      - Automatically handles 401 Unauthorized responses
      - Retries failed requests with fresh authentication
      - Includes credentials with every request
      - Uses proper TypeScript generics for type safety
      - Handles JSON parsing automatically

      ### Error Handling

      The function throws errors for:
      - Network errors
      - Authentication failures
      - Non-OK responses (status >= 400)

      Always wrap calls in try/catch blocks:

      ```typescript
      try {
        const data = await fetchWithAuth<DataType>('/api/endpoint');
        // Handle success
      } catch (error) {
        // Handle error
      }
      ```

      ### Best Practices

      - Use TypeScript generics to specify the expected return type
      - Always include proper error handling
      - Use the `cache` and `credentials` options as shown
      - Keep the base URL in environment variables
      - Log errors appropriately in production

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using client credentials flow"
</rule>
