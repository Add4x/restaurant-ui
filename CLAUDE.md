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

### Payment Flow

1. Cart data is used to create Stripe checkout sessions
2. User is redirected to Stripe hosted checkout
3. On completion, webhook or success URL verifies payment
4. Order is confirmed and cart is cleared

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls
- `NEXT_PUBLIC_API_VERSION`: API version (e.g., "v1/public")
- `STRIPE_SECRET_KEY`: Stripe API secret key