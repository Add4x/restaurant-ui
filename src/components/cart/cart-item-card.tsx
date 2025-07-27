"use client";

import Image from "next/image";
import { Minus, Plus, X, Flame, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/stores/cart-store";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const itemPrice =
    item.menuItem.price +
    (item.selectedProtein?.protein_options.price_addition || 0);

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case "mild": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "spicy": return "bg-orange-100 text-orange-800";
      case "hot": return "bg-red-100 text-red-800";
      case "very-hot": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
          <Image
            src={item.menuItem.image_url || "/placeholder.svg"}
            alt={item.menuItem.image_alt_text}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                {item.menuItem.name}
              </h3>
              {item.selectedProtein && (
                <p className="text-sm text-gray-600">
                  with {item.selectedProtein.protein_options.name}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Customizations */}
          <div className="space-y-2 mb-3">
            {item.spiceLevel && (
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-gray-400" />
                <Badge 
                  variant="secondary" 
                  className={`${getSpiceLevelColor(item.spiceLevel)} border-0`}
                >
                  {item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1).replace("-", " ")}
                </Badge>
              </div>
            )}
            
            {item.specialInstructions && (
              <div className="flex items-start gap-2">
                <Edit2 className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-600 italic">
                  &ldquo;{item.specialInstructions}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-l-lg"
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-4 text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none rounded-r-lg"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                ${itemPrice.toFixed(2)} each
              </p>
              <p className="font-semibold text-lg text-gray-900">
                ${item.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}