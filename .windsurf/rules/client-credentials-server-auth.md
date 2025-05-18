---
description: Client Credentials - Server Authentication
globs: src/lib/auth-server.ts
---

# Client Credentials Flow - Server Authentication

<rule>
name: client_credentials_server_auth
description: Server-side authentication implementation for client credentials flow
filters:
  - type: file_path
    pattern: "src/(lib|server)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "server_auth|client_credentials"

actions:
  - type: suggest
    message: |
      ## Server-Side Authentication Implementation

      For server components and server actions, implement authentication on the server:

      ```typescript
      // src/lib/auth-server.ts
      import { cookies } from 'next/headers';

      const API_URL = process.env.API_URL || 'http://localhost:8080';
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;

      /**
       * Authenticate with client credentials flow (server-side)
       */
      export async function authenticateServer(): Promise<boolean> {
        if (!CLIENT_ID || !CLIENT_SECRET) {
          console.error('Client credentials not configured');
          return false;
        }

        try {
          const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
          
          const response = await fetch(`${API_URL}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${authString}`,
            },
            body: new URLSearchParams({
              'grant_type': 'client_credentials',
              'scope': 'api',
            }),
            cache: 'no-store',
          });

          if (!response.ok) {
            console.error('Authentication failed:', await response.text());
            return false;
          }

          // The Java backend sets HTTP-only cookies
          // For server components, we need to forward those cookies
          const cookieStore = cookies();
          response.headers.getSetCookie().forEach(cookie => {
            // Parse the cookie to get name, value, and options
            const [cookieName, cookieValue] = cookie.split('=');
            cookieStore.set(cookieName, cookieValue);
          });

          return true;
        } catch (error) {
          console.error('Authentication error:', error);
          return false;
        }
      }
      ```

      ### Key Points

      - Always validate environment variables before use
      - Use `no-store` cache policy for authentication requests
      - Handle both success and error cases appropriately
      - Forward cookies to maintain authentication state
      - Log errors for debugging

      ### Error Handling

      The function returns a boolean indicating success/failure. Handle the result appropriately:

      ```typescript
      const isAuthenticated = await authenticateServer();
      if (!isAuthenticated) {
        // Handle authentication failure
        throw new Error('Authentication failed');
      }
      ```

      ### Security Considerations

      - Never log sensitive information like client secrets
      - Use HTTPS in production
      - Implement proper error handling to prevent information leakage
      - Set appropriate cookie attributes (Secure, HttpOnly, SameSite)

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using client credentials flow"
</rule>
