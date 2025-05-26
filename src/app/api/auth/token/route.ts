import { NextResponse } from "next/server";
import { authenticate } from "@/actions/auth";

/**
 * API route to get JWT tokens for client-side authentication
 * This bridges server-side authentication with client-side needs
 */
export async function POST() {
  try {
    // Get a JWT token using server-side authentication
    const accessToken = await authenticate();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Return the token in the same format as the OAuth server
    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: "Bearer",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔴 [api/auth/token] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
