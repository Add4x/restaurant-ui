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
        throw new Error("Brand name and location are required");
      }

      const result = await getFavoriteMenuItems(
        brandName,
        selectedLocation.slug
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!brandName && !!selectedLocation?.slug,
  });
}
