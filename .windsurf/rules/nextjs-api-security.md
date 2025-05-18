---
description: Next.js - API Security Best Practices
globs: src/middleware.ts,src/app/api/**/*.ts
---

# Next.js - API Security Best Practices

<rule>
name: nextjs_api_security
description: Security best practices for Next.js API routes
filters:
  - type: file_path
    pattern: "(src/middleware\\.ts|src/app/api/.*\\.ts)$"
  - type: intent
    pattern: "security|auth|protection"

actions:
  - type: suggest
    message: |
      ## API Security Best Practices

      ### 1. Authentication & Authorization
      ```typescript
      // src/middleware/auth.ts
      import { NextResponse } from 'next/server';
      import { getToken } from 'next-auth/jwt';
      import type { NextRequestWithAuth } from 'next-auth/middleware';
      
      // List of public API routes
      const publicApiRoutes = [
        '/api/auth/signin',
        '/api/auth/signup',
        '/api/public',
      ];
      
      export async function requireAuth(
        req: NextRequestWithAuth,
        roles: string[] = []
      ) {
        // Skip auth for public routes
        if (publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return { user: null };
        }
        
        // Get token from request
        const token = await getToken({ req });
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Check if user has required role
        if (roles.length > 0 && !roles.includes(token.role)) {
          throw new Error('Insufficient permissions');
        }
        
        return { user: token };
      }
      ```

      ### 2. Rate Limiting
      ```typescript
      // src/lib/rate-limit.ts
      import { LRUCache } from 'lru-cache';
      
      type Options = {
        uniqueTokenPerInterval?: number;
        interval?: number;
      };
      
      export function createRateLimiter(options?: Options) {
        const tokenCache = new LRUCache({
          max: options?.uniqueTokenPerInterval || 5000,
          ttl: options?.interval || 60000,
        });
      
        return {
          check: (req: Request, limit: number, token: string) =>
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
      }
      
      // Global rate limiter (60 requests per minute per IP)
      export const globalRateLimiter = createRateLimiter({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 10000, // Max users
      });
      
      // Stricter rate limiter for auth endpoints (5 requests per minute per IP)
      export const authRateLimiter = createRateLimiter({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 10000, // Max users
      });
      ```

      ### 3. Input Validation
      ```typescript
      // src/lib/validation.ts
      import { z } from 'zod';
      import { ValidationError } from './errors';
      
      // Sanitize user input to prevent XSS
      export function sanitizeInput(input: string): string {
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      
      // Common validation schemas
      export const emailSchema = z.string()
        .email('Invalid email address')
        .transform(val => sanitizeInput(val.trim()));
      
      export const passwordSchema = z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number');
      
      // Validate and sanitize request body
      export async function validateAndSanitize<T>(
        schema: z.ZodSchema<T>,
        data: unknown
      ): Promise<T> {
        const result = schema.safeParse(data);
        
        if (!result.success) {
          const errors = result.error.errors.reduce((acc, curr) => {
            const path = curr.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(curr.message);
            return acc;
          }, {} as Record<string, string[]>);
          
          throw new ValidationError(errors);
        }
        
        return result.data;
      }
      ```

      ### 4. CORS Configuration
      ```typescript
      // src/middleware/cors.ts
      import { NextResponse } from 'next/server';
      
      const allowedOrigins = [
        'http://localhost:3000',
        'https://your-production-domain.com',
      ];
      
      export function corsHeaders(request: Request) {
        const origin = request.headers.get('origin');
        const headers = new Headers();
        
        if (origin && allowedOrigins.includes(origin)) {
          headers.set('Access-Control-Allow-Origin', origin);
          headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          headers.set('Access-Control-Allow-Credentials', 'true');
        }
        
        return headers;
      }
      
      // Handle preflight requests
      export function handlePreflight(request: Request) {
        const headers = corsHeaders(request);
        return new NextResponse(null, { headers, status: 204 });
      }
      ```

      ### 5. Security Headers
      ```typescript
      // src/middleware/security-headers.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      export function securityHeaders(request: NextRequest) {
        // List of domains allowed to embed this site in an iframe
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self'",
          "connect-src 'self' https://*.your-api.com",
          "frame-ancestors 'self'",
          "form-action 'self'",
          "base-uri 'self'",
        ].join('; ');
        
        const headers = new Headers();
        
        // Security Headers
        headers.set('Content-Security-Policy', csp);
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('X-XSS-Protection', '1; mode=block');
        headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        
        // HSTS (only in production)
        if (process.env.NODE_ENV === 'production') {
          headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        }
        
        return headers;
      }
      ```

      ### 6. API Route Protection
      ```typescript
      // src/app/api/protected/route.ts
      import { NextResponse } from 'next/server';
      import { getToken } from 'next-auth/jwt';
      import { globalRateLimiter } from '@/lib/rate-limit';
      import { securityHeaders } from '@/middleware/security-headers';
      
      export async function GET(request: Request) {
        try {
          // Rate limiting
          const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
          await globalRateLimiter.check(request, 100, ip); // 100 requests per minute
          
          // Verify authentication
          const token = await getToken({ 
            req: request as any,
            secret: process.env.NEXTAUTH_SECRET 
          });
          
          if (!token) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
          }
          
          // Check user role
          if (token.role !== 'admin') {
            return NextResponse.json(
              { error: 'Forbidden' },
              { status: 403 }
            );
          }
          
          // Get protected data
          const data = await getProtectedData();
          
          // Return response with security headers
          const response = NextResponse.json({ data });
          
          // Add security headers
          const headers = securityHeaders(request);
          headers.forEach((value, key) => {
            response.headers.set(key, value);
          });
          
          return response;
          
        } catch (error) {
          if (error.message === 'Rate limit exceeded') {
            return NextResponse.json(
              { error: 'Too many requests' },
              { status: 429 }
            );
          }
          
          console.error('Protected route error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### 7. Secure Cookies
      ```typescript
      // src/lib/auth/cookies.ts
      import { cookies } from 'next/headers';
      
      const SESSION_COOKIE = 'session_token';
      const CSRF_COOKIE = 'csrf_token';
      
      export function setAuthCookies({
        sessionToken,
        csrfToken,
      }: {
        sessionToken: string;
        csrfToken: string;
      }) {
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Session cookie (HTTP-only, Secure, SameSite=Lax)
        cookies().set({
          name: SESSION_COOKIE,
          value: sessionToken,
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        // CSRF cookie (not HTTP-only, used by the client)
        cookies().set({
          name: CSRF_COOKIE,
          value: csrfToken,
          secure: isProduction,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
      
      export function clearAuthCookies() {
        cookies().delete(SESSION_COOKIE);
        cookies().delete(CSRF_COOKIE);
      }
      ```

      ### 8. CSRF Protection
      ```typescript
      // src/middleware/csrf.ts
      import { NextResponse } from 'next/server';
      import { cookies } from 'next/headers';
      import { verify } from 'jsonwebtoken';
      
      const CSRF_HEADER = 'x-csrf-token';
      
      export async function validateCsrfToken(request: Request) {
        // Skip for GET, HEAD, OPTIONS requests
        if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
          return true;
        }
        
        // Get CSRF token from header and cookie
        const csrfHeader = request.headers.get(CSRF_HEADER);
        const csrfCookie = cookies().get('csrf_token')?.value;
        
        if (!csrfHeader || !csrfCookie) {
          return false;
        }
        
        // Compare tokens
        return csrfHeader === csrfCookie;
      }
      
      // Usage in API route
      export async function POST(request: Request) {
        // Verify CSRF token
        const isValidCsrf = await validateCsrfToken(request);
        
        if (!isValidCsrf) {
          return NextResponse.json(
            { error: 'Invalid CSRF token' },
            { status: 403 }
          );
        }
        
        // Process the request...
      }
      ```

      ### 9. Request Logging
      ```typescript
      // src/middleware/logger.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      export async function logRequest(request: NextRequest) {
        const { method, url, headers } = request;
        const userAgent = headers.get('user-agent') || '';
        const ip = headers.get('x-forwarded-for') || 'unknown';
        
        // Log request details
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          method,
          url,
          userAgent,
          ip,
          // Don't log sensitive headers
          headers: {
            'content-type': headers.get('content-type'),
            'content-length': headers.get('content-length'),
            'accept': headers.get('accept'),
          },
        }));
        
        // Log request body for non-GET requests (be careful with sensitive data)
        if (method !== 'GET') {
          try {
            const body = await request.clone().text();
            if (body) {
              console.log('Request body:', body.substring(0, 1000)); // Limit log size
            }
          } catch (error) {
            console.error('Error logging request body:', error);
          }
        }
      }
      
      // Log response
      export function logResponse(response: NextResponse, request: NextRequest) {
        const { method, url } = request;
        const { status } = response;
        
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          method,
          url,
          status,
          'response-time': Date.now() - request.startTime,
        }));
      }
      
      // Usage in middleware
      export async function withLogging(request: NextRequest) {
        // Add start time to request
        (request as any).startTime = Date.now();
        
        // Log request
        await logRequest(request);
        
        // Get response
        const response = NextResponse.next();
        
        // Log response
        logResponse(response, request);
        
        return response;
      }
      ```

      ### 10. Security Audit
      ```typescript
      // scripts/security-audit.ts
      import { execSync } from 'child_process';
      import fs from 'fs';
      import path from 'path';
      
      // Check for known vulnerabilities in dependencies
      function checkDependencies() {
        console.log('Checking for vulnerable dependencies...');
        
        try {
          // Run npm audit
          const result = execSync('npm audit --json').toString();
          const audit = JSON.parse(result);
          
          if (audit.vulnerabilities?.high || audit.vulnerabilities?.critical) {
            console.error('Critical or High severity vulnerabilities found!');
            console.log(JSON.stringify(audit.vulnerabilities, null, 2));
            process.exit(1);
          }
          
          console.log('No critical vulnerabilities found in dependencies');
          
        } catch (error) {
          console.error('Failed to check dependencies:', error);
          process.exit(1);
        }
      }
      
      // Check for exposed secrets
      function checkSecrets() {
        console.log('Checking for exposed secrets...');
        
        const secretsPatterns = [
          /password\s*[=:][\s\'"]*[\w\d!@#$%^&*]+/gi,
          /secret[\s\w]*[=:][\s\'"]*[\w\d!@#$%^&*]+/gi,
          /api[_-]?key[\s\w]*[=:][\s\'"]*[\w\d!@#$%^&*]+/gi,
          /token[\s\w]*[=:][\s\'"]*[\w\d!@#$%^&*]+/gi,
        ];
        
        // Scan files for secrets
        const scanDirectory = (dir: string) => {
          const files = fs.readdirSync(dir);
          
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
              // Skip node_modules and .next directories
              if (file === 'node_modules' || file === '.next') continue;
              scanDirectory(filePath);
            } else if (stat.isFile()) {
              // Skip binary files
              if (/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i.test(file)) continue;
              
              // Skip minified JS/CSS
              if (/\.min\.[j|t]sx?$|\.min\.css$/i.test(file)) continue;
              
              // Read file content
              const content = fs.readFileSync(filePath, 'utf8');
              
              // Check for secrets
              for (const pattern of secretsPatterns) {
                const matches = content.match(pattern);
                if (matches) {
                  console.error(`Potential secret found in ${filePath}:`);
                  matches.forEach(match => console.log(`  - ${match}`));
                }
              }
            }
          }
        };
        
        scanDirectory(process.cwd());
        console.log('Secret scanning completed');
      }
      
      // Run security checks
      function runSecurityAudit() {
        console.log('Starting security audit...');
        
        checkDependencies();
        checkSecrets();
        
        console.log('Security audit completed successfully');
      }
      
      runSecurityAudit();
      ```

      ### Best Practices Summary
      1. **Always validate and sanitize user input**
      2. **Use HTTPS in production**
      3. **Implement proper authentication and authorization**
      4. **Use secure, HTTP-only cookies for sessions**
      5. **Implement CSRF protection**
      6. **Set appropriate security headers**
      7. **Implement rate limiting**
      8. **Log security-relevant events**
      9. **Keep dependencies updated**
      10. **Regularly audit your code and dependencies**

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js API security implementation"
</rule>
