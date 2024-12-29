export const subMenuItems = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Drinks",
  "Snacks",
  "Specialties",
] as const;

export type SubMenuItem = (typeof subMenuItems)[number];
