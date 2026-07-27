import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dubai.png";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { useMemo, useState } from "react";
import { Sparkles, Search, MapPin, UtensilsCrossed, Landmark, Award } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <DubaiItRandomizerModal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
      />

      {/* HERO SECTION - Visit Dubai & TheFork Inspired */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center pt-24 pb-16">
        <img 
          src={heroImage} 
          alt="Dubai skyline at sunset with fine dining" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center md:text-left">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-xs font-bold border border-primary/30 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Hungry? Let's Dubai-it at Dubai-Eat.
            </span>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold text-white leading-[0.95] tracking-tight">
              Where are we eating? <br />
              <span className="italic text-primary">Let’s Dubai-it.</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-white/90 max-w-xl leading-relaxed">
              Explore 50 of Dubai's finest dining destinations. Compare local reviews, price bands, Michelin recognitions, and delivery apps at a glance.
            </p>
          </div>

          {/* Dynamic Horizontal Search Panel - TheFork Inspired */}
          <div className="mt-12 max-w-4xl bg-card/85 backdrop-blur-md border border-border p-5 rounded-3xl shadow-2xl">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Eatery Type select */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">Eatery Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Eatery Types</option>
                  <option value="restaurant">🍽️ Restaurants</option>
                  <option value="bar">🍸 Bars & Nightlife</option>
                  <option value="cafe">☕ Cafes & Bakeries</option>
                </select>
              </div>

              {/* Area select */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">Neighborhood</label>
                <select
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                >
                  <option value="All">All Neighborhoods</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Keyword query */}
              <div className="md:col-span-4 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 text-left px-1">Cuisine or Vibe</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search e.g. sushi, view, rooftop..."
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
              className="text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-xs flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Can't Decide? Let’s Dubai-it!
            </button>
          </div>

        </div>
      </section>

      {/* QUICK INSPIRATION GRID - Visit Dubai & TheFork Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center md:text-left mb-12">
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

      {/* FEATURED RESTAURANTS SLIDER */}
      <section id="featured" className="border-t border-border bg-secondary/20 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Trending now</p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-tight max-w-xl">
                Featured Dubai Hotspots
              </h2>
            </div>
            <Link to="/restaurants" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Browse all 50 eateries →
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((r, i) => (
              <article key={r.name} className="group relative overflow-hidden rounded-3xl bg-card border border-border aspect-[4/5] shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute inset-0">
                  <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1.5">
                    {r.michelin && (
                      <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                        ★ Michelin
                      </span>
                    )}
                    <span className="text-xs uppercase tracking-widest opacity-80">{r.cuisine}</span>
                  </div>
                  <h3 className="font-display text-3xl font-semibold mt-1.5">{r.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="font-bold">{r.rating.toFixed(1)} ★</span>
                    <span className="opacity-70">({r.reviews})</span>
                    <span className="opacity-70">· {r.area}</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1.5 font-semibold">AED {r.priceMin}–{r.priceMax}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE NEIGHBORHOODS - Visit Dubai Style */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center md:text-left mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Dubai neighborhood guide</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground max-w-xl leading-tight">
            Explore eateries by district
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg">From the financial hub of DIFC to the beachside vibes of Palm Jumeirah.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { name: "DIFC", desc: "Corporate lunch spots, upscale lounges, and high-end fine dining.", count: "12 Venues", img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400" },
            { name: "Palm Jumeirah", desc: "Seaside views, beachfront cafes, and legendary luxury beach clubs.", count: "9 Venues", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" },
            { name: "Downtown Dubai", desc: "Burj view terraces, tourist hotspots, and elegant lounges.", count: "10 Venues", img: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400" },
            { name: "Jumeirah", desc: "Casual beachfront bistros, local coffee roasters, and family bistros.", count: "8 Venues", img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400" },
          ].map((n) => (
            <button
              key={n.name}
              onClick={() => {
                navigate({
                  to: "/restaurants",
                  search: { area: n.name }
                });
              }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-border text-left transition-all hover:shadow-lg"
            >
              <img 
                src={n.img} 
                alt={n.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/55 transition-colors" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full self-start">
                  {n.count}
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg">{n.name}</h3>
                  <p className="text-[10px] text-white/80 mt-1 line-clamp-2 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            </button>
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
            Explore all 50 eateries →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}