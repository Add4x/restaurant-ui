"use server";

import { CartItem } from "@/stores/cart-store";
import { privateApiClient } from "@/lib/api-client.server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Define a consistent return type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

/**
 * Create an order in the Java backend
 */
export async function createOrder(
  items: CartItem[],
  total: number,
  locationId: string,
  notes?: string
): Promise<ActionResult<{ orderId: string }>> {
  try {
    // Transform cart items to backend format
    const orderItems = items.map((item) => ({
      menuItemId: Number(item.menuItem.id),
      quantity: item.quantity,
      subtotal: item.menuItem.price * item.quantity,
    }));

    // Calculate total from items
    const calculatedTotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

    const orderData = {
      customerId: 1, // TODO: Get from user context/auth
      locationId: Number(locationId),
      orderDate: new Date().toISOString(),
      totalAmount: calculatedTotal,
      notes: notes,
      items: orderItems,
    };

    const order = await privateApiClient.post<{ orderId: number }>(
      API_ENDPOINTS.orders.create,
      orderData
    );

    return {
      success: true,
      data: { orderId: order.orderId.toString() },
    };
  } catch (error) {
    console.error("Failed to create order:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
      code: "ORDER_CREATE_ERROR",
      status: 500,
    };
  }
}

/**
 * Create a Stripe checkout session for an order
 */
export async function createCheckoutSession(
  orderId: string
): Promise<ActionResult<{ checkoutUrl: string }>> {
  try {
    const response = await privateApiClient.post<{ checkoutUrl: string }>(
      API_ENDPOINTS.checkout.createSession,
      { orderId: Number(orderId) }
    );

    return {
      success: true,
      data: { checkoutUrl: response.checkoutUrl },
    };
  } catch (error) {
    console.error("Failed to create checkout session:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
      code: "CHECKOUT_SESSION_ERROR",
      status: 500,
    };
  }
}

/**
 * Create order and checkout session in sequence
 */
export async function createOrderAndCheckout(
  items: CartItem[],
  total: number,
  locationId: string,
  notes?: string
): Promise<ActionResult<{ checkoutUrl: string; orderId: string }>> {
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
