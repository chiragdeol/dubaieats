import { getVerifiedBookings } from "@/data/verified-bookings";

export type BookingProviderName =
  | "SevenRooms"
  | "EatApp"
  | "ReserveOut"
  | "OpenTable"
  | "Direct Website";

export type ReservationService = {
  name: BookingProviderName;
  url: string;
  isPrimary?: boolean;
};

export type VenueLike = {
  name: string;
  website?: string;
  address?: string;
  district?: string;
  phone?: string;
  coordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  bookingPlatform?: { name: BookingProviderName; url: string };
  reservationServices?: ReservationService[];
  officialWebsite?: string;
  walkInOnly?: boolean;
};

const PLACEHOLDER_HOSTS = new Set([
  "dubaieats.ae",
  "www.dubaieats.ae",
  "dubai-eat.com",
  "www.dubai-eat.com",
  "dubaieat.com",
  "www.dubaieat.com",
]);

export function isRealWebsite(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !PLACEHOLDER_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function officialWebsiteOf(r: VenueLike): string | undefined {
  if (r.officialWebsite && isRealWebsite(r.officialWebsite)) return r.officialWebsite;
  if (isRealWebsite(r.website)) return r.website;
  return undefined;
}

function coordsOf(r: VenueLike): { lat: number; lng: number } | undefined {
  if (r.coordinates) return r.coordinates;
  if (typeof r.latitude === "number" && typeof r.longitude === "number") {
    return { lat: r.latitude, lng: r.longitude };
  }
  return undefined;
}

export function googlePlaceUrl(r: VenueLike): string {
  const query = [r.name, r.address || r.district, "Dubai"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleDirectionsUrl(r: VenueLike): string {
  const coords = coordsOf(r);
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${r.name} ${r.address || r.district || ""} Dubai`
  )}`;
}

export function googlePhotosUrl(r: VenueLike): string {
  return googlePlaceUrl(r);
}

export function googleMenuUrl(r: VenueLike): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${r.name} Dubai menu`)}`;
}

export function googleOrderUrl(r: VenueLike): string {
  return googlePlaceUrl(r);
}

export function offersOrderOnGoogle(r: { features?: string[] }): boolean {
  return (r.features || []).some((f) => {
    const n = f.toLowerCase();
    return n.includes("delivery") || n.includes("takeaway") || n.includes("collection");
  });
}

export function googleReviewsUrl(r: VenueLike): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${r.name} Dubai reviews`)}`;
}

export function callUrl(phone?: string): string | undefined {
  if (!phone) return undefined;
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function buildReservationServices(
  name: string,
  website?: string
): { services: ReservationService[]; walkInOnly: boolean; officialWebsite?: string } {
  const verified = getVerifiedBookings(name);
  const officialWebsite = isRealWebsite(website) ? website : undefined;
  const services: ReservationService[] = [];

  if (verified?.sevenrooms) {
    services.push({ name: "SevenRooms", url: verified.sevenrooms, isPrimary: services.length === 0 });
  }
  if (verified?.eatapp) {
    services.push({ name: "EatApp", url: verified.eatapp, isPrimary: services.length === 0 });
  }
  if (verified?.reserveout) {
    services.push({ name: "ReserveOut", url: verified.reserveout, isPrimary: services.length === 0 });
  }
  if (verified?.opentable) {
    services.push({ name: "OpenTable", url: verified.opentable, isPrimary: services.length === 0 });
  }
  if (officialWebsite) {
    services.push({
      name: "Direct Website",
      url: officialWebsite,
      isPrimary: services.length === 0,
    });
  }

  return {
    services,
    walkInOnly: Boolean(verified?.walkInOnly),
    officialWebsite,
  };
}

const PROVIDER_META: Record<BookingProviderName, { logo: string; badge: string }> = {
  SevenRooms: { logo: "🟣", badge: "Official booking" },
  EatApp: { logo: "🟠", badge: "Instant confirm" },
  ReserveOut: { logo: "🔵", badge: "Table booking" },
  OpenTable: { logo: "🔴", badge: "OpenTable" },
  "Direct Website": { logo: "🌐", badge: "Official site" },
};

export function getBookingProviders(r: VenueLike) {
  return (r.reservationServices || []).map((s) => ({
    id: s.name,
    name: s.name,
    url: s.url,
    ...PROVIDER_META[s.name],
  }));
}

export function getAccurateBookHref(r: VenueLike): string {
  if (r.walkInOnly) return googlePlaceUrl(r);
  return r.bookingPlatform?.url || officialWebsiteOf(r) || googleDirectionsUrl(r);
}

export function getAccurateBookLabel(r: VenueLike): string {
  if (r.walkInOnly) return "Walk-in · Map";
  if (r.bookingPlatform?.name === "Direct Website") return "Website";
  if (r.bookingPlatform?.url) return "Book Table";
  if (officialWebsiteOf(r)) return "Website";
  return "Directions";
}
