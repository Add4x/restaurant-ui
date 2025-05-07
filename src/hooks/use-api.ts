"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
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
            throw new Error("Authentication required");
          }
          throw new Error(`API error: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },
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
