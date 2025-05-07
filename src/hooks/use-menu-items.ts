"use client";

import { useQuery } from "@tanstack/react-query";
import { getMenuItem, getMenuItemsByCategory } from "@/actions/menu";

/**
 * Hook for fetching all menu items
 */
export function useMenuItems(categoryId: string) {
  return useQuery({
    queryKey: ["menu-items", categoryId],
    queryFn: async () => {
      const result = await getMenuItemsByCategory(categoryId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

/**
 * Hook for fetching a specific menu item by ID
 */
export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu-items", id],
    queryFn: async () => {
      const result = await getMenuItem(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!id,
  });
}
