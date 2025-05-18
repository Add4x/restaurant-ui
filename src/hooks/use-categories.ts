"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getMenuItemsByCategory } from "@/actions/api";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  // other fields...
});

export type Category = z.infer<typeof categorySchema>;

export function useCategories() {
  console.log("useCategories #######");
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
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
