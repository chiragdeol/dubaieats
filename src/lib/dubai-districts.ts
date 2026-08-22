/**
 * Dubai Districts — Full community-level location data
 * Organized by geographic zone for filter UI grouping
 */

export type DubaiZone =
  | "Downtown & Business Bay"
  | "Dubai Marina & JBR"
  | "Palm Jumeirah & Beachfront"
  | "Old Dubai & Heritage"
  | "Jumeirah & Al Wasl"
  | "New Dubai Communities"
  | "East & Northeast Dubai"
  | "North Dubai";

export type DubaiDistrict = {
  name: string;
  zone: DubaiZone;
  aliases?: string[]; // alternate names / hotel names that map here
};

export const DUBAI_DISTRICTS: DubaiDistrict[] = [
  // ── Downtown & Business Bay ──
  { name: "Downtown Dubai", zone: "Downtown & Business Bay", aliases: ["downtown", "souk al bahar", "address downtown", "burj khalifa", "address sky view", "taj dubai", "nassima royal"] },
  { name: "Business Bay", zone: "Downtown & Business Bay", aliases: ["business bay", "jw marriott marquis"] },
  { name: "DIFC", zone: "Downtown & Business Bay", aliases: ["difc", "gate village", "four seasons difc"] },
  { name: "Za'abeel", zone: "Downtown & Business Bay", aliases: ["zaabeel", "raffles"] },
  { name: "Al Karama", zone: "Old Dubai & Heritage", aliases: ["karama"] },

  // ── Dubai Marina & JBR ──
  { name: "Dubai Marina", zone: "Dubai Marina & JBR", aliases: ["dubai marina", "marina", "pier 7", "grosvenor house", "le royal meridien", "marina mall"] },
  { name: "JBR", zone: "Dubai Marina & JBR", aliases: ["jbr", "the beach jbr", "jumeirah beach residence", "the beach", "the maine"] },
  { name: "Bluewaters Island", zone: "Dubai Marina & JBR", aliases: ["bluewaters", "caesars bluewaters"] },
  { name: "JLT", zone: "Dubai Marina & JBR", aliases: ["jlt", "jumeirah lakes towers"] },
  { name: "The Greens & Views", zone: "Dubai Marina & JBR", aliases: ["the greens", "the views"] },

  // ── Palm Jumeirah & Beachfront ──
  { name: "Palm Jumeirah", zone: "Palm Jumeirah & Beachfront", aliases: ["palm", "palm jumeirah", "atlantis", "atlantis the royal", "atlantis the palm", "five palm", "w dubai", "st regis", "st. regis", "the palm", "palm tower", "nakheel", "west beach", "club vista mare", "azure residences", "one&only the palm", "jumeirah zabeel saray", "raffles the palm", "marriott resort palm", "anantara the palm", "the pointe"] },
  { name: "Umm Suqeim", zone: "Palm Jumeirah & Beachfront", aliases: ["umm suqeim", "jumeirah fishing harbour", "fishing harbour 2", "burj al arab beach", "burj al arab"] },
  { name: "Jumeirah Beach Hotel", zone: "Palm Jumeirah & Beachfront", aliases: ["jumeirah al naseem", "jumeirah al qasr", "mina a salam", "mina a' salam", "madinat jumeirah", "pierchic"] },

  // ── Old Dubai & Heritage ──
  { name: "Deira", zone: "Old Dubai & Heritage", aliases: ["deira", "al rigga", "baniyas"] },
  { name: "Bur Dubai", zone: "Old Dubai & Heritage", aliases: ["bur dubai", "al fahidi"] },
  { name: "Al Mankhool", zone: "Old Dubai & Heritage", aliases: ["al mankhool", "mankhool", "al musallah", "al mussallah"] },
  { name: "Oud Metha", zone: "Old Dubai & Heritage", aliases: ["oud metha", "lamcy"] },
  { name: "Garhoud", zone: "Old Dubai & Heritage", aliases: ["garhoud", "festival city", "dubai festival city", "intercontinental festival city"] },
  { name: "Al Quoz", zone: "Old Dubai & Heritage", aliases: ["al quoz", "alserkal avenue"] },
  { name: "Satwa", zone: "Old Dubai & Heritage", aliases: ["satwa", "2nd december"] },

  // ── Jumeirah & Al Wasl ──
  { name: "Jumeirah 1", zone: "Jumeirah & Al Wasl", aliases: ["jumeirah 1"] },
  { name: "Jumeirah 2", zone: "Jumeirah & Al Wasl", aliases: ["jumeirah 2", "jumeirah emirates towers", "four seasons jumeirah"] },
  { name: "Jumeirah 3", zone: "Jumeirah & Al Wasl", aliases: ["jumeirah 3"] },
  { name: "Al Wasl", zone: "Jumeirah & Al Wasl", aliases: ["al wasl", "city walk"] },
  { name: "La Mer", zone: "Jumeirah & Al Wasl", aliases: ["la mer"] },
  { name: "Safa Park Area", zone: "Jumeirah & Al Wasl", aliases: ["safa", "box park"] },
  { name: "Al Safa", zone: "Jumeirah & Al Wasl", aliases: ["al safa"] },

  // ── New Dubai Communities ──
  { name: "Dubai Hills Estate", zone: "New Dubai Communities", aliases: ["dubai hills", "dubai hills mall"] },
  { name: "Al Barsha", zone: "New Dubai Communities", aliases: ["al barsha", "mall of the emirates", "moe"] },
  { name: "JVC", zone: "New Dubai Communities", aliases: ["jvc", "jumeirah village circle"] },
  { name: "JVT", zone: "New Dubai Communities", aliases: ["jvt", "jumeirah village triangle"] },
  { name: "Motor City", zone: "New Dubai Communities", aliases: ["motor city", "uptown motor city"] },
  { name: "Sports City", zone: "New Dubai Communities", aliases: ["sports city", "dubai sports city"] },
  { name: "Discovery Gardens", zone: "New Dubai Communities", aliases: ["discovery gardens"] },
  { name: "Al Furjan", zone: "New Dubai Communities", aliases: ["al furjan", "furjan"] },
  { name: "Town Square", zone: "New Dubai Communities", aliases: ["town square", "nshama"] },
  { name: "Arabian Ranches", zone: "New Dubai Communities", aliases: ["arabian ranches"] },
  { name: "Mudon", zone: "New Dubai Communities", aliases: ["mudon"] },
  { name: "Damac Hills", zone: "New Dubai Communities", aliases: ["damac hills", "akoya"] },

  // ── East & Northeast Dubai ──
  { name: "Mirdif", zone: "East & Northeast Dubai", aliases: ["mirdif", "mirdif city centre"] },
  { name: "Rashidiya", zone: "East & Northeast Dubai", aliases: ["rashidiya", "al rashidiya"] },
  { name: "Silicon Oasis", zone: "East & Northeast Dubai", aliases: ["silicon oasis", "dso"] },
  { name: "Academic City", zone: "East & Northeast Dubai", aliases: ["academic city"] },
  { name: "International City", zone: "East & Northeast Dubai", aliases: ["international city"] },
  { name: "Creek Harbour", zone: "East & Northeast Dubai", aliases: ["creek harbour", "dubai creek harbour"] },
  { name: "Ras Al Khor", zone: "East & Northeast Dubai", aliases: ["ras al khor"] },
  { name: "Dubai Festival City", zone: "East & Northeast Dubai", aliases: ["festival city"] },

  // ── North Dubai ──
  { name: "Al Nahda", zone: "North Dubai", aliases: ["al nahda", "nahda"] },
  { name: "Al Qusais", zone: "North Dubai", aliases: ["al qusais", "qusais"] },
  { name: "Muhaisnah", zone: "North Dubai", aliases: ["muhaisnah"] },
  { name: "Al Twar", zone: "North Dubai", aliases: ["al twar", "twar"] },
  { name: "Hor Al Anz", zone: "North Dubai", aliases: ["hor al anz"] },
  { name: "Al Mizhar", zone: "North Dubai", aliases: ["al mizhar", "mizhar"] },
  { name: "Deira Islands", zone: "North Dubai", aliases: ["deira islands", "nakheel mall"] },
];

