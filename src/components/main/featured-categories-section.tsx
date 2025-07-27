"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/stores/location-store";
import { getCategories } from "@/actions/menu";

export function FeaturedCategoriesSection() {
  const { brandName, selectedLocation } = useLocationStore();

  const { data: categoriesResult, isLoading } = useQuery({
    queryKey: ["categories", brandName, selectedLocation?.slug],
    queryFn: () => getCategories(brandName, selectedLocation!.slug),
    enabled: !!brandName && !!selectedLocation?.slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const categories = categoriesResult?.success ? categoriesResult.data : [];
  const featuredCategories = categories.slice(0, 4);

  if (isLoading || featuredCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-8 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8 font-playfair text-primaryDark">
          Explore Our Menu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/menu?category=${category.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={category.imageUrl || "/placeholder-food.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white font-semibold text-xl">
                      {category.name}
                    </h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description || `Discover our delicious ${category.name.toLowerCase()} options`}
                    </p>
                    <span className="text-primary font-medium text-sm mt-2 inline-block hover:underline">
                      View Items →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/menu"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}