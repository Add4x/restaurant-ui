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
import { ApiError } from "@/lib/api-client";
import { authorizedFetch } from "@/actions/auth";
import { menuItemDetailSchema, menuItemSchema } from "@/lib/types";
import { z } from "zod";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Re-export the API result type with a different name to avoid conflicts
export type ActionResult<T> = ApiActionResult<T>;

// Re-export types for convenience
export type { FavoriteMenuItem, MenuItemView };

/**
 * Get categories for a specific brand and location
 */
export async function getCategories(
  brandName: string,
  locationSlug: string,
  menuSlug: string = "main-menu"
): Promise<ActionResult<Category[]>> {
  return getApiCategories(brandName, locationSlug, menuSlug);
}

/**
 * Get menu items by category (legacy - uses category ID)
 */
export async function getMenuItemsByCategory(
  categoryId: string
): Promise<ActionResult<MenuItemView[]>> {
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
): Promise<ActionResult<MenuItem[]>> {
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

    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);
    const encodedCategorySlug = encodeURIComponent(categorySlug);

    const url = `${BASE_URL}/api/menu/items?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}&categorySlug=${encodedCategorySlug}`;

    console.log("Fetching menu items by category from:", url);

    const response = await authorizedFetch(url);
    const rawData = await response.json();

    // Validate the data using Zod schema
    const menuItems = z.array(menuItemSchema).parse(rawData);

    return { success: true, data: menuItems };
  } catch (error) {
    console.error(
      `Failed to fetch menu items for category ${categorySlug}:`,
      error
    );

    if (error instanceof ApiError) {
      // Map specific API errors to user-friendly messages
      let userMessage = error.message;

      if (error.status === 404) {
        userMessage = "Category not found or has no menu items.";
      } else if (error.status === 401) {
        userMessage =
          "Authentication required. Please try refreshing the page.";
      } else if (error.status === 403) {
        userMessage =
          "Access denied. You don't have permission to view this category.";
      } else if (error.status >= 500) {
        userMessage = "Server error. Please try again later.";
      }

      return {
        success: false,
        error: userMessage,
        code: error.code,
        status: error.status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      console.error("Data validation error:", error.errors);
      return {
        success: false,
        error: "The menu items data format is invalid. Please try again later.",
        code: "VALIDATION_ERROR",
        status: 422,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        status: 0,
      };
    }

    // Generic error fallback
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      code: "UNKNOWN_ERROR",
      status: 500,
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
): Promise<ActionResult<FavoriteMenuItem[]>> {
  return getApiFavoriteMenuItems(brandName, locationSlug, menuSlug, tagSlug);
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
): Promise<ActionResult<MenuItemDetail>> {
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

    if (!itemSlug?.trim()) {
      return {
        success: false,
        error: "Item slug is required",
        code: "INVALID_INPUT",
        status: 400,
      };
    }

    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);
    const encodedCategorySlug = encodeURIComponent(categorySlug);
    const encodedItemSlug = encodeURIComponent(itemSlug);

    const url = `${BASE_URL}/api/menu/item-details?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}&categorySlug=${encodedCategorySlug}&itemSlug=${encodedItemSlug}`;

    console.log("Fetching menu item details from:", url);

    const response = await authorizedFetch(url);
    const rawData = await response.json();

    // Validate the data using Zod schema
    const menuItemDetail = menuItemDetailSchema.parse(rawData);

    return { success: true, data: menuItemDetail };
  } catch (error) {
    console.error(`Failed to fetch menu item details for ${itemSlug}:`, error);

    if (error instanceof ApiError) {
      // Map specific API errors to user-friendly messages
      let userMessage = error.message;

      if (error.status === 404) {
        userMessage =
          "Menu item not found. It may have been removed or the link is incorrect.";
      } else if (error.status === 401) {
        userMessage =
          "Authentication required. Please try refreshing the page.";
      } else if (error.status === 403) {
        userMessage =
          "Access denied. You don't have permission to view this item.";
      } else if (error.status >= 500) {
        userMessage = "Server error. Please try again later.";
      }

      return {
        success: false,
        error: userMessage,
        code: error.code,
        status: error.status,
      };
    }

    // Handle Zod validation errors specially
    if (error instanceof z.ZodError) {
      console.error("Data validation error:", error.errors);
      return {
        success: false,
        error: "The menu item data format is invalid. Please try again later.",
        code: "VALIDATION_ERROR",
        status: 422,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        status: 0,
      };
    }

    // Generic error fallback
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      code: "UNKNOWN_ERROR",
      status: 500,
    };
  }
}
