---
description: Java Auth - Login Implementation
globs: src/app/login/**/*.{ts,tsx}
---

# Java Backend Authentication - Login

<rule>
name: java_auth_login
description: Login implementation for Java backend with HTTP-only cookies
filters:
  - type: file_path
    pattern: "src/(app/login|components/auth)/.*\\.(ts|tsx)$"
  - type: intent
    pattern: "login|authentication|signin"

actions:
  - type: suggest
    message: |
      ## Login Implementation with Java Backend

      Implement login functionality that works with Java backend's HTTP-only cookies:

      ```typescript
      // src/app/login/page.tsx
      'use client';
      
      import { useRouter } from 'next/navigation';
      import { useState } from 'react';
      import { Button } from '@/components/ui/button';
      import { Input } from '@/components/ui/input';
      import { useToast } from '@/components/ui/use-toast';
      
      export default function LoginPage() {
        const router = useRouter();
        const { toast } = useToast();
        const [isLoading, setIsLoading] = useState(false);
        
        async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
          event.preventDefault();
          setIsLoading(true);
          
          const formData = new FormData(event.currentTarget);
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;
          
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ username, password }),
            });
            
            if (response.ok) {
              // The Java backend sets HTTP-only cookies in the response
              router.push('/dashboard');
              router.refresh(); // Ensure client-side state is updated
            } else {
              const error = await response.json();
              throw new Error(error.message || 'Login failed');
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: error instanceof Error ? error.message : 'Login failed',
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
          }
        }
        
        return (
          <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              <h1 className="text-2xl font-bold">Login</h1>
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        );
      }
      ```

      ### Login API Route

      ```typescript
      // src/app/api/auth/login/route.ts
      import { NextResponse } from 'next/server';
      
      export async function POST(request: Request) {
        const { username, password } = await request.json();
        const API_URL = process.env.API_URL || 'http://localhost:8080';
        
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
              { error: error.message || 'Login failed' },
              { status: response.status }
            );
          }
          
          // Forward the response with cookies to the client
          const data = await response.json();
          const nextResponse = NextResponse.json(data);
          
          // Forward any cookies from the auth server
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              nextResponse.headers.append('Set-Cookie', value);
            }
          });
          
          return nextResponse;
        } catch (error) {
          console.error('Login error:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### Key Points

      - Use `credentials: 'include'` for all auth-related requests
      - Handle loading and error states
      - Provide clear user feedback
      - Secure against CSRF attacks
      - Validate all inputs

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Login pages and authentication flows with Java backend"
</rule>
