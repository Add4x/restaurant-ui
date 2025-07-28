// API Response Types
// These types should match your backend API responses

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Domain Types (matching your backend)
export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  phoneNumber: string;
  email: string;
  openingHours?: OpeningHours[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel?: 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
  calories?: number;
  isActive: boolean;
  isAvailable: boolean;
  proteins?: MenuItemProtein[];
  modifications?: MenuItemModification[];
  tags?: MenuItemTag[];
}

export interface MenuItemProtein {
  id: number;
  name: string;
  additionalCost: number;
}

export interface MenuItemModification {
  id: number;
  name: string;
  description: string;
  additionalCost: number;
}

export interface MenuItemTag {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId?: string;
  locationId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  deliveryAddress?: Address;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  subtotal: number;
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  locationIds?: string[];
}

// Request Types
export interface CreateOrderRequest {
  locationId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  deliveryAddress?: Address;
  specialInstructions?: string;
  promoCode?: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ValidateOfferRequest {
  code: string;
  locationId: string;
  orderTotal: number;
}