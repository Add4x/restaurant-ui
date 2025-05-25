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
    console.log("Setting brandName:", brandName);
    set({ brandName });
  },
  setLocations: (locations) => {
    console.log("Setting locations:", locations);
    set({ locations });
  },
  setSelectedLocation: (location) => {
    console.log("Setting selectedLocation:", location);
    set({ selectedLocation: location });
  },
  getSelectedLocationSlug: () => {
    const { selectedLocation } = get();
    return selectedLocation?.slug || null;
  },
}));