import { VERIFIED_DELIVERY } from "@/data/verified-delivery";

export type OrderMode = "pickup" | "delivery";

export type DeliveryPartner = {
  id: "talabat" | "deliveroo";
  name: string;
  /** https link — opens the native app on mobile if installed, otherwise the mobile site. */
  webUrl: string;
  note: string;
  eta: string;
};

type DeliveryVenue = {
  name: string;
  features?: string[];
  deliveryLinks?: { talabat?: string; deliveroo?: string };
};

const TALABAT_APP_URL = "https://www.talabat.com/uae";
const DELIVEROO_APP_URL = "https://deliveroo.ae";

export function venueOffersDelivery(venue: DeliveryVenue, live?: { delivery?: boolean; takeout?: boolean }) {
  if (live?.delivery || live?.takeout) return true;
  return (venue.features || []).some((f) => {
    const n = f.toLowerCase();
    return n.includes("delivery") || n.includes("takeaway") || n.includes("collection");
  });
}

export function venueOffersPickup(venue: DeliveryVenue, live?: { takeout?: boolean }) {
  if (live?.takeout) return true;
  return (venue.features || []).some((f) => {
    const n = f.toLowerCase();
    return n.includes("takeaway") || n.includes("collection") || n.includes("pickup");
  });
}

export function venueOffersDropoff(venue: DeliveryVenue, live?: { delivery?: boolean }) {
  if (live?.delivery) return true;
  return (venue.features || []).some((f) => f.toLowerCase().includes("delivery"));
}

export function getDeliveryPartners(venue: DeliveryVenue, mode: OrderMode): DeliveryPartner[] {
  const verified = VERIFIED_DELIVERY[venue.name];
  const talabatWeb = venue.deliveryLinks?.talabat || verified?.talabat || TALABAT_APP_URL;
  const deliverooWeb = venue.deliveryLinks?.deliveroo || verified?.deliveroo || DELIVEROO_APP_URL;

  const pickup = mode === "pickup";
  return [
    {
      id: "talabat",
      name: "Talabat",
      webUrl: talabatWeb,
      note: pickup ? "Collection in the Talabat app" : "Fees may apply",
      eta: pickup ? "Opens the Talabat app for pickup" : "Opens the Talabat app",
    },
    {
      id: "deliveroo",
      name: "Deliveroo",
      webUrl: deliverooWeb,
      note: pickup ? "Pickup in the Deliveroo app" : "Fees may apply",
      eta: pickup ? "Opens the Deliveroo app for pickup" : "Opens the Deliveroo app",
    },
  ];
}
