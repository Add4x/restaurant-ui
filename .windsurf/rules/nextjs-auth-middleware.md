---
description: Next.js - Authentication & Middleware
globs: src/middleware.ts,src/app/api/auth/**/*.ts
---

# Next.js - Authentication & Middleware

<rule>
name: nextjs_auth_middleware
description: Authentication patterns and middleware implementation in Next.js
filters:
  - type: file_path
    pattern: "(src/middleware\\.ts|src/app/api/auth/.*\\.ts)$"
  - type: intent
    pattern: "authentication|middleware|auth_protected"

actions:
  - type: suggest
    message: |
      ## Authentication & Middleware in Next.js

      ### Middleware for Authentication
      ```typescript
      // src/middleware.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      // List of public routes that don't require authentication
      const publicRoutes = ['/login', '/register', '/forgot-password'];
      
      // List of API routes that don't require authentication
      const publicApiRoutes = ['/api/auth/signin', '/api/auth/signup'];
      
      export function middleware(request: NextRequest) {
        const { pathname } = request.nextUrl;
        
        // Skip middleware for public routes and static files
        if (
          publicRoutes.some(route => pathname.startsWith(route)) ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/static') ||
          pathname.includes('.')
        ) {
          return NextResponse.next();
        }
        
        // Check for API routes
        if (pathname.startsWith('/api')) {
          // Skip authentication for public API routes
          if (publicApiRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
          }
          
          // Get the session token from the cookie
          const token = request.cookies.get('session_token')?.value;
          
          if (!token) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
          }
          
          // Add user info to request headers for API routes
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-user-id', 'user123'); // Set from token
          
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        }
        
        // Handle page routes
        const token = request.cookies.get('session_token')?.value;
        
        // Redirect to login if not authenticated
        if (!token) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('from', pathname);
          return NextResponse.redirect(loginUrl);
        }
        
        // User is authenticated, continue with the request
        return NextResponse.next();
      }
      
      // Configure which routes to run the middleware on
      export const config = {
        matcher: [
          /*
           * Match all request paths except for the ones starting with:
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           * - public folder
           */
          '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
        ],
      };
      ```

      ### Authentication API Route
      ```typescript
      // src/app/api/auth/login/route.ts
      import { NextResponse } from 'next/server';
      import { sign } from 'jsonwebtoken';
      import { cookies } from 'next/headers';
      import { compare } from 'bcryptjs';
      import { z } from 'zod';
      
      const loginSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      });
      
      export async function POST(request: Request) {
        try {
          const body = await request.json();
          const validation = loginSchema.safeParse(body);
          
          if (!validation.success) {
            return NextResponse.json(
              { error: 'Validation failed', issues: validation.error.issues },
              { status: 400 }
            );
          }
          
          const { email, password } = validation.data;
          
          // In a real app, fetch user from your database
          const user = await getUserByEmail(email);
          
          if (!user || !(await compare(password, user.password))) {
            return NextResponse.json(
              { error: 'Invalid email or password' },
              { status: 401 }
            );
          }
          
          // Create JWT token
          const token = sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
          );
          
          // Set HTTP-only cookie
          cookies().set({
            name: 'session_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
          });
          
          return NextResponse.json({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
          });
          
        } catch (error) {
          console.error('Login error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### Protected Route Component
      ```tsx
      // src/components/auth/protected-route.tsx
      'use client';
      
      import { useRouter, usePathname } from 'next/navigation';
      import { useEffect } from 'react';
      import { useSession } from './session-context';
      
      export function ProtectedRoute({ children }: { children: React.ReactNode }) {
        const { status } = useSession();
        const router = useRouter();
        const pathname = usePathname();
        
        useEffect(() => {
          if (status === 'unauthenticated') {
            const loginUrl = new URL('/login', window.location.origin);
            loginUrl.searchParams.set('from', pathname);
            router.push(loginUrl.toString());
          }
        }, [status, router, pathname]);
        
        if (status === 'loading') {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        
        if (status === 'authenticated') {
          return <>{children}</>;
        }
        
        return null;
      }
      ```

      ### Session Context
      ```tsx
      // src/contexts/session-context.tsx
      'use client';
      
      import { createContext, useContext, useEffect, useState } from 'react';
      import { usePathname, useRouter } from 'next/navigation';
      
      type User = {
        id: string;
        email: string;
        name: string;
      };
      
      type Session = {
        user: User | null;
        status: 'loading' | 'authenticated' | 'unauthenticated';
      };
      
      const SessionContext = createContext<{
        session: Session;
        signIn: (email: string, password: string) => Promise<void>;
        signOut: () => Promise<void>;
      } | null>(null);
      
      export function SessionProvider({ children }: { children: React.ReactNode }) {
        const [session, setSession] = useState<Session>({
          user: null,
          status: 'loading',
        });
        
        const router = useRouter();
        const pathname = usePathname();
        
        // Check auth status on mount
        useEffect(() => {
          checkAuth();
        }, []);
        
        async function checkAuth() {
          try {
            const response = await fetch('/api/auth/session');
            
            if (response.ok) {
              const { user } = await response.json();
              setSession({ user, status: 'authenticated' });
            } else {
              setSession({ user: null, status: 'unauthenticated' });
              
              // Redirect to login if not on a public page
              const publicPaths = ['/login', '/register', '/forgot-password'];
              if (!publicPaths.some(path => pathname.startsWith(path))) {
                const loginUrl = new URL('/login', window.location.origin);
                loginUrl.searchParams.set('from', pathname);
                router.push(loginUrl.toString());
              }
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            setSession({ user: null, status: 'unauthenticated' });
          }
        }
        
        async function signIn(email: string, password: string) {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || 'Login failed');
          }
          
          const { user } = await response.json();
          setSession({ user, status: 'authenticated' });
          
          // Redirect to the original page or home
          const searchParams = new URLSearchParams(window.location.search);
          const from = searchParams.get('from') || '/';
          router.push(from);
        }
        
        async function signOut() {
          await fetch('/api/auth/logout', { method: 'POST' });
          setSession({ user: null, status: 'unauthenticated' });
          router.push('/login');
        }
        
        return (
          <SessionContext.Provider value={{ session, signIn, signOut }}>
            {children}
          </SessionContext.Provider>
        );
      }
      
      export function useSession() {
        const context = useContext(SessionContext);
        
        if (!context) {
          throw new Error('useSession must be used within a SessionProvider');
        }
        
        return context;
      }
      ```

      ### API Route Protection
      ```typescript
      // src/lib/api-utils.ts
      import { NextResponse } from 'next/server';
      import { getToken } from 'next-auth/jwt';
      import { NextRequestWithAuth } from 'next-auth/middleware';
      
      export async function requireAuth(
        req: NextRequestWithAuth,
        handler: (req: NextRequestWithAuth, userId: string) => Promise<NextResponse>
      ) {
        try {
          // Get token from request
          const token = await getToken({ req });
          
          if (!token) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
          }
          
          // Call the handler with the authenticated user ID
          return handler(req, token.sub!);
          
        } catch (error) {
          console.error('Auth error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      
      // Usage in API route
      export async function GET(request: NextRequest) {
        return requireAuth(request, async (req, userId) => {
          // This code only runs if the user is authenticated
          const data = await getProtectedData(userId);
          return NextResponse.json({ data });
        });
      }
      ```

      ### Role-Based Access Control
      ```typescript
      // src/middleware.ts (partial)
      import { NextResponse } from 'next/server';
      import { getToken } from 'next-auth/jwt';
      
      // Define role-based access control
      const rolePermissions = {
        admin: ['/admin', '/api/admin'],
        user: ['/dashboard', '/api/user'],
      };
      
      export async function middleware(request) {
        const { pathname } = request.nextUrl;
        
        // Skip middleware for public routes
        if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
          return NextResponse.next();
        }
        
        // Get the session token
        const token = await getToken({ req: request });
        
        // Check if route requires authentication
        const isProtectedRoute = Object.values(rolePermissions)
          .some(routes => routes.some(route => pathname.startsWith(route)));
        
        if (isProtectedRoute) {
          if (!token) {
            const signInUrl = new URL('/login', request.url);
            signInUrl.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(signInUrl);
          }
          
          // Check if user has permission for the route
          const userRole = token.role || 'user';
          const hasPermission = rolePermissions[userRole]?.some(
            route => pathname.startsWith(route)
          );
          
          if (!hasPermission) {
            return NextResponse.json(
              { error: 'Forbidden' },
              { status: 403 }
            );
          }
        }
        
        return NextResponse.next();
      }
      ```

      ### Best Practices
      1. **Use HTTP-only cookies** for storing session tokens
      2. **Implement CSRF protection** for state-changing operations
      3. **Use secure flags** on cookies in production
      4. **Implement rate limiting** on authentication endpoints
      5. **Use secure password hashing** (bcrypt, Argon2)
      6. **Implement proper session management** with expiration
      7. **Use HTTPS** in production
      8. **Implement proper CORS** for API routes
      9. **Log authentication events** for security auditing
      10. **Regularly rotate secrets** and update dependencies

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications with authentication"
</rule>
