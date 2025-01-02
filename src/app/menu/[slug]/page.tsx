import { getMenuItemsByCategory } from "@/actions/menu";
import { MenuItemCard } from "@/app/menu/components/menu-item-card";
import { notFound } from "next/navigation";
import { subMenuItems } from "@/data/submenu-items";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // get the value from subMenuItems and use it to get the categoryId from subMenuItemMap
  const categoryId = subMenuItems[slug as keyof typeof subMenuItems];
  const items = await getMenuItemsByCategory(categoryId);
  const storage_url = process.env.SUPABASE_STORAGE_URL;

  // append the image_url to each item
  items.forEach((item) => {
    if (item.image_url) {
      item.image_url = `${storage_url}/${item.image_url}`;
      item.image_alt_text = item.name;
    } else {
      item.image_url = "/images/menu-placeholder.jpg";
      item.image_alt_text = "Menu placeholder image";
    }
  });

  if (!items.length) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 capitalize font-playfair text-primaryDark text-center">
          {slug.replace("-", " ")}
        </h1>
        <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:mx-0">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
