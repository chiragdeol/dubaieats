import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dubai.png";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { useMemo, useState } from "react";
import { Sparkles, Search, Heart, ChevronRight } from "lucide-react";

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

  // Curated list for the "Restaurants chosen for you" section
  const chosenRestaurants = useMemo(() => {
    // Select Zuma, LPM, Pierchic, and Ossiano
    const selectedNames = ["Zuma", "LPM Restaurant", "Pierchic", "Ossiano"];
    const found = enrichedRestaurants.filter(r => selectedNames.some(name => r.name.toLowerCase().includes(name.toLowerCase())));
    
    // Add dummy discount badges for TheFork style
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
      customRating: (r.rating * 2).toFixed(1) // Map 5.0 scale to 10.0 scale to match TheFork screenshot (e.g. 9.1, 8.9)
    }));
  }, []);

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
              className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4.5 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" /> Can't Decide? Let’s Dubai-it!
            </button>
          </div>

        </div>
      </section>

      {/* QUICK INSPIRATION GRID - Visit Dubai & TheFork Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
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

      {/* SECTION: Restaurants chosen for you - TheFork screenshot styled */}
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
                {/* Image panel with badge & heart */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  
                  {/* Tag on top left */}
                  <span className="absolute top-3 left-3 bg-white/95 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 dark:bg-zinc-900 dark:text-amber-400">
                    👑 {r.tag}
                  </span>

                  {/* Heart on top right */}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors shadow-xs dark:bg-zinc-900/80">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-base text-foreground leading-snug line-clamp-1">{r.name}</h3>
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

              {/* Special green offer badge at the bottom */}
              <div className="px-4 pb-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold py-2 px-3 rounded-lg flex items-center justify-between">
                  <span>{r.deal}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Dubai-Eat Recommends - TheFork screenshot styled */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border/60">
        <div className="mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Dubai-Eat recommends
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Best deals in town */}
          <div className="bg-emerald-400/90 dark:bg-emerald-950/65 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-35 group-hover:scale-105 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" alt="Best deals bowl" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="relative z-10 max-w-[70%]">
              <h3 className="font-display font-bold text-2xl text-emerald-950 dark:text-white leading-tight">Best deals in town</h3>
              <p className="text-emerald-900/90 dark:text-emerald-100/90 text-xs mt-3 leading-relaxed">Book a table with us and benefit from our unheard of deals.</p>
            </div>
            <button
              onClick={() => {
                navigate({ to: "/restaurants", search: { type: "restaurant" } });
              }}
              className="self-start text-[10px] font-bold tracking-wider text-emerald-950 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-6 relative z-10"
            >
              SEE OFFERS <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: New on Dubai-Eat */}
          <div className="bg-orange-50 dark:bg-zinc-900 border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[250px] relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-35 group-hover:scale-105 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300" alt="Hotspot burger" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="relative z-10 max-w-[70%]">
              <h3 className="font-display font-bold text-2xl text-foreground leading-tight">New on Dubai-Eat</h3>
              <p className="text-muted-foreground text-xs mt-3 leading-relaxed">Check out our latest additions and book a table at the newest hotspots in your city!</p>
            </div>
            <button
              onClick={() => {
                navigate({ to: "/restaurants" });
              }}
              className="self-start text-[10px] font-bold tracking-wider text-primary hover:underline flex items-center gap-1 mt-6 relative z-10"
            >
              SEE RESTAURANTS <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Insider */}
          <div className="bg-pink-500/10 dark:bg-pink-950/45 border border-pink-500/20 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-35 group-hover:scale-105 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300" alt="Insider pasta" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="relative z-10 max-w-[70%]">
              <h3 className="font-display font-bold text-2xl text-pink-700 dark:text-pink-300 leading-tight">Insider Selection</h3>
              <p className="text-pink-900/90 dark:text-pink-100/90 text-xs mt-3 leading-relaxed">We have selected for you the trendiest and gourmet restaurants among our best rated places.</p>
            </div>
            <button
              onClick={() => {
                navigate({ to: "/restaurants", search: { vibe: "michelin" } });
              }}
              className="self-start text-[10px] font-bold tracking-wider text-pink-700 dark:text-pink-400 hover:underline flex items-center gap-1 mt-6 relative z-10"
            >
              SEE RESTAURANTS <ChevronRight className="w-4 h-4" />
            </button>
          </div>

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
            Explore all 50 restaurants →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}