import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Providers } from "@/app/(main)/providers";
import { LocationInitializer } from "@/components/location-initializer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brandName = process.env.RESTAURANT_BRAND || "Burger Palace";
  const defaultLocationSlug = process.env.MAIN_LOCATION_SLUG || "burger-palace-downtown";

  return (
    <Providers>
      <LocationInitializer
        brandName={brandName}
        defaultLocationSlug={defaultLocationSlug}
      />
      <Navbar />
      {children}
      <Footer />
    </Providers>
  );
}
