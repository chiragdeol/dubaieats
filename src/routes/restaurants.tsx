import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  MessageSquare,
  SlidersHorizontal,
  X,
  ChevronDown
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

function getSecondImage(name: string): string {
  const foodImages = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return foodImages[hash % foodImages.length];
}

function GmbCard({ r, onOpenDirections }: { r: Restaurant; onOpenDirections: (r: Restaurant) => void }) {
  const secondaryImg = getSecondImage(r.name);
  const liveStatus = isCurrentlyOpenInDubai(r.hours);
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
    <article className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left relative group">
      <div>
        {/* Card header image block */}
        <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0 bg-secondary">
          <img 
            src={r.image} 
            alt={r.name} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {r.michelin && (
              <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                ★ Michelin
              </span>
            )}
            {r.barType && (
              <span className="bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                🍸 Bar/Vibe
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 text-white text-xs font-bold drop-shadow-md">
            AED {r.priceMin}–{r.priceMax}
          </div>
        </div>

        <div className="p-5">
          {/* Title */}
          <h2 className="font-sans text-lg font-bold text-foreground leading-snug tracking-tight">
            {r.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <span className="font-bold text-foreground text-sm">{(r.rating * 2).toFixed(1)}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(r.rating) ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-zinc-700"}`} 
                />
              ))}
            </div>
            <a 
              href={shareUrl(r.name)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-bold hover:underline"
            >
              ({r.reviews} reviews)
            </a>
          </div>

          {/* Logistics & Area */}
          <p className="text-xs text-muted-foreground mt-1">
            {r.cuisine} · {r.area}
          </p>

          {/* Hours line */}
          <div className="mt-2 text-xs flex items-center gap-1.5">
            {liveStatus.isOpen ? (
              <span className="text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">Open Now</span>
            ) : (
              <span className="text-rose-600 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded-sm">Closed</span>
            )}
            <span className="text-muted-foreground font-medium">{r.hours}</span>
          </div>

          {/* Perks Tags list */}
          <div className="flex flex-wrap gap-1 mt-3.5">
            {r.liquor === "Licensed" && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/15">
                🍷 Licensed
              </span>
            )}
            {r.seatingPerks?.map((perk) => (
              <span key={perk} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/15">
                {perk === "Burj View" ? "🏙️" : perk === "Beachfront" ? "🏖️" : "🪑"} {perk}
              </span>
            ))}
            {r.logistics?.includes("Complimentary Valet") && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/15">
                🚗 Free Valet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Button controls */}
      <div className="px-5 pb-5 shrink-0 border-t border-border/50 pt-4 space-y-2.5 bg-secondary/10">
        
        {/* Primary Booking buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a 
            href={r.bookingPlatform?.url || r.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl py-2 flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs transition-all text-center"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book Table</span>
          </a>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl py-2 flex items-center justify-center gap-1 text-xs font-bold transition-all text-center"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-500 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Quick action icons */}
        <div className="flex justify-between items-center px-1 pt-1.5 border-t border-border/30">
          <a href={callUrl(r.phone)} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <Phone className="w-3.5 h-3.5 text-primary" /> Call
          </a>
          <button onClick={() => onOpenDirections(r)} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Map
          </button>
          <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <Globe className="w-3.5 h-3.5 text-primary" /> Site
          </a>
          <button onClick={handleShare} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <Share2 className="w-3.5 h-3.5 text-primary" /> Share
          </button>
        </div>

      </div>
    </article>
  );
}

