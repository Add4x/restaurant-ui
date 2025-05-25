import { create } from "zustand";
import { Location } from "@/lib/types";

interface LocationState {
  brandName: string;
  locations: Location[];
  selectedLocation: Location | null;
  setBrandName: (brandName: string) => void;
  setLocations: (locations: Location[]) => void;
  setSelectedLocation: (location: Location) => void;
  getSelectedLocationSlug: () => string | null;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  brandName: "",
  locations: [],
  selectedLocation: null,
  setBrandName: (brandName) => {
    set({ brandName });
  },
  setLocations: (locations) => {
    set({ locations });
  },
  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
  },
  getSelectedLocationSlug: () => {
    const { selectedLocation } = get();
    return selectedLocation?.slug || null;
  },
}));
