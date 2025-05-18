---
description: Java Auth - API Client
globs: src/lib/api-client.ts
---

# Java Backend Authentication - API Client

<rule>
name: java_auth_api_client
description: API client implementation for Java backend with HTTP-only cookies
filters:
  - type: file_path
    pattern: "src/(lib|utils)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "api_client|http_client|fetch"

actions:
  - type: suggest
    message: |
      ## API Client for Java Backend

      Implement a reusable API client that handles authentication cookies:

      ```typescript
      // src/lib/api-client.ts
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      export async function fetchWithAuth<T>(
        endpoint: string, 
        options: RequestInit = {}
      ): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;
        
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            // This is crucial - it ensures cookies are sent with the request
            credentials: 'include',
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Handle unauthorized (redirect to login if needed)
              window.location.href = '/login';
              throw new Error('Authentication required');
            }
            throw new Error(`API error: ${response.status}`);
          }

          return response.json();
        } catch (error) {
          console.error('API request failed:', error);
          throw error;
        }
      }
      ```

      ### Usage Example

      ```typescript
      // Example usage in a component or hook
      async function fetchData() {
        try {
          const data = await fetchWithAuth<YourDataType>('/api/your-endpoint');
          return data;
        } catch (error) {
          // Handle error
        }
      }
      ```

      ### Key Points

      - Always include `credentials: 'include'` for cookie-based auth
      - Handle 401 responses by redirecting to login
      - Use TypeScript generics for type safety
      - Centralize API URL configuration

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Frontend applications connecting to Java backend with HTTP-only cookies"
</rule>
