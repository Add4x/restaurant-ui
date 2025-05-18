---
description: Client Credentials - API Routes
globs: src/app/api/**/route.ts
---

# Client Credentials Flow - API Routes

<rule>
name: client_credentials_api_routes
description: Implementing API routes with client credentials flow
filters:
  - type: file_path
    pattern: "src/app/api/.*/route\\.ts$"
  - type: intent
    pattern: "api_routes|client_credentials"

actions:
  - type: suggest
    message: |
      ## API Route Handlers with Client Credentials

      For API routes that need to authenticate with the backend:

      ```typescript
      // src/app/api/auth/route.ts
      import { NextRequest, NextResponse } from 'next/server';

      const API_URL = process.env.API_URL || 'http://localhost:8080';
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;

      export async function POST(request: NextRequest) {
        if (!CLIENT_ID || !CLIENT_SECRET) {
          return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
          );
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
          });

          if (!response.ok) {
            return NextResponse.json(
              { error: 'Authentication failed' },
              { status: response.status }
            );
          }

          // Forward the response with cookies to the client
          const data = await response.json();
          
          // Create a new response with the data
          const nextResponse = NextResponse.json(data, { status: 200 });
          
          // Forward any cookies from the auth server
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              nextResponse.headers.append('Set-Cookie', value);
            }
          });
          
          return nextResponse;
        } catch (error) {
          console.error('Authentication error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### Key Components

      1. **Environment Variables**
         - Access credentials from environment variables
         - Provide fallback values for development

      2. **Error Handling**
         - Validate required configuration
         - Handle fetch errors
         - Return appropriate HTTP status codes

      3. **Response Handling**
         - Forward the auth server response
         - Preserve cookies for session management
         - Set appropriate CORS headers if needed

      ### Usage in Client Components

      ```typescript
      // Client component
      'use client';

      async function login() {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            credentials: 'include', // Important for cookies
          });
          
          if (!response.ok) {
            throw new Error('Authentication failed');
          }
          
          const data = await response.json();
          // Handle successful authentication
        } catch (error) {
          // Handle error
        }
      }
      ```

      ### Security Considerations

      - Never expose client secrets to the client
      - Use HTTPS in production
      - Set appropriate CORS policies
      - Validate all incoming requests
      - Rate limit authentication endpoints
      - Use secure cookie attributes (HttpOnly, Secure, SameSite)

      ### Testing

      Test your API routes with curl:

      ```bash
      # Get access token
      curl -X POST http://localhost:3000/api/auth \
        -H "Content-Type: application/json" \
        -c cookies.txt
      ```

      ```bash
      # Use the token in subsequent requests
      curl http://localhost:3000/api/protected \
        -b cookies.txt
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js API routes using client credentials flow"
</rule>
