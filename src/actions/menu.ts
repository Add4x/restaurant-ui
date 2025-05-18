"use server";

import {
  getCategories as getApiCategories,
  getMenuItemsByCategory as getApiMenuItemsByCategory,
  getFavoriteMenuItems as getApiFavoriteMenuItems,
  ActionResult as ApiActionResult,
  FavoriteMenuItem,
  MenuItemView,
} from "@/actions/api";
import { Category } from "@/lib/types";
import { ApiError } from "@/lib/api-client";

// Re-export the API result type with a different name to avoid conflicts
export type ActionResult<T> = ApiActionResult<T>;

// Re-export the API functions with proper type handling
export async function getCategories(): Promise<ActionResult<Category[]>> {
  const result = await getApiCategories();

  // Transform the result to match the expected Category type
  if (result.success) {
    const transformedData = result.data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      imageAltText: item.imageAltText,
      displayOrder: item.displayOrder,
    }));

    return {
      success: true,
      data: transformedData as Category[],
    };
  }

  return result;
}

export type { FavoriteMenuItem };

export async function getFavoriteMenuItems(): Promise<
  ActionResult<FavoriteMenuItem[]>
> {
  return getApiFavoriteMenuItems();
}

export async function getMenuItemsByCategory(
  categoryId: string
): Promise<ActionResult<MenuItemView[]>> {
  return getApiMenuItemsByCategory(categoryId);
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
}

/**
 * Get a specific menu item by ID
 */
export async function getMenuItem(id: string): Promise<ActionResult<MenuItem>> {
  try {
    // This is just a placeholder - you'll need to implement the actual API call
    throw new Error("Not implemented");
  } catch (error) {
    console.error(`Failed to fetch menu item with ID ${id}:`, error);

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
