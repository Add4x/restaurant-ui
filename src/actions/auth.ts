"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Authenticate with the server using client credentials
 * Returns the access token if successful, undefined if failed
 */
export async function authenticate(): Promise<string | undefined> {
  const clientId = process.env.API_CLIENT_ID || "client";
  const clientSecret = process.env.API_CLIENT_SECRET || "secret";

  console.log("🔧 [auth] Debug info:", {
    BASE_URL,
    clientId,
    clientSecret: clientSecret ? "***SET***" : "***NOT SET***",
    NODE_ENV: process.env.NODE_ENV,
  });

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    // Remove scope parameter as the server doesn't support it

    const authUrl = `${BASE_URL}/oauth2/token`;
    console.log("🔗 [auth] Attempting to authenticate at:", authUrl);

    const authHeader = `Basic ${Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64")}`;

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔴 [auth] Authentication failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return undefined;
    }

    // Get token from response
    const tokenData = await response.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("🔴 [auth] No access token in response");
      return undefined;
    }

    console.log("✅ [auth] Successfully authenticated");
    return accessToken;
  } catch (error) {
    console.error("🔴 [auth] Authentication error:", error);

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        console.error("❌ [auth] Backend server is not running on", BASE_URL);
        console.error("💡 [auth] Please start your Java backend server");
      } else if (error.message.includes("ENOTFOUND")) {
        console.error("❌ [auth] Cannot resolve hostname:", BASE_URL);
        console.error("💡 [auth] Check your BASE_URL configuration");
      }
    }

    return undefined;
  }
}

// Store the token in memory (server-side only)
let accessToken: string | undefined;
let tokenExpiry: number | undefined;

/**
 * Check if the current token is expired or about to expire
 */
function isTokenExpired(): boolean {
  if (!accessToken || !tokenExpiry) {
    return true;
  }
  // Consider token expired if it expires within the next 30 seconds
  return Date.now() >= tokenExpiry - 30000;
}

/**
 * Parse JWT token to extract expiry time
 */
function parseTokenExpiry(token: string): number | undefined {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : undefined; // Convert to milliseconds
  } catch (error) {
    console.warn("⚠️ [auth] Could not parse token expiry:", error);
    return undefined;
  }
}

// Track authentication state to prevent infinite loops
let isAuthenticating = false;

/**
 * Wrapper for fetch that handles JWT authentication with Bearer token
 */
export async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Check if we need to authenticate or refresh token
  if (!accessToken || isTokenExpired()) {
    if (!isAuthenticating) {
      isAuthenticating = true;
      try {
        accessToken = await authenticate();
        if (accessToken) {
          tokenExpiry = parseTokenExpiry(accessToken);
        }
      } finally {
        isAuthenticating = false;
      }
    }
  }

  // Prepare headers with JWT Bearer token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Make the request with JWT token
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized with authentication retry
  if (response.status === 401 && !isAuthenticating) {
    isAuthenticating = true;

    try {
      console.log("🔄 [auth] Token expired or invalid, refreshing...");

      // Clear the old token and get a new one
      accessToken = undefined;
      tokenExpiry = undefined;

      const newToken = await authenticate();

      if (!newToken) {
        throw new Error("Authentication failed after 401 response");
      }

      accessToken = newToken;
      tokenExpiry = parseTokenExpiry(newToken);

      // Update headers with new JWT token
      const newHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers as Record<string, string>),
      };

      // Retry the original request with new JWT token
      const retryResponse = await fetch(url, {
        ...options,
        headers: newHeaders,
      });

      // If we still get 401 after authentication, there might be an issue with the token
      if (retryResponse.status === 401) {
        const errorText = await retryResponse.text();
        console.error(
          "🔴 [fetch] Still unauthorized after JWT refresh:",
          errorText
        );
        throw new Error(`JWT authentication failed: ${errorText}`);
      }

      return retryResponse;
    } catch (error) {
      console.error("🔴 [fetch] Error during JWT authentication:", error);
      throw error;
    } finally {
      isAuthenticating = false;
    }
  }

  // Handle other error statuses
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`🔴 [fetch] API error ${response.status}:`, errorText);
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response;
}

/**
 * Get the current access token (for debugging purposes)
 */
export async function getCurrentToken(): Promise<string | undefined> {
  return accessToken;
}

/**
 * Clear the current token (useful for logout)
 */
export async function clearToken(): Promise<void> {
  accessToken = undefined;
  tokenExpiry = undefined;
}
