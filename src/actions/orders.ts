"use server";

import { z } from "zod";
import { CartItem } from "@/stores/cart-store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Define a consistent return type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

// Schema for order item creation
const orderItemCreateSchema = z.object({
  menuItemId: z.number(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
});

// Schema for order creation request
const orderCreateRequestSchema = z.object({
  customerId: z.number(),
  locationId: z.number(),
  orderDate: z.string(), // ISO date string
  totalAmount: z.number().positive(),
  notes: z.string().optional(),
  items: z.array(orderItemCreateSchema),
});

// Schema for order response
const orderResponseSchema = z.object({
  orderId: z.number(),
  customer: z.object({
    customerId: z.number(),
    // Other customer fields are optional for now
  }).passthrough(),
  location: z.object({
    locationId: z.number(),
    // Other location fields are optional for now
  }).passthrough(),
  orderDate: z.string(),
  totalAmount: z.number(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Optional fields
  notes: z.string().optional(),
  items: z.array(z.any()).optional(),
  payment: z.any().optional(),
});

// Schema for checkout session request
const checkoutSessionRequestSchema = z.object({
  orderId: z.number(),
});

// Schema for checkout session response
const checkoutSessionResponseSchema = z.object({
  checkoutUrl: z.string().url(),
});

/**
 * Transform cart items to order items for the backend
 */
function transformCartItemsToOrderItems(items: CartItem[]) {
  return items.map((item) => ({
    menuItemId: parseInt(item.menuItem.id.toString()),
    quantity: item.quantity,
    subtotal: item.totalPrice,
  }));
}

/**
 * Create an order in the Java backend
 */
export async function createOrder(
  items: CartItem[],
  total: number,
  locationId: number,
  notes?: string
): Promise<ActionResult<{ orderId: number }>> {
  try {
    // Transform cart items to backend format
    const orderItems = transformCartItemsToOrderItems(items);

    // For now, use default value for guest checkout
    // TODO: Implement proper customer management
    const DEFAULT_GUEST_CUSTOMER_ID = 1; // This should be configured

    const orderData = {
      customerId: DEFAULT_GUEST_CUSTOMER_ID,
      locationId: locationId,
      orderDate: new Date().toISOString(),
      totalAmount: total,
      notes: notes || "",
      items: orderItems,
    };

    // Validate request data
    const validatedData = orderCreateRequestSchema.parse(orderData);

    const response = await fetch(`${BASE_URL}/api/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create order: ${response.status} - ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log("Order creation response from backend:", responseData);

    // Validate response
    const validatedResponse = orderResponseSchema.parse(responseData);

    return {
      success: true,
      data: { orderId: validatedResponse.orderId },
    };
  } catch (error) {
    console.error("Failed to create order:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data format: ${error.message}`,
        code: "VALIDATION_ERROR",
      };
    }

    if (
      error instanceof Error &&
      error.message.includes("Failed to create order")
    ) {
      return {
        success: false,
        error: error.message,
        code: "API_ERROR",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      code: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Create a Stripe checkout session for an order
 */
export async function createCheckoutSession(
  orderId: number
): Promise<ActionResult<{ checkoutUrl: string }>> {
  try {
    const requestData = checkoutSessionRequestSchema.parse({ orderId });

    const response = await fetch(
      `${BASE_URL}/api/v1/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create checkout session: ${response.status} - ${errorText}`
      );
    }

    const responseData = await response.json();

    // Validate response
    const validatedResponse = checkoutSessionResponseSchema.parse(responseData);

    return {
      success: true,
      data: { checkoutUrl: validatedResponse.checkoutUrl },
    };
  } catch (error) {
    console.error("Failed to create checkout session:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data format: ${error.message}`,
        code: "VALIDATION_ERROR",
      };
    }

    if (
      error instanceof Error &&
      error.message.includes("Failed to create checkout session")
    ) {
      return {
        success: false,
        error: error.message,
        code: "API_ERROR",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      code: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Create order and checkout session in sequence
 */
export async function createOrderAndCheckout(
  items: CartItem[],
  total: number,
  locationId: number,
  notes?: string
): Promise<ActionResult<{ checkoutUrl: string; orderId: number }>> {
  // Step 1: Create the order
  const orderResult = await createOrder(items, total, locationId, notes);

  if (!orderResult.success) {
    return orderResult;
  }

  // Step 2: Create checkout session with the order ID
  const checkoutResult = await createCheckoutSession(orderResult.data.orderId);

  if (!checkoutResult.success) {
    // Order was created but checkout failed
    // In a real app, you might want to handle this case specially
    return checkoutResult;
  }

  return {
    success: true,
    data: {
      orderId: orderResult.data.orderId,
      checkoutUrl: checkoutResult.data.checkoutUrl,
    },
  };
}
