export const subMenuItems = {
  breakfast: "766c1041-9b9d-44d8-a695-8d6b610954c8",
  lunch: "00c13b63-5033-42aa-a3e4-d52cb48a5b1a",
  dinner: "008ba938-75c1-4a26-9f9f-ad7dadf45101",
  desserts: "766c1041-9b9d-44d8-a695-8d6b610954c8",
  drinks: "ca1b092d-a67a-420d-b312-71c077526753",
  snacks: "ca1b092d-a67a-420d-b312-71c077526753",
  specialties: "ca1b092d-a67a-420d-b310-71c077526753",
};

export type SubMenuItem = (typeof subMenuItems)[keyof typeof subMenuItems];
