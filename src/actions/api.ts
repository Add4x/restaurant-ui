"use server";

import { z } from "zod";
import { authorizedFetch } from "@/actions/auth";
import { menuItemSchema } from "@/lib/types";
import { ApiError } from "@/lib/api-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Define a consistent return type for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

// Define schemas for API responses
const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  display_order: z.number().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  image_alt_text: z.string().optional(),
});

const favoriteMenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_description: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
  image_alt_text: z.string().optional().default(""),
});

// Type exports
export type FavoriteMenuItem = z.infer<typeof favoriteMenuItemSchema>;
export type MenuItemView = z.infer<typeof menuItemSchema>;

/**
 * Get all categories
 */
export async function getCategories(): Promise<
  ActionResult<z.infer<typeof categoryResponseSchema>[]>
> {
  try {
    const response = await authorizedFetch(`${BASE_URL}/api/categories`);
    const rawData = await response.json();

    // Validate and transform the data
    const parsedData = z.array(categoryResponseSchema).parse(rawData);

    // Process the data to match the expected format
    const categories = parsedData.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      image_alt_text: category.image_alt_text ?? "",
      display_order: category.display_order ?? 0,
    }));

    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);

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

/**
 * Get favorite menu items
 */
export async function getFavoriteMenuItems(): Promise<
  ActionResult<FavoriteMenuItem[]>
> {
  try {
    const response = await authorizedFetch(
      `${BASE_URL}/api/menu-items/favorites`
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
