"use server";

import { z } from "zod";
import { authorizedFetch } from "@/actions/auth";
import { menuItemSchema, locationSchema } from "@/lib/types";
import { ApiError } from "@/lib/api-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Define a consistent return type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

// Define schemas for API responses

const favoriteMenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortDescription: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
  image_alt_text: z.string().optional().default(""),
});

// Type exports
export type FavoriteMenuItem = z.infer<typeof favoriteMenuItemSchema>;
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
 * Get favorite menu items
 */
export async function getFavoriteMenuItems(): Promise<
  ActionResult<FavoriteMenuItem[]>
> {
  try {
    const response = await authorizedFetch(
      `${BASE_URL}/api/menu-items/by-tag/favorite`
    );
    const rawData = await response.json();

    // Validate the data
    const favorites = z.array(favoriteMenuItemSchema).parse(rawData);

    return { success: true, data: favorites };
  } catch (error) {
    console.error("Failed to fetch favorite menu items:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        status: error.status,
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

    const response = await authorizedFetch(
      `${BASE_URL}/api/categories/${validCategoryId}/menu-items`
    );
    const rawData = await response.json();

    // Validate the data
    const menuItems = z.array(menuItemSchema).parse(rawData);

    return { success: true, data: menuItems };
  } catch (error) {
    console.error(
      `Failed to fetch menu items for category ${categoryId}:`,
      error
    );

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        status: error.status,
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
    const response = await authorizedFetch(
      `${BASE_URL}/api/restaurants/locations?brandName=${encodedBrandName}`
    );
    const rawData = await response.json();

    // Validate the data
    const locations = z.array(locationSchema).parse(rawData);

    return { success: true, data: locations };
  } catch (error) {
    console.error(`Failed to fetch locations for brand ${brandName}:`, error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        status: error.status,
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

    const response = await authorizedFetch(
      `${BASE_URL}/api/menu/categories?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}`
    );
    const rawData = await response.json();

    // Parse categories response (different structure than the hardcoded one)
    const categoryResponseSchema = z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      description: z.string(),
      displayOrder: z.number(),
    });

    const parsedData = z.array(categoryResponseSchema).parse(rawData);

    // Process the data to match the expected format
    const categories = parsedData.map((category) => ({
      id: String(category.id),
      name: category.name,
      description: category.description,
      imageUrl: "/images/menu-placeholder.jpg",
      imageAltText: "Menu placeholder image",
      displayOrder: category.displayOrder,
    }));

    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories with location:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        status: error.status,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
