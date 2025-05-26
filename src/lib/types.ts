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

// Menu item schema
export const menuItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  base_price: z.number(),
  max_price: z.number(),
  short_description: z.string(),
  has_protein_options: z.boolean(),
  category_name: z.string(),
  image_url: z.string(),
  image_alt_text: z.string(),
  menu_item_proteins: z.array(menuItemProteinSchema),
});

// Schema for tags in detailed menu item
export const menuItemTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Schema for proteins in detailed menu item
export const menuItemDetailProteinSchema = z.object({
  id: z.number(),
  name: z.string(),
  additionalCost: z.number(),
});

// Schema for modifications in detailed menu item
export const menuItemModificationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  additionalCost: z.number(),
});

// Detailed menu item schema for the new API endpoint
export const menuItemDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  isVegetarian: z.boolean(),
  isGlutenFree: z.boolean(),
  tags: z.array(menuItemTagSchema),
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
