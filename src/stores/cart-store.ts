import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem, MenuItemProtein } from "@/lib/types";

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedProtein: MenuItemProtein | null;
  totalPrice: number;
  spiceLevel: string | null;
  specialInstructions: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    selectedProtein: MenuItemProtein | null,
    spiceLevel?: string | null,
    specialInstructions?: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem, selectedProtein, spiceLevel = null, specialInstructions = "") => {
        const { items } = get();
        const itemId = `${menuItem.id}-${
          selectedProtein?.protein_options.name || "base"
        }-${Date.now()}`; // Add timestamp to make each order unique

        // Calculate item price based on base price and protein option
        const itemPrice =
          menuItem.price +
          (selectedProtein?.protein_options.price_addition || 0);

        // Always add as new item since customizations make each order unique
        set({
          items: [
            ...items,
            {
              id: itemId,
              menuItem,
              selectedProtein,
              spiceLevel,
              specialInstructions,
              quantity: 1,
              totalPrice: itemPrice,
            },
          ],
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const price =
                item.menuItem.price +
                (item.selectedProtein?.protein_options.price_addition || 0);

              return {
                ...item,
                quantity,
                totalPrice: price * quantity,
              };
            }
            return item;
          }),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },
    }),
    {
      name: "jathara-cart-storage",
    }
  )
);
