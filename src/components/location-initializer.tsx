"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/stores/location-store";
import { getLocationsByBrandName } from "@/actions/api";
import { Location } from "@/lib/types";

interface LocationInitializerProps {
  brandName: string;
  defaultLocationSlug: string;
}

export function LocationInitializer({
  brandName,
  defaultLocationSlug,
}: LocationInitializerProps) {
  const { setBrandName, setLocations, setSelectedLocation } =
    useLocationStore();

  // Fetch locations on the client side using React Query
  const { data: locationsResult, isLoading, error } = useQuery({
    queryKey: ["locations", brandName],
    queryFn: () => getLocationsByBrandName(brandName),
    enabled: !!brandName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  useEffect(() => {
    // Always set brand name immediately
    setBrandName(brandName);

    // Handle locations data when it becomes available
    if (locationsResult?.success && locationsResult.data.length > 0) {
      setLocations(locationsResult.data);

      // Set default location
      const defaultLocation = locationsResult.data.find(
        (location) => location.slug === defaultLocationSlug
      );

      if (defaultLocation) {
        setSelectedLocation(defaultLocation);
      } else {
        // If default location not found, use the first location
        setSelectedLocation(locationsResult.data[0]);
      }
    } else if (!isLoading && (error || !locationsResult?.success)) {
      // If there's an error or no data, create a fallback location
      console.warn("Failed to fetch locations, using fallback", error || (!locationsResult?.success ? locationsResult?.error : "Unknown error"));
      
      const fallbackLocation: Location = {
        locationId: 1,
        name: brandName,
        slug: defaultLocationSlug,
        address: "Unknown",
        phoneNumber: "Unknown",
        email: "Unknown",
        openingHours: "Unknown",
        cuisineType: "Unknown",
        latitude: 0,
        longitude: 0,
        active: true,
      };

      setLocations([fallbackLocation]);
      setSelectedLocation(fallbackLocation);
    }
  }, [
    brandName,
    defaultLocationSlug,
    locationsResult,
    isLoading,
    error,
    setBrandName,
    setLocations,
    setSelectedLocation,
  ]);

  // This component doesn't render anything, it just initializes the store
  return null;
}
