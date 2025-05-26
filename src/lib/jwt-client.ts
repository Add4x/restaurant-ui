"use client";

/**
 * Client-side JWT authentication utilities
 * This handles JWT tokens in the browser for React components
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Store JWT token in memory (client-side)
let clientAccessToken: string | undefined;
let clientTokenExpiry: number | undefined;

/**
 * Parse JWT token to extract expiry and other claims
 */
function parseJwtToken(
  token: string
): { exp?: number; [key: string]: unknown } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.warn("⚠️ [jwt-client] Could not parse JWT token:", error);
    return null;
  }
}

/**
 * Check if the current token is expired or about to expire
 */
function isTokenExpired(): boolean {
  if (!clientAccessToken || !clientTokenExpiry) {
    return true;
  }
  // Consider token expired if it expires within the next 30 seconds
  return Date.now() >= clientTokenExpiry - 30000;
}

/**
 * Authenticate and get a new JWT token (client-side)
 */
async function authenticateClient(): Promise<string | undefined> {
  try {
    // Call your server action or API route to get a token
    const response = await fetch("/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("🔴 [jwt-client] Authentication failed:", response.status);
      return undefined;
    }

    const data = await response.json();
    const token = data.access_token;

    if (token) {
      const payload = parseJwtToken(token);
      clientTokenExpiry = payload?.exp ? payload.exp * 1000 : undefined;
      console.log("✅ [jwt-client] Successfully authenticated");
    }

    return token;
  } catch (error) {
    console.error("🔴 [jwt-client] Authentication error:", error);
    return undefined;
  }
}

// Track authentication state to prevent concurrent auth requests
let isAuthenticating = false;

/**
 * Fetch wrapper with JWT authentication for client-side requests
 */
export async function fetchWithJWT<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure we have a valid token
  if (!clientAccessToken || isTokenExpired()) {
    if (!isAuthenticating) {
      isAuthenticating = true;
      try {
        clientAccessToken = await authenticateClient();
      } finally {
        isAuthenticating = false;
      }
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (clientAccessToken) {
    headers["Authorization"] = `Bearer ${clientAccessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized with token refresh
  if (response.status === 401 && !isAuthenticating) {
    isAuthenticating = true;

    try {
      console.log("🔄 [jwt-client] Token expired, refreshing...");

      // Clear old token and get new one
      clientAccessToken = undefined;
      clientTokenExpiry = undefined;

      const newToken = await authenticateClient();

      if (!newToken) {
        throw new Error("Failed to refresh JWT token");
      }

      clientAccessToken = newToken;

      // Retry the request with new token
      const newHeaders = {
        ...headers,
        Authorization: `Bearer ${clientAccessToken}`,
      };

      response = await fetch(url, {
        ...options,
        headers: newHeaders,
      });

      if (response.status === 401) {
        throw new Error("Authentication failed even after token refresh");
      }
    } finally {
      isAuthenticating = false;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get current JWT token (for debugging)
 */
export function getCurrentJWTToken(): string | undefined {
  return clientAccessToken;
}

/**
 * Clear JWT token (for logout)
 */
export function clearJWTToken(): void {
  clientAccessToken = undefined;
  clientTokenExpiry = undefined;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!(clientAccessToken && !isTokenExpired());
}