/** Returns all unique zones in order */
export const DUBAI_ZONES: DubaiZone[] = [
  "Downtown & Business Bay",
  "Dubai Marina & JBR",
  "Palm Jumeirah & Beachfront",
  "Jumeirah & Al Wasl",
  "Old Dubai & Heritage",
  "New Dubai Communities",
  "East & Northeast Dubai",
  "North Dubai",
];

/** Areas shown in the public restaurant search dropdown */
export const LISTING_AREAS = [
  "Al Mankhool",
  "Business Bay",
  "DIFC",
  "Downtown Dubai",
  "Dubai Marina",
  "Garhoud",
  "JBR",
  "JLT",
  "Jumeirah 2",
  "Jumeirah Beach Hotel",
  "Palm Jumeirah",
  "Satwa",
  "Umm Suqeim",
  "Za'abeel",
] as const;

export type ListingArea = (typeof LISTING_AREAS)[number];

/**
 * Given a restaurant's area string (hotel/venue name),
 * find the best matching Dubai community district name.
 */
export function resolveDistrict(area: string): string {
  const lower = area.toLowerCase();
  for (const d of DUBAI_DISTRICTS) {
    if (d.aliases) {
      for (const alias of d.aliases) {
        if (lower.includes(alias.toLowerCase())) {
          return d.name;
        }
      }
    }
    if (lower.includes(d.name.toLowerCase())) return d.name;
  }
  return "Downtown Dubai"; // fallback
}
