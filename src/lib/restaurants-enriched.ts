import { restaurants as rawRestaurants, Restaurant } from "../data/restaurants";
import { resolveDistrict } from "./dubai-districts";
import { buildReservationServices, type BookingProviderName, type ReservationService } from "./venue-actions";

export function getRestaurantSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ExpandedEateryType =
  | "restaurant"
  | "bar"
  | "cafe"
  | "nightclub"
  | "beach_club"
  | "private_chef"
  | "caterer"
  | "popup";

export type PrivilegeCategory =
  // Government & Corporate
  | "Esaad"
  | "Fazaa"
  | "Homat Al Watan"
  | "ALSAADA"
  | "Emirates Platinum"
  // Developers & Master Estates
  | "Tickit by Dubai Holding"
  | "Viya by Wasl"
  | "U By Emaar"
  | "Nakheel Rewards"
  // Card Networks & Banking
  | "American Express"
  | "Visa"
  | "Mastercard"
  | "Emirates NBD"
  | "Mashreq"
  | "FAB"
  | "ADCB"
  | "HSBC"
  | "Standard Chartered"
  | "CBD"
  | "RAKBANK"
  | "Citi"
  | "DIB"
  // Lifestyle & Discount Apps
  | "Smiles by e&"
  | "Careem DineOut"
  | "The Entertainer"
  | "Supperclub"
  | "Privilee"
  | "Talabat Pro"
  | "Zomato"
  | "BOGO (Buy 1 Get 1)"
  // Hotel Loyalty & VIP
  | "More Cravings by Marriott Bonvoy"
  | "Jumeirah One"
  | "Atlantis Circle"
  | "ALL Accor Live Limitless"
  | "Hilton Honors"
  | "Concierge VIP";

export function formatPrivilegeBadge(privilege: string): string {
  switch (privilege) {
    case "Esaad":
      return "💳 Esaad Benefit";
    case "Fazaa":
      return "💳 Fazaa Benefit";
    case "Homat Al Watan":
      return "💳 Homat Al Watan";
    case "ALSAADA":
      return "💳 ALSAADA Benefit";
    case "Emirates Platinum":
      return "💳 Emirates Platinum";
    case "Tickit by Dubai Holding":
      return "💳 Tickit Points";
    case "Viya by Wasl":
      return "💳 Viya Rewards";
    case "U By Emaar":
      return "💳 U By Emaar";
    case "Nakheel Rewards":
      return "💳 Nakheel Rewards";
    case "American Express":
      return "💳 Amex Dining";
    case "Visa":
      return "💳 Visa Infinite/Signature";
    case "Mastercard":
      return "💳 Mastercard World";
    case "Emirates NBD":
      return "💳 ENBD Offer";
    case "Mashreq":
      return "💳 Mashreq Privileges";
    case "FAB":
      return "💳 FAB Rewards";
    case "ADCB":
      return "💳 ADCB TouchPoints";
    case "HSBC":
      return "💳 HSBC Privileges";
    case "Standard Chartered":
      return "💳 StanChart Dining";
    case "CBD":
      return "💳 CBD Offer";
    case "RAKBANK":
      return "💳 RAKBANK Dining";
    case "Citi":
      return "💳 Citi Gourmet";
    case "DIB":
      return "💳 DIB Rewards";
    case "Smiles by e&":
      return "💳 Smiles by e&";
    case "Careem DineOut":
      return "💳 Careem DineOut";
    case "The Entertainer":
      return "💳 Entertainer 2-for-1";
    case "Supperclub":
      return "💳 Supperclub";
    case "Privilee":
      return "💳 Privilee F&B";
    case "Talabat Pro":
      return "💳 Talabat Pro Dine-in";
    case "Zomato":
      return "💳 Zomato Gold";
    case "BOGO (Buy 1 Get 1)":
      return "💳 Buy 1 Get 1 Free";
    case "More Cravings by Marriott Bonvoy":
      return "💳 More Cravings";
    case "Jumeirah One":
      return "💳 Jumeirah One";
    case "Atlantis Circle":
      return "💳 Atlantis Circle";
    case "ALL Accor Live Limitless":
      return "💳 Accor ALL Dining";
    case "Hilton Honors":
      return "💳 Hilton Honors";
    case "Concierge VIP":
      return "👑 VIP Concierge";
    default:
      return privilege.startsWith("💳") ? privilege : `💳 ${privilege} Offer`;
  }
}

