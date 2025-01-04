import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import { getFavoriteMenuItems } from "@/actions/menu";
import TestimonialSection from "@/components/testimonial-section";

export default async function Home() {
  const FavoriteMenuItem = await getFavoriteMenuItems();

  FavoriteMenuItem.forEach((item) => {
    if (item.image_url) {
      item.image_url = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${item.image_url}`;
    } else {
      item.image_url = "/images/menu-placeholder.jpg";
      item.image_alt_text = "Menu placeholder image";
    }
  });

  return (
    <div>
      <HeroSection />
      <FavoritesSection items={FavoriteMenuItem} />
      <TestimonialSection />
    </div>
  );
}
