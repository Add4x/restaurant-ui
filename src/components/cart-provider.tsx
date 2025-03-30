"use client";

import { ReactNode, createContext, useContext } from "react";
import { useCartStore, CartItem } from "@/store/cart-store";
import { MenuItem, MenuItemProtein } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    menuItem: MenuItem,
    selectedProtein: MenuItemProtein | null
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Use the existing cart store
  const cart = useCartStore();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