export type MenuItem = {
  id: string;
  name: string;
  category: "Starters & Raw" | "Mains & Grills" | "Pasta & Pizza" | "Desserts" | "Beverages & Cocktails";
  price: number;
  description: string;
  tags: ("Halal" | "Vegan" | "Gluten-Free" | "Keto" | "Chef Special" | "Organic")[];
  isPopular?: boolean;
};

export type EnrichedRestaurant = Omit<Restaurant, "eateryType" | "bookingPlatform"> & {
  slug: string;
  district: string;
  coordinates: { lat: number; lng: number };
  liquor: "Licensed" | "Non-Licensed" | "BYOB";
  seatingPerks: string[];
  occasions: string[];
  logistics: string[];
  bookingPlatform?: { name: BookingProviderName; url: string };
  reservationServices: ReservationService[];
  officialWebsite?: string;
  walkInOnly?: boolean;
  deliveryLinks: {
    keeta: string;
    deliveroo: string;
    talabat: string;
    careem: string;
    noon: string;
    direct?: string;
  };
  barType?: string;
  eateryType: ExpandedEateryType;
  discounts: PrivilegeCategory[];
  lifestyleTags: string[];
  isSponsored?: boolean;
  sponsoredBannerText?: string;
  // Deep Practical Information (PDF Section 2)
  valetInfo: { available: boolean; type: "Complimentary" | "Paid" | "Self-Parking"; cost: string };
  dressCode: "Smart Casual" | "Casual" | "Elegant / Upscale" | "Beach Chic";
  childPolicy: string;
  petPolicy: string;
  accessibility: string;
  awardsList: string[];
  dietaryTags: string[];
  digitalMenu: MenuItem[];
  verificationStats: { upvotes: number; downvotes: number; lastVerifiedDate: string };
};

export const enrichedRestaurants: EnrichedRestaurant[] = rawRestaurants.map((r) => {
  const district = resolveDistrict(r.area);
  const booking = buildReservationServices(r.name, r.website);
  const reservationServices = booking.services;
  const officialWebsite = booking.officialWebsite;
  const walkInOnly = booking.walkInOnly;
  const bookingPlatform = reservationServices[0]
    ? { name: reservationServices[0].name, url: reservationServices[0].url }
    : undefined;

  return {
    ...r,
    slug: getRestaurantSlug(r.name),
    district,
    coordinates: { lat: r.latitude, lng: r.longitude },
    liquor: r.liquor || "Non-Licensed",
    seatingPerks: r.seatingPerks || [],
    occasions: r.occasions || [],
    logistics: r.logistics || [],
    bookingPlatform,
    reservationServices,
    officialWebsite,
    walkInOnly,
    deliveryLinks: {
      keeta: r.deliveryLinks?.keeta || "",
      deliveroo: r.deliveryLinks?.deliveroo || "",
      talabat: r.deliveryLinks?.talabat || "",
      careem: r.deliveryLinks?.careem || "",
      noon: r.deliveryLinks?.noon || "",
      direct: officialWebsite,
    },
    eateryType: r.eateryType || "restaurant",
    discounts: [],
    lifestyleTags: r.seatingPerks || [],
    isSponsored: false,
    sponsoredBannerText: undefined,
    valetInfo: { available: false, type: "Self-Parking", cost: "See Google Maps" },
    dressCode: "Smart Casual",
    childPolicy: "See Google listing",
    petPolicy: "See Google listing",
    accessibility: "See Google listing for accessibility details",
    awardsList: r.michelin ? [r.michelin] : [],
    dietaryTags: [],
    digitalMenu: [],
    verificationStats: { upvotes: 0, downvotes: 0, lastVerifiedDate: "" },
  };
});
