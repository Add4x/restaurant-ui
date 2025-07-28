"use server";

import { z } from "zod";
import { menuItemSchema, locationSchema } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1/public";

// Define a consistent return type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

// Define schemas for API responses

// Type exports - define the type directly since we're transforming the API response
export type FavoriteMenuItem = {
  id: string;
  name: string;
  shortDescription: string;
  image_url: string;
  image_alt_text: string;
};
export type MenuItemView = z.infer<typeof menuItemSchema>;
export type LocationData = z.infer<typeof locationSchema>;

/**
 * Get categories with brand name and location slug (primary API)
 */
export async function getCategories(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu"
): Promise<
  ActionResult<
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      imageAltText: string;
      displayOrder: number;
    }[]
  >
> {
  return getCategoriesWithLocation(brandName, locationSlug, menuSlug);
}

/**
 * Get favorite menu items by tag (popular)
 */
export async function getFavoriteMenuItems(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu",
  tagSlug: string = "popular"
): Promise<ActionResult<FavoriteMenuItem[]>> {
  try {
    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);
    const encodedTagSlug = encodeURIComponent(tagSlug);

    const response = await fetch(
      `${BASE_URL}/api/${API_VERSION}/menu/items-by-tag?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}&tagSlug=${encodedTagSlug}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    // Define schema for the API response
    const apiMenuItemSchema = z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      image_url: z.string().optional().default("/images/menu-placeholder.jpg"),
      image_alt_text: z.string().optional().default("Menu placeholder image"),
      // We only need these fields from the API response
      // Other fields like price, tags, proteins, modifications are ignored
    });

    // Validate the API response
    const apiMenuItems = z.array(apiMenuItemSchema).parse(rawData);

    // Transform API response to match favoriteMenuItemSchema
    const favorites: FavoriteMenuItem[] = apiMenuItems.map((item) => ({
      id: String(item.id),
      name: item.name,
      shortDescription: item.description,
      image_url: item.image_url,
      image_alt_text: item.image_alt_text,
    }));

    return { success: true, data: favorites };
  } catch (error) {
    console.error("Failed to fetch favorite menu items:", error);

    if (error instanceof Error && error.message.includes("HTTP error")) {
      const status = parseInt(
        error.message.match(/status: (\d+)/)?.[1] || "500"
      );
      return {
        success: false,
        error: error.message,
        code: "HTTP_ERROR",
        status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data format: ${error.message}`,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(
  categoryId: string
): Promise<ActionResult<MenuItemView[]>> {
  try {
    // Validate input
    const validCategoryId = z.string().uuid().parse(categoryId);

    const response = await fetch(
      `${BASE_URL}/api/${API_VERSION}/categories/${validCategoryId}/menu-items`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    // Validate the data
    const menuItems = z.array(menuItemSchema).parse(rawData);

    return { success: true, data: menuItems };
  } catch (error) {
    console.error(
      `Failed to fetch menu items for category ${categoryId}:`,
      error
    );

    if (error instanceof Error && error.message.includes("HTTP error")) {
      const status = parseInt(
        error.message.match(/status: (\d+)/)?.[1] || "500"
      );
      return {
        success: false,
        error: error.message,
        code: "HTTP_ERROR",
        status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data format: ${error.message}`,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get restaurant locations by brand name
 */
export async function getLocationsByBrandName(
  brandName: string
): Promise<ActionResult<LocationData[]>> {
  try {
    const encodedBrandName = encodeURIComponent(brandName);

    const response = await fetch(
      `${BASE_URL}/api/${API_VERSION}/restaurants/locations?brandName=${encodedBrandName}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    // Validate the data
    const locations = z.array(locationSchema).parse(rawData);

    return { success: true, data: locations };
  } catch (error) {
    console.error(`Failed to fetch locations for brand: ${brandName}`, error);

    if (error instanceof Error && error.message.includes("HTTP error")) {
      const status = parseInt(
        error.message.match(/status: (\d+)/)?.[1] || "500"
      );
      return {
        success: false,
        error: error.message,
        code: "HTTP_ERROR",
        status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Invalid data format: ${error.message}`,
        code: "VALIDATION_ERROR",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get categories with brand name and location slug
 */
export async function getCategoriesWithLocation(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu"
): Promise<
  ActionResult<
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      imageAltText: string;
      displayOrder: number;
    }[]
  >
> {
  try {
    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);

    const response = await fetch(
      `${BASE_URL}/api/${API_VERSION}/menu/categories?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    // Parse categories response (different structure than the hardcoded one)
    const categoryResponseSchema = z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      description: z.string(),
      displayOrder: z.number(),
      image_url: z.string().optional(),
      image_alt_text: z.string().optional(),
    });

    const parsedData = z.array(categoryResponseSchema).parse(rawData);

    // Process the data to match the expected format
    const categories = parsedData.map((category) => ({
      id: String(category.id),
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url || "/images/menu-placeholder.jpg",
      imageAltText: category.image_alt_text || "Menu placeholder image",
      displayOrder: category.displayOrder,
    }));

    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories with location:", error);

    if (error instanceof Error && error.message.includes("HTTP error")) {
      const status = parseInt(
        error.message.match(/status: (\d+)/)?.[1] || "500"
      );
      return {
        success: false,
        error: error.message,
        code: "HTTP_ERROR",
        status,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
