import { useMemo } from "react";
import { useQuery, type QueryClient } from "@tanstack/react-query";
import {
  fetchGooglePlace,
  googlePlaceQueryKey,
  hasGooglePlacesKey,
  venueGallery,
  type GooglePlaceSummary,
} from "@/lib/google-places";
import { enrichedRestaurants } from "@/lib/restaurants-enriched";

export type VenueLiveInput = {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  rating?: number;
  reviews?: string;
  hours?: string;
  website?: string;
  phone?: string;
};

const PLACE_STALE_TIME = 1000 * 60 * 60;

export function useGooglePlace(venue: {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}) {
  const enabled = hasGooglePlacesKey() && Boolean(venue.name);

  const query = useQuery<GooglePlaceSummary | null>({
    queryKey: googlePlaceQueryKey(venue.name, venue.address),
    queryFn: () =>
      fetchGooglePlace({
        name: venue.name || "",
        address: venue.address,
        latitude: venue.latitude,
        longitude: venue.longitude,
      }),
    enabled,
    staleTime: PLACE_STALE_TIME,
    retry: 1,
  });

  return {
    place: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useVenueLive(venue?: VenueLiveInput | null) {
  const { place, isLoading } = useGooglePlace({
    name: venue?.name,
    address: venue?.address,
    latitude: venue?.latitude,
    longitude: venue?.longitude,
  });

  const gallery = useMemo(
    () => venueGallery(venue?.image, place),
    [place, venue?.image]
  );

  return {
    place,
    isLoading,
    gallery,
    rating: place?.rating ?? venue?.rating,
    reviews: place?.reviewCount
      ? place.reviewCount >= 1000
        ? `${(place.reviewCount / 1000).toFixed(1)}K`
        : String(place.reviewCount)
      : venue?.reviews,
    hours: place?.hoursText || venue?.hours,
    website: place?.website || venue?.website,
    phone: place?.phone || venue?.phone,
    openNow: place?.openNow,
  };
}

export function prefetchCatalogGooglePlaces(queryClient: QueryClient) {
  if (typeof window === "undefined" || !hasGooglePlacesKey()) return;
  for (const restaurant of enrichedRestaurants) {
    void queryClient.prefetchQuery({
      queryKey: googlePlaceQueryKey(restaurant.name, restaurant.address),
      queryFn: () =>
        fetchGooglePlace({
          name: restaurant.name,
          address: restaurant.address,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        }),
      staleTime: PLACE_STALE_TIME,
    });
  }
}
