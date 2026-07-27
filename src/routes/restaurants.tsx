import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { type Restaurant } from "@/data/restaurants";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SponsoredDirectionsModal } from "@/components/sponsored-directions-modal";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { isCurrentlyOpenInDubai } from "@/lib/opening-hours";
import { 
  Phone, 
  MapPin, 
  Globe, 
  Bookmark, 
  Star, 
  Search, 
  Share2,
  Calendar,
  Info,
  UtensilsCrossed,
  Sparkles,
  Award,
  MessageSquare
} from "lucide-react";

type RestaurantsSearch = {
  type?: string;
  cuisine?: string;
  area?: string;
  vibe?: string;
  q?: string;
};

export const Route = createFileRoute("/restaurants")({
  validateSearch: (search: Record<string, unknown>): RestaurantsSearch => {
    return {
      type: (search.type as string) || undefined,
      cuisine: (search.cuisine as string) || undefined,
      area: (search.area as string) || undefined,
      vibe: (search.vibe as string) || undefined,
      q: (search.q as string) || undefined,
    };
  },
  component: Index,
});

function callUrl(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function shareUrl(name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Dubai")}`;
}

// User-friendly labels and emojis for Dubai Bar Types
const barTypeLabels: Record<string, string> = {
  "rooftop-skyline": "🏙️ Rooftop & Skyline Lounge",
  "beach-waterfront": "🏖️ Beach Club & Waterfront",
  "speakeasy": "🕵️ Speakeasy & Hidden Bar",
  "skypool": "🏊 Skypool & Infinity Pool Bar",
  "jazz-live-music": "🎷 Jazz & Live Music Bar",
  "dinner-show": "💃 Dinner Show & Cabaret",
  "hifi-listening": "📻 Hi-Fi & Vinyl Listening Bar",
  "activity-arcade": "👾 Activity & Arcade Bar",
  "karaoke": "🎤 Karaoke Room",
  "cocktail-mixology": "🍸 Cocktail & Mixology",
  "cigar-whisky": "🥃 Cigar & Whisky Lounge",
  "shisha-hookah": "💨 Shisha Lounge",
  "wine-tapas": "🍷 Wine & Tapas",
  "izakaya-sake": "🍶 Izakaya & Sake Bar",
  "sports-bar": "⚽ Sports Bar",
  "pubs": "🍺 British & Irish Pub",
  "gastropub": "🍽️ Gastropub",
  "hotel-lobby": "🛋️ Hotel Lounge"
};

// Helper to resolve secondary image deterministically for the GMB card split view
function getSecondImage(name: string): string {
  const foodImages = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", // pizza
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", // bowl
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500", // pancakes
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", // salad
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500", // burger
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500", // salad2
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500", // pasta
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500", // seafood
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500", // sushi
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500", // asian bowl
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return foodImages[hash % foodImages.length];
}

function GmbCard({ r, onOpenDirections }: { r: Restaurant; onOpenDirections: (r: Restaurant) => void }) {
  const secondaryImg = getSecondImage(r.name);
  const liveStatus = isCurrentlyOpenInDubai(r.hours);

  // Parse phone number for WhatsApp concierge link
  const cleanPhone = r.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi!%20I'd%20like%20to%20check%20table%20availability%20for%20${encodeURIComponent(r.name)}%20via%20Dubai-Eat.`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: r.name,
        text: `Check out ${r.name} in Dubai!`,
        url: r.website,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl(r.name));
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between text-left relative overflow-hidden">
      <div>
        {/* Michelin Badge */}
        {r.michelin && (
          <div className="mb-2">
            {r.michelin.includes("Star") ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {r.michelin} Michelin
              </span>
            ) : r.michelin === "Bib Gourmand" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 shadow-xs">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Bib Gourmand
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20 shadow-xs">
                <Award className="w-3.5 h-3.5" />
                Michelin Selected
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="font-sans text-xl font-bold text-foreground leading-tight tracking-tight">
          {r.name}
        </h2>

        {/* Rating and Info Line */}
        <div className="flex items-center flex-wrap gap-1 mt-1 text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{r.rating.toFixed(1)}</span>
          <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />
          <Info className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
          <a 
            href={shareUrl(r.name)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary font-semibold hover:underline"
          >
            ({r.reviews})
          </a>
          <span>·</span>
          <span>AED {r.priceMin}–{r.priceMax}</span>
          <span>·</span>
          <span className="truncate">{r.category}</span>
        </div>

        {/* Live Dubai Status Line */}
        <div className="mt-1 text-sm">
          {liveStatus.isOpen ? (
            <span className="text-emerald-600 font-medium">Open Now</span>
          ) : (
            <span className="text-rose-600 font-medium">Closed</span>
          )}
          <span className="text-muted-foreground font-light"> · {r.hours}</span>
        </div>

        {/* Dubai Criteria Logistics & Perks Badges */}
        <div className="flex flex-wrap gap-1 mt-3">
          {r.barType && barTypeLabels[r.barType] && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              {barTypeLabels[r.barType]}
            </span>
          )}
          {r.eateryType && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 capitalize">
              {r.eateryType === "restaurant" ? "🍽️ Restaurant" : r.eateryType === "bar" ? "🍸 Bar/Lounge" : "☕ Cafe"}
            </span>
          )}
          {r.liquor && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              r.liquor === "Licensed" 
                ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/55" 
                : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400"
            }`}>
              🍷 {r.liquor}
            </span>
          )}
          {r.seatingPerks?.map((perk) => (
            <span key={perk} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/55">
              {perk === "Burj View" ? "🏙️" : perk === "Beachfront" ? "🏖️" : "🪑"} {perk}
            </span>
          ))}
          {r.occasions?.includes("Kid Friendly") && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/55">
              🍼 Kid Friendly
            </span>
          )}
          {r.logistics?.map((item) => (
            <span key={item} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/55">
              {item === "Complimentary Valet" ? "🚗" : item === "Shisha Available" ? "💨" : "⚡"} {item}
            </span>
          ))}
        </div>

        {/* Split Images Area */}
        <div className="flex gap-1.5 mt-4 h-36 w-full rounded-2xl overflow-hidden shrink-0">
          <img 
            src={r.image} 
            alt={`${r.name} interior`} 
            className="w-[65%] h-full object-cover" 
          />
          <img 
            src={secondaryImg} 
            alt={`${r.name} cuisine`} 
            className="w-[35%] h-full object-cover" 
          />
        </div>

        {/* Delivery App Launchers Row */}
        {r.deliveryLinks && (
          <div className="mt-4 pt-3 border-t border-border/70">
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2">Instant Delivery Apps Menu</p>
            <div className="grid grid-cols-5 gap-1.5">
              <a
                href={r.deliveryLinks.deliveroo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#00cdbc]/10 border border-[#00cdbc]/30 hover:bg-[#00cdbc]/25 text-[#00cdbc] dark:text-[#00e3cf] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                title="Open in Deliveroo"
              >
                <span className="text-sm">🛵</span>
                <span className="text-[9px] font-bold">Deliveroo</span>
              </a>
              <a
                href={r.deliveryLinks.talabat}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ff5a00]/10 border border-[#ff5a00]/30 hover:bg-[#ff5a00]/25 text-[#ff5a00] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                title="Open in Talabat"
              >
                <span className="text-sm">🚚</span>
                <span className="text-[9px] font-bold">Talabat</span>
              </a>
              <a
                href={r.deliveryLinks.noon}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ffe816]/15 border border-[#ffe816]/40 hover:bg-[#ffe816]/30 text-yellow-700 dark:text-yellow-400 p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                title="Open in Noon Food"
              >
                <span className="text-sm">🟡</span>
                <span className="text-[9px] font-bold">Noon</span>
              </a>
              <a
                href={r.deliveryLinks.careem}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#47a13c]/10 border border-[#47a13c]/30 hover:bg-[#47a13c]/25 text-[#47a13c] dark:text-[#5ce74f] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                title="Open in Careem"
              >
                <span className="text-sm">🟢</span>
                <span className="text-[9px] font-bold">Careem</span>
              </a>
              <a
                href={r.deliveryLinks.keeta}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/25 text-sky-600 dark:text-sky-400 p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                title="Open in Keeta"
              >
                <span className="text-sm">⏺️</span>
                <span className="text-[9px] font-bold">Keeta</span>
              </a>
            </div>
          </div>
        )}

        {/* Action Circles */}
        <div className="flex justify-between items-center mt-5 px-1 shrink-0">
          <a 
            href={callUrl(r.phone)} 
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <span className="text-primary font-semibold text-[11px] tracking-wide">Call</span>
          </a>

          <button 
            onClick={() => onOpenDirections(r)} 
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <span className="text-primary font-semibold text-[11px] tracking-wide">Directions</span>
          </button>

          <a 
            href={r.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <span className="text-primary font-semibold text-[11px] tracking-wide">Website</span>
          </a>

          <button 
            onClick={handleShare}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <Share2 className="h-4.5 w-4.5" />
            </div>
            <span className="text-primary font-semibold text-[11px] tracking-wide">Share</span>
          </button>

          <button 
            onClick={() => alert(`Saved ${r.name} to list!`)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
              <Bookmark className="h-4.5 w-4.5" />
            </div>
            <span className="text-primary font-semibold text-[11px] tracking-wide">Save</span>
          </button>
        </div>
      </div>

      {/* Booking Row */}
      <div className="mt-5 pt-3 border-t border-border/70 space-y-2 shrink-0">
        <a 
          href={r.bookingPlatform?.url || r.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition-all"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Reserve via {r.bookingPlatform?.name || "Website"}</span>
        </a>

        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold transition-all"
        >
          <MessageSquare className="h-3.5 w-3.5 text-emerald-500 fill-current" />
          <span>💬 WhatsApp Concierge</span>
        </a>
      </div>
    </article>
  );
}

function Index() {
  const search = Route.useSearch();

  const [query, setQuery] = useState(search.q || "");
  const [cuisine, setCuisine] = useState<string>(search.cuisine || "All");
  const [priceBand, setPriceBand] = useState<string>("All");
  const [michelinFilter, setMichelinFilter] = useState<string>(search.vibe === "michelin" ? "Any Michelin" : "All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Dubai Specific Logistics & perks filters
  const [liquorFilter, setLiquorFilter] = useState<string>("All");
  const [perkFilter, setPerkFilter] = useState<string>(
    search.vibe === "Burj View" || search.vibe === "Beachfront" || search.vibe === "AC Terrace" 
      ? search.vibe 
      : "All"
  );
  const [occasionFilter, setOccasionFilter] = useState<string>(
    search.vibe === "Kid Friendly" || search.vibe === "Business Lunch" || search.vibe === "Sunday Brunch" || search.vibe === "Late Night"
      ? search.vibe
      : "All"
  );
  const [logisticsFilter, setLogisticsFilter] = useState<string>("All");
  const [barTypeFilter, setBarTypeFilter] = useState<string>("All");
  const [eateryTypeFilter, setEateryTypeFilter] = useState<string>(search.type || "All");
  const [areaFilter, setAreaFilter] = useState<string>(search.area || "All");
  
  const [selectedDirectionsRestaurant, setSelectedDirectionsRestaurant] = useState<Restaurant | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach((r) => set.add(r.cuisine));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const areas = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach((r) => set.add(r.area));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrichedRestaurants.filter((r) => {
      if (
        q &&
        !(
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q)
        )
      )
        return false;
      if (cuisine !== "All" && r.cuisine !== cuisine) return false;
      
      const symbol = r.priceMin < 100 ? "AED" : r.priceMin < 250 ? "AED AED" : r.priceMin < 400 ? "AED AED AED" : "AED AED AED AED";
      if (priceBand !== "All" && symbol !== priceBand) return false;
      
      if (michelinFilter === "Starred" && (!r.michelin || !r.michelin.includes("Star"))) return false;
      if (michelinFilter === "Bib Gourmand" && r.michelin !== "Bib Gourmand") return false;
      if (michelinFilter === "Selected" && r.michelin !== "Michelin Selected") return false;
      if (michelinFilter === "Any Michelin" && !r.michelin) return false;

      // Dubai Criteria Filters
      if (liquorFilter !== "All" && r.liquor !== liquorFilter) return false;
      if (perkFilter !== "All" && !r.seatingPerks?.includes(perkFilter)) return false;
      if (occasionFilter !== "All" && !r.occasions?.includes(occasionFilter)) return false;
      if (logisticsFilter !== "All" && !r.logistics?.includes(logisticsFilter)) return false;
      if (barTypeFilter !== "All" && r.barType !== barTypeFilter) return false;
      if (eateryTypeFilter !== "All" && r.eateryType !== eateryTypeFilter.toLowerCase()) return false;
      if (areaFilter !== "All" && r.area !== areaFilter) return false;

      if (statusFilter === "Open") {
        const live = isCurrentlyOpenInDubai(r.hours);
        if (!live.isOpen) return false;
      }
      return true;
    });
  }, [query, cuisine, priceBand, michelinFilter, statusFilter, liquorFilter, perkFilter, occasionFilter, logisticsFilter, barTypeFilter, eateryTypeFilter, areaFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />

        <SponsoredDirectionsModal
          targetRestaurant={selectedDirectionsRestaurant}
          onClose={() => setSelectedDirectionsRestaurant(null)}
        />

        <DubaiItRandomizerModal
          isOpen={isRandomizerOpen}
          onClose={() => setIsRandomizerOpen(false)}
        />

        {/* Page Title & Search Section */}
        <section className="bg-secondary/20 border-b border-border py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" /> Food cravings? Let’s Dubai-it at Dubai-Eat
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Dubai Eateries Directory</h1>
              <p className="text-muted-foreground mt-1">Explore 50 top-rated Dubai restaurant directories styled as GMB profiles</p>
            </div>
            
            {/* Search Input & Randomizer */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
              <div className="relative w-full sm:w-72">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurant, area, cuisine..."
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
              <button
                onClick={() => setIsRandomizerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-amber-600 transition-colors shrink-0"
              >
                <Sparkles className="w-4 h-4" /> Can't Decide? Let’s Dubai-it!
              </button>
            </div>
          </div>
        </section>

        {/* Filters Toolbar */}
        <div className="border-b border-border bg-background/95 backdrop-blur-md sticky top-16 z-20 shadow-sm py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2.5 items-center">
            
            {/* Eatery Type Filter */}
            <select
              value={eateryTypeFilter}
              onChange={(e) => setEateryTypeFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All types</option>
              <option value="restaurant">🍽️ Restaurants</option>
              <option value="bar">🍸 Bars & Nightlife</option>
              <option value="cafe">☕ Cafes & Bakeries</option>
            </select>

            {/* Area Filter */}
            <select 
              value={areaFilter} 
              onChange={(e) => setAreaFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              {areas.map((a) => (
                <option key={a} value={a}>{a === "All" ? "All neighborhoods" : a}</option>
              ))}
            </select>

            {/* Cuisine Select */}
            <select 
              value={cuisine} 
              onChange={(e) => setCuisine(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All cuisines" : c}</option>
              ))}
            </select>

            {/* Price Select */}
            <select 
              value={priceBand} 
              onChange={(e) => setPriceBand(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All prices</option>
              <option value="AED">AED (Budget)</option>
              <option value="AED AED">AED AED (Casual)</option>
              <option value="AED AED AED">AED AED AED (Upscale)</option>
              <option value="AED AED AED AED">AED AED AED AED (Fine Dining)</option>
            </select>

            {/* Michelin Select */}
            <select 
              value={michelinFilter} 
              onChange={(e) => setMichelinFilter(e.target.value)}
              className="rounded-full border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-955 dark:text-amber-200 px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer font-semibold"
            >
              <option value="All">All Michelin & Guide</option>
              <option value="Any Michelin">⭐ Michelin Guide Venues</option>
              <option value="Starred">⭐ Michelin Starred Only</option>
              <option value="Bib Gourmand">🍽️ Bib Gourmand Only</option>
              <option value="Selected">✨ Michelin Selected Only</option>
            </select>

            {/* Grouped Bar Type Select Menu */}
            <select 
              value={barTypeFilter} 
              onChange={(e) => setBarTypeFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground font-semibold"
            >
              <option value="All">All Bar Vibes</option>
              
              <optgroup label="Vibe & View">
                <option value="rooftop-skyline">Rooftop & Skyline Lounges</option>
                <option value="beach-waterfront">Beach Clubs & Waterfront Bars</option>
                <option value="speakeasy">Speakeasies & Hidden Bars</option>
                <option value="skypool">Skypool & Infinity Pool Bars</option>
              </optgroup>

              <optgroup label="Entertainment & Music">
                <option value="jazz-live-music">Jazz & Live Music Bars</option>
                <option value="dinner-show">Dinner Show & Cabaret</option>
                <option value="hifi-listening">Hi-Fi & Vinyl Listening Bars</option>
                <option value="activity-arcade">Activity & Arcade Bars</option>
                <option value="karaoke">Karaoke & Private Rooms</option>
              </optgroup>

              <optgroup label="Specialty & Craft">
                <option value="cocktail-mixology">Cocktail & Craft Mixology</option>
                <option value="cigar-whisky">Cigar & Whisky Lounges</option>
                <option value="shisha-hookah">Shisha & Hookah Lounges</option>
                <option value="wine-tapas">Wine & Tapas Bars</option>
                <option value="izakaya-sake">Izakaya & Sake Bars</option>
              </optgroup>

              <optgroup label="Casual & Classic">
                <option value="sports-bar">Sports Bars</option>
                <option value="pubs">British & Irish Pubs</option>
                <option value="gastropub">Gastropubs</option>
                <option value="hotel-lobby">Hotel & Lobby Lounges</option>
              </optgroup>
            </select>

            {/* Liquor License Status Filter */}
            <select
              value={liquorFilter}
              onChange={(e) => setLiquorFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All Liquor Status</option>
              <option value="Licensed">🍷 Licensed</option>
              <option value="Non-Licensed">🥤 Non-Licensed</option>
            </select>

            {/* Seating Perks Filter */}
            <select
              value={perkFilter}
              onChange={(e) => setPerkFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All Seating Perks</option>
              <option value="AC Terrace">🪑 AC Terrace</option>
              <option value="Burj View">🏙️ Burj View</option>
              <option value="Beachfront">🏖️ Beachfront</option>
            </select>

            {/* Occasions / Kids Friendly Filter */}
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All Occasions</option>
              <option value="Business Lunch">💼 Business Lunch</option>
              <option value="Sunday Brunch">🥂 Sunday Brunch</option>
              <option value="Late Night">🌌 Late Night</option>
              <option value="Kid Friendly">🍼 Kid Friendly</option>
            </select>

            {/* Logistics Filter */}
            <select
              value={logisticsFilter}
              onChange={(e) => setLogisticsFilter(e.target.value)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-foreground"
            >
              <option value="All">All Logistics</option>
              <option value="Complimentary Valet">🚗 Complimentary Valet</option>
              <option value="EV Charging">⚡ EV Charging</option>
              <option value="Shisha Available">💨 Shisha Available</option>
            </select>

            {/* Open Now Button */}
            <button
              onClick={() => setStatusFilter(statusFilter === "Open" ? "All" : "Open")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all ${
                statusFilter === "Open" 
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700" 
                  : "border-border bg-card text-foreground hover:bg-secondary/40"
              }`}
            >
              Open Now in Dubai
            </button>

            {/* Reset Button */}
            {(query || cuisine !== "All" || priceBand !== "All" || michelinFilter !== "All" || statusFilter !== "All" || liquorFilter !== "All" || perkFilter !== "All" || occasionFilter !== "All" || logisticsFilter !== "All" || barTypeFilter !== "All" || eateryTypeFilter !== "All" || areaFilter !== "All") && (
              <button 
                onClick={() => { 
                  setQuery(""); 
                  setCuisine("All"); 
                  setPriceBand("All"); 
                  setMichelinFilter("All"); 
                  setStatusFilter("All"); 
                  setLiquorFilter("All");
                  setPerkFilter("All");
                  setOccasionFilter("All");
                  setLogisticsFilter("All");
                  setBarTypeFilter("All");
                  setEateryTypeFilter("All");
                  setAreaFilter("All");
                }}
                className="text-xs font-semibold text-primary hover:underline ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Directory Cards Grid */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-semibold">No eateries match your search</p>
              <button 
                onClick={() => { 
                  setQuery(""); 
                  setCuisine("All"); 
                  setPriceBand("All"); 
                  setMichelinFilter("All"); 
                  setStatusFilter("All"); 
                  setLiquorFilter("All");
                  setPerkFilter("All");
                  setOccasionFilter("All");
                  setLogisticsFilter("All");
                  setBarTypeFilter("All");
                  setEateryTypeFilter("All");
                  setAreaFilter("All");
                }}
                className="text-sm text-primary underline mt-2 hover:opacity-85"
              >
                Reset filters and show all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((r) => (
                <GmbCard key={r.name} r={r} onOpenDirections={setSelectedDirectionsRestaurant} />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
