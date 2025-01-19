"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Category } from "@/lib/types";

// get categories ordered by display_order with selected fields
export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_categories")
    .select("id, name, display_order, description, image_url, image_alt_text")
    .order("display_order", { ascending: true });
  if (error) throw new Error("Failed to fetch categories");

  // return data
  return data.map((category) => ({
    ...category,
    description: category.description ?? "",
    image_url: category.image_url ?? "",
    image_alt_text: category.image_alt_text ?? "",
    display_order: category.display_order ?? 0,
  }));
}

export interface FavoriteMenuItem {
  id: string;
  name: string;
  short_description: string;
  image_url: string;
  image_alt_text: string;
}

export async function getFavoriteMenuItems(): Promise<FavoriteMenuItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, short_description, image_url, image_alt_text")
    .eq("is_favorite", true)
    .limit(6);

  if (error) throw new Error("Failed to fetch favorite menu items");
  return data as FavoriteMenuItem[];
}

interface MenuItemView {
  id: string;
  name: string;
  base_price: number;
  max_price: number;
  short_description: string;
  has_protein_options: boolean;
  image_url: string;
  image_alt_text: string;
  category_name: string;
  menu_item_proteins: Array<{
    protein_options: {
      name: string;
      is_vegetarian: boolean;
      price_addition: number;
    };
  }>;
}

export async function getMenuItemsByCategory(
  categoryId: string
): Promise<MenuItemView[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.rpc("get_menu_items_by_category", {
    input_category_id: categoryId,
  });

  if (error) {
    throw new Error("Failed to fetch menu items");
  }

  return data as MenuItemView[];
}
