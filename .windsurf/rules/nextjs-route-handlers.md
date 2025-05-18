---
description: Next.js - Route Handlers
globs: src/app/api/**/route.ts
---

# Next.js - Route Handlers

<rule>
name: nextjs_route_handlers
description: Standards for implementing route handlers in Next.js App Router
filters:
  - type: file_path
    pattern: "src/app/api/.*/route\\.(ts|tsx)$"
  - type: intent
    pattern: "route_handlers|api_routes"

actions:
  - type: suggest
    message: |
      ## Route Handlers in Next.js App Router

      Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.

      ### Basic Structure
      ```typescript
      // src/app/api/hello/route.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      // GET /api/hello
      export async function GET(request: NextRequest) {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name') || 'World';
        
        // Return a JSON response
        return NextResponse.json({ message: `Hello, ${name}!` });
      }
      
      // POST /api/hello
      export async function POST(request: NextRequest) {
        try {
          // Parse JSON body
          const data = await request.json();
          
          // Validate input
          if (!data.name) {
            return NextResponse.json(
              { error: 'Name is required' },
              { status: 400 }
            );
          }
          
          // Process data
          const greeting = `Hello, ${data.name}!`;
          
          // Return success response
          return NextResponse.json(
            { message: greeting },
            { status: 201 }
          );
          
        } catch (error) {
          console.error('Error processing request:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      
      // Other HTTP methods
      export async function PUT(request: NextRequest) { /* ... */ }
      export async function DELETE(request: NextRequest) { /* ... */ }
      export async function PATCH(request: NextRequest) { /* ... */ }
      ```

      ### Dynamic Route Segments
      ```typescript
      // src/app/api/users/[userId]/route.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      export async function GET(
        request: NextRequest,
        { params }: { params: { userId: string } }
      ) {
        const userId = params.userId;
        
        try {
          // Fetch user by ID
          const user = await getUserById(userId);
          
          if (!user) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }
          
          return NextResponse.json({ user });
          
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
          );
        }
      }
      ```

      ### Route Segment Configuration
      ```typescript
      // src/app/api/route.ts
      import { NextResponse } from 'next/server';
      import type { NextRequest } from 'next/server';
      
      // Config for the route
      export const dynamic = 'force-dynamic'; // Always fetch fresh data
      export const revalidate = 60; // Revalidate every 60 seconds
      export const fetchCache = 'force-no-store'; // Don't cache
      
      // Runtime configuration
      export const runtime = 'nodejs'; // or 'edge'
      
      export async function GET(request: NextRequest) {
        // Your route handler
      }
      ```

      ### Request Validation with Zod
      ```typescript
      // src/app/api/users/route.ts
      import { NextResponse } from 'next/server';
      import { z } from 'zod';
      
      // Define validation schema
      const createUserSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        role: z.enum(['user', 'admin']).default('user'),
      });
      
      export async function POST(request: Request) {
        try {
          const body = await request.json();
          
          // Validate request body
          const validation = createUserSchema.safeParse(body);
          
          if (!validation.success) {
            return NextResponse.json(
              { 
                error: 'Validation failed',
                issues: validation.error.issues 
              },
              { status: 400 }
            );
          }
          
          // Data is now properly typed
          const { name, email, role } = validation.data;
          
          // Create user...
          const user = await createUser({ name, email, role });
          
          return NextResponse.json(
            { user },
            { status: 201 }
          );
          
        } catch (error) {
          console.error('Error creating user:', error);
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      }
      ```

      ### File Uploads
      ```typescript
      // src/app/api/upload/route.ts
      import { writeFile } from 'fs/promises';
      import { NextResponse } from 'next/server';
      import { join } from 'path';
      
      export async function POST(request: Request) {
        try {
          const formData = await request.formData();
          const file = formData.get('file') as File | null;
          
          if (!file) {
            return NextResponse.json(
              { error: 'No file provided' },
              { status: 400 }
            );
          }
          
          // Convert file to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Save file
          const path = join(process.cwd(), 'public/uploads', file.name);
          await writeFile(path, buffer);
          
          return NextResponse.json({
            success: true,
            path: `/uploads/${file.name}`
          });
          
        } catch (error) {
          console.error('Upload error:', error);
          return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
          );
        }
      }
      ```

      ### CORS Headers
      ```typescript
      // src/app/api/cors/route.ts
      import { NextResponse } from 'next/server';
      
      // Set CORS headers in the response
      function setCorsHeaders(response: NextResponse) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
      }
      
      export async function GET() {
        const response = NextResponse.json({ message: 'CORS enabled' });
        return setCorsHeaders(response);
      }
      
      // Handle OPTIONS method for CORS preflight
      export async function OPTIONS() {
        const response = new NextResponse(null, { status: 204 });
        return setCorsHeaders(response);
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
      
      export function rateLimit(options?: Options) {
        const tokenCache = new LRUCache({
          max: options?.uniqueTokenPerInterval || 500,
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
      
      // Usage in route handler
      const limiter = rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500, // Max users per second
      });
      
      export async function POST(request: Request) {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        
        try {
          await limiter.check(request, 10, ip); // 10 requests per minute
          // Handle request
          return NextResponse.json({ success: true });
        } catch (error) {
          return NextResponse.json(
            { error: 'Rate limit exceeded' },
            { status: 429 }
          );
        }
      }
      ```

      ### Best Practices
      1. **Use TypeScript**: Always type your route handlers and responses
      2. **Validate Input**: Use Zod or similar for request validation
      3. **Handle Errors**: Implement proper error handling and status codes
      4. **Use Environment Variables**: For sensitive configuration
      5. **Rate Limiting**: Protect your API from abuse
      6. **CORS**: Configure CORS appropriately
      7. **Security Headers**: Set appropriate security headers
      8. **Logging**: Log important events and errors
      9. **Testing**: Write tests for your API routes
      10. **Documentation**: Document your API endpoints

metadata:
  priority: high
  version: 1.0
  last_updated: "2025-05-17"
  applies_to: "Next.js applications using App Router"
</rule>
