"use client";

import { MenuCard } from "@/app/(main)/menu/components/menu-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/divider";
import {
  ErrorState,
  DataNotFoundError,
  NetworkError,
} from "@/components/ui/error-state";
import { ComponentLoading } from "@/components/ui/loading-state";
import { useCategories } from "@/hooks/use-categories";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/menu-store";
import { useLocationStore } from "@/stores/location-store";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function MenuCategoryGrid() {
  const { data: result, error, isLoading, refetch } = useCategories();
  const router = useRouter();
  const { setCurrentCategory } = useMenuStore();
  const { brandName, selectedLocation } = useLocationStore();

  // Handle loading state or when location data is not ready
  if (isLoading || !brandName || !selectedLocation?.slug)
    return <ComponentLoading message="Loading menu categories..." />;

  // Handle query error (network error, etc.)
  if (error) {
    return <NetworkError onRetry={() => refetch()} />;
  }

  // Handle API error response
  if (result?.error) {
    return (
      <ErrorState
        title="Failed to Load Menu Categories"
        message={
          result.message ||
          "We couldn't load the menu categories. Please try again."
        }
        onRetry={() => refetch()}
        variant="default"
      />
    );
  }

  // Handle no data - only show this if we have a successful result but no categories
  const categories = result?.data;
  if (result && (!categories || categories.length === 0)) {
    return (
      <DataNotFoundError
        title="No Menu Categories Available"
        message="We don't have any menu categories to show right now. Please check back later or contact us if this problem persists."
        onRetry={() => refetch()}
      />
    );
  }

  // If we don't have result yet, don't render anything (let loading state handle it)
  if (!result || !categories) {
    return <ComponentLoading message="Loading menu categories..." />;
  }

  const handleViewMore = (categorySlug: string) => {
    // Set the current category in the store
    setCurrentCategory(categorySlug);

    // Navigate to the category page
    router.push(`/menu/${categorySlug}`);
  };

  return (
    <div className="container mx-auto">
      <div className="grid gap-8">
        {/* first item - featured full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative w-full h-[20rem] md:h-[24rem] overflow-hidden">
                <Image
                  src={categories[0].imageUrl}
                  alt={categories[0].imageAltText}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="flex flex-col justify-center p-8 md:p-12">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-primaryDark font-playfair">
                    {categories[0].name}
                  </CardTitle>
                </CardHeader>
                <Divider className="mb-6" />
                <CardDescription className="flex flex-col gap-6">
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {categories[0].description}
                  </p>
                  <Button
                    onClick={() => handleViewMore(categories[0].slug)}
                    size="lg"
                    className="self-start group/btn hover:bg-primary/90 transition-all"
                  >
                    Explore {categories[0].name}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardDescription>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Remaining items in grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(1).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}