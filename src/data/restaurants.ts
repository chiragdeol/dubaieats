import { realVenues } from "./real-venues";

export type MichelinTier = "3 Stars" | "2 Stars" | "1 Star" | "Bib Gourmand" | "Michelin Selected";

export type Restaurant = {
  name: string;
  rating: number;
  reviews: string;
  reviewsCount: number;
  priceMin: number;
  priceMax: number;
  cuisine: string;
  category: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  status: "Open" | "Closed";
  image: string;
  latitude: number;
  longitude: number;
  features: string[];
  description: string;
  website: string;
  michelin?: MichelinTier;
  liquor?: "Licensed" | "Non-Licensed" | "BYOB";
  seatingPerks?: string[];
  occasions?: string[];
  logistics?: string[];
  bookingPlatform?: { name: "SevenRooms" | "OpenTable" | "EatApp" | "ReserveOut" | "Direct Website"; url: string };
  deliveryLinks?: { deliveroo?: string; talabat?: string; noon?: string; careem?: string; keeta?: string };
  barType?: string;
  eateryType?: "restaurant" | "bar" | "cafe";
  slug?: string;
};

export type SponsoredRestaurant = {
  name: string;
  rating: number;
  reviewsCount: number;
  category: string;
  statusText: string;
  distance: string;
  floor?: string;
  images: string[];
  tagline?: string;
  website: string;
  phone: string;
  address: string;
};

export const sponsoredRestaurants: SponsoredRestaurant[] = [
  {
    name: "FZN by Björn Frantzén",
    rating: 4.5,
    reviewsCount: 84,
    category: "Modern European restaurant",
    statusText: "Closed · Opens 7 PM Wed",
    distance: "20.1 km",
    tagline: "3 Michelin-Starred Restaurant - Modern European Dining With Japanese Influences",
    images: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    ],
    website: "https://www.restaurantfzn.com",
    phone: "+971 4 426 2626",
    address: "Atlantis The Palm, Crescent Rd, Palm Jumeirah, Dubai",
  },
  {
    name: "Vera Versilia | Italian Restaurant in Dubai",
    rating: 4.9,
    reviewsCount: 330,
    category: "Italian restaurant",
    statusText: "Closed · Opens 12 PM",
    distance: "15.2 km",
    floor: "2nd floor",
    tagline: "Authentic Tuscan Seafood & Fine Dining in Dubai",
    images: [
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    ],
    website: "https://www.veraversiliadubai.com",
    phone: "+971 4 582 7700",
    address: "Level 2, Radisson Blu Hotel, Dubai Waterfront, Dubai",
  },
];

export const restaurants: Restaurant[] = realVenues;
