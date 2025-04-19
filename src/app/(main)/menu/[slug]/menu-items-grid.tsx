"use client";

import { MenuItemCard } from "@/app/(main)/menu/components/menu-item-card";
import { LoadingGrid } from "@/components/loading-grid";
import { useMenuItems } from "@/hooks/use-menu-items";
import { notFound } from "next/navigation";

interface MenuItemsGridProps {
  categoryId: string;
}

export function MenuItemsGrid({ categoryId }: MenuItemsGridProps) {
  const { data: items, isLoading, isError } = useMenuItems(categoryId);

  if (isLoading) return <LoadingGrid />;

  if (isError) {
    throw new Error("Failed to load menu items");
  }

  if (!items?.length) {
    notFound();
  }

  return (
    <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-6 sm:mx-0">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
