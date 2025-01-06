export const subMenuItems = {
  appetizers: "008ba938-75c1-4a26-9f9f-ad7dadf45101",
  biryanis: "00c13b63-5033-42aa-a3e4-d52cb48a5b1a",
  soups: "54c554c1-a9b1-43d4-9751-b83f45619026",
  breakfast: "766c1041-9b9d-44d8-a695-8d6b610954c8",
  curries: "8e23ad36-5f18-4b86-8414-ae27eb54bad2",
  fusion: "ca1b092d-a67a-420d-b312-71c077526753",
  others: "e41c9371-8626-4afb-8036-359bf5ea3e6e",
};

export type SubMenuItem = (typeof subMenuItems)[keyof typeof subMenuItems];
