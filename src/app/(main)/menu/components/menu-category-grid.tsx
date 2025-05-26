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
// import Image from "next/image";
export function MenuCategoryGrid() {
  const { data: result, error, isLoading, refetch } = useCategories();
  const router = useRouter();
  const { setCurrentCategory } = useMenuStore();

  // Handle loading state
  if (isLoading)
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

  // Handle no data
  const categories = result?.data;
  if (!categories || categories.length === 0) {
    return (
      <DataNotFoundError
        title="No Menu Categories Available"
        message="We don't have any menu categories to show right now. Please check back later or contact us if this problem persists."
        onRetry={() => refetch()}
      />
    );
  }

  const handleViewMore = (categorySlug: string) => {
    // Set the current category in the store
    setCurrentCategory(categorySlug);

    // Navigate to the category page
    router.push(`/menu/${categorySlug}`);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primaryDark font-playfair">
        Our Menu
      </h1>
      <div className="grid gap-6">
        {/* first item - full width */}
        <Card className="w-full rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative w-full h-[18.75rem] ">
              {/* <Image
                src={categories[0].image_url}
                alt={categories[0].image_alt_text}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="eager"
              /> */}
              <img
                src={categories[0].imageUrl}
                alt={categories[0].imageAltText}
                className="object-cover w-full h-full"
              />
            </div>

            <CardContent className="flex flex-col gap-4 justify-center p-4">
              <CardHeader className="p-0"></CardHeader>
              <CardTitle className="text-2xl font-bold text-primaryDark normal-case">
                {categories[0].name}
              </CardTitle>
              <Divider />
              <CardDescription className="flex flex-col gap-4 text-sm text-gray-500">
                <p className="text-sm normal-case">
                  {categories[0].description}
                </p>
                <Button
                  onClick={() => handleViewMore(categories[0].slug)}
                  className="self-start cursor-pointer"
                >
                  View More
                </Button>
              </CardDescription>
            </CardContent>
          </div>
        </Card>
        {/* Remaining items */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.slice(1).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
