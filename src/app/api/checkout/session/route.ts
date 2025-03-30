import { NextRequest, NextResponse } from "next/server";
import { getCheckoutSession } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await getCheckoutSession(sessionId);

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
