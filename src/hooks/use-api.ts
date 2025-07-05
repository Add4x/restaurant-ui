"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1/public";

// Define the API response type
export type ApiResponse<T> =
  | { error: true; message: string; code: string; status: number }
  | { error: false; data: T };


/**
 * Hook for fetching data from the backend API
 */
export function useApiQuery<T>(endpoint: string, queryKey: string[]) {
  return useQuery<ApiResponse<T>>({
    queryKey,
    queryFn: async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(`${BASE_URL}/api/${API_VERSION}${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
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
    retry: (failureCount) => {
      // Retry up to 2 times for errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for posting data to the backend API
 */
export function useApiMutation<TData, TVariables>(endpoint: string) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      try {
        const response = await fetch(`${BASE_URL}/api/${API_VERSION}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
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
