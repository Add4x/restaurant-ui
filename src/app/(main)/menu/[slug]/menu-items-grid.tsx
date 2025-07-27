"use client";

import { MenuItem } from "@/lib/types";
import { MenuItemCard } from "@/app/(main)/menu/components/menu-item-card";

interface MenuItemsGridProps {
  menuItems: MenuItem[];
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
      {menuItems.map((menuItem, index) => (
        <MenuItemCard key={menuItem.id} item={menuItem} index={index} />
      ))}
    </div>
  );
}