---
description: Client Credentials - Best Practices
globs: src/**/*.{ts,tsx}
---

# Client Credentials Flow - Best Practices

<rule>
name: client_credentials_best_practices
description: Best practices for implementing client credentials flow
filters:
  - type: file_extension
    pattern: "\\.(ts|tsx)$"
  - type: intent
    pattern: "best_practices|client_credentials"

actions:
  - type: suggest
    message: |
      ## Client Credentials Flow - Best Practices

      ### Security Guidelines

      1. **Credential Management**
         - Store client secrets in environment variables (never in code)
         - Use different credentials for each environment (dev, staging, prod)
         - Rotate credentials regularly
         - Never log or expose client secrets

      2. **HTTPS**
         - Always use HTTPS in production
         - Enforce HTTPS redirects
         - Use HSTS headers

      3. **Cookies**
         - Set `Secure`, `HttpOnly`, and `SameSite` attributes
         - Use `__Host-` prefix for additional security
         - Set appropriate expiration times

      ### Performance Considerations

      1. **Token Caching**
         - Cache access tokens in memory (not in localStorage)
         - Implement token refresh logic
         - Consider using a token manager utility

      ```typescript
      // Example token manager
      class TokenManager {
        private static instance: TokenManager;
        private token: string | null = null;
        private expiresAt: number = 0;

        private constructor() {}

        static getInstance(): TokenManager {
          if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
          }
          return TokenManager.instance;
        }

        async getToken(): Promise<string> {
          if (this.token && Date.now() < this.expiresAt - 60000) {
            return this.token;
          }
          return this.refreshToken();
        }

        private async refreshToken(): Promise<string> {
          // Implementation for refreshing the token
          const response = await fetch('/api/auth', { method: 'POST' });
          const data = await response.json();
          this.token = data.access_token;
          this.expiresAt = Date.now() + (data.expires_in * 1000);
          return this.token;
        }
      }
      ```

      ### Error Handling

      1. **Common Errors**
         - 401 Unauthorized: Invalid or expired token
         - 403 Forbidden: Insufficient permissions
         - 429 Too Many Requests: Rate limiting

      2. **Retry Logic**
         - Implement exponential backoff for retries
         - Limit the number of retries
         - Provide user feedback during retries

      ```typescript
      async function fetchWithRetry<T>(
        url: string,
        options: RequestInit = {},
        retries = 3
      ): Promise<T> {
        try {
          const response = await fetch(url, options);
          if (response.status === 401) {
            // Handle token refresh
            const tokenManager = TokenManager.getInstance();
            const token = await tokenManager.getToken();
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${token}`,
            };
            return fetchWithRetry(url, options, retries - 1);
          }
          return response.json();
        } catch (error) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
            return fetchWithRetry(url, options, retries - 1);
          }
          throw error;
        }
      }
      ```

      ### Testing

      1. **Unit Tests**
         - Test authentication logic
         - Test error handling
         - Test token refresh

      2. **Integration Tests**
         - Test API endpoints
         - Test cookie handling
         - Test error responses

      ```typescript
      // Example test with Jest
      describe('Authentication', () => {
        it('should authenticate with valid credentials', async () => {
          const response = await request(app)
            .post('/api/auth')
            .expect(200);
          
          expect(response.body).toHaveProperty('access_token');
          expect(response.headers['set-cookie']).toBeDefined();
        });
      });
      ```

      ### Monitoring and Logging

      1. **Logging**
         - Log authentication attempts (without sensitive data)
         - Log errors and warnings
         - Use structured logging

      2. **Monitoring**
         - Monitor authentication success/failure rates
         - Set up alerts for suspicious activity
         - Track token usage and expiration

      ### Common Pitfalls

      1. **Token Leakage**
         - Don't include tokens in URLs
         - Don't log tokens
         - Use secure channels only

      2. **CSRF Protection**
         - Implement CSRF tokens for state-changing requests
         - Use SameSite cookie attribute

      3. **Rate Limiting**
         - Implement rate limiting on authentication endpoints
         - Use exponential backoff for retries

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using client credentials flow"
</rule>
