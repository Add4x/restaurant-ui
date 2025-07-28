"use client";

import { useQuery } from "@tanstack/react-query";
// Client-side hooks use fetch directly to Route Handlers
import type { MenuItem } from "@/lib/api/types";

/**
 * Hook for fetching menu items by category ID
 */
export function useMenuItemsByCategory(categoryId: string) {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items", "category", categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${categoryId}/menu-items`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single menu item by slug
 */
export function useMenuItem(slug: string) {
  return useQuery<MenuItem>({
    queryKey: ["menu-item", slug],
    queryFn: async () => {
      const response = await fetch(`/api/menu/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu item');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single menu item by ID
 */
export function useMenuItemById(id: string) {
  return useQuery<MenuItem>({
    queryKey: ["menu-item", "id", id],
    queryFn: async () => {
      const response = await fetch(`/api/menu/items/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu item');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching menu items by category slug
 */
export function useMenuItemsByCategorySlug(
  brandName: string | undefined,
  locationSlug: string | undefined,
  categorySlug: string,
  menuSlug: string = 'main-menu'
) {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items", "category-slug", brandName, locationSlug, menuSlug, categorySlug],
    queryFn: async () => {
      if (!brandName || !locationSlug || !categorySlug) {
        throw new Error('Missing required parameters');
      }
      
      const params = new URLSearchParams({
        brandName,
        locationSlug,
        menuSlug,
        categorySlug,
      });
      
      const response = await fetch(`/api/menu/items?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
    enabled: !!brandName && !!locationSlug && !!categorySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}