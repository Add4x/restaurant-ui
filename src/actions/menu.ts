"use server";

import {
  getCategories as getApiCategories,
  getMenuItemsByCategory as getApiMenuItemsByCategory,
  getFavoriteMenuItems as getApiFavoriteMenuItems,
  ActionResult as ApiActionResult,
  FavoriteMenuItem,
  MenuItemView,
} from "@/actions/api";
import { Category, MenuItemDetail, MenuItem } from "@/lib/types";
import { menuItemDetailSchema, menuItemSchema } from "@/lib/types";
import { z } from "zod";
import { publicApiClient } from "@/lib/api-client.server";

/**
 * Get categories for a specific brand and location
 */
export async function getCategories(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu"
): Promise<ApiActionResult<Category[]>> {
  return getApiCategories(brandName, locationSlug, menuSlug);
}

/**
 * Get menu items by category (legacy - uses category ID)
 */
export async function getMenuItemsByCategory(
  categoryId: string
): Promise<ApiActionResult<MenuItemView[]>> {
  return getApiMenuItemsByCategory(categoryId);
}

/**
 * Get menu items by category using the new API endpoint
 */
export async function getMenuItemsByCategorySlug(
  brandName: string,
  locationSlug: string,
  menuSlug: string,
  categorySlug: string
): Promise<ApiActionResult<MenuItem[]>> {
  let rawData: unknown = null;

  try {
    // Validate inputs
    if (!brandName?.trim()) {
      return {
        success: false,
        error: "Brand name is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    if (!locationSlug?.trim()) {
      return {
        success: false,
        error: "Location slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    if (!categorySlug?.trim()) {
      return {
        success: false,
        error: "Category slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    const queryParams = new URLSearchParams({
      brandName,
      locationSlug,
      menuSlug,
      categorySlug,
    });

    rawData = await publicApiClient.get(
      `/menu/items?${queryParams.toString()}`
    );

    // Validate the data using Zod schema
    const menuItems = z.array(menuItemSchema).parse(rawData);

    return { success: true, data: menuItems };
  } catch (error) {
    console.error("Failed to fetch menu items by category slug:", error);

    // Handle API errors from server client
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { message: string; status: number };
      return {
        success: false,
        error: apiError.message,
        code: 'HTTP_ERROR',
        status: apiError.status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      console.error("Validation error details:", {
        issues: error.issues,
        rawData: rawData,
      });

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
 * Get detailed menu item information
 */
export async function getMenuItemDetails(
  brandName: string,
  locationSlug: string,
  menuSlug: string,
  categorySlug: string,
  itemSlug: string
): Promise<ApiActionResult<MenuItemDetail>> {
  let rawData: unknown = null;

  try {
    // Validate inputs
    if (!brandName?.trim()) {
      return {
        success: false,
        error: "Brand name is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    if (!locationSlug?.trim()) {
      return {
        success: false,
        error: "Location slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    if (!categorySlug?.trim()) {
      return {
        success: false,
        error: "Category slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    if (!itemSlug?.trim()) {
      return {
        success: false,
        error: "Item slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    const queryParams = new URLSearchParams({
      brandName,
      locationSlug,
      menuSlug,
      categorySlug,
      itemSlug,
    });

    rawData = await publicApiClient.get(
      `/menu/item-details?${queryParams.toString()}`
    );

    // Validate the data using Zod schema
    const menuItemDetail = menuItemDetailSchema.parse(rawData);

    return { success: true, data: menuItemDetail };
  } catch (error) {
    console.error("Failed to fetch menu item details:", error);

    // Handle API errors from server client
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { message: string; status: number };
      return {
        success: false,
        error: apiError.message,
        code: 'HTTP_ERROR',
        status: apiError.status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      console.error("Validation error details:", {
        issues: error.issues,
        rawData: rawData,
      });

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
 * Get favorite menu items for a specific brand and location
 */
export async function getFavoriteMenuItems(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu",
  tagSlug: string = "popular"
): Promise<ApiActionResult<FavoriteMenuItem[]>> {
  return getApiFavoriteMenuItems(brandName, locationSlug, menuSlug, tagSlug);
}
