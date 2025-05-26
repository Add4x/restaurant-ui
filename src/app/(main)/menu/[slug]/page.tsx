"use client";

import React, { Suspense } from "react";
import { MenuItemsGrid } from "@/app/(main)/menu/[slug]/menu-items-grid";
import { LoadingGrid } from "@/components/loading-grid";
import { useMenuItemsByCategory } from "@/hooks/use-menu-items";
import { useMenuStore } from "@/stores/menu-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const { currentMenuSlug, setCurrentCategory } = useMenuStore();
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

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useMenuItemsByCategory(currentMenuSlug, categorySlug || "");

  const handleRetry = () => {
    refetch();
  };

  const handleGoBack = () => {
    router.push("/menu");
  };

  // Log errors for debugging
  React.useEffect(() => {
    if (result?.error && !isLoading) {
      console.error("Menu items error:", result.message);
    }
  }, [result?.error, result?.message, isLoading]);

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

  // API returned an error (like 404)
  if (result?.error) {
    const isNotFound =
      result.status === 404 || result.code === "RESOURCE_NOT_FOUND";
    const message = isNotFound
      ? "This menu category doesn't exist or has no items available."
      : result.message || "Unable to load menu items.";

    return (
      <ErrorState
        message={message}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  // Success state
  const menuItems = result?.data;
  if (!menuItems || menuItems.length === 0) {
    return (
      <ErrorState
        message="No menu items found in this category."
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  // Get category name from the slug (capitalize first letter)
  const categoryName = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 normal-case font-playfair text-primaryDark text-center">
          {categoryName}
        </h1>
        <Suspense fallback={<LoadingGrid />}>
          <MenuItemsGrid menuItems={menuItems} />
        </Suspense>
      </div>
    </div>
  );
}
