import { create } from "zustand";

interface Offer {
  text: string;
  backgroundColor: string;
  modalContent?: {
    title: string;
    description: string;
    imageSrc: string;
  };
}

interface OffersState {
  offers: Offer[];
  currentOfferIndex: number;
  isModalOpen: boolean;
  setCurrentOfferIndex: (index: number) => void;
  setModalOpen: (open: boolean) => void;
}

export const useOffersStore = create<OffersState>((set) => ({
  offers: [
    {
      text: "Complimentary Iranian Chai",
      backgroundColor: "bg-primary",
      modalContent: {
        title: "Complimentary Iranian Chai",
        description: "Please ask our staff for complimentary Iranian chai",
        imageSrc: "/iranian-chai.jpg", // Make sure to add this image to your public folder
      },
    },
    // { text: "New Menu Items", backgroundColor: "bg-primary/90" },
    // { text: "20% off on all orders", backgroundColor: "bg-primary/80" },
  ],
  currentOfferIndex: 0,
  isModalOpen: false,
  setCurrentOfferIndex: (index) => set({ currentOfferIndex: index }),
  setModalOpen: (open) => set({ isModalOpen: open }),
}));
