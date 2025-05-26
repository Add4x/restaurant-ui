import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import TestimonialSection from "@/components/testimonial-section";
import { LocationInitializer } from "@/components/location-initializer";

export default function Home() {
  // Pass environment variables to client components
  const brandName = process.env.RESTAURANT_BRAND || "Burger Palace";
  const defaultLocationSlug =
    process.env.MAIN_LOCATION_SLUG || "burger-palace-downtown";

  return (
    <div>
      <LocationInitializer
        brandName={brandName}
        defaultLocationSlug={defaultLocationSlug}
      />
      <HeroSection />
      <FavoritesSection />
      <TestimonialSection />
    </div>
  );
}
