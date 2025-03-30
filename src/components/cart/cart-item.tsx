"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/store/cart-store";
import { useCartStore } from "@/store/cart-store";

interface CartItemProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const itemPrice =
    item.menuItem.base_price +
    (item.selectedProtein?.protein_options.price_addition || 0);

  return (
    <div className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
        <Image
          src={item.menuItem.image_url || "/placeholder.svg"}
          alt={item.menuItem.image_alt_text}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {item.menuItem.name}
            </h3>
            {item.selectedProtein && (
              <p className="text-xs text-gray-500 mt-0.5">
                {item.selectedProtein.protein_options.name}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">
              ${itemPrice.toFixed(2)} each
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-500 hover:bg-transparent -mr-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none text-gray-500"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="px-2 text-sm font-medium min-w-[24px] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none text-gray-500"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>

          <p className="text-sm font-semibold text-gray-900">
            ${item.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