function Index() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  // Route state
  const [query, setQuery] = useState(search.q || "");
  const [selectedType, setSelectedType] = useState<string>(search.type || "All");
  const [selectedArea, setSelectedArea] = useState<string>(search.area || "All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>(search.cuisine || "All");
  const [selectedVibe, setSelectedVibe] = useState<string>(search.vibe || "All");
  const [sortBy, setSortBy] = useState<string>("rating-desc");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const [selectedDirectionsRestaurant, setSelectedDirectionsRestaurant] = useState<Restaurant | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  // Dynamic filter lists
  const areas = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach((r) => set.add(r.area));
    return Array.from(set).sort();
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach((r) => set.add(r.cuisine));
    return Array.from(set).sort();
  }, []);

  // Sync state helper to URL params
  const updateFilter = (params: Partial<RestaurantsSearch>) => {
    navigate({
      to: "/restaurants",
      search: (prev) => ({
        ...prev,
        ...params
      })
    });
  };

  // Dynamic counts for left sidebar
  const counts = useMemo(() => {
    const areaCounts: Record<string, number> = {};
    const cuisineCounts: Record<string, number> = {};
    const typeCounts = { restaurant: 0, bar: 0, cafe: 0 };
    let michelinCount = 0;

    enrichedRestaurants.forEach((r) => {
      areaCounts[r.area] = (areaCounts[r.area] || 0) + 1;
      cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
      if (r.eateryType) typeCounts[r.eateryType]++;
      if (r.michelin) michelinCount++;
    });

    return { areaCounts, cuisineCounts, typeCounts, michelinCount };
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Filter
    let list = enrichedRestaurants.filter((r) => {
      if (
        q &&
        !(
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q)
        )
      )
        return false;

      if (selectedType !== "All" && r.eateryType !== selectedType.toLowerCase()) return false;
      if (selectedArea !== "All" && r.area !== selectedArea) return false;
      if (selectedCuisine !== "All" && r.cuisine !== selectedCuisine) return false;

      if (selectedVibe !== "All") {
        if (selectedVibe === "michelin" && !r.michelin) return false;
        if (selectedVibe === "Burj View" && !r.seatingPerks?.includes("Burj View")) return false;
        if (selectedVibe === "Beachfront" && !r.seatingPerks?.includes("Beachfront")) return false;
        if (selectedVibe === "AC Terrace" && !r.seatingPerks?.includes("AC Terrace")) return false;
        if (selectedVibe === "Business Lunch" && !r.occasions?.includes("Business Lunch")) return false;
        if (selectedVibe === "Sunday Brunch" && !r.occasions?.includes("Sunday Brunch")) return false;
        if (selectedVibe === "Kid Friendly" && !r.occasions?.includes("Kid Friendly")) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "rating-desc") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews-desc") {
      const getReviewsNum = (val: string) => parseInt(val.replace(/,/g, ""), 10) || 0;
      list.sort((a, b) => getReviewsNum(b.reviews) - getReviewsNum(a.reviews));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.priceMin - b.priceMin);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.priceMin - a.priceMin);
    }

    return list;
  }, [query, selectedType, selectedArea, selectedCuisine, selectedVibe, sortBy]);

  const SidebarContent = () => (
    <div className="space-y-7 text-left">
      {/* Category: Eatery Type */}
      <div>
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-foreground mb-3 pb-1 border-b border-border">
          Eatery Type
        </h3>
        <ul className="space-y-1.5 text-xs font-semibold">
          {[
            { id: "All", label: "All types", count: enrichedRestaurants.length },
            { id: "restaurant", label: "🍽️ Restaurants", count: counts.typeCounts.restaurant },
            { id: "bar", label: "🍸 Bars & Lounges", count: counts.typeCounts.bar },
            { id: "cafe", label: "☕ Cafes & Bakeries", count: counts.typeCounts.cafe },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setSelectedType(item.id);
                  updateFilter({ type: item.id === "All" ? undefined : item.id });
                }}
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedType === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-70">({item.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Category: Areas */}
      <div>
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-foreground mb-3 pb-1 border-b border-border">
          Neighborhoods
        </h3>
        <ul className="space-y-1.5 text-xs font-semibold max-h-48 overflow-y-auto pr-1 gmb-sidebar">
          <li>
            <button
              onClick={() => {
                setSelectedArea("All");
                updateFilter({ area: undefined });
              }}
              className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedArea === "All" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span>All Neighborhoods</span>
              <span className="text-[10px] opacity-70">({enrichedRestaurants.length})</span>
            </button>
          </li>
          {areas.map((a) => (
            <li key={a}>
              <button
                onClick={() => {
                  setSelectedArea(a);
                  updateFilter({ area: a });
                }}
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedArea === a ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>{a}</span>
                <span className="text-[10px] opacity-70">({counts.areaCounts[a] || 0})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Category: Cuisines */}
      <div>
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-foreground mb-3 pb-1 border-b border-border">
          Cuisines
        </h3>
        <ul className="space-y-1.5 text-xs font-semibold max-h-48 overflow-y-auto pr-1 gmb-sidebar">
          <li>
            <button
              onClick={() => {
                setSelectedCuisine("All");
                updateFilter({ cuisine: undefined });
              }}
              className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedCuisine === "All" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span>All Cuisines</span>
              <span className="text-[10px] opacity-70">({enrichedRestaurants.length})</span>
            </button>
          </li>
          {cuisines.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setSelectedCuisine(c);
                  updateFilter({ cuisine: c });
                }}
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedCuisine === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>{c}</span>
                <span className="text-[10px] opacity-70">({counts.cuisineCounts[c] || 0})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Category: Experiences & Vibes */}
      <div>
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-foreground mb-3 pb-1 border-b border-border">
          Vibes & Experiences
        </h3>
        <ul className="space-y-1.5 text-xs font-semibold">
          {[
            { id: "All", label: "All Experiences" },
            { id: "michelin", label: "⭐ Michelin Guide" },
            { id: "Burj View", label: "🏙️ Burj Khalifa View" },
            { id: "Beachfront", label: "🏖️ Beachfront Dining" },
            { id: "AC Terrace", label: "🪑 AC Terrace Seating" },
            { id: "Business Lunch", label: "💼 Business Lunch" },
            { id: "Sunday Brunch", label: "🥂 Sunday Brunch" },
            { id: "Kid Friendly", label: "🍼 Kid Friendly" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setSelectedVibe(item.id);
                  updateFilter({ vibe: item.id === "All" ? undefined : item.id });
                }}
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-secondary/40 transition-colors ${selectedVibe === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

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

        {/* Outer Grid Panel */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Header Title Section */}
          <div className="border-b border-border/60 pb-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-left">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Food cravings? Let's Dubai-it.
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
                Eateries & Dining in Dubai
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Discover verified menus, licensed status, valet, and live reservation platforms.
              </p>
            </div>
            
            <button
              onClick={() => setIsRandomizerOpen(true)}
              className="bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-full hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5 self-start"
            >
              <Sparkles className="w-4 h-4 fill-white" /> Let’s Dubai-it Randomizer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* 1. Left Sidebar - Desktop only */}
            <aside className="hidden lg:block lg:col-span-3 border-r border-border/60 pr-8 h-fit sticky top-24">
              <SidebarContent />
            </aside>

            {/* 2. Main Content catalog Grid */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* Toolbar: Query Search & Sort controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/70">
                <div className="relative flex-1">
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      updateFilter({ q: e.target.value || undefined });
                    }}
                    placeholder="Search by restaurant name, area or cuisine..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {/* Mobile filter Toggle */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 border border-border bg-card px-3.5 py-2.5 rounded-xl text-xs font-bold text-foreground cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </button>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                    >
                      <option value="rating-desc">Highest Rated</option>
                      <option value="reviews-desc">Most Reviewed</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Count Summary */}
              <div className="text-left text-xs font-bold text-muted-foreground flex items-center justify-between">
                <span>Showing {filteredAndSorted.length} matching eateries</span>
                {(selectedType !== "All" || selectedArea !== "All" || selectedCuisine !== "All" || selectedVibe !== "All" || query) && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setSelectedType("All");
                      setSelectedArea("All");
                      setSelectedCuisine("All");
                      setSelectedVibe("All");
                      navigate({ to: "/restaurants" });
                    }}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>

              {/* Empty state */}
              {filteredAndSorted.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-3xl">
                  <UtensilsCrossed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-base font-bold text-foreground">No eateries found matching filters</p>
                  <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or adjusting search keyword.</p>
                </div>
              ) : (
                /* Cards grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSorted.map((r) => (
                    <GmbCard key={r.name} r={r} onOpenDirections={setSelectedDirectionsRestaurant} />
                  ))}
                </div>
              )}

            </main>

          </div>

        </div>

      </div>

      {/* 3. Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
          />
          
          {/* Drawer container */}
          <div className="relative w-80 max-w-[90vw] h-full bg-background border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-lg text-foreground">Filters</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <SidebarContent />
            </div>

            <div className="mt-8 border-t border-border pt-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-primary text-primary-foreground font-bold text-xs py-3 rounded-xl hover:opacity-95"
              >
                Apply Filters ({filteredAndSorted.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
