export const menuItems = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Drinks",
  "Snacks",
  "Specialties",
] as const;

export type MenuItem = (typeof menuItems)[number];
