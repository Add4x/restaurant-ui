import { NextResponse } from "next/server";
import { authenticate } from "@/actions/auth";

/**
 * POST /api/auth - Authenticate with client credentials
 */
export async function POST() {
  try {
    const success = await authenticate();

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Authentication error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Authentication service unavailable",
      },
      { status: 503 }
    );
  }
}

/**
 * GET /api/auth - Check authentication status
 */
export async function GET() {
  try {
    // Simply try to authenticate
    const success = await authenticate();

    if (!success) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
    });
  } catch (error) {
    console.error("Authentication check error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        error: "Authentication service unavailable",
      },
      { status: 503 }
    );
  }
}
