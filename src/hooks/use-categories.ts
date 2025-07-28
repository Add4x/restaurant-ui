"use client";

import { useQuery } from "@tanstack/react-query";
// Client-side hooks use fetch directly to Route Handlers
import type { Category, MenuItem } from "@/lib/api/types";

export function useCategories(brandName?: string, locationSlug?: string, menuSlug?: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", brandName, locationSlug, menuSlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (brandName) params.append('brandName', brandName);
      if (locationSlug) params.append('locationSlug', locationSlug);
      if (menuSlug) params.append('menuSlug', menuSlug);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/api/categories?${queryString}` : '/api/categories';
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ["category", "slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/categories/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

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