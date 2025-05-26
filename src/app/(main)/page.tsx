import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import { getFavoriteMenuItems, FavoriteMenuItem } from "@/actions/menu";
import { getLocationsByBrandName } from "@/actions/api";
import TestimonialSection from "@/components/testimonial-section";
import { LocationInitializer } from "@/components/location-initializer";

export default async function Home() {
  const brandName = process.env.RESTAURANT_BRAND || "Burger Palace";
  const defaultLocationSlug =
    process.env.MAIN_LOCATION_SLUG || "burger-palace-downtown";

  // Fetch both locations and favorite items in parallel
  const [locationsResult, favoritesResult] = await Promise.all([
    getLocationsByBrandName(brandName),
    getFavoriteMenuItems(brandName, defaultLocationSlug),
  ]);

  // Handle locations error
  if (!locationsResult.success) {
    console.error("Failed to load locations:", locationsResult.error);
  }

  // Handle favorites error and provide fallback
  let favoriteItems: FavoriteMenuItem[] = [];
  if (favoritesResult.success) {
    favoriteItems = favoritesResult.data;
  } else {
    console.error("Failed to load favorite items:", favoritesResult.error);
  }

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
      <LocationInitializer
        brandName={brandName}
        locations={locationsResult.success ? locationsResult.data : []}
        defaultLocationSlug={defaultLocationSlug}
      />
      <HeroSection />
      <FavoritesSection items={favoriteItems} />
      <TestimonialSection />
    </div>
  );
}
