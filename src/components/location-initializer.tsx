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
  const { setBrandName, setLocations, setSelectedLocation } = useLocationStore();

  useEffect(() => {
    console.log("LocationInitializer: brandName", brandName);
    console.log("LocationInitializer: locations", locations);
    console.log("LocationInitializer: defaultLocationSlug", defaultLocationSlug);
    
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
        console.log("LocationInitializer: Setting default location", defaultLocation);
        setSelectedLocation(defaultLocation);
      } else {
        console.log("LocationInitializer: Default location not found, using first location", locations[0]);
        // If default location not found, use the first location
        setSelectedLocation(locations[0]);
      }
    } else {
      console.log("LocationInitializer: No locations available");
    }
  }, [brandName, locations, defaultLocationSlug, setBrandName, setLocations, setSelectedLocation]);

  // This component doesn't render anything, it just initializes the store
  return null;
}