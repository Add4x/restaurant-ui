"use client";

import { MenuItemCard } from "@/app/menu/components/menu-item-card";
import { useMenuItems } from "@/hooks/use-menu-items";
import { notFound } from "next/navigation";

interface MenuItemsGridProps {
  categoryId: string;
}

export function MenuItemsGrid({ categoryId }: MenuItemsGridProps) {
  const { data: items, isError, error, isLoading } = useMenuItems(categoryId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error loading menu items:", error);
    throw new Error("Failed to load menu items");
  }

  if (!items?.length) {
    console.log("No items found for category:", categoryId);
    notFound();
  }

  return (
    <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:mx-0">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
