"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
// Client-side hooks use fetch directly to Route Handlers
import type { Offer, ValidateOfferRequest } from "@/lib/api/types";

/**
 * Hook for fetching all offers
 */
export function useOffers() {
  return useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await fetch('/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching offers by location
 */
export function useOffersByLocation(locationId: string) {
  return useQuery<Offer[]>({
    queryKey: ["offers", "location", locationId],
    queryFn: async () => {
      const response = await fetch(`/api/offers?locationId=${locationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return response.json();
    },
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for validating an offer code
 */
export function useValidateOffer() {
  return useMutation<Offer, Error, ValidateOfferRequest>({
    mutationFn: async (data) => {
      const response = await fetch('/api/offers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to validate offer');
      }
      return response.json();
    },
  });
}