"use client";

import React, { Suspense } from "react";
import { MenuItemsGrid } from "@/app/(main)/menu/[slug]/menu-items-grid";
import { LoadingGrid } from "@/components/loading-grid";
import { useMenuItemsByCategorySlug } from "@/hooks/use-menu-items";
import { useMenuStore } from "@/stores/menu-store";
import { useLocationStore } from "@/stores/location-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MenuItem as ApiMenuItem } from "@/lib/api/types";
import type { MenuItem } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function ErrorState({
  message,
  onRetry,
  onGoBack,
}: {
  message: string;
  onRetry: () => void;
  onGoBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Category Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          {message ||
            "The menu category you're looking for doesn't exist or has no items."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { setCurrentCategory } = useMenuStore();
  const { brandName, selectedLocation } = useLocationStore();
  const router = useRouter();

  // We need to unwrap the params Promise
  const [categorySlug, setCategorySlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then(({ slug }) => {
      setCategorySlug(slug);
      // Set the current category in the store when the page loads
      setCurrentCategory(slug);
    });
  }, [params, setCurrentCategory]);

  // Get menu items directly by category slug
  const {
    data: menuItems,
    isLoading,
    isError,
    refetch,
  } = useMenuItemsByCategorySlug(
    brandName || undefined,
    selectedLocation?.slug || undefined,
    categorySlug || "",
    'main-menu'
  );

  const handleRetry = () => {
    refetch();
  };

  const handleGoBack = () => {
    router.push("/menu");
  };

  // Log errors for debugging
  React.useEffect(() => {
    if (isError && !isLoading) {
      console.error("Menu items error:", isError);
    }
  }, [isError, isLoading]);

  // Loading state
  if (!categorySlug || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <LoadingGrid />
        </div>
      </div>
    );
  }

  // Network/Query error (different from API error)
  if (isError) {
    return (
      <ErrorState
        message="Something went wrong while loading the menu items. Please try again."
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }


  // Success state
  const apiItems = menuItems as ApiMenuItem[] | undefined;
  if (!apiItems || apiItems.length === 0) {
    return (
      <ErrorState
        message="No menu items found in this category."
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  // Get category name from slug
  const categoryName = categorySlug
    ? categorySlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Menu Items";

  // Convert API items to the expected MenuItem format
  const items: MenuItem[] = apiItems.map(item => ({
    id: parseInt(item.id),
    slug: item.slug,
    name: item.name,
    description: item.description || "",
    price: item.price,
    isVegetarian: item.isVegetarian,
    isGlutenFree: item.isGlutenFree,
    tags: item.tags || [],
    proteins: item.proteins || [],
    modifications: item.modifications || [],
    image_url: item.imageUrl || "/images/menu-placeholder.jpg",
    image_alt_text: item.name,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-primaryDark">
            {categoryName}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our selection of authentic {categoryName.toLowerCase()} dishes
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<LoadingGrid />}>
          <MenuItemsGrid menuItems={items} />
        </Suspense>
      </div>
    </div>
  );
}
