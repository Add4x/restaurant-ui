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
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
      }/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
      }/checkout?status=canceled`,
      metadata: {
        orderId: orderId || "",
      },
    });

    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    // Return the session URL for client-side redirect
    return { url: session.url, sessionId: session.id };
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
    return {
      url: session.url,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve checkout session: ${error.message}`);
    }
    throw new Error("Failed to retrieve checkout session");
  }
}

// New server action to verify a session and handle payment confirmation
export async function verifyPaymentSession(sessionId: string): Promise<{
  success: boolean;
  paymentStatus: string;
  message?: string;
  customerInfo?: {
    email?: string;
    name?: string;
    customerId?: string;
  };
}> {
  try {
    if (!sessionId) {
      return {
        success: false,
        paymentStatus: "error",
        message: "Session ID is required",
      };
    }

    // Expand customer details when retrieving the session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items"],
    });

    // Check if payment was successful
    if (session.payment_status === "paid") {
      // Extract customer information
      const customerInfo: {
        email?: string;
        name?: string;
        customerId?: string;
      } = {};

      // Get email from session
      if (session.customer_email) {
        customerInfo.email = session.customer_email;
      } else if (session.customer_details?.email) {
        customerInfo.email = session.customer_details.email;
      }

      // Get name from session
      if (session.customer_details?.name) {
        customerInfo.name = session.customer_details.name;
      }

      // Here you would typically save this information to your database
      // For example: await saveOrderToDatabase(customerInfo, orderDetails);

      return {
        success: true,
        paymentStatus: "paid",
        customerInfo,
      };
    }

    return {
      success: false,
      paymentStatus: session.payment_status,
      message: `Payment is ${session.payment_status}`,
    };
  } catch (error) {
    console.error("Error verifying payment session:", error);

    return {
      success: false,
      paymentStatus: "error",
      message:
        error instanceof Error ? error.message : "Failed to verify payment",
    };
  }
}
