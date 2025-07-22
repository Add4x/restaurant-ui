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

This project uses a **hybrid approach** for API integration:

#### TanStack Query (Client-side)
Used for **data fetching** (GET requests):
- Menu items, categories, locations
- Real-time data that benefits from caching
- Operations needing loading/error states in UI

Example:
```typescript
// src/hooks/use-menu-items.ts
export function useMenuItems(categoryId: string) {
  return useApiQuery<MenuItem[]>(`/categories/${categoryId}/menu-items`, ['menu-items', categoryId]);
}
```

#### Server Actions (Server-side)
Used for **mutations** (POST/PUT/DELETE) and **sensitive operations**:
- Order creation and management
- Payment/checkout flows
- Any operation with sensitive data
- Complex multi-step operations

Example:
```typescript
// src/actions/orders.ts
export async function createOrder(items, total, locationId) {
  // Server-side API call - URL not exposed to client
  const response = await fetch(`${BASE_URL}/api/v1/orders`, {
    method: 'POST',
    // ...
  });
}
```

#### Rationale for Hybrid Approach

1. **Security**: Payment and order APIs stay server-side, reducing attack surface
2. **Performance**: Server actions reduce client bundle size for mutations
3. **Type Safety**: Full TypeScript support across server/client boundary
4. **Best Practices**: Follows Next.js App Router recommendations
5. **Flexibility**: Use the right tool for each use case

#### When to Use Each Pattern

**Use TanStack Query when:**
- Fetching data that needs caching
- Need optimistic updates
- Want built-in retry logic
- Displaying loading/error states

**Use Server Actions when:**
- Handling sensitive data (payments, orders)
- Performing complex multi-step operations
- Need server-side validation before proceeding
- Want to keep API structure hidden from client

### Payment Flow

1. Cart data is sent to server action
2. Server action creates order in Java backend
3. Server action requests Stripe checkout session from Java backend
4. User is redirected to Stripe hosted checkout
5. Java backend webhook handles payment confirmation
6. Order status is updated to PAID

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls
- `NEXT_PUBLIC_API_VERSION`: API version (e.g., "v1/public")
- `STRIPE_SECRET_KEY`: Stripe API secret key