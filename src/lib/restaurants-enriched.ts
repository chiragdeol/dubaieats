import { restaurants as rawRestaurants, Restaurant } from "../data/restaurants";

export const enrichedRestaurants: Restaurant[] = rawRestaurants.map((r) => {
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

  // 6. Delivery Links
  const deliveryLinks = {
    deliveroo: `https://www.google.com/search?q=${encodeURIComponent("site:deliveroo.ae " + r.name + " Dubai")}`,
    talabat: `https://www.google.com/search?q=${encodeURIComponent("site:talabat.com " + r.name + " Dubai")}`,
    noon: `https://www.google.com/search?q=${encodeURIComponent("site:noon.com " + r.name + " Dubai")}`,
    careem: `https://www.google.com/search?q=${encodeURIComponent("site:careem.com " + r.name + " Dubai")}`,
    keeta: `https://www.google.com/search?q=${encodeURIComponent("site:keeta.global OR site:keeta.ae " + r.name + " Dubai")}`
  };

  return {
    ...r,
    liquor,
    seatingPerks,
    occasions,
    logistics,
    bookingPlatform,
    deliveryLinks,
    barType
  };
});
