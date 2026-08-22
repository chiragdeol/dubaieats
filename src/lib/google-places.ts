import { GOOGLE_PLACE_IDS } from "@/data/google-place-ids";

export type GooglePlaceSummary = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  mapsUri?: string;
  rating?: number;
  reviewCount?: number;
  hoursText?: string;
  weekdayHours?: string[];
  openNow?: boolean;
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  photos: string[];
  menuPhotos: string[];
  lat?: number;
  lng?: number;
};

export type VenueQuery = {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
};

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "";
const memoryCache = new Map<string, GooglePlaceSummary | null>();
const CACHE_PREFIX = "de-google-place-v4:";

type PlacePhoto = {
  getURI?: (opts: { maxWidth?: number; maxHeight?: number }) => string;
  name?: string;
};

type PlaceInstance = {
  id?: string;
  fetchFields?: (opts: { fields: string[] }) => Promise<unknown>;
  displayName?: string | { text?: string };
  formattedAddress?: string;
  location?: { lat: number | (() => number); lng: number | (() => number) };
  googleMapsURI?: string;
  websiteURI?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  photos?: PlacePhoto[];
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      importLibrary?: (name: string) => Promise<{
        Place: {
          searchByText: (request: Record<string, unknown>) => Promise<{ places?: PlaceInstance[] }>;
        };
        PlacesService?: new (attr: HTMLDivElement) => {
          findPlaceFromQuery: (
            request: { query: string; fields: string[] },
            callback: (results: Array<{ place_id?: string }> | null, status: string) => void
          ) => void;
          getDetails: (
            request: { placeId: string; fields: string[] },
            callback: (place: LegacyJsPlace | null, status: string) => void
          ) => void;
        };
      }>;
      places?: {
        PlacesService: new (attr: HTMLDivElement) => {
          findPlaceFromQuery: (
            request: { query: string; fields: string[] },
            callback: (results: Array<{ place_id?: string }> | null, status: string) => void
          ) => void;
          getDetails: (
            request: { placeId: string; fields: string[] },
            callback: (place: LegacyJsPlace | null, status: string) => void
          ) => void;
        };
      };
    };
  };
};

type LegacyJsPlace = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  rating?: number;
  user_ratings_total?: number;
  dine_in?: boolean;
  delivery?: boolean;
  takeout?: boolean;
  geometry?: { location?: { lat: () => number; lng: () => number } };
  opening_hours?: { open_now?: boolean; weekday_text?: string[] };
  photos?: Array<{ getUrl: (opts: { maxWidth?: number; maxHeight?: number }) => string }>;
};

const PLACE_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "googleMapsURI",
  "websiteURI",
  "internationalPhoneNumber",
  "nationalPhoneNumber",
  "regularOpeningHours",
  "currentOpeningHours",
  "rating",
  "userRatingCount",
  "photos",
  "dineIn",
  "takeout",
  "delivery",
];

export function hasGooglePlacesKey() {
  return Boolean(API_KEY);
}

function cacheKey(venue: VenueQuery) {
  return `${venue.name}|${venue.address || ""}`.toLowerCase();
}

export function googlePlaceQueryKey(name?: string, address?: string) {
  return ["google-place", name, address] as const;
}

export function venueGallery(fallbackImage: string | undefined, place: GooglePlaceSummary | null | undefined, max = 8) {
  if (place?.photos?.length) return place.photos.slice(0, max);
  return fallbackImage ? [fallbackImage] : [];
}

export function getCachedGooglePlace(venue: VenueQuery): GooglePlaceSummary | null {
  const key = cacheKey(venue);
  if (memoryCache.has(key)) return memoryCache.get(key) ?? null;
  const cached = readSession(key);
  if (cached !== undefined) {
    memoryCache.set(key, cached);
    return cached;
  }
  return null;
}

function resolvedPlaceId(venue: VenueQuery) {
  return venue.placeId || GOOGLE_PLACE_IDS[venue.name] || "";
}

function readSession(key: string): GooglePlaceSummary | null | undefined {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    return JSON.parse(raw) as GooglePlaceSummary | null;
  } catch {
    return undefined;
  }
}

function writeSession(key: string, value: GooglePlaceSummary | null) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

function displayNameOf(value: string | { text?: string } | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.text || "";
}

