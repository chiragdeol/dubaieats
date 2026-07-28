import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { type Restaurant } from "@/data/restaurants";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SponsoredDirectionsModal } from "@/components/sponsored-directions-modal";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { OwnerCta } from "@/components/owner-cta";
import { isCurrentlyOpenInDubai } from "@/lib/opening-hours";
import { DUBAI_DISTRICTS, DUBAI_ZONES } from "@/lib/dubai-districts";
import { parseIntent, matchRestaurants, hasGemini, callGemini, type ChatMessage } from "@/lib/restaurant-ai";
import { 
  Phone, 
  MapPin, 
  Globe, 
  Bookmark, 
  Star, 
  Search, 
  Share2,
  Calendar,
  Sparkles,
  UtensilsCrossed,
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
    <article className="bg-card border border-border/85 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left relative group">
      <div>
        {/* Card header image block */}
        <Link to="/restaurants/$id" params={{ id: r.slug || "" }} className="relative aspect-[16/10] w-full overflow-hidden shrink-0 bg-secondary block">
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
        </Link>

        <div className="p-5">
          {/* Title */}
          <h2 className="font-sans text-lg font-bold text-foreground leading-snug tracking-tight hover:text-primary transition-colors">
            <Link to="/restaurants/$id" params={{ id: r.slug || "" }}>
              {r.name}
            </Link>
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

  // Route states
  const [query, setQuery] = useState(search.q || "");
  const [selectedType, setSelectedType] = useState<string>(search.type || "All");
  const [selectedArea, setSelectedArea] = useState<string>(search.area || "All");
  const [selectedCuisine, setSelectedCuisine] = useState<string>(search.cuisine || "All");
  const [selectedVibe, setSelectedVibe] = useState<string>(search.vibe || "All");
  const [sortBy, setSortBy] = useState<string>("rating-desc");

  const [selectedDirectionsRestaurant, setSelectedDirectionsRestaurant] = useState<Restaurant | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  // ── AI Filter state ──
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiActiveIds, setAiActiveIds] = useState<string[] | null>(null); // null = AI not active
  const [aiReplyText, setAiReplyText] = useState("");
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runAiFilter = async (q: string) => {
    if (!q.trim()) { setAiActiveIds(null); setAiReplyText(""); return; }
    setAiLoading(true);
    try {
      if (hasGemini) {
        const history: ChatMessage[] = [{ role: "user", text: q }];
        const { matchedIds, reply } = await callGemini(history);
        setAiActiveIds(matchedIds.length > 0 ? matchedIds : []);
        setAiReplyText(reply.replace(/\*\*/g, "").split("\n")[0]);
      } else {
        const intent = parseIntent(q);
        const matched = matchRestaurants(intent, 25);
        setAiActiveIds(matched.map(r => r.slug || ""));
        const parts: string[] = [];
        if (intent.cuisines.length) parts.push(intent.cuisines.join(" & "));
        if (intent.districts.length) parts.push(`in ${intent.districts.join(", ")}`);
        if (intent.maxPrice) parts.push(`under AED ${intent.maxPrice}`);
        setAiReplyText(
          matched.length > 0
            ? `Showing ${matched.length} result${matched.length > 1 ? "s" : ""}${parts.length ? " for " + parts.join(" ") : ""}`
            : "No exact match — try a different query"
        );
      }
    } catch { setAiActiveIds(null); }
    finally { setAiLoading(false); }
  };

  const handleAiInput = (val: string) => {
    setAiQuery(val);
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    if (!val.trim()) { setAiActiveIds(null); setAiReplyText(""); return; }
    aiDebounceRef.current = setTimeout(() => runAiFilter(val), 650);
  };

  const clearAiFilter = () => { setAiQuery(""); setAiActiveIds(null); setAiReplyText(""); };

  // Districts — grouped by zone for dropdown
  const districtsByZone = useMemo(() => {
    return DUBAI_ZONES.map(zone => ({
      zone,
      districts: DUBAI_DISTRICTS.filter(d => d.zone === zone).map(d => d.name),
    }));
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

  const filteredAndSorted = useMemo(() => {
    // When AI filter is active, use its matched IDs as the base list
    let list = aiActiveIds !== null
      ? enrichedRestaurants.filter(r => aiActiveIds.includes(r.slug || ""))
      : (() => {
          const q = query.trim().toLowerCase();
          return enrichedRestaurants.filter((r) => {
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
            if (selectedArea !== "All" && r.district !== selectedArea) return false;
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
        })();

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
  }, [query, selectedType, selectedArea, selectedCuisine, selectedVibe, sortBy, aiActiveIds]);


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

        {/* Catalog Main Panel */}
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

          {/* ── AI Gemini Filter Bar ── */}
          <div
            className="rounded-3xl border p-5 mb-5 relative overflow-hidden transition-all"
            style={{
              background: aiActiveIds !== null
                ? "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(234,88,12,0.08) 60%, rgba(190,24,93,0.06) 100%)"
                : "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(234,88,12,0.04) 60%, rgba(190,24,93,0.03) 100%)",
              borderColor: aiActiveIds !== null ? "rgba(251,191,36,0.45)" : "rgba(251,191,36,0.18)",
              boxShadow: aiActiveIds !== null ? "0 0 0 3px rgba(251,191,36,0.08)" : undefined,
            }}
          >
            {/* Label row */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-lg leading-none">✨</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                AI Filter
              </span>
              {hasGemini ? (
                <span className="text-[10px] font-bold bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/25 px-2 py-0.5 rounded-full">
                  Gemini
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  Smart
                </span>
              )}
              {aiActiveIds !== null && (
                <button
                  onClick={clearAiFilter}
                  className="ml-auto flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors hover:border-primary/30"
                >
                  ✕ Clear AI filter
                </button>
              )}
            </div>

            {/* Input */}
            <div className="relative">
              <input
                value={aiQuery}
                onChange={e => handleAiInput(e.target.value)}
                placeholder={hasGemini
                  ? "Ask Gemini — e.g. \"Best sushi in Marina under AED 200 with alcohol\""
                  : "Describe what you want — e.g. \"Japanese food near JBR with a Burj view\""
                }
                className="w-full bg-background border rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none transition-all text-foreground placeholder:text-muted-foreground"
                style={{
                  borderColor: aiQuery ? "rgba(251,191,36,0.55)" : undefined,
                  boxShadow: aiQuery ? "0 0 0 3px rgba(251,191,36,0.1)" : undefined,
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
              {/* Loading dots */}
              {aiLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>

            {/* AI reply / result count badge */}
            {aiReplyText && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">🤖</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {aiReplyText}
                  {aiActiveIds !== null && aiActiveIds.length > 0 && (
                    <span className="ml-2 font-extrabold text-amber-600 dark:text-amber-400">
                      · {aiActiveIds.length} restaurant{aiActiveIds.length > 1 ? "s" : ""} found
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Hint chips */}
            {!aiQuery && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Sushi in Dubai Marina 🍣",
                  "Burj Khalifa view 🏙️",
                  "Lebanese under AED 100 💰",
                  "Michelin restaurants ⭐",
                  "Delivery near JVC 🛵",
                ].map(hint => (
                  <button
                    key={hint}
                    onClick={() => handleAiInput(hint)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-amber-400/20 text-amber-700 dark:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/40 transition-all"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top Level Horizontal Filters Bar */}
          <div className={`bg-card border border-border/80 p-5 rounded-3xl shadow-sm mb-8 space-y-4 transition-opacity duration-200 ${aiActiveIds !== null ? "opacity-35 pointer-events-none select-none" : "opacity-100"}`}>
            
            {/* Row 1: Search text input */}
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateFilter({ q: e.target.value || undefined });
                }}
                placeholder="Search by restaurant name, area or cuisine..."
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>

            {/* Row 2: Dropdown selectors */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              
              {/* 1. Eatery Type */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Eatery Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    updateFilter({ type: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Eatery Types</option>
                  <option value="restaurant">🍽️ Restaurants</option>
                  <option value="bar">🍸 Bars & Lounges</option>
                  <option value="cafe">☕ Cafes & Bakeries</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">District / Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    updateFilter({ area: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Dubai Districts</option>
                  {districtsByZone.map(({ zone, districts }) => (
                    <optgroup key={zone} label={`── ${zone}`}>
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* 3. Cuisine */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Cuisine</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => {
                    setSelectedCuisine(e.target.value);
                    updateFilter({ cuisine: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Cuisines</option>
                  {cuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* 4. Experience & Perks */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Vibe / Experience</label>
                <select
                  value={selectedVibe}
                  onChange={(e) => {
                    setSelectedVibe(e.target.value);
                    updateFilter({ vibe: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Vibes</option>
                  <option value="michelin">⭐ Michelin Guide</option>
                  <option value="Burj View">🏙️ Burj Khalifa View</option>
                  <option value="Beachfront">🏖️ Beachfront Dining</option>
                  <option value="AC Terrace">🪑 AC Terrace Seating</option>
                  <option value="Business Lunch">💼 Business Lunch</option>
                  <option value="Sunday Brunch">🥂 Sunday Brunch</option>
                  <option value="Kid Friendly">🍼 Kid Friendly</option>
                </select>
              </div>

              {/* 5. Sort options */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="rating-desc">Highest Rated</option>
                  <option value="reviews-desc">Most Reviewed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

            </div>

          </div>

          {/* Results Summary Counter */}
          <div className="text-left text-xs font-bold text-muted-foreground flex items-center justify-between mb-6">
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

          {/* Main Catalog Grid */}
          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-3xl">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-base font-bold text-foreground">No eateries found matching filters</p>
              <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or adjusting search keyword.</p>
            </div>
          ) : (
            /* Cards grid - spans full width */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((r) => (
                <GmbCard key={r.name} r={r} onOpenDirections={setSelectedDirectionsRestaurant} />
              ))}
            </div>
          )}

        </div>

      </div>

      <OwnerCta />

      <SiteFooter />
    </div>
  );
}
