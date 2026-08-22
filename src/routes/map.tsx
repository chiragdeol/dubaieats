import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LISTING_AREAS } from "@/lib/dubai-districts";
import { RestaurantMap } from "@/components/restaurant-map";
import { VenuePhoto, LiveRatingText, LiveHoursText } from "@/components/venue-photo";
import { getAccurateBookHref, getAccurateBookLabel } from "@/lib/venue-actions";
import { ListingDeliveryButtons } from "@/components/order-online-card";
import { 
  MapPin, 
  Star, 
  Search, 
  Navigation, 
  ChevronRight, 
  Calendar, 
  ExternalLink,
  BadgePercent
} from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Dubai Restaurant Map — Dubai Eats" },
      { name: "description", content: "Explore Dubai restaurants, deals, and venues on an interactive map with verified pins." },
    ],
  }),
  component: InteractiveMapPage,
});

function InteractiveMapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVenue, setActiveVenue] = useState<EnrichedRestaurant>(enrichedRestaurants[0]);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach(r => set.add(r.cuisine));
    return Array.from(set).sort();
  }, []);

  const filteredVenues = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedRestaurants.filter(r => {
      if (selectedDistrict !== "All" && r.district !== selectedDistrict) return false;
      if (selectedCuisine !== "All" && r.cuisine !== selectedCuisine) return false;
      if (q && !(r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.area.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [selectedDistrict, selectedCuisine, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E0E0E0] pb-6 mb-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#757575] font-heading">
                <Link to="/" className="text-[#1A1A1A] font-bold hover:text-[#D4AF37]">Home</Link>
                <span>›</span>
                <span>Eat & Drink</span>
                <span>›</span>
                <span>Interactive Dubai Map</span>
              </div>
              <p className="mp-eyebrow mb-1 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" /> GEOGRAPHIC CULINARY MAP
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-[#1A1A1A] tracking-tight">
                Dubai Culinary Map Explorer
              </h1>
              <p className="text-sm text-[#757575] mt-1 font-normal font-sans">
                Pinpoint top dining spots, Fazaa & Esaad discount deals, and beachfront lounges across 60+ Dubai districts.
              </p>
            </div>

            <div className="text-xs font-bold font-heading text-[#1A1A1A] bg-white px-4 py-2 rounded-full border border-[#E0E0E0] shadow-2xs">
              📍 Showing {filteredVenues.length} Restaurant Pins
            </div>
          </div>

          {/* Map Filters Bar */}
          <div className="bg-white border border-[#EAEAEA] p-4 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            
            {/* Search keyword */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venue or cuisine on map..."
                className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none placeholder:text-[#757575]"
              />
              <Search className="w-4 h-4 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* District dropdown */}
            <div>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none cursor-pointer font-heading"
              >
                <option value="All">All Dubai Areas</option>
                {LISTING_AREAS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Cuisine dropdown */}
            <div>
              <select
                value={selectedCuisine}
                onChange={e => setSelectedCuisine(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none cursor-pointer font-heading"
              >
                <option value="All">All Cuisines</option>
                {cuisines.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Main Map Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Leaflet Map Canvas with Real Pins */}
            <div className="lg:col-span-8 bg-white border border-[#EAEAEA] rounded-3xl overflow-hidden shadow-md relative min-h-[500px] h-[640px]">
              <RestaurantMap
                restaurants={filteredVenues}
                activeRestaurant={activeVenue}
                onSelectRestaurant={setActiveVenue}
                className="w-full h-full min-h-[640px]"
              />
            </div>

            {/* Right Column: Active Selected Venue Quick Card */}
            <div className="lg:col-span-4 space-y-4">
              {activeVenue ? (
                <div className="bg-white border border-[#EAEAEA] rounded-3xl overflow-hidden shadow-md space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <VenuePhoto
                      venue={activeVenue}
                      alt={activeVenue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] font-bold font-heading bg-[#D4AF37] text-[#1A1A1A] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {activeVenue.cuisine}
                      </span>
                      <h3 className="font-heading font-black text-xl leading-tight mt-1 text-white">{activeVenue.name}</h3>
                      <p className="text-xs text-white/80 font-sans">{activeVenue.district}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    {/* Rating & Price */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-1">
                        <span className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-black text-xs px-2 py-0.5 rounded-md font-heading">
                          <LiveRatingText venue={activeVenue} scale={2} />
                        </span>
                        <span className="font-bold text-[#1A1A1A] font-heading">({activeVenue.reviews} reviews)</span>
                      </div>
                      <span className="font-black text-[#1A1A1A] font-heading">
                        AED {activeVenue.priceMin}–{activeVenue.priceMax} pp
                      </span>
                    </div>

                    {/* Practical Info highlights */}
                    <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#EAEAEA] text-xs space-y-1.5 font-sans">
                      <p className="flex justify-between"><span className="text-[#757575] font-semibold">Dress Code:</span> <strong className="text-[#1A1A1A]">{activeVenue.dressCode}</strong></p>
                      <p className="flex justify-between"><span className="text-[#757575] font-semibold">Valet:</span> <strong className="text-[#1A1A1A]">{activeVenue.valetInfo.type}</strong></p>
                      <p className="flex justify-between"><span className="text-[#757575] font-semibold">Hours:</span> <strong className="text-[#1A1A1A] truncate max-w-[140px]"><LiveHoursText venue={activeVenue} /></strong></p>
                    </div>

                    {/* Accepted Deals */}
                    {activeVenue.discounts && activeVenue.discounts.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-[#D4AF37] font-heading uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <BadgePercent className="w-3 h-3 text-[#D4AF37]" /> Accepted Privilege Cards
                        </p>
                        <div className="flex flex-wrap gap-1 font-heading">
                          {activeVenue.discounts.map(d => (
                            <span key={d} className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-bold text-[10px] px-2 py-0.5 rounded-md">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <ListingDeliveryButtons venue={activeVenue} />
                      <Link
                        to="/restaurants/$id"
                        params={{ id: activeVenue.slug }}
                        className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>View Full Profile & Digital Menu</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <a
                        href={getAccurateBookHref(activeVenue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-bold font-heading text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        <span>{getAccurateBookLabel(activeVenue)}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 text-center text-[#757575]">
                  <MapPin className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" />
                  <p className="text-sm font-bold text-[#1A1A1A] font-heading">Select a restaurant pin</p>
                  <p className="text-xs mt-1 font-sans">Click on any pin on the map to see details.</p>
                </div>
              )}

              {/* Quick Pin Selector Strip */}
              <div className="bg-white border border-[#EAEAEA] rounded-2xl p-3 shadow-2xs">
                <p className="text-[11px] font-bold font-heading text-[#757575] mb-2 px-1">
                  Quick Select ({filteredVenues.length} Nearby Venues)
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {filteredVenues.slice(0, 15).map(v => (
                    <button
                      key={v.slug}
                      onClick={() => setActiveVenue(v)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        activeVenue?.slug === v.slug
                          ? "bg-[#1A1A1A] text-white font-bold"
                          : "bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#1A1A1A]"
                      }`}
                    >
                      <span className="truncate max-w-[180px]">{v.name}</span>
                      <span className="text-[10px] font-heading font-extrabold text-[#D4AF37]">
                        AED {v.priceMin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
