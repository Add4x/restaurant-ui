"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMenuItemsByCategory,
  getMenuItemDetails,
  getMenuItemsByCategorySlug,
} from "@/actions/menu";
import { useLocationStore } from "@/stores/location-store";

/**
 * Hook for fetching all menu items by category (legacy - uses category ID)
 */
export function useMenuItems(categoryId: string) {
  return useQuery({
    queryKey: ["menu-items", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        return {
          error: true,
          message: "Category ID is required",
          code: "MISSING_PARAMS",
          status: 400,
        };
      }

      const result = await getMenuItemsByCategory(categoryId);

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
    enabled: !!categoryId,
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

/**
 * Hook for fetching menu items by category slug using the new API
 */
export function useMenuItemsByCategory(menuSlug: string, categorySlug: string) {
  const { brandName, selectedLocation } = useLocationStore();

  return useQuery({
    queryKey: [
      "menu-items-by-category",
      brandName,
      selectedLocation?.slug,
      menuSlug,
      categorySlug,
    ],
    queryFn: async () => {
      if (!brandName || !selectedLocation?.slug) {
        throw new Error("Brand name and location are required");
      }

      const result = await getMenuItemsByCategorySlug(
        brandName,
        selectedLocation.slug,
        menuSlug,
        categorySlug
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
    enabled:
      !!brandName && !!selectedLocation?.slug && !!menuSlug && !!categorySlug,
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

/**
 * Hook for fetching detailed menu item information
 */
export function useMenuItemDetails(
  menuSlug: string,
  categorySlug: string,
  itemSlug: string
) {
  const { brandName, selectedLocation } = useLocationStore();

  return useQuery({
    queryKey: [
      "menu-item-details",
      brandName,
      selectedLocation?.slug,
      menuSlug,
      categorySlug,
      itemSlug,
    ],
    queryFn: async () => {
      if (!brandName || !selectedLocation?.slug) {
        throw new Error("Brand name and location are required");
      }

      const result = await getMenuItemDetails(
        brandName,
        selectedLocation.slug,
        menuSlug,
        categorySlug,
        itemSlug
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
    enabled:
      !!brandName &&
      !!selectedLocation?.slug &&
      !!menuSlug &&
      !!categorySlug &&
      !!itemSlug,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (item not found)
      if (error?.message?.includes("404")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
