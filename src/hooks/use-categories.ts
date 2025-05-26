"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getMenuItemsByCategory } from "@/actions/api";
import { useLocationStore } from "@/stores/location-store";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  // other fields...
});

export type Category = z.infer<typeof categorySchema>;

export function useCategories() {
  const { brandName, selectedLocation } = useLocationStore();

  return useQuery({
    queryKey: ["categories", brandName, selectedLocation?.slug],
    queryFn: async () => {
      if (!brandName || !selectedLocation?.slug) {
        return {
          error: true,
          message: "Brand name and location are required",
          code: "MISSING_PARAMS",
          status: 400,
        };
      }

      const result = await getCategories(brandName, selectedLocation.slug);

      if (!result.success) {
        return {
          error: true,
          message: result.error,
          code: result.code,
          status: result.status,
        };
      }

      return {
        error: false,
        data: result.data,
      };
    },
    enabled: !!brandName && !!selectedLocation?.slug,
    retry: (failureCount, error) => {
      if (error?.message?.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      if (!id) {
        return {
          error: true,
          message: "Category ID is required",
          code: "MISSING_PARAMS",
          status: 400,
        };
      }

      const result = await getMenuItemsByCategory(id);

      if (!result.success) {
        // Instead of throwing, return a structured error that components can handle
        return {
          error: true,
          message: result.error,
          code: result.code,
          status: result.status,
        };
      }

      return {
        error: false,
        data: result.data,
      };
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (category not found)
      if (error?.message?.includes("404")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
