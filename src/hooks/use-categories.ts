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
  console.log("brandName #######", brandName);
  console.log("selectedLocation #######", selectedLocation);

  return useQuery({
    queryKey: ["categories", brandName, selectedLocation?.slug],
    queryFn: async () => {
      if (!brandName || !selectedLocation?.slug) {
        throw new Error("Brand name and location are required");
      }

      const result = await getCategories(brandName, selectedLocation.slug);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!brandName && !!selectedLocation?.slug,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const result = await getMenuItemsByCategory(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!id,
  });
}
