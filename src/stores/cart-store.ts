import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem, MenuItemProtein } from "@/lib/types";

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedProtein: MenuItemProtein | null;
  totalPrice: number;
}

interface CartState {
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (menuItem, selectedProtein) => {
        const { items } = get();
        const itemId = `${menuItem.id}-${
          selectedProtein?.protein_options.name || "base"
        }`;

        // Check if item already exists with the same protein option
        const existingItemIndex = items.findIndex((item) => item.id === itemId);

        if (existingItemIndex !== -1) {
          // If item exists, increment quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          updatedItems[existingItemIndex].totalPrice =
            updatedItems[existingItemIndex].quantity *
            (menuItem.base_price +
              (selectedProtein?.protein_options.price_addition || 0));

          set({ items: updatedItems });
        } else {
          // Calculate item price based on base price and protein option
          const itemPrice =
            menuItem.base_price +
            (selectedProtein?.protein_options.price_addition || 0);

          // Add new item
          set({
            items: [
              ...items,
              {
                id: itemId,
                menuItem,
                selectedProtein,
                quantity: 1,
                totalPrice: itemPrice,
              },
            ],
          });
        }
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
                item.menuItem.base_price +
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
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
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
