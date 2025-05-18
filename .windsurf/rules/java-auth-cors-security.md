---
description: Java Auth - CORS & Security
globs: src/middleware.ts
---

# Java Backend Authentication - CORS & Security

<rule>
name: java_auth_cors_security
description: CORS and security configurations for Java backend authentication
filters:
  - type: file_path
    pattern: "(middleware|next\.config)\\.(ts|js)$"
  - type: intent
    pattern: "cors|security|http_only"

actions:
  - type: suggest
    message: |
      ## CORS and Security Configuration

      ### Next.js Middleware for CORS

      ```typescript
      // src/middleware.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      const allowedOrigins = [
        'http://localhost:3000',
        'https://your-production-domain.com',
      ];
      
      export function middleware(request: NextRequest) {
        const origin = request.headers.get('origin');
        
        // Handle preflight requests
        if (request.method === 'OPTIONS') {
          const response = new NextResponse(null, { status: 204 });
          
          // Set CORS headers
          if (origin && allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.headers.set('Access-Control-Allow-Credentials', 'true');
          }
          
          return response;
        }
        
        // Set CORS headers for all responses
        const response = NextResponse.next();
        
        if (origin && allowedOrigins.includes(origin)) {
          response.headers.set('Access-Control-Allow-Origin', origin);
          response.headers.set('Access-Control-Allow-Credentials', 'true');
        }
        
        return response;
      }
      
      export const config = {
        matcher: '/api/:path*',
      };
      ```

      ### Next.js API Route Configuration

      ```typescript
      // src/app/api/example/route.ts
      import { NextResponse } from 'next/server';
      
      export async function GET() {
        const response = NextResponse.json({ message: 'Hello, World!' });
        
        // Set secure cookie attributes
        response.cookies.set({
          name: 'example',
          value: 'value',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        return response;
      }
      ```

      ### Java Backend CORS Configuration

      ```java
      // Java Spring Boot Configuration
      @Configuration
      public class WebConfig implements WebMvcConfigurer {
          
          @Value("${app.allowed-origins}")
          private String[] allowedOrigins;
          
          @Override
          public void addCorsMappings(CorsRegistry registry) {
              registry.addMapping("/**")
                  .allowedOrigins(allowedOrigins)
                  .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .allowedHeaders("*")
                  .allowCredentials(true);
          }
          
          @Bean
          public WebMvcConfigurer corsConfigurer() {
              return new WebMvcConfigurer() {
                  @Override
                  public void addCorsMappings(CorsRegistry registry) {
                      registry.addMapping("/**")
                          .allowedOrigins(allowedOrigins)
                          .allowedMethods("*")
                          .allowedHeaders("*")
                          .allowCredentials(true);
                  }
              };
          }
      }
      ```

      ### Security Headers

      Add security headers to your Next.js application:

      ```javascript
      // next.config.js
      const securityHeaders = [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ];
      
      module.exports = {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: securityHeaders,
            },
          ];
        },
      };
      ```

      ### Secure Cookie Configuration

      When setting cookies:

      ```typescript
      // In your auth service or API route
      response.cookies.set({
        name: 'session',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      ```

      ### CSRF Protection

      Implement CSRF protection:

      ```typescript
      // src/lib/csrf.ts
      import { randomBytes } from 'crypto';
      
      export function generateCsrfToken(): string {
        return randomBytes(32).toString('hex');
      }
      
      // In your login form
      export function LoginForm() {
        const [csrfToken, setCsrfToken] = useState('');
        
        useEffect(() => {
          // Generate CSRF token on client side
          setCsrfToken(generateCsrfToken());
          
          // Store in HTTP-only cookie
          document.cookie = `csrf_token=${csrfToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;
        }, []);
        
        return (
          <form>
            <input type="hidden" name="csrf_token" value={csrfToken} />
            {/* Other form fields */}
          </form>
        );
      }
      ```

      ### Rate Limiting

      ```typescript
      // src/lib/rate-limit.ts
      import { LRUCache } from 'lru-cache';
      
      type Options = {
        uniqueTokenPerInterval?: number;
        interval?: number;
      };
      
      export const rateLimit = (options?: Options) => {
        const tokenCache = new LRUCache({
          max: options?.uniqueTokenPerInterval || 500,
          ttl: options?.interval || 60000,
        });
      
        return {
          check: (req: NextRequest, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
              const tokenCount = (tokenCache.get(token) as number[]) || [0];
              if (tokenCount[0] === 0) {
                tokenCache.set(token, [1]);
              } else {
                tokenCount[0] += 1;
                tokenCache.set(token, tokenCount);
              }
              
              if (tokenCount[0] > limit) {
                reject(new Error('Rate limit exceeded'));
              } else {
                resolve();
              }
            }),
        };
      };
      
      // Usage in API route
      const limiter = rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500, // Max users per second
      });
      
      export async function POST(request: Request) {
        try {
          await limiter.check(request, 10, 'CACHE_TOKEN'); // 10 requests per minute
          // Handle request
        } catch (error) {
          return NextResponse.json(
            { error: 'Rate limit exceeded' },
            { status: 429 }
          );
        }
      }
      ```

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "CORS and security configurations for Next.js and Java backend"
</rule>
