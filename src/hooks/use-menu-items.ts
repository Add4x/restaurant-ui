import { useQuery } from "@tanstack/react-query";
import { getMenuItemsByCategory } from "@/actions/menu";
import { MenuItem } from "@/lib/types";

export function useMenuItems(categoryId: string) {
  return useQuery({
    queryKey: ["menuItems", categoryId],
    queryFn: async () => {
      const items = await getMenuItemsByCategory(categoryId);
      return items;
    },
    select: (items: MenuItem[]) => {
      const storage_url = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;

      return items.map((item) => ({
        ...item,
        image_url: item.image_url
          ? `${storage_url}/${item.image_url}`
          : "/images/menu-placeholder.jpg",
        image_alt_text: item.image_url ? item.name : "Menu placeholder image",
      }));
    },
  });
}
