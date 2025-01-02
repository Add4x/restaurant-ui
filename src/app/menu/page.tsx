import { getCategories } from "@/actions/menu";
import { MenuCategoryGrid } from "@/app/menu/components/menu-category-grid";

export default async function MenuPage() {
  // These will run on the server
  const categories = await getCategories();
  const storage_url = process.env.SUPABASE_STORAGE_URL;

  // append the image_url to each category
  categories.forEach((category) => {
    if (category.image_url) {
      category.image_url = `${storage_url}/${category.image_url}`;
    } else {
      category.image_url = "/images/menu-placeholder.jpg";
      category.image_alt_text = "Menu placeholder image";
    }
  });

  console.log(categories);

  return (
    <div className="container md:max-w-6xl min-h-screen py-16">
      <MenuCategoryGrid items={categories} />
    </div>
  );
}
