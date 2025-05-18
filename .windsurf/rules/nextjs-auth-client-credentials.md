---
description: Next.js Authentication - Client Credentials Flow
globs: src/lib/auth-client.ts
---

# Next.js Authentication - Client Credentials Flow

<rule>
name: nextjs_auth_client_credentials
description: Client credentials flow implementation for Next.js
filters:
  - type: file_path
    pattern: "src/(lib|utils|actions)/auth.*\\.(ts|tsx)$"
  - type: intent
    pattern: "client_credentials|oauth2|authentication"

actions:
  - type: suggest
    message: |
      ## Client Credentials Flow Implementation

      ### Authentication Service
      ```typescript
      // src/lib/auth-client.ts
      import { api, ApiError } from './api-client';
      
      const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET; // Server-side only
      const AUTH_URL = '/oauth2/token';
      
      // Client-side authentication status
      let isAuthenticated = false;
      let authPromise: Promise<boolean> | null = null;
      
      export async function authenticate(): Promise<boolean> {
        // Return existing auth promise if in progress
        if (authPromise) {
          return authPromise;
        }
        
        // Create new auth promise
        authPromise = (async () => {
          if (!CLIENT_ID || !CLIENT_SECRET) {
            console.error('Client credentials not configured');
            return false;
          }
          
          try {
            // In a real app, this would be handled by a server action
            const formData = new URLSearchParams();
            formData.append('grant_type', 'client_credentials');
            formData.append('scope', 'read write');
            
            const response = await fetch(AUTH_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
              },
              body: formData,
              credentials: 'include',
            });
            
            if (!response.ok) {
              throw new Error(`Authentication failed: ${response.statusText}`);
            }
            
            isAuthenticated = true;
            return true;
            
          } catch (error) {
            console.error('Authentication error:', error);
            isAuthenticated = false;
            throw error;
            
          } finally {
            // Reset auth promise to allow retries
            authPromise = null;
          }
        })();
        
        return authPromise;
      }
      
      // Higher-order function to wrap API calls with auth
      export function withAuth<TArgs extends any[], TReturn>(
        fn: (...args: TArgs) => Promise<TReturn>
      ): (...args: TArgs) => Promise<TReturn> {
        return async (...args: TArgs): Promise<TReturn> => {
          try {
            return await fn(...args);
          } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
              // Try to re-authenticate once on 401
              try {
                await authenticate();
                // Retry the original request
                return await fn(...args);
              } catch (authError) {
                console.error('Re-authentication failed:', authError);
                throw error; // Throw the original error
              }
            }
            throw error;
          }
        };
      }
      
      // Example usage with API client
      export const authApi = {
        get: <T>(endpoint: string) => 
          withAuth(() => api.get<T>(endpoint))(),
          
        post: <T>(endpoint: string, data: unknown) =>
          withAuth(() => api.post<T>(endpoint, data))(),
          
        // Add other methods as needed
      };
      
      // Auth provider for React context
      export function useAuth() {
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [error, setError] = useState<Error | null>(null);
        
        useEffect(() => {
          const checkAuth = async () => {
            try {
              setIsLoading(true);
              const isAuth = await authenticate();
              setIsAuthenticated(isAuth);
            } catch (err) {
              setError(err instanceof Error ? err : new Error('Authentication failed'));
              setIsAuthenticated(false);
            } finally {
              setIsLoading(false);
            }
          };
          
          checkAuth();
        }, []);
        
        const login = async (): Promise<boolean> => {
          try {
            setIsLoading(true);
            const result = await authenticate();
            setIsAuthenticated(result);
            return result;
          } catch (err) {
            setError(err instanceof Error ? err : new Error('Login failed'));
            setIsAuthenticated(false);
            return false;
          } finally {
            setIsLoading(false);
          }
        };
        
        const logout = async (): Promise<void> => {
          try {
            // Call your logout endpoint if needed
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
          } finally {
            // Clear client-side auth state
            isAuthenticated = false;
            setIsAuthenticated(false);
          }
        };
        
        return {
          isAuthenticated,
          isLoading,
          error,
          login,
          logout,
        };
      }
      ```

      ### Server Action for Authentication
      ```typescript
      // src/actions/auth.ts
      'server-only';
      
      import { cookies } from 'next/headers';
      import { redirect } from 'next/navigation';
      import { z } from 'zod';
      
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;
      const AUTH_URL = `${process.env.AUTH_SERVER_URL}/oauth2/token`;
      
      const authResponseSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in: z.number().optional(),
        scope: z.string().optional(),
      });
      
      export async function authenticateWithClientCredentials() {
        if (!CLIENT_ID || !CLIENT_SECRET) {
          throw new Error('Client credentials not configured');
        }
        
        try {
          const formData = new URLSearchParams();
          formData.append('grant_type', 'client_credentials');
          formData.append('scope', 'read write');
          
          const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            },
            body: formData,
          });
          
          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Authentication failed: ${error}`);
          }
          
          const data = authResponseSchema.parse(await response.json());
          
          // Set HTTP-only cookie with the token
          cookies().set({
            name: 'session_token',
            value: data.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: data.expires_in || 3600, // Default to 1 hour
          });
          
          return { success: true };
          
        } catch (error) {
          console.error('Authentication error:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Authentication failed' 
          };
        }
      }
      
      export async function requireAuth() {
        const token = cookies().get('session_token')?.value;
        
        if (!token) {
          // Try to authenticate
          const result = await authenticateWithClientCredentials();
          if (!result.success) {
            redirect('/login');
          }
        }
        
        return { isAuthenticated: true };
      }
      ```

      ### Protecting API Routes
      ```typescript
      // src/app/api/protected/route.ts
      import { NextResponse } from 'next/server';
      import { requireAuth } from '@/actions/auth';
      
      export async function GET() {
        try {
          // This will handle authentication or redirect
          await requireAuth();
          
          // Your protected logic here
          return NextResponse.json({ message: 'Protected data' });
          
        } catch (error) {
          console.error('Protected route error:', error);
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }
      ```

      ### Protecting Server Components
      ```tsx
      // src/app/protected/page.tsx
      import { requireAuth } from '@/actions/auth';
      
      export default async function ProtectedPage() {
        // This will handle authentication or redirect
        await requireAuth();
        
        return (
          <div>
            <h1>Protected Content</h1>
            {/* Your protected content */}
          </div>
        );
      }
      ```

      ### Protecting Client Components
      ```tsx
      // src/components/ProtectedClientComponent.tsx
      'use client';
      
      import { useEffect } from 'react';
      import { useRouter } from 'next/navigation';
      import { useAuth } from '@/lib/auth-client';
      
      export default function ProtectedClientComponent({
        children,
      }: {
        children: React.ReactNode;
      }) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        
        useEffect(() => {
          if (!isLoading && !isAuthenticated) {
            router.push('/login');
          }
        }, [isAuthenticated, isLoading, router]);
        
        if (isLoading) {
          return <div>Loading...</div>;
        }
        
        if (!isAuthenticated) {
          return null; // Will redirect in useEffect
        }
        
        return <>{children}</>;
      }
      ```

      ### Environment Variables
      ```env
      # .env.local
      NEXT_PUBLIC_API_URL=http://localhost:8080
      NEXT_PUBLIC_CLIENT_ID=your-client-id
      CLIENT_SECRET=your-client-secret
      AUTH_SERVER_URL=http://localhost:8080
      ```

      ### Security Considerations
      - Never expose client secrets in client-side code
      - Always use HTTPS in production
      - Set appropriate cookie attributes (HttpOnly, Secure, SameSite)
      - Implement proper CORS configuration
      - Rotate client credentials regularly
      - Monitor and log authentication attempts

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using client credentials flow"
</rule>
