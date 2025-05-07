"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Authenticate with the server using client credentials
 * Returns true if authentication was successful
 */
export async function authenticate(): Promise<boolean> {
  const clientId = process.env.API_CLIENT_ID || "client";
  const clientSecret = process.env.API_CLIENT_SECRET || "secret";

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("scope", "write");

    const response = await fetch(`${BASE_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: formData,
      // This is critical - it allows HTTP-only cookies to be set
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Authentication failed:", await response.text());
      return false;
    }

    // The Java backend sets HTTP-only cookies in the response
    // We don't need to do anything else as the cookies are automatically
    // included in subsequent requests when using credentials: 'include'

    return true;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}

/**
 * Fetch wrapper with authentication cookies
 */
export async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Try the request with existing cookies
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // Include cookies in the request
    credentials: "include",
  });

  // If unauthorized, try to authenticate and retry
  if (response.status === 401) {
    const authenticated = await authenticate();

    if (!authenticated) {
      throw new Error("Authentication failed");
    }

    // Retry the request with new cookies
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
}
