"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CartItemComponent } from "@/components/cart/cart-item";
import { useCartStore } from "@/store/cart-store";
import { isCartEnabled } from "@/lib/feature-flags";
import { useRouter } from "next/navigation";

export function Cart() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, toggleCart, getTotalItems, getTotalPrice, clearCart } =
    useCartStore();
  const cartEnabled = isCartEnabled();
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // If cart is disabled or not mounted yet, don't render
  if (!mounted || !cartEnabled) return null;

  const handleCheckout = () => {
    // Close the cart modal
    toggleCart();
    // Navigate to checkout page using Next.js router
    router.push("/checkout");
  };

  const totalItems = getTotalItems();

  return (
    <>
      {/* Cart button - simplified to match the image */}
      <div className="relative cursor-pointer" onClick={toggleCart}>
        <ShoppingCart className="w-6 h-6 text-primary-dark" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-medium rounded-full">
            {totalItems}
          </span>
        )}
      </div>

      {/* Cart dialog */}
      <Dialog open={isOpen} onOpenChange={toggleCart}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Shopping Cart</DialogTitle>
          <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="rounded-full h-8 w-8 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center px-6">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">
                Add items to get started
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto py-2 px-6">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>

              <div className="sticky bottom-0 bg-white z-10 px-6 pt-4 pb-6 mt-2 border-t">
                <div className="flex justify-between font-medium text-base mb-4">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
