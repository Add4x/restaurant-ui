"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { isCartEnabled } from "@/lib/feature-flags";
import Link from "next/link";

export function Cart() {
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCartStore();
  const cartEnabled = isCartEnabled();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // If cart is disabled or not mounted yet, don't render
  if (!mounted || !cartEnabled) return null;

  const totalItems = getTotalItems();

  return (
    <Link href="/cart" className="relative cursor-pointer">
      <ShoppingCart className="w-6 h-6 text-primary-dark" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-medium rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
