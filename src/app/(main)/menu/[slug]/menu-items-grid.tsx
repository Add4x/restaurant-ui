"use client";

import { MenuItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Flame, Star } from "lucide-react";

interface MenuItemsGridProps {
  menuItems: MenuItem[];
}

interface MenuItemCardProps {
  menuItem: MenuItem;
}

// Helper functions to check for spicy and popular tags
const isSpicyItem = (menuItem: MenuItem): boolean => {
  return menuItem.tags.some(
    (tag) =>
      tag.name.toLowerCase().includes("spicy") ||
      tag.name.toLowerCase().includes("hot") ||
      tag.name.toLowerCase().includes("chili") ||
      tag.name.toLowerCase().includes("jalapeño")
  );
};

const isPopularItem = (menuItem: MenuItem): boolean => {
  return menuItem.tags.some(
    (tag) =>
      tag.name.toLowerCase().includes("popular") ||
      tag.name.toLowerCase().includes("favorite") ||
      tag.name.toLowerCase().includes("bestseller") ||
      tag.name.toLowerCase().includes("chef's choice")
  );
};

const isGlutenFreeItem = (menuItem: MenuItem): boolean => {
  return menuItem.tags.some(
    (tag) =>
      tag.name.toLowerCase().includes("gluten free") ||
      tag.name.toLowerCase().includes("gluten-free") ||
      tag.name.toLowerCase().includes("gf")
  );
};

function MenuItemCard({ menuItem }: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={menuItem.image_url}
          alt={menuItem.image_alt_text}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Shield/Banner flags directly below the image */}
      <div className="relative -mt-2 z-10 px-4">
        <div className="flex gap-2 justify-end">
          {isSpicyItem(menuItem) && (
            <div
              className="bg-gradient-to-b from-red-400 to-red-600 text-white px-4 py-3 shadow-lg rounded-lg w-14"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
              }}
            >
              <div className="flex flex-col items-center justify-start gap-1">
                <Flame className="h-4 w-4 fill-white" />
                <span className="text-xs font-bold">Spicy</span>
              </div>
            </div>
          )}
          {isPopularItem(menuItem) && (
            <div
              className="bg-gradient-to-b from-yellow-500 to-orange-600 text-white px-4 py-3 shadow-lg rounded-lg w-14"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
              }}
            >
              <div className="flex flex-col items-center justify-start gap-1">
                <Star className="h-4 w-4 fill-white" />
                <span className="text-xs font-bold">Popular</span>
              </div>
            </div>
          )}
          {isGlutenFreeItem(menuItem) && (
            <div
              className="bg-gradient-to-b from-orange-400 to-orange-500 text-white px-3 py-3 shadow-lg rounded-lg"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
              }}
            >
              <div className="flex flex-col items-center justify-start gap-1">
                <span className="text-xs font-bold">GF</span>
                <span className="text-xs font-bold">Gluten Free</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-1">
            <CardTitle className="text-lg font-bold line-clamp-2 flex-1">
              {menuItem.name}
            </CardTitle>
          </div>
          <div className="text-right ml-2">
            <p className="text-lg font-bold text-primary">
              ${menuItem.price.toFixed(2)}
            </p>
          </div>
        </div>

        <CardDescription className="text-sm line-clamp-2 text-gray-600">
          {menuItem.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 space-y-3 flex-grow">
        {/* Protein Options */}
        {menuItem.proteins.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase">
              Protein Options
            </h4>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="space-y-2">
              {menuItem.proteins.map((protein) => (
                <div
                  key={protein.id}
                  className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0 m-0"
                >
                  <span className="font-semibold text-gray-900 text-base pl-16">
                    {protein.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">+</span>
                    <span className="text-lg font-bold text-primary">
                      ${protein.additionalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {/* Order Button */}
        <Button
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
          size="sm"
          disabled
        >
          Order Now (Coming Soon)
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MenuItemsGrid({ menuItems }: MenuItemsGridProps) {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No menu items found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((menuItem) => (
        <MenuItemCard key={menuItem.id} menuItem={menuItem} />
      ))}
    </div>
  );
}
