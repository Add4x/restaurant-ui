import { type NextRequest, NextResponse } from "next/server";
import { createOrderAndCheckout } from "@/actions/orders";

export async function POST(req: NextRequest) {
  // Handle checkout request
  try {
    const body = await req.json();
    const { items, total, locationId } = body;

    console.log("Checkout route received:", {
      items: items?.length,
      total,
      locationId,
      body,
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    if (!locationId || typeof locationId !== "number") {
      return NextResponse.json(
        { error: "Invalid location ID" },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (
        !item.menuItem.name ||
        typeof item.totalPrice !== "number" ||
        !item.quantity
      ) {
        return NextResponse.json(
          { error: "Invalid item format" },
          { status: 400 }
        );
      }
    }

    // Create order and checkout session via Java backend
    const result = await createOrderAndCheckout(
      items,
      total,
      locationId,
      undefined
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({
      success: true,
      url: result.data.checkoutUrl,
      orderId: result.data.orderId,
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
