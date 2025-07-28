# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
# Start the development server with Turbopack
npm run dev

# Build for production
npm run build

# Start the production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js restaurant website project with the following architecture:

### Frontend Structure

- **App Router**: Uses Next.js App Router (not Pages Router)
- **UI Framework**: TailwindCSS with Radix UI components
- **State Management**: Zustand for client-side state (cart, offers)
- **Data Fetching**: 
  - Server components with server actions for API calls
  - TanStack React Query for client-side data fetching/caching

### Backend Integration

- **API Integration**: Direct API calls to Java backend using versioned endpoints
- **Payment Processing**: Stripe integration for checkout flow

### Key Folders

- `/src/app/`: Next.js app router routes and page components
- `/src/components/`: Reusable UI components (both shared and feature-specific)
- `/src/actions/`: Server actions for API calls and data fetching
- `/src/stores/`: Zustand store definitions for client-side state
- `/src/lib/`: Utility functions, type definitions, and service integrations
- `/public/`: Static assets (images, etc.)

### Data Flow

1. Server components fetch data using server actions
2. Server actions call backend APIs directly using versioned endpoints
3. Client components use Zustand stores for local state (cart, UI state)
4. Forms and mutations use server actions to update data

### API Integration Patterns

This project follows **enterprise-standard security patterns** with complete separation of server and client concerns:

#### Architecture Overview

1. **Server-Only API Clients** 
   - `/src/lib/api-client.server.ts` - Server-side only, contains backend URL
   - `/src/lib/api-config.server.ts` - Server-only configuration
   - Backend URLs are NEVER exposed to client-side code
   - Handles authentication with Basic Auth for server-to-server calls

2. **Route Handlers** (`/app/api/*`)
   - Proxy public API endpoints to hide backend structure
   - Handle server-side authentication
   - Provide consistent API interface for client

3. **TanStack Query** (Client-side data fetching)
   - Used for all GET requests via Route Handlers
   - Provides caching, loading states, and error handling
   - Configured with global error handler

4. **Server Actions** (Sensitive operations only)
   - Order creation and checkout
   - Payment processing
   - Any operation with sensitive data

#### File Structure

```
src/
├── lib/
│   ├── api-client.server.ts   # Server-only API client
│   ├── api-config.server.ts   # Server-only config (backend URLs)
│   └── api/
│       ├── endpoints.ts       # Type-safe endpoint definitions
│       ├── types.ts           # API types matching backend
│       └── error-handler.ts   # Global error handling
├── app/
│   └── api/                   # Route Handlers (server-side proxy)
│       ├── locations/
│       ├── categories/
│       └── menu/
├── hooks/                     # Client-side hooks (use fetch to Route Handlers)
│   ├── use-locations.ts
│   ├── use-categories.ts
│   ├── use-menu-items.ts
│   └── use-offers.ts
└── actions/                   # Server Actions (sensitive operations)
    └── orders.ts              # Order/payment operations
```

#### API Flow Examples

**Public Data Fetching:**
```
Client Component → TanStack Query → fetch() → Route Handler → Server API Client → Backend
                                       ↑                              ↑
                                 (relative URLs)              (server-only, has backend URL)
```

**Sensitive Operations:**
```
Client Component → Server Action → API Client → Backend
```

#### Implementation Examples

**Client-Side Data Fetching (TanStack Query):**
```typescript
// src/hooks/use-categories.ts
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      // Client uses relative URLs - no backend exposure
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Server-Side Route Handler:**
```typescript
// src/app/api/categories/route.ts
import { publicApiClient } from '@/lib/api-client.server'; // Server-only import

export async function GET() {
  // Server-side has access to backend URL
  const categories = await publicApiClient.get('/categories');
  return NextResponse.json(categories);
}
```

**Sensitive Operations (Server Actions):**
```typescript
// src/actions/orders.ts
"use server";
export async function createOrder(items, total, locationId) {
  // Uses privateApiClient with auth headers
  const order = await privateApiClient.post<Order>(
    API_ENDPOINTS.orders.create,
    orderData
  );
  return { success: true, data: { orderId: order.id } };
}
```

#### Security Considerations

1. **Complete URL Isolation**: Backend URLs only exist in server-side environment variables
2. **Server-Only Imports**: API clients that know backend URLs throw errors if imported client-side
3. **API Keys**: Stored in server-only environment variables (no NEXT_PUBLIC_ prefix)
4. **Authentication**: Basic Auth headers added only on server-side
5. **Error Handling**: Sensitive error details sanitized before client display
6. **Route Handlers**: Act as secure proxy between client and backend

#### When to Use Each Pattern

**Use Route Handlers + TanStack Query for:**
- All public data fetching (GET requests)
- Data that benefits from caching
- Operations needing loading/error states

**Use Server Actions for:**
- Payment processing
- Order creation
- Any operation with sensitive data
- Operations requiring server-side validation

### Payment Flow

1. Cart data is sent to server action
2. Server action creates order in Java backend
3. Server action requests Stripe checkout session from Java backend
4. User is redirected to Stripe hosted checkout
5. Java backend webhook handles payment confirmation
6. Order status is updated to PAID

## Environment Variables

### Server-Side Only (Secure)
These variables are only accessible server-side and contain sensitive information:
- `API_BASE_URL`: Backend API base URL (e.g., "http://localhost:8080")
- `API_VERSION`: API version (e.g., "v1")
- `API_CLIENT_ID`: API client ID for server-to-server authentication
- `API_CLIENT_SECRET`: API client secret for server-to-server authentication
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `BRAND_NAME`: Restaurant brand name for API calls
- `RESTAURANT_BRAND`: Restaurant display name
- `MAIN_LOCATION_SLUG`: Main location slug

### Client-Side (Public)
These are publicly visible environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_ENABLE_CART`: Feature flag for cart functionality