function hoursFromWeekday(descriptions?: string[]) {
  if (!descriptions?.length) return undefined;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Dubai" });
  return descriptions.find((line) => line.toLowerCase().startsWith(today.toLowerCase())) || descriptions[0];
}

function coordValue(value: number | (() => number) | undefined) {
  if (typeof value === "function") return value();
  return value;
}

function legacyPhotoUrl(photoReference: string) {
  const qs = `maxwidth=1600&photoreference=${encodeURIComponent(photoReference)}&key=${encodeURIComponent(API_KEY)}`;
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host === "localhost" || host === "127.0.0.1") {
    return `/api/google-maps/maps/api/place/photo?${qs}`;
  }
  return `https://maps.googleapis.com/maps/api/place/photo?${qs}`;
}

function restPhotoUrl(photoName: string) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1200&maxWidthPx=1600&key=${encodeURIComponent(API_KEY)}`;
}

function splitPhotos(photos: string[]) {
  const unique = Array.from(new Set(photos.filter(Boolean)));
  return {
    photos: unique,
    menuPhotos: unique.length > 2 ? unique.slice(1) : unique,
  };
}

let mapsReady: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (!API_KEY) return Promise.reject(new Error("Missing Google Places API key"));
  const w = window as GoogleMapsWindow;
  if (w.google?.maps?.importLibrary) return Promise.resolve();
  if (mapsReady) return mapsReady;

  mapsReady = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps-places]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&v=weekly&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsPlaces = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return mapsReady;
}

let activeLookups = 0;
const waiters: Array<() => void> = [];

async function withLimit<T>(fn: () => Promise<T>): Promise<T> {
  while (activeLookups >= 3) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  activeLookups += 1;
  try {
    return await fn();
  } finally {
    activeLookups -= 1;
    waiters.shift()?.();
  }
}

type RestPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  googleMapsUri?: string;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  photos?: Array<{ name?: string }>;
};

function fromRestPlace(place: RestPlace, fallbackName: string): GooglePlaceSummary | null {
  if (!place.id) return null;
  const weekdayHours = place.regularOpeningHours?.weekdayDescriptions || [];
  const photos = (place.photos || []).slice(0, 12).map((photo) => photo.name).filter(Boolean).map((name) => restPhotoUrl(name as string));
  const split = splitPhotos(photos);
  return {
    id: place.id,
    name: place.displayName?.text || fallbackName,
    address: place.formattedAddress,
    phone: place.internationalPhoneNumber || place.nationalPhoneNumber,
    website: place.websiteUri,
    mapsUri: place.googleMapsUri,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    hoursText: hoursFromWeekday(weekdayHours),
    weekdayHours,
    openNow: place.currentOpeningHours?.openNow,
    dineIn: place.dineIn,
    takeout: place.takeout,
    delivery: place.delivery,
    photos: split.photos,
    menuPhotos: split.menuPhotos,
    lat: place.location?.latitude,
    lng: place.location?.longitude,
  };
}

function fromJsPlace(place: PlaceInstance, fallbackName: string): GooglePlaceSummary | null {
  if (!place.id) return null;
  const weekdayHours = place.regularOpeningHours?.weekdayDescriptions || [];
  const photos = (place.photos || [])
    .slice(0, 12)
    .map((photo) => {
      if (typeof photo.getURI === "function") {
        return photo.getURI({ maxWidth: 1600, maxHeight: 1200 });
      }
      if (photo.name) return restPhotoUrl(photo.name);
      return "";
    })
    .filter(Boolean);
  const split = splitPhotos(photos);
  return {
    id: place.id,
    name: displayNameOf(place.displayName) || fallbackName,
    address: place.formattedAddress,
    phone: place.internationalPhoneNumber || place.nationalPhoneNumber,
    website: place.websiteURI,
    mapsUri: place.googleMapsURI,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    hoursText: hoursFromWeekday(weekdayHours),
    weekdayHours,
    openNow: place.currentOpeningHours?.openNow,
    dineIn: place.dineIn,
    takeout: place.takeout,
    delivery: place.delivery,
    photos: split.photos,
    menuPhotos: split.menuPhotos,
    lat: coordValue(place.location?.lat),
    lng: coordValue(place.location?.lng),
  };
}

async function fetchViaRest(venue: VenueQuery): Promise<GooglePlaceSummary | null> {
  const body = JSON.stringify({
    textQuery: [venue.name, venue.address, "Dubai"].filter(Boolean).join(", "),
    maxResultCount: 1,
    languageCode: "en",
    regionCode: "AE",
    ...(typeof venue.latitude === "number" && typeof venue.longitude === "number"
      ? {
          locationBias: {
            circle: {
              center: { latitude: venue.latitude, longitude: venue.longitude },
              radius: 800,
            },
          },
        }
      : {}),
  });

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.googleMapsUri",
    "places.websiteUri",
    "places.internationalPhoneNumber",
    "places.nationalPhoneNumber",
    "places.regularOpeningHours",
    "places.currentOpeningHours",
    "places.rating",
    "places.userRatingCount",
    "places.photos",
    "places.dineIn",
    "places.takeout",
    "places.delivery",
  ].join(",");

  const attempts: Array<{ url: string; headers: Record<string, string> }> = [
    { url: "/api/google-places/v1/places:searchText", headers: { "Content-Type": "application/json", "X-Goog-FieldMask": fieldMask } },
    {
      url: "https://places.googleapis.com/v1/places:searchText",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": fieldMask,
      },
    },
  ];

  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, { method: "POST", headers: attempt.headers, body });
      if (!response.ok) continue;
      const json = (await response.json()) as { places?: RestPlace[] };
      const place = json.places?.[0];
      if (!place) continue;
      return fromRestPlace(place, venue.name);
    } catch {
      /* try next */
    }
  }
  return null;
}

async function fetchViaMapsJs(venue: VenueQuery): Promise<GooglePlaceSummary | null> {
  await loadMapsScript();
  const w = window as GoogleMapsWindow;
  const lib = await w.google?.maps?.importLibrary?.("places");
  if (!lib?.Place?.searchByText) return null;

  const request: Record<string, unknown> = {
    textQuery: [venue.name, venue.address, "Dubai"].filter(Boolean).join(", "),
    fields: PLACE_FIELDS,
    maxResultCount: 1,
    language: "en",
    region: "AE",
  };
  if (typeof venue.latitude === "number" && typeof venue.longitude === "number") {
    request.locationBias = { lat: venue.latitude, lng: venue.longitude };
  }

  const { places } = await lib.Place.searchByText(request);
  const place = places?.[0];
  if (!place) return null;
  if (place.fetchFields) {
    await place.fetchFields({ fields: PLACE_FIELDS });
  }
  return fromJsPlace(place, venue.name);
}

async function fetchViaLegacyRest(venue: VenueQuery): Promise<GooglePlaceSummary | null> {
  let placeId = resolvedPlaceId(venue);
  if (!placeId) {
    const query = encodeURIComponent([venue.name, venue.address, "Dubai"].filter(Boolean).join(" "));
    const findPaths = [
      `/api/google-maps/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(API_KEY)}`,
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(API_KEY)}`,
    ];

    for (const url of findPaths) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const json = (await response.json()) as { candidates?: Array<{ place_id?: string }>; status?: string };
        if (json.status === "OK" && json.candidates?.[0]?.place_id) {
          placeId = json.candidates[0].place_id;
          break;
        }
      } catch {
        /* try next */
      }
    }
  }
  if (!placeId) return null;

  const fields = [
    "place_id",
    "name",
    "formatted_address",
    "international_phone_number",
    "website",
    "url",
    "rating",
    "user_ratings_total",
    "opening_hours",
    "photos",
    "geometry",
    "dine_in",
    "delivery",
    "takeout",
  ].join(",");
  const detailPaths = [
    `/api/google-maps/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${encodeURIComponent(API_KEY)}`,
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${encodeURIComponent(API_KEY)}`,
  ];

  for (const url of detailPaths) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const json = (await response.json()) as {
        status?: string;
        result?: {
          place_id?: string;
          name?: string;
          formatted_address?: string;
          international_phone_number?: string;
          website?: string;
          url?: string;
          rating?: number;
          user_ratings_total?: number;
          dine_in?: boolean;
          delivery?: boolean;
          takeout?: boolean;
          geometry?: { location?: { lat?: number; lng?: number } };
          opening_hours?: { open_now?: boolean; weekday_text?: string[] };
          photos?: Array<{ photo_reference?: string }>;
        };
      };
      const place = json.result;
      if (json.status !== "OK" || !place?.place_id) continue;
      const photos = (place.photos || [])
        .slice(0, 12)
        .map((photo) => photo.photo_reference)
        .filter(Boolean)
        .map((ref) => legacyPhotoUrl(ref as string));
      const split = splitPhotos(photos);
      const weekdayHours = place.opening_hours?.weekday_text || [];
      return {
        id: place.place_id,
        name: place.name || venue.name,
        address: place.formatted_address,
        phone: place.international_phone_number,
        website: place.website,
        mapsUri: place.url,
        rating: place.rating,
        reviewCount: place.user_ratings_total,
        hoursText: hoursFromWeekday(weekdayHours),
        weekdayHours,
        openNow: place.opening_hours?.open_now,
        dineIn: place.dine_in,
        takeout: place.takeout,
        delivery: place.delivery,
        photos: split.photos,
        menuPhotos: split.menuPhotos,
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng,
      };
    } catch {
      /* try next */
    }
  }
  return null;
}

async function fetchViaPlacesService(venue: VenueQuery): Promise<GooglePlaceSummary | null> {
  await loadMapsScript();
  const w = window as GoogleMapsWindow;
  await w.google?.maps?.importLibrary?.("places");
  const Service = w.google?.maps?.places?.PlacesService;
  if (!Service) return null;
  const svc = new Service(document.createElement("div"));
  const query = [venue.name, venue.address, "Dubai"].filter(Boolean).join(", ");

  const knownId = resolvedPlaceId(venue);
  const placeId = knownId || await new Promise<string | null>((resolve) => {
    svc.findPlaceFromQuery({ query, fields: ["place_id", "name"] }, (results, status) => {
      resolve(status === "OK" && results?.[0]?.place_id ? results[0].place_id : null);
    });
  });
  if (!placeId) return null;

  return new Promise((resolve) => {
    svc.getDetails(
      {
        placeId,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "international_phone_number",
          "website",
          "url",
          "rating",
          "user_ratings_total",
          "opening_hours",
          "photos",
          "geometry",
          "dine_in",
          "delivery",
          "takeout",
        ],
      },
      (place, status) => {
        if (status !== "OK" || !place?.place_id) {
          resolve(null);
          return;
        }
        const photos = (place.photos || []).slice(0, 12).map((photo) => photo.getUrl({ maxWidth: 1600 }));
        const split = splitPhotos(photos);
        const weekdayHours = place.opening_hours?.weekday_text || [];
        resolve({
          id: place.place_id,
          name: place.name || venue.name,
          address: place.formatted_address,
          phone: place.international_phone_number,
          website: place.website,
          mapsUri: place.url,
          rating: place.rating,
          reviewCount: place.user_ratings_total,
          hoursText: hoursFromWeekday(weekdayHours),
          weekdayHours,
          openNow: place.opening_hours?.open_now,
          dineIn: place.dine_in,
          takeout: place.takeout,
          delivery: place.delivery,
          photos: split.photos,
          menuPhotos: split.menuPhotos,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        });
      }
    );
  });
}

export async function fetchGooglePlace(venue: VenueQuery): Promise<GooglePlaceSummary | null> {
  if (!API_KEY || !venue.name) return null;
  const resolved: VenueQuery = {
    ...venue,
    placeId: resolvedPlaceId(venue) || undefined,
  };
  const key = cacheKey(resolved);
  if (memoryCache.has(key)) return memoryCache.get(key) ?? null;

  const cached = readSession(key);
  if (cached?.photos?.length) {
    memoryCache.set(key, cached);
    return cached;
  }

  try {
    const result = await withLimit(async () => {
      const fromRest = await fetchViaLegacyRest(resolved);
      if (fromRest?.photos?.length) return fromRest;
      const fromJs = await fetchViaPlacesService(resolved);
      if (fromJs?.photos?.length) return fromJs;
      return fromRest || fromJs || (await fetchViaRest(resolved)) || (await fetchViaMapsJs(resolved));
    });
    if (result) {
      memoryCache.set(key, result);
      if (result.photos.length) writeSession(key, result);
    }
    return result;
  } catch (error) {
    console.warn("Google Places lookup failed", error);
    return null;
  }
}
