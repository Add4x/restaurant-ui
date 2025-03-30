"use server";

import { createCheckoutSession } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { z } from "zod";

const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      menuItem: z.object({
        id: z.string(),
        name: z.string(),
        base_price: z.number(),
        short_description: z.string().optional(),
        image_url: z.string().optional(),
      }),
      quantity: z.number().int().positive(),
      selectedProtein: z
        .object({
          protein_options: z.object({
            name: z.string(),
            price_addition: z.number(),
          }),
        })
        .nullable(),
      totalPrice: z.number(),
    })
  ),
  customerEmail: z.string().email().optional(),
});

export async function createStripeCheckout(
  items: CartItem[],
  customerEmail?: string
) {
  try {
    // Validate input
    const validatedData = CheckoutSchema.parse({
      items,
      customerEmail,
    });

    // Transform cart items to Stripe line items
    const lineItems = validatedData.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.menuItem.name,
          description: item.menuItem.short_description,
          images: item.menuItem.image_url
            ? [item.menuItem.image_url]
            : undefined,
        },
        unit_amount: Math.round(item.totalPrice * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create an order ID for tracking
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}-${Date.now()
      .toString()
      .slice(-4)}`;

    // Create checkout session
    const session = await createCheckoutSession(lineItems, orderId);

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
