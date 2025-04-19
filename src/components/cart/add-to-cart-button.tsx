"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isCartEnabled } from "@/lib/feature-flags";
import { MenuItem } from "@/lib/types";

interface AddToCartButtonProps {
  item: MenuItem;
  className?: string;
}

export function AddToCartButton({
  item,
  className = "",
}: AddToCartButtonProps) {
  const router = useRouter();
  const cartEnabled = isCartEnabled();

  // If cart is disabled, don't render
  if (!cartEnabled) return null;

  const handleOrderNow = () => {
    // Encode the item data to pass through URL to avoid state issues
    const itemData = encodeURIComponent(JSON.stringify(item));
    router.push(`/order/${item.id}?data=${itemData}`);
  };

  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      <Button onClick={handleOrderNow} className="gap-2 w-full bg-primary/80">
        <ShoppingCart className="h-4 w-4" />
        <span className="flex-1">Order Now</span>
      </Button>
    </div>
  );
}
