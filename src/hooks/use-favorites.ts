"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavoriteMenuItems } from "@/actions/menu";
import { useLocationStore } from "@/stores/location-store";

/**
 * Hook for fetching favorite menu items
 */
export function useFavoriteMenuItems() {
  const { brandName, selectedLocation } = useLocationStore();

  return useQuery({
    queryKey: ["favorite-menu-items", brandName, selectedLocation?.slug],
    queryFn: async () => {
      if (!brandName || !selectedLocation?.slug) {
        return {
          error: true,
          message: "Brand name and location are required",
          code: "MISSING_PARAMS",
          status: 400,
        };
      }

      const result = await getFavoriteMenuItems(
        brandName,
        selectedLocation.slug
      );

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
    enabled: !!brandName && !!selectedLocation?.slug,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (favorites not found)
      if (error?.message?.includes("404")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
