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

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    // Remove scope parameter as the server doesn't support it

    const authUrl = `${BASE_URL}/oauth2/token`;

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

    return accessToken;
  } catch (error) {
    console.error("🔴 [auth] Authentication error:", error);
    return undefined;
  }
}

// Store the token in memory (server-side only)
let accessToken: string | undefined;

/**
 * Fetch wrapper with authorization token
 */
// Track authentication state to prevent infinite loops
let isAuthenticating = false;

/**
 * Wrapper for fetch that handles authentication with Bearer token
 */
export async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // If we have a token, use it
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Initial request with token
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized with authentication retry
  if (response.status === 401 && !isAuthenticating) {
    isAuthenticating = true;

    try {
      // Get a new token
      accessToken = await authenticate();

      if (!accessToken) {
        throw new Error("Authentication failed after 401 response");
      }

      // Update headers with new token
      const newHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers as Record<string, string>),
      };

      // Retry the original request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: newHeaders,
      });

      // If we still get 401 after authentication, there might be an issue with the token
      if (retryResponse.status === 401) {
        const errorText = await retryResponse.text();
        console.error(
          "🔴 [fetch] Still unauthorized after authentication:",
          errorText
        );
        throw new Error(`Authentication failed: ${errorText}`);
      }

      return retryResponse;
    } catch (error) {
      console.error("🔴 [fetch] Error during authentication:", error);
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
