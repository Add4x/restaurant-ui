export const subMenuItems = {
  appetizers: "008ba938-75c1-4a26-9f9f-ad7dadf45101",
  biryanis: "00c13b63-5033-42aa-a3e4-d52cb48a5b1a",
  breakfast: "766c1041-9b9d-44d8-a695-8d6b610954c8",
  curries: "8e23ad36-5f18-4b86-8414-ae27eb54bad2",
  desserts: "9644e3c5-def9-4d5d-86c4-562171941206",
  drinks: "8dd10902-43a8-492c-9028-52bc068caf6e",
  fusion: "ca1b092d-a67a-420d-b312-71c077526753",
  others: "e41c9371-8626-4afb-8036-359bf5ea3e6e",
  sides: "360900e3-8e71-4a66-8f99-81ec625dca23",
  snacks: "8139b058-05df-4c55-8572-06cd7de04170",
  soups: "54c554c1-a9b1-43d4-9751-b83f45619026",
  "weekend-specials": "6285a9d7-fc14-49d7-b75f-b2d463b8b1d4",
};

export type SubMenuItem = (typeof subMenuItems)[keyof typeof subMenuItems];
