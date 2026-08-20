import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { enrichedRestaurants, type EnrichedRestaurant, type PrivilegeCategory } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  BadgePercent, 
  Sparkles, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  Calendar,
  CheckCircle2,
  Gift
} from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Dubai Dining Deals & Privilege Cards — Fazaa, Esaad, Entertainer" },
      { name: "description", content: "Explore verified restaurant discounts in Dubai with Fazaa, Esaad, Emirates Platinum, Entertainer, and UAE Bank Cards." },
    ],
  }),
  component: DealsDirectoryPage,
});

const PRIVILEGE_PROGRAMS: { id: PrivilegeCategory | "All"; label: string; group: string; icon: string }[] = [
  { id: "All", label: "All Deals & Offers", group: "General", icon: "✨" },
  { id: "Fazaa", label: "Fazaa Card Deals", group: "Government", icon: "🇦🇪" },
  { id: "Esaad", label: "Esaad Card Privileges", group: "Government", icon: "🛡️" },
  { id: "Emirates Platinum", label: "Emirates Platinum Card", group: "Corporate", icon: "✈️" },
  { id: "The Entertainer", label: "The Entertainer 2-for-1", group: "Apps", icon: "🎟️" },
  { id: "Supperclub", label: "Supperclub Membership", group: "Apps", icon: "🥂" },
  { id: "BOGO (Buy 1 Get 1)", label: "Buy 1 Get 1 Free", group: "Promotions", icon: "🍔" },
  { id: "Emirates NBD", label: "Emirates NBD Card Deals", group: "Banks", icon: "💳" },
  { id: "HSBC", label: "HSBC Dining Privileges", group: "Banks", icon: "💳" },
  { id: "FAB", label: "FAB Credit Card Offers", group: "Banks", icon: "💳" },
  { id: "Mashreq", label: "Mashreq Bank Perks", group: "Banks", icon: "💳" },
  { id: "Concierge VIP", label: "VIP Concierge Privileges", group: "VIP", icon: "👑" },
];

function DealsDirectoryPage() {
  const [selectedProgram, setSelectedProgram] = useState<PrivilegeCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedRestaurants.filter(r => {
      const matchProgram = selectedProgram === "All" || (r.discounts && r.discounts.includes(selectedProgram));
      const matchQuery = !q || 
        r.name.toLowerCase().includes(q) || 
        r.cuisine.toLowerCase().includes(q) || 
        r.district.toLowerCase().includes(q) ||
        r.discounts?.some(d => d.toLowerCase().includes(q));
      return matchProgram && matchQuery;
    });
  }, [selectedProgram, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* Breadcrumb & Eyebrow */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link to="/" className="text-[#005971] font-bold">Home</Link>
              <span>›</span>
              <span>Eat & Drink</span>
              <span>›</span>
              <span>Deals & Privilege Cards</span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-[#005971] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-teal-200 border border-white/20">
                <Gift className="w-3.5 h-3.5 text-amber-300" /> Exclusive Dining Privileges Directory
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
                Unlock Exclusive Dining Privileges & Discounts
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal">
                Discover verified dining promotions across Dubai accepting your <strong>Fazaa, Esaad, Emirates Platinum, Entertainer, Supperclub, and UAE Bank cards</strong>.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-6 mb-10">
            
            {/* Search Input */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venue or deal (e.g. Zuma, Italian in DIFC, Fazaa)..."
                className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Privilege Program Pills */}
            <div className="flex flex-wrap gap-2">
              {PRIVILEGE_PROGRAMS.map(prog => {
                const isSelected = selectedProgram === prog.id;
                return (
                  <button
                    key={prog.id}
                    onClick={() => setSelectedProgram(prog.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-md scale-105"
                        : "bg-card border border-border text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <span>{prog.icon}</span>
                    <span>{prog.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deals Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-extrabold text-muted-foreground">
              <span>Showing {filteredDeals.length} venues with active privileges</span>
              {selectedProgram !== "All" && (
                <button
                  onClick={() => setSelectedProgram("All")}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map(r => (
                <article
                  key={r.slug}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          Up to 25% Off
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                        📍 {r.district}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-foreground hover:text-primary transition-colors">
                            <Link to="/restaurants/$id" params={{ id: r.slug }}>
                              {r.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-muted-foreground">{r.cuisine} · ~AED {r.priceMin}–{r.priceMax}</p>
                        </div>
                        <span className="bg-emerald-500 text-white font-black text-xs px-2 py-0.5 rounded-md">
                          {(r.rating * 2).toFixed(1)}
                        </span>
                      </div>

                      {/* Accepted Privilege badges */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Accepted Cards & Programs
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.discounts?.map(d => (
                            <span
                              key={d}
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                                selectedProgram === d
                                  ? "bg-amber-500 text-white border-amber-600 font-black"
                                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                              }`}
                            >
                              💳 {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                      <Link
                        to="/restaurants/$id"
                        params={{ id: r.slug }}
                        className="bg-primary text-primary-foreground font-bold text-xs py-2.5 rounded-xl hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-1"
                      >
                        <span>View Deal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={r.bookingPlatform?.url || r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-border bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Book Table</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
