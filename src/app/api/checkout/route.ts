import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderPaymentStatus, createOrder } from "@/lib/orders";
import { createCheckoutSession } from "@/lib/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  // Check if this is a webhook request
  const signature = req.headers.get("stripe-signature");

  if (signature) {
    // Handle webhook request
    return handleWebhook(req, signature);
  }

  // Handle regular checkout request
  try {
    const body = await req.json();
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await createOrder(items, total, "stripe");

    // Format line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.description || undefined,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const checkoutSessionResult = await createCheckoutSession(
      lineItems,
      order.id
    );

    return NextResponse.json({
      success: true,
      url: checkoutSessionResult.url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Checkout Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

async function handleWebhook(req: NextRequest, signature: string) {
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      // Get the order ID from metadata
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Update the order payment status
        await updateOrderPaymentStatus(orderId, "paid");

        // Here you would typically:
        // 1. Send confirmation emails
        // 2. Update inventory
        // 3. Notify staff about new orders
        console.log(`Payment successful for order: ${orderId}`);
      }

      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
