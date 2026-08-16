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
  ExternalLink
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

  const whatsappMessage = `Hi ${r.name}, I found your venue on Dubai Eats Explorer. I'd like to ask about table availability and current offers.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${r.name} - Dubai Eats Explorer`,
        text: `Check out ${r.name} in ${r.area} on Dubai Eats Explorer!`,
        url: window.location.origin + `/restaurants/${r.slug}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/restaurants/${r.slug}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article className="bg-white border border-[#dce2e2] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row justify-between group relative text-left">
      
      {/* Top Banner Image with badges */}
      <div className="lg:flex lg:min-w-0 lg:flex-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:h-auto lg:w-44 lg:shrink-0 lg:aspect-auto">
          <img
            src={r.image}
            alt={r.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-wrap gap-1">
              {r.isSponsored && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  [SPONSORED]
                </span>
              )}
              {r.michelin && (
                <span className="bg-rose-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-white" /> Michelin Guide
                </span>
              )}
              <span className="bg-black/60 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                AED {r.priceMin}–{r.priceMax}
              </span>
            </div>

            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </div>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <MapPin className="w-3 h-3 text-amber-400" /> {r.district}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 lg:min-w-0 lg:flex-1">
          <h2 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
            <Link to="/restaurants/$id" params={{ id: r.slug }}>
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

          {/* Accepted Privilege Cards */}
          {r.discounts && r.discounts.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {r.discounts.slice(0, 3).map((disc) => (
                <span key={disc} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  💳 {disc}
                </span>
              ))}
              {r.discounts.length > 3 && (
                <span className="text-[9px] font-bold text-muted-foreground">+{r.discounts.length - 3} more</span>
              )}
            </div>
          )}

          {/* Perks Tags list */}
          <div className="flex flex-wrap gap-1 mt-2">
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
          </div>
        </div>
      </div>

      {/* Button controls */}
      <div className="px-4 pb-4 shrink-0 border-t border-border/50 pt-3 space-y-2 bg-[#f4f8f6] lg:w-40 lg:border-l lg:border-t-0">
        
        {/* Primary Booking & VIP Deposit buttons */}
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

          <button
            onClick={() => onOpenDeposit(r)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 rounded-xl py-2 flex items-center justify-center gap-1 text-xs font-extrabold shadow-xs transition-all text-center"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>VIP Deposit</span>
          </button>
        </div>

        {/* Quick action icons */}
        <div className="flex justify-between items-center px-1 pt-1.5 border-t border-border/30">
          <a href={callUrl(r.phone)} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <Phone className="w-3.5 h-3.5 text-primary" /> Call
          </a>
          <button onClick={() => onOpenDirections(r)} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Map
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1 text-[10px] font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
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
    <div className="min-h-screen bg-[#f8f6f1] text-[#172d3d] flex flex-col justify-between">
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

        <div className="border-b border-[#dce2e2] bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center">
            <form onSubmit={(event) => { event.preventDefault(); updateFilter({ q: query || undefined }); }} className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-[#cfd9d8] bg-white">
              <label className="flex items-center gap-2 border-r border-[#dce2e2] px-4 py-2.5 text-sm font-semibold lg:w-64">
                <MapPin className="h-4 w-4 shrink-0 text-[#172d3d]" />
                <select value={selectedArea} onChange={(event) => { setSelectedArea(event.target.value); updateFilter({ area: event.target.value === "All" ? undefined : event.target.value }); }} className="w-full bg-transparent outline-none">
                  <option value="All">Dubai</option>
                  {districtsByZone.flatMap(({ districts }) => districts).map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
              </label>
              <label className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#172d3d]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cuisine, restaurant name..." className="w-full text-sm italic outline-none placeholder:text-slate-400" />
              </label>
              <button className="bg-[#005f52] px-6 text-xs font-bold uppercase text-white hover:bg-[#004d43]">Search</button>
            </form>
            <Link to="/join" className="hidden shrink-0 text-sm font-semibold text-[#005f52] lg:block">For owners</Link>
            <Link to="/restaurants" className="shrink-0 text-sm font-semibold text-[#005f52]">Log in</Link>
          </div>
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3 text-xs font-semibold whitespace-nowrap">
            <button onClick={() => { setSelectedDiscount("All"); setSelectedVibe("All"); }} className="rounded-full bg-[#064e68] px-4 py-2 text-white">⚙ All filters</button>
            <button onClick={() => setSelectedDiscount("The Entertainer")} className="rounded-full border border-[#172d3d] px-4 py-2">Special offers</button>
            <button onClick={() => setSortBy("rating-desc")} className="rounded-full border border-[#d5dddd] px-4 py-2">☆ Best rated</button>
            <button onClick={() => setSelectedCuisine("All")} className="rounded-full border border-[#d5dddd] px-4 py-2">🍴 Cuisine⌄</button>
            <button onClick={() => setSelectedArea("All")} className="rounded-full border border-[#d5dddd] px-4 py-2">Neighbourhood⌄</button>
            <button onClick={() => setSelectedDiscount("All")} className="rounded-full border border-[#d5dddd] px-4 py-2">Privileges</button>
          </div>
        </div>

        {/* Catalog Main Panel */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Header Title Section */}
          <div className="mb-6 border-b border-[#dce2e2] pb-4 text-left">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500"><Link to="/" className="text-[#00796b]">⌂</Link><span>›</span><span>Dubai restaurants</span><span>›</span><span>Best restaurants in Dubai</span></div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#172d3d] sm:text-4xl">The best restaurants in Dubai</h1>
              <span className="text-sm text-slate-500">{filteredAndSorted.length} restaurants</span>
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
