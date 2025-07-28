"use server";

import { CartItem } from "@/stores/cart-store";
import { z } from "zod";
import { privateApiClient } from "@/lib/api-client.server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Schema for validating the order data
const StoreOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      menuItem: z.object({
        id: z.string(),
        name: z.string(),
        // ... other required fields
      }),
      quantity: z.number().int().positive(),
      selectedProtein: z.any().nullable(),
      totalPrice: z.number(),
    })
  ),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  pickupTime: z.string().optional(),
});

export async function createStoreOrder(
  items: CartItem[],
  customerName?: string,
  customerPhone?: string,
  pickupTime?: string
) {
  try {
    // Validate input
    StoreOrderSchema.parse({
      items,
      customerName,
      customerPhone,
      pickupTime,
    });

    // Here you would typically:
    // 1. Save the order to the backend API
    // 2. Send notification to store staff
    // 3. Generate order number

    // Transform cart items to backend format
    const orderItems = items.map((item) => ({
      menuItemId: item.menuItem.id.toString(),
      quantity: item.quantity,
      specialInstructions: item.specialInstructions,
    }));

    // Create order using secure API client
    const orderData = {
      items: orderItems,
      customerName,
      customerPhone,
      pickupTime,
      // Add any other required fields for your backend
    };

    const data = await privateApiClient.post<{ id: string; orderNumber?: number }>(
      API_ENDPOINTS.orders.create,
      orderData
    );

    return {
      success: true,
      orderNumber: data.orderNumber || Math.floor(Math.random() * 1000) + 1000,
      message: "Your order has been placed successfully!",
    };
  } catch (error) {
    console.error("Store order error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
