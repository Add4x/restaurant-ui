import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuState {
  currentCategorySlug: string | null;
  currentMenuSlug: string;
  setCurrentCategory: (categorySlug: string) => void;
  setCurrentMenu: (menuSlug: string) => void;
  getCurrentCategorySlug: () => string | null;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      currentCategorySlug: null,
      currentMenuSlug: "main-menu",
      setCurrentCategory: (categorySlug) => {
        set({ currentCategorySlug: categorySlug });
      },
      setCurrentMenu: (menuSlug) => {
        set({ currentMenuSlug: menuSlug });
      },
      getCurrentCategorySlug: () => {
        const { currentCategorySlug } = get();
        return currentCategorySlug;
      },
    }),
    {
      name: "menu-store",
    }
  )
);
