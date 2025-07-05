import { z } from "zod";

// Schema for protein options
export const proteinOptionSchema = z.object({
  name: z.string(),
  is_vegetarian: z.boolean(),
  price_addition: z.number(),
});

// Schema for menu item proteins
export const menuItemProteinSchema = z.object({
  protein_options: proteinOptionSchema,
});

// Schema for tags in menu items
export const menuItemTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Schema for proteins in menu items
export const menuItemProteinResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  additionalCost: z.number(),
});

// Schema for modifications in menu items
export const menuItemModificationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  additionalCost: z.number(),
});

// Updated menu item schema to match API response
export const menuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  isVegetarian: z.boolean().nullable().default(false),
  isGlutenFree: z.boolean().nullable().default(false),
  tags: z.array(menuItemTagSchema),
  proteins: z.array(menuItemProteinResponseSchema),
  modifications: z.array(menuItemModificationSchema),
  // Add default values for image fields since they're not in the API response
  image_url: z.string().optional().default("/images/menu-placeholder.jpg"),
  image_alt_text: z.string().optional().default("Menu placeholder image"),
});

// Schema for tags in detailed menu item (keeping for backward compatibility)
export const menuItemDetailTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Schema for proteins in detailed menu item (keeping for backward compatibility)
export const menuItemDetailProteinSchema = z.object({
  id: z.number(),
  name: z.string(),
  additionalCost: z.number(),
});

// Detailed menu item schema for the item-details API endpoint (keeping existing)
export const menuItemDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  isVegetarian: z.boolean().nullable().default(false),
  isGlutenFree: z.boolean().nullable().default(false),
  tags: z.array(menuItemDetailTagSchema),
  proteins: z.array(menuItemDetailProteinSchema),
  modifications: z.array(menuItemModificationSchema),
});

// Category schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional().default(0),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default("/images/menu-placeholder.jpg"),
  imageAltText: z.string().optional().default("Menu placeholder image"),
});

// Location schema
export const locationSchema = z.object({
  locationId: z.number(),
  name: z.string(),
  slug: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  openingHours: z.string(),
  cuisineType: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  active: z.boolean(),
});

// Type exports
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuItemDetail = z.infer<typeof menuItemDetailSchema>;
export type MenuItemTag = z.infer<typeof menuItemTagSchema>;
export type MenuItemDetailProtein = z.infer<typeof menuItemDetailProteinSchema>;
export type MenuItemModification = z.infer<typeof menuItemModificationSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProteinOption = z.infer<typeof proteinOptionSchema>;
export type MenuItemProtein = z.infer<typeof menuItemProteinSchema>;
export type Location = z.infer<typeof locationSchema>;

// Shared types for the restaurant application

export type FavoriteMenuItem = {
  id: string;
  name: string;
  shortDescription: string;
  image_url: string;
  image_alt_text: string;
};

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

// Re-export from api.ts to avoid circular dependencies
export type { MenuItemView, LocationData } from "@/actions/api";
