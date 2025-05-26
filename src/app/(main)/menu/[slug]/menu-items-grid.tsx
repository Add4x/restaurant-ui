"use client";

import { MenuItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MenuItemsGridProps {
  menuItems: MenuItem[];
}

interface MenuItemCardProps {
  menuItem: MenuItem;
}

function MenuItemCard({ menuItem }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={menuItem.image_url}
          alt={menuItem.image_alt_text}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {menuItem.name}
          </CardTitle>
          <div className="text-right ml-2">
            <p className="text-lg font-bold text-primary">
              ${menuItem.price.toFixed(2)}
            </p>
          </div>
        </div>

        <CardDescription className="text-sm line-clamp-2">
          {menuItem.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {menuItem.proteins.length > 0 && (
            <Badge variant="outline" className="text-xs">
              Protein Options
            </Badge>
          )}
          {menuItem.isVegetarian && (
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-600"
            >
              Vegetarian
            </Badge>
          )}
          {menuItem.isGlutenFree && (
            <Badge
              variant="outline"
              className="text-xs text-blue-600 border-blue-600"
            >
              Gluten Free
            </Badge>
          )}
          {menuItem.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Placeholder for Order Now button - to be implemented later */}
        <Button className="w-full" size="sm" disabled>
          Order Now (Coming Soon)
        </Button>
      </CardContent>
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
