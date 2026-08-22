/**
 * Booking URLs that have been confirmed to exist.
 * Never guess SevenRooms / EatApp / ReserveOut slugs — missing keys mean
 * those buttons must not be shown.
 */
export type VerifiedBookingLinks = {
  sevenrooms?: string;
  eatapp?: string;
  reserveout?: string;
  opentable?: string;
  walkInOnly?: boolean;
};

export const verifiedBookingsByName: Record<string, VerifiedBookingLinks> = {
  "zuma dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/zumadubai",
    eatapp: "https://eatapp.co/zuma-difc",
  },
  "coya dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/coyadubai",
  },
  "gaia dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/gaiadubai",
  },
  "la petite maison": {
    sevenrooms: "https://www.sevenrooms.com/reservations/lpmdubai",
  },
  "ce la vie sky bar": {
    sevenrooms: "https://www.sevenrooms.com/reservations/celavidubai",
  },
  "cé la vi dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/celavidubai",
  },
  "roberto's dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/robertosdubai",
  },
  "il borro tuscan bistro": {
    sevenrooms: "https://www.sevenrooms.com/reservations/ilborrotuscanbistrodubai",
  },
  "rüya dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/ruyadubai",
  },
  "ling ling dubai": {
    sevenrooms: "https://www.sevenrooms.com/reservations/linglingroyalatlantis",
  },
  "dinner by heston blumenthal": {
    opentable: "https://www.opentable.com/r/dinner-by-heston-blumenthal-dubai",
  },
  "akira back dubai": {
    opentable: "https://www.opentable.com/r/akira-back-w-dubai-the-palm-dubai",
  },
  "3fils": {
    walkInOnly: true,
  },
};

export function getVerifiedBookings(name: string): VerifiedBookingLinks | undefined {
  return verifiedBookingsByName[name.trim().toLowerCase()];
}
