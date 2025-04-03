"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { MenuItem, MenuItemProtein } from "@/lib/types";
import { isCartEnabled } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";
interface AddToCartButtonProps {
  item: MenuItem;
  className?: string;
}

export function AddToCartButton({
  item,
  className = "",
}: AddToCartButtonProps) {
  const [selectedProtein, setSelectedProtein] =
    useState<MenuItemProtein | null>(
      item.has_protein_options && item.menu_item_proteins.length > 0
        ? item.menu_item_proteins[0]
        : null
    );

  const { addItem } = useCartStore();
  const cartEnabled = isCartEnabled();

  // If cart is disabled, don't render
  if (!cartEnabled) return null;

  const handleAddToCart = () => {
    addItem(item, selectedProtein);
  };

  // Set price display string
  const price = selectedProtein
    ? (
        item.base_price + selectedProtein.protein_options.price_addition
      ).toFixed(2)
    : item.base_price.toFixed(2);

  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      {item.has_protein_options && item.menu_item_proteins.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Select option:</label>
          <div className="grid grid-cols-2 gap-2">
            {item.menu_item_proteins.map((protein) => (
              <Button
                key={protein.protein_options.name}
                type="button"
                variant={
                  selectedProtein?.protein_options.name ===
                  protein.protein_options.name
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setSelectedProtein(protein)}
                className={cn(
                  selectedProtein?.protein_options.name ===
                    protein.protein_options.name && "bg-primary/80"
                )}
              >
                <span>
                  {protein.protein_options.name} ($
                  {(
                    item.base_price + protein.protein_options.price_addition
                  ).toFixed(2)}
                  )
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleAddToCart} className="gap-2 w-full bg-primary/80">
        <ShoppingCart className="h-4 w-4" />
        <span className="flex-1">Add to Cart - ${price}</span>
      </Button>
    </div>
  );
}
