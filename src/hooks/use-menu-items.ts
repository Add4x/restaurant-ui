import { useQuery } from "@tanstack/react-query";
import {
  getMenuItemsByCategory,
  getCategories,
  getFavoriteMenuItems,
  type FavoriteMenuItem,
} from "@/actions/menu";
import { MenuItem, Category } from "@/lib/types";

export function useMenuItems(categoryId: string) {
  const query = useQuery({
    queryKey: ["menuItems", categoryId],
    queryFn: async () => {
      const items = await getMenuItemsByCategory(categoryId);
      return items;
    },
    select: (items: MenuItem[]) => {
      const storage_url = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

      const processedItems = items.map((item) => ({
        ...item,
        image_url: item.image_url
          ? `${storage_url}/${item.image_url}`
          : "/images/menu-placeholder.jpg",
        image_alt_text: item.image_url ? item.name : "Menu placeholder image",
      }));

      return processedItems;
    },
  });

  return query;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    select: (categories: Category[]) => {
      const storage_url = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

      return categories.map((category) => ({
        ...category,
        image_url: category.image_url
          ? `${storage_url}/${category.image_url}`
          : "/images/menu-placeholder.jpg",
        image_alt_text:
          category.image_alt_text || "Menu category placeholder image",
      }));
    },
  });
}

export function useFavoriteMenuItems() {
  return useQuery<FavoriteMenuItem[]>({
    queryKey: ["favoriteMenuItems"],
    queryFn: () => getFavoriteMenuItems(),
    select: (items: FavoriteMenuItem[]) => {
      const storage_url = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

      return items.map((item) => ({
        ...item,
        image_url: item.image_url
          ? `${storage_url}/${item.image_url}`
          : "/images/menu-placeholder.jpg",
        image_alt_text: item.image_alt_text || "Menu item placeholder image",
      }));
    },
  });
}
