---
description: Java Auth - Client Credentials Flow
globs: src/lib/auth-client.ts
---

# Java Backend Authentication - Client Credentials

<rule>
name: java_auth_client_credentials
description: Client credentials flow implementation for Java backend
filters:
  - type: file_path
    pattern: "src/(lib|utils)/auth.*\\.(ts|tsx)$"
  - type: intent
    pattern: "client_credentials|service_auth"

actions:
  - type: suggest
    message: |
      ## Client Credentials Flow Implementation

      For service-to-service authentication using client credentials:

      ```typescript
      // src/lib/auth-client.ts
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;
      
      export async function getClientCredentialsToken() {
        if (!CLIENT_ID || !CLIENT_SECRET) {
          throw new Error('Client credentials not configured');
        }

        try {
          const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
          
          const response = await fetch(`${API_URL}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${authString}`
            },
            body: new URLSearchParams({
              'grant_type': 'client_credentials',
              'scope': 'api'
            }),
            credentials: 'include'
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to obtain token: ${error}`);
          }

          // The token is set as an HTTP-only cookie by the server
          return true;
        } catch (error) {
          console.error('Failed to get token:', error);
          throw error;
        }
      }
      ```

      ### Usage in Server Components

      ```typescript
      // src/app/api/protected/route.ts
      import { NextResponse } from 'next/server';
      import { getClientCredentialsToken } from '@/lib/auth-client';
      
      export async function GET() {
        try {
          await getClientCredentialsToken();
          
          // Now make your authenticated request
          const response = await fetch(`${process.env.API_URL}/api/protected`, {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          
          const data = await response.json();
          return NextResponse.json(data);
          
        } catch (error) {
          console.error('API request failed:', error);
          return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
          );
        }
      }
      ```

      ### Security Considerations

      - Store client secrets in environment variables
      - Use HTTPS in production
      - Implement proper error handling
      - Log errors securely
      - Rotate client secrets regularly

      ### Error Handling

      ```typescript
      async function fetchWithRetry() {
        const maxRetries = 3;
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
          try {
            // Attempt to get a fresh token
            await getClientCredentialsToken();
            
            // Make the authenticated request
            const response = await fetch(`${API_URL}/api/data`, {
              credentials: 'include',
            });
            
            if (response.ok) {
              return await response.json();
            }
            
            if (response.status === 401 && i < maxRetries - 1) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
              continue;
            }
            
            throw new Error(`Request failed with status ${response.status}`);
            
          } catch (error) {
            lastError = error;
            if (i === maxRetries - 1) {
              throw lastError;
            }
          }
        }
      }
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Service-to-service authentication with Java backend"
</rule>
