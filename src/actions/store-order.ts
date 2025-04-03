"use server";

import { CartItem } from "@/stores/cart-store";
import { z } from "zod";

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
    // 1. Save the order to your database (Supabase)
    // 2. Send notification to store staff
    // 3. Generate order number

    // Mock implementation
    const orderNumber = Math.floor(Math.random() * 1000) + 1000;

    return {
      success: true,
      orderNumber,
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
