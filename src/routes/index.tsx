import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dubai.png";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { OwnerCta } from "@/components/owner-cta";
import { useMemo, useState } from "react";
import { 
  Sparkles, 
  Search, 
  Heart, 
  ChevronRight, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard, 
  Award, 
  CheckCircle2,
  BadgePercent,
  Star,
  ExternalLink,
  MessageSquare,
  Calendar
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dubai Eats — Food cravings? Let's Dubai-it at Dubai-Eat" },
      { name: "description", content: "Discover, compare and reserve tables at 50 of Dubai's most iconic restaurants — ratings, price ranges, Michelin awards and live Google links." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const featured = enrichedRestaurants.slice(0, 3);
  const cuisines = Array.from(new Set(enrichedRestaurants.map((r) => r.cuisine.split(" ")[0]))).slice(0, 8);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Search form state
  const [searchType, setSearchType] = useState<string>("All");
  const [searchArea, setSearchArea] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const areas = useMemo(() => {
    const set = new Set<string>();
    enrichedRestaurants.forEach((r) => set.add(r.area));
    return Array.from(set).sort();
  }, []);

  // Filter sponsored venues for homepage ad placement
  const homepageSponsoredVenues = useMemo(() => {
    return enrichedRestaurants.filter(r => r.isSponsored).slice(0, 2);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/restaurants",
      search: {
        type: searchType === "All" ? undefined : searchType,
        area: searchArea === "All" ? undefined : searchArea,
        q: searchQuery || undefined,
      }
    });
  };

  const handleInspirationClick = (vibe: string) => {
    navigate({
      to: "/restaurants",
      search: {
        vibe: vibe,
      }
    });
  };

  // Curated list for the "Restaurants chosen for you" section
  const chosenRestaurants = useMemo(() => {
    const selectedNames = ["Zuma", "LPM Restaurant", "Pierchic", "Ossiano"];
    const found = enrichedRestaurants.filter(r => selectedNames.some(name => r.name.toLowerCase().includes(name.toLowerCase())));
    
    const deals = [
      { badge: "Up to -50% - Dubai-Eat Festival", tag: "Insider" },
      { badge: "Up to -50% - Food bill", tag: "Insider" },
      { badge: "Up to -30%", tag: "Popular" },
      { badge: "Up to -30% - Early Bird", tag: "Insider" }
    ];

    return found.slice(0, 4).map((r, index) => ({
      ...r,
      deal: deals[index % deals.length].badge,
      tag: deals[index % deals.length].tag,
      customRating: (r.rating * 2).toFixed(1)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background text-left">
      <SiteHeader />

      <DubaiItRandomizerModal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center pt-24 pb-16">
        <img 
          src={heroImage} 
          alt="Dubai skyline at sunset with fine dining" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-background" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center md:text-left">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-xs font-bold border border-primary/30 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> B2B Hospitality SaaS & Dining Intelligence
            </span>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold text-white leading-[0.95] tracking-tight">
              Where are we eating? <br />
              <span className="italic text-primary">Let’s Dubai-it.</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-white/90 max-w-xl leading-relaxed">
              Explore 50 of Dubai's finest dining destinations. 100% Unbiased Organic Rankings, Esaad & Fazaa Privilege Filters, and Transparent Google-Style Venue Ads.
            </p>
          </div>

          {/* Dynamic Horizontal Search Panel */}
          <div className="mt-12 max-w-4xl bg-card/85 backdrop-blur-md border border-border p-5 rounded-3xl shadow-2xl">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Eatery Type select */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">Eatery Scope</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Scope & Venues</option>
                  <option value="restaurant">🍽️ Restaurants</option>
                  <option value="cafe">☕ Cafes & Bakeries</option>
                  <option value="bar">🍸 Bars & Lounges</option>
                  <option value="nightclub">🕺 Nightclubs</option>
                  <option value="beach_club">🏖️ Beach Clubs</option>
                  <option value="private_chef">👨‍🍳 Private Chefs</option>
                </select>
              </div>

              {/* Area select */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">District / Area</label>
                <select
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Dubai Districts</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Keyword query */}
              <div className="md:col-span-4 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">Cuisine or Privileges</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search e.g. sushi, Esaad, Fazaa..."
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              {/* CTA Search Button */}
              <div className="md:col-span-2 pt-5">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5"
                >
                  Let's Dubai-Eat
                </button>
              </div>

            </form>
          </div>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <button
              onClick={() => setIsRandomizerOpen(true)}
              className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4.5 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" /> Can't Decide? Let’s Dubai-it!
            </button>
          </div>

        </div>
      </section>

      {/* ── HOMEPAGE SPONSORED PRODUCTS / FEATURED PARTNERS SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  [FEATURED SPONSORED PRODUCTS]
                </span>
                <span className="text-xs font-bold text-muted-foreground">Transparent Ad Placement</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                Featured Partner Venues & Direct Booking Privileges
              </h2>
            </div>
            <Link
              to="/merchant"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl hover:opacity-95 transition-opacity shrink-0"
            >
              <Building2 className="w-4 h-4" /> Feature Your Venue Here
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homepageSponsoredVenues.map(s => (
              <div key={s.slug} className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <img src={s.image} alt={s.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        SPONSORED
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">{s.district}</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-foreground mt-1 truncate">{s.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{s.cuisine} · AED {s.priceMin}–{s.priceMax}</p>
                    {s.discounts && s.discounts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.discounts.slice(0, 2).map(disc => (
                          <span key={disc} className="text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
                            💳 {disc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">✨ {s.sponsoredBannerText}</p>
                  <Link
                    to="/restaurants/$id"
                    params={{ id: s.slug }}
                    className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1"
                  >
                    View Partner <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK INSPIRATION GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center md:text-left mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Curated selections</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground max-w-2xl leading-tight">
            Discover Dubai's ultimate culinary vibes.
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg">Click any category below to instantly find eateries matching your specific mood.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { id: "michelin", label: "Michelin Starred", icon: "⭐", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300" },
            { id: "Burj View", label: "Burj Khalifa View", icon: "🏙️", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300" },
            { id: "Beachfront", label: "Beachfront Dining", icon: "🏖️", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300" },
            { id: "Business Lunch", label: "Business Lunches", icon: "💼", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300" },
            { id: "Sunday Brunch", label: "Sunday Brunches", icon: "🥂", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300" },
            { id: "Kid Friendly", label: "Kid Friendly Sites", icon: "🍼", img: "https://images.unsplash.com/photo-1566275529824-cdc6d5867be3?w=300" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => handleInspirationClick(c.id)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] border border-border bg-card text-left transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <img 
                src={c.img} 
                alt={c.label} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="text-xl mb-1 block">{c.icon}</span>
                <h3 className="font-display font-semibold text-sm leading-snug">{c.label}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── B2B SAAS PLATFORM SHOWCASE SECTION ── */}
      <section className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 text-white py-20 px-6 my-12 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> B2B Hospitality SaaS Product
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
              Powered by Dubai Eats SaaS Merchant Engine
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Dubai Eats is built as an end-to-end B2B SaaS platform for restaurants, cafes, beach clubs, and hospitality venues across Dubai.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" /> DET Dubai Open Data Sync
                </div>
                <p className="text-xs text-white/70">Automated licensing, commercial register validation, and open data indexing.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <BadgePercent className="w-4 h-4" /> Privilege Card Portal
                </div>
                <p className="text-xs text-white/70">Manage accepted Esaad, Fazaa, Entertainer & Bank card promotion matrices.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <TrendingUp className="w-4 h-4" /> Google-Style Ad Server
                </div>
                <p className="text-xs text-white/70">Transparent sponsored listings and high-visibility hero display banner auctions.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <CreditCard className="w-4 h-4" /> Deposit & Lead Gateway
                </div>
                <p className="text-xs text-white/70">Integrated Stripe & Telr checkout for VIP table deposits & private chef commissions.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/merchant"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl hover:opacity-95 transition-opacity"
              >
                Access Merchant & SaaS Portal →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-card/10 backdrop-blur-md border border-white/15 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> SaaS Merchant Features
            </h3>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>100% Unbiased Organic Ranking:</strong> Verified algorithms.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Transparent Ad Badges:</strong> Clearly labeled `[SPONSORED]`.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>AI WhatsApp Lead Engine:</strong> Direct pre-filled inquiries.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>District Coverage:</strong> 60+ Dubai communities indexed.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION: Restaurants chosen for you */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border/60">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Restaurants chosen for you
            </h2>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary hover:underline flex items-center gap-0.5">
            See all <ChevronRight className="w-4.5 h-4.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chosenRestaurants.map((r) => (
            <div key={r.name} className="bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <Link to="/restaurants/$id" params={{ id: r.slug || "" }} className="relative aspect-[4/3] w-full overflow-hidden block">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  
                  <span className="absolute top-3 left-3 bg-white/95 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 dark:bg-zinc-900 dark:text-amber-400">
                    👑 {r.tag}
                  </span>

                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors shadow-xs dark:bg-zinc-900/80">
                    <Heart className="w-4 h-4" />
                  </button>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-base text-foreground leading-snug line-clamp-1 hover:text-primary transition-colors">
                      <Link to="/restaurants/$id" params={{ id: r.slug || "" }}>
                        {r.name}
                      </Link>
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="inline-block bg-emerald-500 text-white font-extrabold text-xs px-1.5 py-0.5 rounded-md">
                        {r.customRating}
                      </span>
                      <p className="text-[9px] text-muted-foreground mt-0.5">({r.reviews})</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {r.area}
                  </p>
                  
                  <p className="text-xs font-medium text-foreground mt-1.5">
                    {r.cuisine} · ~AED {r.priceMin}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-between">
                  <span>{r.deal}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* PRIVATE CHEF ON DEMAND */}
      <section className="bg-amber-500/10 border-y border-amber-500/20 py-20 px-6 my-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              👑 Dubai Luxury Dining Concierge
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-4 leading-tight">
              Private Chef on Demand
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-4 leading-relaxed">
              Skip the dining room crowd. Hire a Michelin-tier Private Chef for a bespoke culinary experience in your villa, luxury penthouse, yacht party, or dinner cruise in Dubai.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-card border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground">👨‍🍳 Splidu</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Vetted chefs providing end-to-end dining, bespoke tablescaping, and complete clean-up.</p>
                </div>
                <a
                  href="https://splidu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors"
                >
                  Book Splidu
                </a>
              </div>
              
              <div className="bg-card border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground">🍳 myCHEF Dubai</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Connects you with licensed private chefs, custom menus, and high-end caterers.</p>
                </div>
                <a
                  href="https://mychef.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors"
                >
                  Book myCHEF
                </a>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/971562730030?text=Hi!%20I'd%20like%20to%20inquire%20about%20booking%20a%20Private%20Chef%20on%20Demand%20in%20Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 text-sm shadow-md transition-all"
              >
                💬 Let's Dubai-it on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video border border-amber-500/20">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
              alt="Professional private chef prepping elegant dishes in Dubai kitchen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              🧑‍🍳 Elite Dubai Culinary Guild
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-foreground text-background p-12 sm:p-20 text-center">
          <h2 className="font-display text-4xl sm:text-6xl font-semibold leading-tight max-w-3xl mx-auto">
            Your next reservation is <span className="italic text-accent">waiting</span>.
          </h2>
          <Link to="/restaurants" className="inline-block mt-10 rounded-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold hover:opacity-90 transition-opacity">
            Explore all 50 restaurants →
          </Link>
        </div>
      </section>

      <OwnerCta />

      <SiteFooter />
    </div>
  );
}