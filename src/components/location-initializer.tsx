"use client";

import { useEffect } from "react";
import { useLocationStore } from "@/stores/location-store";
import { Location } from "@/lib/types";

interface LocationInitializerProps {
  brandName: string;
  locations: Location[];
  defaultLocationSlug: string;
}

export function LocationInitializer({
  brandName,
  locations,
  defaultLocationSlug,
}: LocationInitializerProps) {
  const { setBrandName, setLocations, setSelectedLocation } =
    useLocationStore();

  useEffect(() => {
    // Set brand name
    setBrandName(brandName);

    // Set locations
    setLocations(locations);

    // Set default location if locations are available
    if (locations.length > 0) {
      const defaultLocation = locations.find(
        (location) => location.slug === defaultLocationSlug
      );

      if (defaultLocation) {
        setSelectedLocation(defaultLocation);
      } else {
        // If default location not found, use the first location
        setSelectedLocation(locations[0]);
      }
    }
  }, [
    brandName,
    locations,
    defaultLocationSlug,
    setBrandName,
    setLocations,
    setSelectedLocation,
  ]);

  // This component doesn't render anything, it just initializes the store
  return null;
}
