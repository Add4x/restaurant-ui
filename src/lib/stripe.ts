"use server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

type LineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
};

export async function createCheckoutSession(
  lineItems: LineItem[],
  orderId?: string
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing Stripe secret key");
    }

    // Validate line items
    if (!lineItems || lineItems.length === 0) {
      throw new Error("Line items are required");
    }

    console.log("######lineItems", JSON.stringify(lineItems, null, 2));

    // Validate each line item
    lineItems.forEach((item, index) => {
      if (!item.price_data || !item.price_data.unit_amount) {
        throw new Error(`Invalid price data for line item at index ${index}`);
      }

      if (
        isNaN(item.price_data.unit_amount) ||
        item.price_data.unit_amount <= 0
      ) {
        throw new Error(`Invalid unit amount for line item at index ${index}`);
      }
    });

    // Create a checkout session with the order items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/checkout?status=canceled`,
      metadata: {
        orderId: orderId || "",
      },
    });

    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    // Return the session URL for client-side redirect
    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Handle Stripe errors with specific details
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(
        `Stripe error: ${error.message} (${error.type}: ${error.code})`
      );
    }

    // Handle regular errors
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }

    throw new Error("Failed to create checkout session");
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve checkout session: ${error.message}`);
    }
    throw new Error("Failed to retrieve checkout session");
  }
}
