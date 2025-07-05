"use server";

import { CartItem } from "@/stores/cart-store";
import { z } from "zod";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1/public";

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

    // Real implementation using our backend API
    const response = await fetch(`${BASE_URL}/api/${API_VERSION}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        customerName,
        customerPhone,
        pickupTime,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();

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
