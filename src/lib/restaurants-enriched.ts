import { restaurants as rawRestaurants, Restaurant } from "../data/restaurants";
import { resolveDistrict } from "./dubai-districts";

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
  | "Esaad"
  | "Fazaa"
  | "Emirates Platinum"
  | "The Entertainer"
  | "Supper Club"
  | "BOGO (Buy 1 Get 1)"
  | "Emirates NBD"
  | "HSBC"
  | "FAB"
  | "Mashreq"
  | "Concierge VIP";

export type EnrichedRestaurant = Restaurant & {
  slug: string;
  district: string;
  liquor: "Licensed" | "Non-Licensed" | "BYOB";
  seatingPerks: string[];
  occasions: string[];
  logistics: string[];
  bookingPlatform: { name: "SevenRooms" | "OpenTable" | "Direct Website"; url: string };
  deliveryLinks: {
    deliveroo: string;
    talabat: string;
    noon: string;
    careem: string;
    keeta: string;
  };
  barType?: string;
  eateryType: ExpandedEateryType;
  discounts: PrivilegeCategory[];
  lifestyleTags: string[];
  isSponsored?: boolean;
  sponsoredBannerText?: string;
};

export const enrichedRestaurants: EnrichedRestaurant[] = rawRestaurants.map((r, idx) => {
  const nameLower = r.name.toLowerCase();
  const areaLower = r.area.toLowerCase();
  const cuisineLower = r.cuisine.toLowerCase();

  // 1. Liquor status
  let liquor: "Licensed" | "Non-Licensed" | "BYOB" = "Non-Licensed";
  if (
    r.priceMin >= 250 ||
    areaLower.includes("difc") ||
    areaLower.includes("palm") ||
    areaLower.includes("jumeirah al qasr") ||
    areaLower.includes("atlantis") ||
    nameLower.includes("zuma") ||
    nameLower.includes("coya") ||
    nameLower.includes("lpm") ||
    nameLower.includes("gaia") ||
    nameLower.includes("milos")
  ) {
    liquor = "Licensed";
  } else if (nameLower.includes("ravi") || nameLower.includes("ustad") || nameLower.includes("qtair")) {
    liquor = "Non-Licensed";
  }

  // 2. Seating Perks
  const seatingPerks: string[] = ["AC Terrace"];
  if (areaLower.includes("palm") || areaLower.includes("beach") || areaLower.includes("atlantis") || nameLower.includes("qtair")) {
    seatingPerks.push("Beachfront");
  }
  if (areaLower.includes("burj") || areaLower.includes("downtown") || nameLower.includes("atmosphere")) {
    seatingPerks.push("Burj View");
  }

  // 3. Occasions & Kids Friendly
  const occasions: string[] = [];
  if (r.priceMin >= 300) {
    occasions.push("Date Night", "Business Lunch", "Late Night");
  } else {
    occasions.push("Kid Friendly", "Family Friendly", "Children's Play Area");
  }
  if (cuisineLower.includes("italian") || cuisineLower.includes("french") || nameLower.includes("india")) {
    occasions.push("Sunday Brunch");
  }
  if (nameLower.includes("yacht") || areaLower.includes("harbour") || areaLower.includes("marina")) {
    occasions.push("Yacht Party", "Dinner Cruise");
  }

  // 4. Logistics
  const logistics: string[] = [];
  if (r.priceMin >= 200) {
    logistics.push("Complimentary Valet", "EV Charging");
  } else {
    logistics.push("Self Parking");
  }
  if (cuisineLower.includes("turkish") || cuisineLower.includes("persian") || areaLower.includes("marina") || nameLower.includes("india") || nameLower.includes("coya")) {
    logistics.push("Shisha Available");
  }

  // 5. Booking Platform
  let bookingPlatform: { name: "SevenRooms" | "OpenTable" | "Direct Website"; url: string } = {
    name: "Direct Website",
    url: r.website
  };
  if (r.priceMin >= 400 || nameLower.includes("zuma") || nameLower.includes("coya") || nameLower.includes("lpm")) {
    bookingPlatform = {
      name: "SevenRooms",
      url: `https://www.sevenrooms.com/reservations/${nameLower.replace(/[^a-z0-9]/g, "")}`
    };
  } else if (r.priceMin >= 250) {
    bookingPlatform = {
      name: "OpenTable",
      url: `https://www.opentable.ae/s?term=${encodeURIComponent(r.name + " Dubai")}`
    };
  }

  // 5.5 Bar Type
  let barType: string | undefined = undefined;
  if (liquor === "Licensed") {
    if (nameLower.includes("zuma") || cuisineLower.includes("japanese")) {
      barType = "izakaya-sake";
    } else if (nameLower.includes("coya") || nameLower.includes("lpm")) {
      barType = "cocktail-mixology";
    } else if (nameLower.includes("pierchic") || areaLower.includes("beach") || nameLower.includes("milos") || areaLower.includes("palm")) {
      barType = "beach-waterfront";
    } else if (nameLower.includes("atmosphere") || areaLower.includes("burj") || areaLower.includes("downtown")) {
      barType = "rooftop-skyline";
    } else if (cuisineLower.includes("french") || cuisineLower.includes("italian") || cuisineLower.includes("european")) {
      barType = "wine-tapas";
    } else if (areaLower.includes("atlantis") || areaLower.includes("four seasons") || areaLower.includes("jumeirah") || areaLower.includes("qasr")) {
      barType = "hotel-lobby";
    } else {
      barType = "cocktail-mixology";
    }
  }

  // 5.6 Expanded Eatery Type
  let eateryType: ExpandedEateryType = "restaurant";
  if (nameLower.includes("club") || nameLower.includes("lounge") || nameLower.includes("cavalli") || nameLower.includes("blu")) {
    eateryType = "nightclub";
  } else if (nameLower.includes("beach") || nameLower.includes("surf") || nameLower.includes("nikki") || areaLower.includes("palm") && r.priceMin >= 350) {
    eateryType = "beach_club";
  } else if (nameLower.includes("chef") || nameLower.includes("private") || nameLower.includes("table")) {
    eateryType = "private_chef";
  } else if (nameLower.includes("catering") || nameLower.includes("event")) {
    eateryType = "caterer";
  } else if (nameLower.includes("popup") || nameLower.includes("pop up") || nameLower.includes("supper")) {
    eateryType = "popup";
  } else if (barType !== undefined) {
    eateryType = "bar";
  } else if (
    cuisineLower.includes("cafe") ||
    cuisineLower.includes("coffee") ||
    cuisineLower.includes("bakery") ||
    cuisineLower.includes("pastry") ||
    cuisineLower.includes("breakfast") ||
    cuisineLower.includes("tea") ||
    cuisineLower.includes("dessert") ||
    nameLower.includes("cafe") ||
    nameLower.includes("coffee") ||
    nameLower.includes("bakery")
  ) {
    eateryType = "cafe";
  }

  // 6. Delivery Links
  const deliveryLinks = {
    deliveroo: `https://www.google.com/search?q=${encodeURIComponent("site:deliveroo.ae " + r.name + " Dubai")}`,
    talabat: `https://www.google.com/search?q=${encodeURIComponent("site:talabat.com " + r.name + " Dubai")}`,
    noon: `https://www.google.com/search?q=${encodeURIComponent("site:noon.com " + r.name + " Dubai")}`,
    careem: `https://www.google.com/search?q=${encodeURIComponent("site:careem.com " + r.name + " Dubai")}`,
    keeta: `https://www.google.com/search?q=${encodeURIComponent("site:keeta.global OR site:keeta.ae " + r.name + " Dubai")}`
  };

  // 7. Discounts & Privileges Card / App mapping
  const discounts: PrivilegeCategory[] = [];
  if (r.priceMin <= 250) {
    discounts.push("The Entertainer", "BOGO (Buy 1 Get 1)");
  }
  if (r.priceMin <= 350) {
    discounts.push("Esaad", "Fazaa", "Emirates NBD");
  }
  if (r.priceMin >= 200) {
    discounts.push("Emirates Platinum", "HSBC", "FAB");
  }
  if (r.priceMin >= 300) {
    discounts.push("Supper Club", "Mashreq");
  }
  if (r.priceMin >= 400 || r.michelin) {
    discounts.push("Concierge VIP");
  }

  // 8. Lifestyle Tags
  const lifestyleTags: string[] = [...seatingPerks];
  if (cuisineLower.includes("italian") || cuisineLower.includes("french") || r.priceMin >= 250) {
    lifestyleTags.push("Sunday Brunch");
  }
  if (liquor === "Licensed") {
    lifestyleTags.push("Ladies Night", "Live DJ");
  }
  if (logistics.includes("Shisha Available")) {
    lifestyleTags.push("Shisha");
  }
  if (eateryType === "beach_club" || seatingPerks.includes("Beachfront")) {
    lifestyleTags.push("Pool Pass");
  }
  if (cuisineLower.includes("arabic") || cuisineLower.includes("lebanese") || cuisineLower.includes("middle eastern") || cuisineLower.includes("turkish")) {
    lifestyleTags.push("Ramadan Special");
  }

  // 9. Sponsored Ad Engine demo tags (for transparent Google-style ad placement)
  const isSponsored = idx === 0 || idx === 3; // Zuma and Atlantis Nobu as featured transparent sponsors
  const sponsoredBannerText = isSponsored ? "Featured Venue · Reserve directly with zero booking fee" : undefined;

  return {
    ...r,
    liquor,
    seatingPerks,
    occasions,
    logistics,
    bookingPlatform,
    deliveryLinks,
    barType,
    eateryType,
    discounts,
    lifestyleTags,
    isSponsored,
    sponsoredBannerText,
    slug: getRestaurantSlug(r.name),
    district: resolveDistrict(r.area),
  };
});
