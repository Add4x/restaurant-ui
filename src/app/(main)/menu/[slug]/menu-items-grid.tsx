"use client";

import { MenuItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

function MenuItemCard({ menuItem }: MenuItemCardProps) {
  return (
    <TooltipProvider>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={menuItem.image_url}
            alt={menuItem.image_alt_text}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay badges for spicy and popular */}
          <div className="absolute top-2 right-2 flex gap-1">
            {isSpicyItem(menuItem) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white backdrop-blur-sm rounded-full p-1.5 shadow-lg cursor-help">
                    <Flame className="h-4 w-4 text-red-500 fill-red-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Spicy Item 🌶️</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isPopularItem(menuItem) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white backdrop-blur-sm rounded-full p-1.5 shadow-lg cursor-help">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Popular Item ⭐</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
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

        <CardContent className="pt-0 space-y-3">
          {/* Protein Options */}
          {menuItem.proteins.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Protein Options:
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {menuItem.proteins.map((protein) => (
                  <div
                    key={protein.id}
                    className="flex justify-between items-center text-xs bg-gray-50 rounded-md px-2 py-1"
                  >
                    <span className="font-medium">{protein.name}</span>
                    <span className="text-gray-600">
                      +${protein.additionalCost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Button */}
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
            size="sm"
            disabled
          >
            Order Now (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
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
