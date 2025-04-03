"use client";

import { CartItem } from "@/stores/cart-store";

// Mock checkout session for client-side use
export interface CheckoutSession {
  id: string;
  payment_status: string;
}

// Client-side function to handle checkout
export async function initiateCheckout(items: CartItem[]) {
  try {
    // Calculate totals
    const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        total,
        taxRate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Client-side function to get session info
export async function getCheckoutSessionInfo(
  sessionId: string
): Promise<CheckoutSession> {
  try {
    const response = await fetch(`/api/checkout/session?id=${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to retrieve session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
}
