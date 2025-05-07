"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavoriteMenuItems } from "@/actions/menu";

/**
 * Hook for fetching favorite menu items
 */
export function useFavoriteMenuItems() {
  return useQuery({
    queryKey: ["favorite-menu-items"],
    queryFn: async () => {
      const result = await getFavoriteMenuItems();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}
