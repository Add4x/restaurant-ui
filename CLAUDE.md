# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
# Start the development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start the production server
pnpm start

# Run linting
pnpm lint

# Run tests
pnpm test                # Run all tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Generate coverage report
pnpm test:ui         # Open Vitest UI

# Type checking (no built-in script, use TypeScript compiler directly)
pnpm exec tsc --noEmit
```

## Architecture Overview

This is a Next.js 15 restaurant website project with the following architecture:

### Frontend Structure

- **App Router**: Uses Next.js App Router (not Pages Router)
- **UI Framework**: TailwindCSS v4 with Radix UI components
- **State Management**: Zustand for client-side state (cart, offers, location, menu)
- **Data Fetching**: 
  - Server components with server actions for sensitive operations
  - TanStack React Query for client-side data fetching/caching via Route Handlers
- **Testing**: Vitest with React Testing Library

### Backend Integration

- **API Integration**: Java Spring Boot backend with versioned REST APIs
- **Payment Processing**: Stripe integration for checkout flow
- **Authentication**: Basic Auth for server-to-server communication

### Key Folders

- `/src/app/`: Next.js app router routes and page components
- `/src/components/`: Reusable UI components (both shared and feature-specific)
- `/src/actions/`: Server actions for sensitive operations (orders, checkout)
- `/src/stores/`: Zustand store definitions for client-side state
- `/src/lib/`: Utility functions, type definitions, and server-only API clients
- `/src/hooks/`: Custom React hooks for data fetching with TanStack Query
- `/src/app/api/`: Route Handlers that proxy backend APIs

### Data Flow & Security Architecture

This project follows **enterprise-standard security patterns** with complete separation of server and client concerns:

#### Architecture Principles

1. **Backend URLs are NEVER exposed to client code** - Only exist in server-side environment variables
2. **Server-Only API Clients** - Located in `/src/lib/api-client.server.ts`, throw errors if imported client-side
3. **Route Handlers as API Proxy** - All client requests go through Next.js Route Handlers that forward to backend
4. **Sensitive Operations use Server Actions** - Order creation, payment processing bypass Route Handlers

#### API Flow Patterns

**Public Data Fetching (GET requests):**
```
Client Hook → TanStack Query → fetch('/api/...') → Route Handler → Server API Client → Backend
```

**Sensitive Operations (POST/PUT/DELETE):**
```
Client Component → Server Action → Server API Client → Backend
```

#### Implementation Standards

**Client-Side Hook Example:**
```typescript
// Always use relative URLs in client code
const response = await fetch('/api/categories');
```

**Route Handler Example:**
```typescript
// Only Route Handlers import server-only API clients
import { publicApiClient } from '@/lib/api-client.server';
```

**Server Action Example:**
```typescript
"use server";
import { privateApiClient } from '@/lib/api-client.server';
```

### API Integration Patterns

- **Public API Client** (`publicApiClient`): For public endpoints, no auth required
- **Private API Client** (`privateApiClient`): For authenticated endpoints, includes Basic Auth
- **Error Handling**: Global error handler transforms backend errors for client display
- **Type Safety**: Shared types in `/src/lib/api/types.ts` match Java backend DTOs

### Environment Variables

#### Server-Side Only (Secure)
- `API_BASE_URL`: Backend API base URL
- `API_VERSION`: API version (e.g., "v1")
- `API_CLIENT_ID`: Basic Auth username
- `API_CLIENT_SECRET`: Basic Auth password
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `RESTAURANT_BRAND`: Restaurant brand name
- `MAIN_LOCATION_SLUG`: Default location slug

#### Client-Side (Public)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_ENABLE_CART`: Feature flag for cart functionality

### Testing Strategy

- **Unit Tests**: Components, hooks, and utilities tested with Vitest
- **Test Utils**: Custom render function with providers in `/src/test/utils/test-utils.tsx`
- **MSW**: Mock Service Worker for API mocking in tests
- **Coverage**: Run `npm run test:coverage` to generate coverage reports

### Payment Flow

1. Cart items collected in Zustand store
2. Server action `createOrderAndCheckout` called with cart data
3. Order created in backend via private API client
4. Stripe checkout session created by backend
5. User redirected to Stripe hosted checkout
6. Backend webhook handles payment confirmation

### Key Conventions

- **Error Handling**: All API errors go through centralized error handler
- **Loading States**: TanStack Query provides loading/error states automatically
- **Type Safety**: Backend response types mapped to frontend types in Route Handlers
- **Security**: No backend URLs, API keys, or sensitive data in client code