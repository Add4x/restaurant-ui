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
import { useCategories } from "@/hooks/use-menu-items";
import { useRouter } from "next/navigation";
// import Image from "next/image";
export function MenuCategoryGrid() {
  const { data: categories, error } = useCategories();
  const router = useRouter();

  if (error) return <div>Error loading categories</div>;
  if (!categories) return null;

  const handleViewMore = (categoryName: string) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/menu/${slug}`);
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
                src={categories[0].image_url}
                alt={categories[0].image_alt_text}
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
                  onClick={() => handleViewMore(categories[0].name)}
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
