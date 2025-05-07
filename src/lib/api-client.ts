import {
  authenticate as authenticateAction,
  authorizedFetch,
} from "@/actions/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Error class for API errors
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Authenticate with the Java backend using client credentials flow
 * Re-exports the authenticate function from actions/auth.ts
 */
export const authenticate = authenticateAction;

/**
 * Make an authenticated API request
 */
export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await authorizedFetch(url, options);
    return await response.json();
  } catch (error) {
    // Convert the error to an ApiError for consistent error handling
    if (error instanceof Error) {
      if (error.message.includes("API error: 401")) {
        throw new ApiError("Authentication failed", 401);
      }
      throw new ApiError(error.message, 500);
    }
    throw new ApiError("Unknown error", 500);
  }
}
