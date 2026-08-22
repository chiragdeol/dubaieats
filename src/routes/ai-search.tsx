import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { parseIntent, matchRestaurants, hasGemini, callGemini, type ChatMessage } from "@/lib/restaurant-ai";
import { getAccurateBookHref, getAccurateBookLabel } from "@/lib/venue-actions";
import { ListingDeliveryButtons } from "@/components/order-online-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VenuePhoto, LiveRatingText } from "@/components/venue-photo";
import { 
  Sparkles, 
  Search, 
  MessageSquare, 
  MapPin, 
  Star, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  BadgePercent,
  Bot
} from "lucide-react";

export const Route = createFileRoute("/ai-search")({
  head: () => ({
    meta: [
      { title: "AI Dining Concierge & Smart Search — Dubai Eat" },
      { name: "description", content: "Ask natural language questions to find Dubai restaurants by discount cards, views, opening hours, and dietary preferences." },
    ],
  }),
  component: AiSearchHubPage,
});

const PROMPT_CHIPS = [
  "Where can I use my Fazza card for Italian in DIFC?",
  "Dog-friendly terrace with Burj Khalifa view in Business Bay open late",
  "Michelin selected Japanese sushi with complimentary valet in Downtown",
  "Family-friendly Sunday brunch in Palm Jumeirah with beach views",
  "Best shisha lounge with AC terrace in Dubai Marina under AED 200",
  "Licensed speakeasy cocktail bar in JLT with live music"
];

function AiSearchHubPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeResults, setActiveResults] = useState<EnrichedRestaurant[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeSearch = async (text: string) => {
    if (!text.trim()) {
      setActiveResults([]);
      setAiExplanation("");
      return;
    }

    setLoading(true);
    try {
      if (hasGemini) {
        const history: ChatMessage[] = [{ role: "user", text }];
        const { matchedIds, reply } = await callGemini(history);
        const matches = enrichedRestaurants.filter(r => matchedIds.includes(r.slug));
        setActiveResults(matches.length > 0 ? matches : matchRestaurants(parseIntent(text), 6));
        setAiExplanation(reply.replace(/\*\*/g, ""));
      } else {
        const intent = parseIntent(text);
        const matches = matchRestaurants(intent, 6);
        setActiveResults(matches);
        const parts: string[] = [];
        if (intent.cuisines.length) parts.push(intent.cuisines.join(", "));
        if (intent.districts.length) parts.push(`in ${intent.districts.join(", ")}`);
        if (intent.maxPrice) parts.push(`budget under AED ${intent.maxPrice}`);
        setAiExplanation(
          matches.length > 0
            ? `Identified ${matches.length} matching Dubai venues matching your criteria (${parts.join(" · ") || "custom query"}).`
            : "No exact matches found. Try broadening your query or asking for another Dubai neighborhood."
        );
      }
    } catch {
      setActiveResults(enrichedRestaurants.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setActiveResults([]);
      setAiExplanation("");
      return;
    }
    debounceRef.current = setTimeout(() => executeSearch(val), 600);
  };

  const handleChipClick = (prompt: string) => {
    setQuery(prompt);
    executeSearch(prompt);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#757575] font-heading">
              <Link to="/" className="text-[#1A1A1A] font-bold hover:text-[#D4AF37]">Home</Link>
              <span>›</span>
              <span>Eat & Drink</span>
              <span>›</span>
              <span>AI Dining Concierge</span>
            </div>
          </div>

          {/* Hero */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-heading">
                <Bot className="w-4 h-4 text-[#D4AF37]" /> GEMINI AI NATURAL LANGUAGE CONCIERGE
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
                Dubai Eats Smart AI Concierge
              </h1>
              <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed font-normal font-sans">
                Describe your exact cravings, preferred privilege cards (Fazaa, Esaad), atmospheric vibes, or district — our AI concierge will pinpoint your ideal venue instantly.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="space-y-4 mb-10">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => handleInput(e.target.value)}
                placeholder='Ask anything (e.g. "Where can I use my Fazza card for Italian in DIFC?")...'
                className="w-full bg-card border-2 border-amber-500/30 rounded-2xl pl-12 pr-12 py-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 shadow-lg"
              />
              <Sparkles className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PROMPT_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="bg-card hover:bg-muted text-foreground/80 hover:text-foreground text-xs font-bold px-3.5 py-1.5 rounded-full border border-border transition-all cursor-pointer text-left"
                >
                  ✨ {chip}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Explanation */}
          {aiExplanation && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 mb-8 flex items-start gap-3.5 shadow-2xs">
              <Bot className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
                  AI Recommendation & Intent Analysis
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {aiExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Matched Venues Grid */}
          {activeResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-xl text-foreground">
                Matching Dubai Recommendations ({activeResults.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeResults.map(r => (
                  <article
                    key={r.slug}
                    className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <VenuePhoto
                          venue={r}
                          alt={r.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-1">
                          <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            AI Match
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                          📍 {r.district}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-extrabold text-base text-foreground">
                            <Link to="/restaurants/$id" params={{ id: r.slug }} className="hover:text-primary transition-colors">
                              {r.name}
                            </Link>
                          </h4>
                          <span className="bg-emerald-500 text-white font-bold text-xs px-2 py-0.5 rounded-md">
                            <LiveRatingText venue={r} scale={2} />
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.cuisine} · ~AED {r.priceMin}–{r.priceMax}</p>
                        
                        {r.discounts && r.discounts.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {r.discounts.slice(0, 3).map(d => (
                              <span key={d} className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                💳 {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="space-y-2 pt-3 border-t border-border">
                        <ListingDeliveryButtons venue={r} />
                        <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/restaurants/$id"
                          params={{ id: r.slug }}
                          className="bg-primary text-primary-foreground font-bold text-xs py-2 rounded-xl text-center flex items-center justify-center gap-1"
                        >
                          <span>Menu & Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <a
                          href={getAccurateBookHref(r)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-secondary text-foreground font-bold text-xs py-2 rounded-xl text-center border border-border flex items-center justify-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{getAccurateBookLabel(r)}</span>
                        </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
