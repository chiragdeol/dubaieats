import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { enrichedRestaurants, type EnrichedRestaurant, type PrivilegeCategory } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SponsoredDirectionsModal } from "@/components/sponsored-directions-modal";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { DepositModal } from "@/components/deposit-modal";
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
  MessageSquare,
  BadgePercent,
  ShieldCheck,
  Building2,
  TrendingUp,
  ExternalLink,
  Tag,
  Heart
} from "lucide-react";

type RestaurantsSearch = {
  type?: string;
  cuisine?: string;
  area?: string;
  vibe?: string;
  discount?: string;
  q?: string;
};

export const Route = createFileRoute("/restaurants")({
  validateSearch: (search: Record<string, unknown>): RestaurantsSearch => {
    return {
      type: (search.type as string) || undefined,
      cuisine: (search.cuisine as string) || undefined,
      area: (search.area as string) || undefined,
      vibe: (search.vibe as string) || undefined,
      discount: (search.discount as string) || undefined,
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

function GmbCard({
  r,
  onOpenDirections,
  onOpenDeposit
}: {
  r: EnrichedRestaurant;
  onOpenDirections: (r: EnrichedRestaurant) => void;
  onOpenDeposit: (r: EnrichedRestaurant) => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const liveStatus = isCurrentlyOpenInDubai(r.hours);

  const whatsappMessage = `Hi ${r.name}, I found your venue on Dubai Eat. I'd like to ask about table availability and current offers.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <article className="bg-white border border-[#EAEAEA] hover:border-[#D4AF37] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group text-left relative">
      
      {/* Left Image Section (TheFork style) */}
      <div className="relative w-full md:w-72 lg:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-[#F5F5F5]">
        <img
          src={r.image}
          alt={r.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {r.isSponsored && (
            <span className="bg-[#D4AF37] text-[#1A1A1A] font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm font-heading">
              [SPONSORED]
            </span>
          )}
          {r.michelin && (
            <span className="bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1 font-heading">
              <Star className="w-2.5 h-2.5 fill-[#D4AF37]" /> Michelin
            </span>
          )}
        </div>

        {/* Top Right Heart Favorite (TheFork Style translucent circle) */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          aria-label="Save to favorites"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 hover:scale-110 transition-all z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${bookmarked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white stroke-[2]"}`} />
        </button>

        {/* Bottom Carousel Indicator Dots (TheFork style) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-xs" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-xs" />
        </div>
      </div>

      {/* Right Content Section (TheFork Style Spacious Layout with Majestic Palate Tokens) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Top Information Block */}
        <div className="space-y-1.5">
          {/* Row 1: Name & Rating Box */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#1A1A1A] leading-snug group-hover:text-[#D4AF37] transition-colors">
              <Link to="/restaurants/$id" params={{ id: r.slug }}>
                {r.name}
              </Link>
            </h2>

            {/* Majestic Palate Rating Badge */}
            <div className="text-right shrink-0">
              <span className="inline-flex items-center justify-center bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-black text-sm sm:text-base px-2.5 py-1 rounded-lg font-heading">
                {(r.rating * 2).toFixed(1)}
              </span>
              <p className="text-[11px] text-[#757575] font-medium mt-0.5">
                ({r.reviews})
              </p>
            </div>
          </div>

          {/* Line 2: Address */}
          <p className="text-[#757575] text-xs sm:text-sm font-normal">
            {r.address || `${r.district}, Dubai`}
          </p>

          {/* Line 3: Cuisine & Average Price */}
          <p className="text-[#1A1A1A] text-xs sm:text-sm font-medium">
            {r.cuisine} · Average price AED {r.priceMin}
          </p>

          {/* Line 4: TheFork Summer / Privilege Tag Pill */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            {r.discounts && r.discounts.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 bg-[#FBF6E9] text-[#9C7D1A] border border-[#EFE2B9] font-bold text-xs px-3.5 py-1.5 rounded-full font-heading">
                <Tag className="w-3.5 h-3.5 fill-[#9C7D1A]" />
                <span>Up to -50% · {r.discounts[0]} Privilege</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#1A1A1A] border border-[#E5E5E5] font-bold text-xs px-3.5 py-1.5 rounded-full font-heading">
                <Tag className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                <span>Special Dining Offers Available</span>
              </span>
            )}

            {/* Perks */}
            {r.liquor === "Licensed" && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F5F5F5] text-[#1A1A1A] border border-[#E0E0E0] font-heading">
                🍷 Licensed Bar
              </span>
            )}
            {liveStatus.isOpen && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FBF6E9] text-[#9C7D1A] border border-[#EFE2B9] font-heading">
                ● Open Now
              </span>
            )}
          </div>
        </div>

        {/* Bottom Booking & Availability Row (Full size, no cutting) */}
        <div className="pt-2 border-t border-[#EAEAEA] space-y-2.5">
          <p className="text-xs text-[#757575] font-medium">
            Do you have <strong className="font-bold text-[#1A1A1A]">another time</strong> in mind?
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Find Availability Button (Outlined style) */}
            <Link
              to="/restaurants/$id"
              params={{ id: r.slug }}
              className="border border-[#1A1A1A] hover:bg-[#F5F5F5] text-[#1A1A1A] font-bold font-heading text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-2xs transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Find availability</span>
            </Link>

            {/* Direct Book Table Button (Primary #1A1A1A) */}
            <a
              href={r.bookingPlatform?.url || r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-2xs transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Book Table</span>
            </a>

            {/* VIP Deposit Modal Button (Gold #D4AF37) */}
            <button
              onClick={() => onOpenDeposit(r)}
              className="bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-bold font-heading text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>VIP Deposit</span>
            </button>

            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#E0E0E0] hover:border-[#1A1A1A] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#1A1A1A] font-bold font-heading text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Call */}
            <a
              href={callUrl(r.phone)}
              className="text-[#757575] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] px-3 py-2.5 rounded-xl text-xs font-bold font-heading transition-colors inline-flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
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
  const [selectedDiscount, setSelectedDiscount] = useState<string>(search.discount || "All");
  const [sortBy, setSortBy] = useState<string>("rating-desc");

  const [selectedDirectionsRestaurant, setSelectedDirectionsRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [selectedDepositRestaurant, setSelectedDepositRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  // ── AI Filter state ──
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiActiveIds, setAiActiveIds] = useState<string[] | null>(null);
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

  // Organic unbiased filtering logic
  const filteredAndSorted = useMemo(() => {
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

            if (selectedType !== "All" && r.eateryType !== selectedType) return false;
            if (selectedArea !== "All" && r.district !== selectedArea) return false;
            if (selectedCuisine !== "All" && r.cuisine !== selectedCuisine) return false;

            if (selectedDiscount !== "All" && (!r.discounts || !r.discounts.includes(selectedDiscount as any))) {
              return false;
            }

            if (selectedVibe !== "All") {
              if (selectedVibe === "michelin" && !r.michelin) return false;
              if (selectedVibe === "Burj View" && !r.seatingPerks?.includes("Burj View")) return false;
              if (selectedVibe === "Beachfront" && !r.seatingPerks?.includes("Beachfront")) return false;
              if (selectedVibe === "AC Terrace" && !r.seatingPerks?.includes("AC Terrace")) return false;
              if (selectedVibe === "Business Lunch" && !r.occasions?.includes("Business Lunch")) return false;
              if (selectedVibe === "Sunday Brunch" && (!r.lifestyleTags?.includes("Sunday Brunch") && !r.occasions?.includes("Sunday Brunch"))) return false;
              if (selectedVibe === "Ladies Night" && !r.lifestyleTags?.includes("Ladies Night")) return false;
              if (selectedVibe === "Shisha" && !r.lifestyleTags?.includes("Shisha")) return false;
              if (selectedVibe === "Pool Pass" && !r.lifestyleTags?.includes("Pool Pass")) return false;
              if (selectedVibe === "Ramadan Special" && !r.lifestyleTags?.includes("Ramadan Special")) return false;
              if (selectedVibe === "Kid Friendly" && !r.occasions?.includes("Kid Friendly")) return false;
            }
            return true;
          });
        })();

    // Pure organic sorting (100% unbiased)
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
  }, [query, selectedType, selectedArea, selectedCuisine, selectedVibe, selectedDiscount, sortBy, aiActiveIds]);

  // Separate Sponsored items for transparent Google-style ad placement
  const sponsoredVenues = useMemo(() => {
    return enrichedRestaurants.filter(r => r.isSponsored).slice(0, 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between">
      <div>
        <SiteHeader />

        <SponsoredDirectionsModal
          targetRestaurant={selectedDirectionsRestaurant}
          onClose={() => setSelectedDirectionsRestaurant(null)}
        />

        <DepositModal
          restaurant={selectedDepositRestaurant}
          isOpen={!!selectedDepositRestaurant}
          onClose={() => setSelectedDepositRestaurant(null)}
        />

        <DubaiItRandomizerModal
          isOpen={isRandomizerOpen}
          onClose={() => setIsRandomizerOpen(false)}
        />

        {/* Catalog Main Panel */}
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
          
          {/* Header Title Section */}
          <div className="mb-6 border-b border-[#E0E0E0] pb-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#757575] font-heading">
              <Link to="/" className="text-[#1A1A1A] font-bold hover:text-[#D4AF37]">Home</Link>
              <span>›</span>
              <span>Eat & Drink</span>
              <span>›</span>
              <span>All Dubai Restaurants</span>
            </div>
            <p className="mp-eyebrow mb-1">MAJESTIC PALATE · OFFICIAL GUIDE</p>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#1A1A1A]">The Best Restaurants in Dubai</h1>
              <span className="text-xs font-bold text-[#757575] font-heading">({filteredAndSorted.length} verified venues)</span>
            </div>
          </div>

          {/* ── AI Gemini Filter Bar ── */}
          <div
            className="rounded-xl border border-[#b9d6cb] bg-[#e8f1ef] p-4 mb-5 relative overflow-hidden transition-all"
            style={{
              background: aiActiveIds !== null
                ? "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(234,88,12,0.08) 60%, rgba(190,24,93,0.06) 100%)"
                : "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(234,88,12,0.04) 60%, rgba(190,24,93,0.03) 100%)",
              borderColor: aiActiveIds !== null ? "rgba(251,191,36,0.45)" : "rgba(251,191,36,0.18)",
              boxShadow: aiActiveIds !== null ? "0 0 0 3px rgba(251,191,36,0.08)" : undefined,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-lg leading-none">✨</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                AI Search & Natural Language Filter
              </span>
              {hasGemini ? (
                <span className="text-[10px] font-bold bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/25 px-2 py-0.5 rounded-full">
                  Gemini AI
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  Smart AI Engine
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

            <div className="relative">
              <input
                value={aiQuery}
                onChange={e => handleAiInput(e.target.value)}
                placeholder={hasGemini
                  ? "Ask Gemini — e.g. \"Best sushi in Marina under AED 200 accepting Esaad card\""
                  : "Describe what you want — e.g. \"Japanese food near JBR with a Burj view\""
                }
                className="w-full bg-background border rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none transition-all text-foreground placeholder:text-muted-foreground"
                style={{
                  borderColor: aiQuery ? "rgba(251,191,36,0.55)" : undefined,
                  boxShadow: aiQuery ? "0 0 0 3px rgba(251,191,36,0.1)" : undefined,
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
              {aiLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>

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
          </div>

          {/* Top Level Horizontal Filters Bar */}
          <div className={`bg-white border border-[#dce2e2] p-4 rounded-xl shadow-sm mb-8 space-y-4 transition-opacity duration-200 ${aiActiveIds !== null ? "opacity-35 pointer-events-none select-none" : "opacity-100"}`}>
            
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              
              {/* 1. Scope & Eatery Type */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Eatery Scope</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    updateFilter({ type: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Venue Types</option>
                  <option value="restaurant">🍽️ Restaurants</option>
                  <option value="cafe">☕ Cafes & Bakeries</option>
                  <option value="bar">🍸 Bars & Lounges</option>
                  <option value="nightclub">🕺 Nightclubs</option>
                  <option value="beach_club">🏖️ Beach Clubs</option>
                  <option value="private_chef">👨‍🍳 Private Chefs</option>
                  <option value="caterer">🍱 Caterers</option>
                  <option value="popup">🎪 Pop-ups</option>
                </select>
              </div>

              {/* 2. District */}
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

              {/* 4. Discounts & Privileges Filter */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 px-1 flex items-center gap-1">
                  <BadgePercent className="w-3 h-3" /> Privileges / Card
                </label>
                <select
                  value={selectedDiscount}
                  onChange={(e) => {
                    setSelectedDiscount(e.target.value);
                    updateFilter({ discount: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Cards & Apps</option>
                  <optgroup label="── Government & Corporate">
                    <option value="Esaad">Esaad Card</option>
                    <option value="Fazaa">Fazaa Card</option>
                    <option value="Emirates Platinum">Emirates Platinum</option>
                  </optgroup>
                  <optgroup label="── Subscriptions & Apps">
                    <option value="The Entertainer">The Entertainer</option>
                    <option value="Supper Club">Supper Club</option>
                    <option value="BOGO (Buy 1 Get 1)">Buy One Get One (BOGO)</option>
                  </optgroup>
                  <optgroup label="── Bank Credit Cards">
                    <option value="Emirates NBD">Emirates NBD</option>
                    <option value="HSBC">HSBC Deals</option>
                    <option value="FAB">FAB Cards</option>
                    <option value="Mashreq">Mashreq Privilege</option>
                  </optgroup>
                  <optgroup label="── VIP Concierge">
                    <option value="Concierge VIP">Concierge VIP Perks</option>
                  </optgroup>
                </select>
              </div>

              {/* 5. Lifestyle & Experience */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Lifestyle & Tags</label>
                <select
                  value={selectedVibe}
                  onChange={(e) => {
                    setSelectedVibe(e.target.value);
                    updateFilter({ vibe: e.target.value === "All" ? undefined : e.target.value });
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Lifestyles</option>
                  <option value="michelin">⭐ Michelin Guide</option>
                  <option value="Sunday Brunch">🥂 Sunday Brunch</option>
                  <option value="Ladies Night">💃 Ladies Night</option>
                  <option value="Shisha">💨 Shisha Lounge</option>
                  <option value="Pool Pass">🏊 Pool Pass</option>
                  <option value="Ramadan Special">🌙 Ramadan Special</option>
                  <option value="Burj View">🏙️ Burj Khalifa View</option>
                  <option value="Beachfront">🏖️ Beachfront</option>
                  <option value="AC Terrace">🪑 AC Terrace</option>
                </select>
              </div>

              {/* 6. Sort options */}
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 px-1">Sort (Unbiased)</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="rating-desc">Highest Rated (Organic)</option>
                  <option value="reviews-desc">Most Reviewed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

            </div>

          </div>

          {/* Results Summary Counter */}
          <div className="text-left text-xs font-bold text-muted-foreground flex items-center justify-between mb-6">
            <span>Showing {filteredAndSorted.length} matching eateries (100% Unbiased Organic Ranking)</span>
            {(selectedType !== "All" || selectedArea !== "All" || selectedCuisine !== "All" || selectedVibe !== "All" || selectedDiscount !== "All" || query) && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedType("All");
                  setSelectedArea("All");
                  setSelectedCuisine("All");
                  setSelectedVibe("All");
                  setSelectedDiscount("All");
                  navigate({ to: "/restaurants" });
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Transparent Google-Style Sponsored Ad Slot */}
          {sponsoredVenues.length > 0 && !query && selectedDiscount === "All" && (
            <div className="mb-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 rounded-3xl p-5 text-left relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  [SPONSORED AD]
                </span>
                <span className="text-xs font-bold text-muted-foreground">Transparent Ad Placement · Separated from Organic Rankings</span>
              </div>
              {sponsoredVenues.map(s => (
                <div key={s.slug} className="flex flex-col sm:flex-row items-center gap-4 bg-card/80 backdrop-blur-xs p-4 rounded-2xl border border-border">
                  <img src={s.image} alt={s.name} className="w-full sm:w-32 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-extrabold text-base text-foreground">{s.name}</h4>
                    <p className="text-xs text-muted-foreground">{s.cuisine} · {s.district} · AED {s.priceMin}–{s.priceMax}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">✨ {s.sponsoredBannerText}</p>
                  </div>
                  <Link
                    to="/restaurants/$id"
                    params={{ id: s.slug }}
                    className="bg-amber-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-600 transition-colors shrink-0"
                  >
                    View Sponsored Venue
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Main Catalog Grid */}
          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-3xl">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-base font-bold text-foreground">No eateries found matching filters</p>
              <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or adjusting search keyword.</p>
            </div>
          ) : (
            /* Cards grid - 3 cards per row */
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)]">
              <div className="space-y-3">
                {filteredAndSorted.map((r) => (
                  <GmbCard
                    key={r.name}
                    r={r}
                    onOpenDirections={setSelectedDirectionsRestaurant}
                    onOpenDeposit={setSelectedDepositRestaurant}
                  />
                ))}
              </div>
              <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-[#dce2e2] bg-[#e8f1ef] shadow-sm lg:block">
                <iframe
                  title="Dubai restaurant map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=55.094%2C25.065%2C55.32%2C25.3&layer=mapnik"
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </aside>
            </div>
          )}

          <div className="mt-16">
            <OwnerCta />
          </div>

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
