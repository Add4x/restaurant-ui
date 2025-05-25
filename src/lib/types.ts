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

// Category schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
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
export type Category = z.infer<typeof categorySchema>;
export type ProteinOption = z.infer<typeof proteinOptionSchema>;
export type MenuItemProtein = z.infer<typeof menuItemProteinSchema>;
export type Location = z.infer<typeof locationSchema>;
