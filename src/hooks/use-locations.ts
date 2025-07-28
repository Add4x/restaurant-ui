"use client";

import { useQuery } from "@tanstack/react-query";
// Client-side hooks use fetch directly to Route Handlers
import type { Location } from "@/lib/api/types";

/**
 * Hook for fetching all locations
 */
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for fetching a single location by slug
 */
export function useLocation(slug: string) {
  return useQuery<Location>({
    queryKey: ["location", slug],
    queryFn: async () => {
      const response = await fetch(`/api/locations/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for fetching a single location by ID
 */
export function useLocationById(id: string) {
  return useQuery<Location>({
    queryKey: ["location", "id", id],
    queryFn: async () => {
      const response = await fetch(`/api/locations/id/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}