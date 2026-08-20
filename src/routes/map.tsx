import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DUBAI_DISTRICTS, DUBAI_ZONES } from "@/lib/dubai-districts";
import { 
  MapPin, 
  Star, 
  Search, 
  Sparkles, 
  Navigation, 
  ChevronRight, 
  Calendar, 
  ExternalLink,
  Phone,
  BadgePercent
} from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Dubai Restaurant Map — Dubai Eat" },
      { name: "description", content: "Explore Dubai restaurants, deals, and venues on an interactive map." },
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
              📍 Showing {filteredVenues.length} Venues on Map
            </div>
          </div>

          {/* Map Filters Bar */}
          <div className="bg-card border border-border p-4 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            
            {/* Search keyword */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venue or cuisine on map..."
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-foreground outline-none"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* District dropdown */}
            <div>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value="All">All Dubai Districts</option>
                {DUBAI_ZONES.map(zone => (
                  <optgroup key={zone} label={`── ${zone}`}>
                    {DUBAI_DISTRICTS.filter(d => d.zone === zone).map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Cuisine dropdown */}
            <div>
              <select
                value={selectedCuisine}
                onChange={e => setSelectedCuisine(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground outline-none cursor-pointer"
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
            
            {/* Left Column: Interactive Map Canvas */}
            <div className="lg:col-span-8 bg-zinc-900 border border-border rounded-3xl overflow-hidden shadow-xl relative min-h-[500px] h-[600px]">
              
              {/* Dubai Map Canvas Simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 p-6 flex flex-col justify-between overflow-hidden">
                
                {/* Overlay Top Bar */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Dubai Geographic Grid
                  </span>
                  <span className="text-[10px] text-white/60 font-semibold bg-black/40 px-3 py-1 rounded-full">
                    GPS: 25.2048° N, 55.2708° E
                  </span>
                </div>

                {/* Map Pins Grid Simulation */}
                <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-4 my-auto p-4 max-h-[420px] overflow-y-auto">
                  {filteredVenues.map((v) => {
                    const isSelected = activeVenue?.slug === v.slug;
                    return (
                      <button
                        key={v.slug}
                        onClick={() => setActiveVenue(v)}
                        className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-md cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-white border-amber-400 shadow-xl scale-105"
                            : "bg-black/70 hover:bg-black/90 text-white/90 border-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-white fill-white" : "text-amber-400"}`} />
                          <span className="font-extrabold text-xs truncate">{v.name}</span>
                        </div>
                        <p className={`text-[10px] mt-1 truncate ${isSelected ? "text-white/90 font-bold" : "text-white/60"}`}>
                          {v.district} · ~AED {v.priceMin}
                        </p>
                        {v.discounts && v.discounts.length > 0 && (
                          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.2 rounded mt-1.5 ${isSelected ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-300"}`}>
                            💳 {v.discounts[0]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom coordinates footer */}
                <div className="relative z-10 flex items-center justify-between text-white/60 text-[10px] pt-2 border-t border-white/10">
                  <span>Click any pin to view venue details, menus & live reservations</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeVenue ? activeVenue.name + " Dubai" : "Dubai Restaurants")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Active Selected Venue Quick Card */}
            <div className="lg:col-span-4">
              {activeVenue ? (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={activeVenue.image}
                      alt={activeVenue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] font-extrabold bg-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {activeVenue.cuisine}
                      </span>
                      <h3 className="font-display font-extrabold text-xl leading-tight mt-1">{activeVenue.name}</h3>
                      <p className="text-xs text-white/80">{activeVenue.district}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    {/* Rating & Price */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span className="bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-md">
                          {(activeVenue.rating * 2).toFixed(1)}
                        </span>
                        <span className="font-bold text-foreground">({activeVenue.reviews} reviews)</span>
                      </div>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        AED {activeVenue.priceMin}–{activeVenue.priceMax} pp
                      </span>
                    </div>

                    {/* Practical Info highlights */}
                    <div className="bg-muted/40 p-3.5 rounded-2xl border border-border text-xs space-y-1.5">
                      <p className="flex justify-between"><span className="text-muted-foreground font-semibold">Dress Code:</span> <strong className="text-foreground">{activeVenue.dressCode}</strong></p>
                      <p className="flex justify-between"><span className="text-muted-foreground font-semibold">Valet:</span> <strong className="text-foreground">{activeVenue.valetInfo.type}</strong></p>
                      <p className="flex justify-between"><span className="text-muted-foreground font-semibold">Hours:</span> <strong className="text-foreground truncate max-w-[140px]">{activeVenue.hours}</strong></p>
                    </div>

                    {/* Accepted Deals */}
                    {activeVenue.discounts && activeVenue.discounts.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <BadgePercent className="w-3 h-3" /> Accepted Privilege Cards
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {activeVenue.discounts.map(d => (
                            <span key={d} className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-md">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <Link
                        to="/restaurants/$id"
                        params={{ id: activeVenue.slug }}
                        className="w-full bg-primary text-primary-foreground font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>View Full Profile & Digital Menu</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <a
                        href={activeVenue.bookingPlatform?.url || activeVenue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs py-2.5 rounded-xl border border-border transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Instant Reservation</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-sm font-bold text-foreground">Select a venue pin</p>
                  <p className="text-xs mt-1">Click on any pin on the map to see details.</p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
