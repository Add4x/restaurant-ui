"use server";

import { CartItem } from "@/stores/cart-store";
import { privateApiClient } from "@/lib/api-client.server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
// Backend order request structure that matches OrderCreateDTO
interface BackendOrderRequest {
  customerId: number;
  locationId: number;
  orderDate: string;
  totalAmount: number;
  notes?: string;
  items: Array<{
    menuItemId: number;
    proteinId: number | null;
    quantity: number;
    subtotal: number;
    modificationIds: number[] | null;
  }>;
  paymentRequest: null;
}

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
  // Define orderData outside try block so it's accessible in catch
  let orderData: BackendOrderRequest | undefined;
  
  try {
    // Transform cart items to backend format
    const orderItems = items.map((item) => ({
      menuItemId: Number(item.menuItem.id),
      proteinId: null, // TODO: Fix protein ID mapping - current structure doesn't have ID
      quantity: item.quantity,
      subtotal: item.totalPrice, // Use the totalPrice that includes protein and modification costs
      modificationIds: null // TODO: Fix modification IDs mapping
    }));

    // Calculate total from items (using totalPrice which includes all additions)
    const calculatedTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    orderData = {
      customerId: 1, // TODO: Get from user context/auth
      locationId: Number(locationId), // Convert string to number for backend
      orderDate: new Date().toISOString(),
      totalAmount: calculatedTotal,
      notes: notes,
      items: orderItems,
      paymentRequest: null // Payment is handled separately via checkout
    };

    console.log("Sending order data:", JSON.stringify(orderData, null, 2));
    
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
    if (orderData) {
      console.error("Order data that failed:", JSON.stringify(orderData, null, 2));
    }

    // Extract more detailed error information
    let errorMessage = "Failed to create order";
    let errorCode = "ORDER_CREATE_ERROR";
    let status = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // Check if it's an API error with more details
      if ('status' in error && typeof error.status === 'number') {
        status = error.status;
      }
      if ('code' in error && typeof error.code === 'string') {
        errorCode = error.code;
      }
    }

    return {
      success: false,
      error: errorMessage,
      code: errorCode,
      status,
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
