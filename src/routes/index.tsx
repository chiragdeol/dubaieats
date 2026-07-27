import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dubai.jpg";
import { restaurants } from "@/data/restaurants";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

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
  const featured = restaurants.slice(0, 3);
  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine.split(" ")[0]))).slice(0, 10);
  const [quickFilter, setQuickFilter] = useState<string>("All");
  const [isRandomizerOpen, setIsRandomizerOpen] = useState<boolean>(false);

  const quickList = useMemo(() => {
    const list = quickFilter === "All"
      ? restaurants
      : restaurants.filter(r => r.cuisine.toLowerCase().startsWith(quickFilter.toLowerCase()));
    return [...list].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [quickFilter]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <DubaiItRandomizerModal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
      />

      {/* HERO */}
      <section className="relative h-[85vh] min-h-[580px] overflow-hidden flex items-end pb-24">
        <img src={heroImage} alt="Dubai skyline at sunset with fine dining" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-6 flex items-center gap-2">
            <span>· Food cravings? <strong className="text-primary font-bold">Let’s Dubai-it</strong> at Dubai-Eat ·</span>
          </p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold text-white max-w-4xl leading-[0.95] tracking-tight">
            Where are we eating? <span className="italic text-primary">Let’s Dubai-it.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/90 max-w-xl">
            Dubai-it right with Dubai-Eat. Compare ratings, price ranges, Michelin awards, and live opening hours across 50 of Dubai's most iconic dining spots.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/restaurants" className="rounded-full bg-primary px-7 py-3.5 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Let's Dubai-Eat →
            </Link>
            <button
              onClick={() => setIsRandomizerOpen(true)}
              className="rounded-full border border-amber-400 bg-amber-500/20 backdrop-blur-md px-7 py-3.5 text-amber-200 text-sm font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Can't Decide? Let’s Dubai-it!
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { n: "50", l: "Handpicked spots" },
            { n: "18+", l: "Cuisines" },
            { n: "AED 20–2000", l: "Price coverage" },
            { n: "100%", l: "Live Google links" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl sm:text-4xl font-semibold text-foreground">{s.n}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Editor's picks</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground max-w-xl leading-tight">
              Three tables worth planning your week around.
            </h2>
          </div>
          <Link to="/restaurants" className="hidden md:inline text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((r, i) => (
            <article key={r.name} className="group relative overflow-hidden rounded-3xl bg-card border border-border aspect-[4/5] shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0">
                <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">#{i + 1} · {r.cuisine}</div>
                <h3 className="font-display text-3xl font-semibold mt-1">{r.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span>{r.rating.toFixed(1)} ★</span>
                  <span className="opacity-70">({r.reviews})</span>
                  <span className="opacity-70">· AED {r.priceMin}–{r.priceMax}</span>
                </div>
                <div className="text-sm opacity-80 mt-1">{r.area}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CUISINES */}
      <section id="cuisines" className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <p className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Want a view of the Fountains? Let’s Dubai-it.</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold max-w-2xl leading-tight">
            From <span className="italic">street karak</span> to Michelin-starred tasting menus.
          </h2>
          <div className="mt-12 flex flex-wrap gap-3">
            {cuisines.map((c) => (
              <Link key={c} to="/restaurants" className="rounded-full border border-primary-foreground/30 px-5 py-2.5 text-sm hover:bg-primary-foreground hover:text-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK FILTER PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Explore quickly</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-tight max-w-xl">
              Filter the list without leaving this page.
            </h2>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
            Open full list with filters →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...cuisines].map(c => (
            <button key={c} onClick={() => setQuickFilter(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${quickFilter === c ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickList.map((r) => (
            <Link key={r.name} to="/restaurants"
              className="group flex gap-4 rounded-2xl border border-border bg-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <img src={r.image} alt={r.name} loading="lazy"
                className="h-20 w-20 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-semibold text-foreground truncate">{r.name}</h3>
                  <span className="text-xs font-semibold text-accent shrink-0">★ {r.rating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{r.cuisine} · {r.area}</div>
                <div className="mt-2 text-xs font-medium text-foreground">AED {r.priceMin}–{r.priceMax}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">How it works</p>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground max-w-2xl leading-tight mb-16">
          Skip the endless scrolling.
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { n: "01", t: "Browse", d: "A curated list of 50 restaurants — no ads, no sponsored slots, no clutter." },
            { n: "02", t: "Compare", d: "Ratings, price ranges, cuisines and neighbourhoods, side by side." },
            { n: "03", t: "Reserve", d: "One tap opens the restaurant's live Google page — call, directions or reserve." },
          ].map((s) => (
            <div key={s.n} className="border-t border-border pt-6">
              <div className="font-display text-5xl text-primary">{s.n}</div>
              <h3 className="font-display text-2xl font-semibold text-foreground mt-4">{s.t}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.d}</p>
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

      <SiteFooter />
    </div>
  );
}