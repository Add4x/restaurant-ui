"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Define the API response type
export type ApiResponse<T> =
  | { error: true; message: string; code: string; status: number }
  | { error: false; data: T };

/**
 * Ensure user is authenticated
 * This will redirect to the auth endpoint if needed
 */
async function ensureAuthenticated() {
  try {
    const response = await fetch("/api/auth", {
      method: "GET",
      credentials: "include", // This is important for cookies
    });

    if (!response.ok) {
      // If not authenticated, try to authenticate
      const authResponse = await fetch("/api/auth", {
        method: "POST",
        credentials: "include",
      });

      if (!authResponse.ok) {
        throw new Error("Authentication failed");
      }
    }

    return true;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}

/**
 * Hook for fetching data from the backend API
 */
export function useApiQuery<T>(endpoint: string, queryKey: string[]) {
  const router = useRouter();

  return useQuery<ApiResponse<T>>({
    queryKey,
    queryFn: async (): Promise<ApiResponse<T>> => {
      try {
        // Ensure we're authenticated before making the request
        await ensureAuthenticated();

        const response = await fetch(`${BASE_URL}${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
          },
          // Include cookies in the request
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            // If unauthorized, redirect to authenticate
            router.push("/api/auth");
            return {
              error: true,
              message: "Authentication required",
              code: "UNAUTHORIZED",
              status: 401,
            };
          }

          return {
            error: true,
            message: `API error: ${response.status}`,
            code: "API_ERROR",
            status: response.status,
          };
        }

        const data = await response.json();
        return {
          error: false,
          data,
        };
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return {
          error: true,
          message: error instanceof Error ? error.message : "Unknown error",
          code: "FETCH_ERROR",
          status: 500,
        };
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error?.message?.includes("401") ||
        error?.message?.includes("Authentication")
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for posting data to the backend API
 */
export function useApiMutation<TData, TVariables>(endpoint: string) {
  const router = useRouter();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      try {
        // Ensure we're authenticated before making the request
        await ensureAuthenticated();

        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Include cookies in the request
          credentials: "include",
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          if (response.status === 401) {
            // If unauthorized, redirect to authenticate
            router.push("/api/auth");
            throw new Error("Authentication required");
          }
          throw new Error(`API error: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
      }
    },
  });
}
