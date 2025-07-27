import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import { LocationHoursSection } from "@/components/main/location-hours-section";
import TestimonialSection from "@/components/testimonial-section";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <div className="space-y-0">
        <LocationHoursSection />
        <FavoritesSection />
        <TestimonialSection />
      </div>
    </div>
  );
}
