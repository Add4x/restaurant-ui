import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import { getFavoriteMenuItems } from "@/actions/menu";
import TestimonialSection from "@/components/testimonial-section";

export default async function Home() {
  const result = await getFavoriteMenuItems();

  if (!result.success) {
    console.error("Failed to load favorite menu items:", result.error);
    // Return an empty array if there was an error
    return (
      <div>
        <HeroSection />
        <FavoritesSection items={[]} />
        <TestimonialSection />
      </div>
    );
  }

  const favoriteItems = result.data;

  // Process image URLs - our backend API now returns complete URLs
  // but we still handle the case where an image might be missing
  favoriteItems.forEach((item) => {
    if (!item.image_url) {
      item.image_url = "/images/menu-placeholder.jpg";
      item.image_alt_text = "Menu placeholder image";
    }
  });

  return (
    <div>
      <HeroSection />
      <FavoritesSection items={favoriteItems} />
      <TestimonialSection />
    </div>
  );
}
