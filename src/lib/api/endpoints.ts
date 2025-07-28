// Centralized API endpoints configuration
// This provides type-safe endpoint definitions and helps prevent typos

export const API_ENDPOINTS = {
  // Location endpoints
  locations: {
    list: '/locations',
    bySlug: (slug: string) => `/locations/slug/${slug}`,
    byId: (id: string) => `/locations/${id}`,
  },
  
  // Menu endpoints
  menu: {
    categories: '/menu/categories',
    categoryBySlug: (slug: string) => `/menu/categories/slug/${slug}`,
    itemsByCategory: (categoryId: string) => `/categories/${categoryId}/menu-items`,
    itemById: (id: string) => `/menu-items/${id}`,
    itemBySlug: (slug: string) => `/menu-items/slug/${slug}`,
  },
  
  // Order endpoints
  orders: {
    create: '/orders',
    list: '/orders',
    byId: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Checkout endpoints
  checkout: {
    createSession: '/checkout/create-checkout-session',
    success: '/checkout/success',
    cancel: '/checkout/cancel',
  },
  
  // Payment endpoints (server-side only)
  payments: {
    createSession: '/payments/create-session',
    verify: '/payments/verify',
    webhook: '/payments/webhook',
  },
  
  // Customer endpoints
  customers: {
    profile: '/customers/profile',
    orders: '/customers/orders',
    addresses: '/customers/addresses',
    updateProfile: '/customers/profile',
  },
  
  // Offers endpoints
  offers: {
    list: '/offers',
    byLocation: (locationId: string) => `/locations/${locationId}/offers`,
    validate: '/offers/validate',
  },
} as const;

// Helper type to extract all endpoint paths
type EndpointPaths<T> = T extends string
  ? T
  : T extends (...args: unknown[]) => string
  ? ReturnType<T>
  : T extends Record<string, unknown>
  ? { [K in keyof T]: EndpointPaths<T[K]> }[keyof T]
  : never;

export type ApiEndpoint = EndpointPaths<typeof API_ENDPOINTS>;