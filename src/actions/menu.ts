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

    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);
    const encodedCategorySlug = encodeURIComponent(categorySlug);

    const url = `${BASE_URL}/api/menu/items?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}&categorySlug=${encodedCategorySlug}`;

    const response = await authorizedFetch(url);
    rawData = await response.json();

    // Validate the data using Zod schema
    const menuItems = z.array(menuItemSchema).parse(rawData);

    return { success: true, data: menuItems };
  } catch (error) {
    console.error("Failed to fetch menu items by category slug:", error);

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

    const encodedBrandName = encodeURIComponent(brandName);
    const encodedLocationSlug = encodeURIComponent(locationSlug);
    const encodedMenuSlug = encodeURIComponent(menuSlug);
    const encodedCategorySlug = encodeURIComponent(categorySlug);
    const encodedItemSlug = encodeURIComponent(itemSlug);

    const url = `${BASE_URL}/api/menu/item-details?brandName=${encodedBrandName}&locationSlug=${encodedLocationSlug}&menuSlug=${encodedMenuSlug}&categorySlug=${encodedCategorySlug}&itemSlug=${encodedItemSlug}`;

    const response = await authorizedFetch(url);
    rawData = await response.json();

    // Validate the data using Zod schema
    const menuItemDetail = menuItemDetailSchema.parse(rawData);

    return { success: true, data: menuItemDetail };
  } catch (error) {
    console.error("Failed to fetch menu item details:", error);

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
