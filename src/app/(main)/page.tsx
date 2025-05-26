import { HeroSection } from "@/components/hero-section";
import { FavoritesSection } from "@/components/main/favorites-section";
import TestimonialSection from "@/components/testimonial-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FavoritesSection />
      <TestimonialSection />
    </div>
  );
}
