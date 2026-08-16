import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, MapPin, Search, SlidersHorizontal, Sparkles, Star, Utensils, Waves, Wine, X } from "lucide-react";
import gourmetPastaPlate from "@/assets/gourmet-pasta-plate.png";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { OwnerCta } from "@/components/owner-cta";
import { enrichedRestaurants } from "@/lib/restaurants-enriched";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dubai Eats — Discover the extraordinary" },
      { name: "description", content: "Discover Dubai's best restaurants, cafes, beach clubs and nightlife with objective search and local privileges." },
    ],
  }),
  component: Landing,
});

const moods = [
  { id: "Beachfront", title: "Sea-side tables", copy: "Sunset dining with a view", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85", icon: Waves },
  { id: "Burj View", title: "Iconic views", copy: "Dinner under the Dubai skyline", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&q=85", icon: Star },
  { id: "Sunday Brunch", title: "The brunch edit", copy: "Long lunches, made memorable", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=85", icon: Utensils },
  { id: "Ladies Night", title: "After dark", copy: "Dubai's best nightlife spots", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=85", icon: Wine },
];

const districts = ["Downtown Dubai", "DIFC", "Palm Jumeirah", "Dubai Marina", "Jumeirah", "Old Dubai"];
const privileges = ["Esaad", "Fazaa", "The Entertainer", "BOGO", "Emirates NBD", "Concierge perks"];

function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [randomizerOpen, setRandomizerOpen] = useState(false);

  const areas = useMemo(() => Array.from(new Set(enrichedRestaurants.map((r) => r.area))).sort(), []);
  const featured = useMemo(() => enrichedRestaurants.filter((r) => !r.isSponsored).slice(0, 4), []);
  const moodPhotos = useMemo(() => enrichedRestaurants.filter((r) => !r.isSponsored).slice(4, 8), []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({ to: "/restaurants", search: { area: area === "All" ? undefined : area, q: query || undefined, discount: selectedPrivileges[0] || undefined } });
  };

  const togglePrivilege = (value: string) => setSelectedPrivileges((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#172d3d]">
      <SiteHeader />
      <main>
        <section className="relative mx-auto max-w-[1400px] px-4 pb-12 pt-16 sm:px-6 lg:px-10">
          <div className="relative min-h-[430px] overflow-hidden rounded-[22px] bg-[#005f52] text-white shadow-sm sm:min-h-[570px]">
            <div className="relative z-10 mx-auto flex min-h-[430px] max-w-5xl items-center px-8 py-16 sm:min-h-[570px] sm:px-16 lg:px-24">
              <div className="w-full max-w-2xl">
                <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-.035em] sm:text-7xl lg:text-[4.5rem]">Discover and book the best restaurant</h1>
                <form onSubmit={submitSearch} className="mt-12 flex flex-col overflow-hidden rounded-2xl bg-white p-2 text-[#172d3d] shadow-xl sm:flex-row sm:items-center sm:rounded-xl">
                  <label className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:w-72 sm:border-b-0 sm:border-r"><MapPin className="h-5 w-5 shrink-0 text-slate-500" /><select value={area} onChange={(e) => setArea(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none"><option value="All">Dubai</option>{areas.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"><Search className="h-5 w-5 shrink-0 text-slate-700" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cuisine, restaurant name..." className="w-full text-sm italic outline-none placeholder:text-slate-400" /></label>
                  <button className="rounded-xl bg-[#00796b] px-8 py-3.5 text-sm font-bold uppercase text-white transition hover:bg-[#006456]">Search</button>
                </form>
              </div>
            </div>
            <img src={gourmetPastaPlate} alt="Gourmet pasta dish" className="absolute bottom-[-8%] right-[-10%] hidden h-[82%] w-[48%] object-contain object-left drop-shadow-2xl lg:block" />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-10"><div className="mb-10 flex items-end justify-between gap-4"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">Start exploring</p><h2 className="font-display text-4xl leading-tight sm:text-5xl">Find your kind of Dubai.</h2></div><Link to="/restaurants" className="hidden items-center gap-1 text-sm font-bold text-[#e45d43] sm:flex">See all experiences <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{moods.map(({ id, title, copy, image, icon: Icon }, moodIndex) => <button key={id} onClick={() => navigate({ to: "/restaurants", search: { vibe: id } })} className="group relative aspect-[.88] overflow-hidden rounded-2xl text-left text-white"><img src={moodPhotos[moodIndex]?.image ?? image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d2938]/90 via-[#0d2938]/10 to-transparent" /><div className="absolute bottom-0 p-6"><Icon className="mb-10 h-5 w-5 text-[#f2c45c]" /><h3 className="font-display text-2xl">{title}</h3><p className="mt-1 text-sm text-white/75">{copy}</p></div></button>)}</div></section>
        <section className="bg-[#e8f1ef] py-20"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="mb-10 flex items-end justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">The local edit</p><h2 className="font-display text-4xl sm:text-5xl">Places worth knowing.</h2></div><Link to="/restaurants" className="flex items-center gap-1 text-sm font-bold text-[#e45d43]">Browse all <ChevronRight className="h-4 w-4" /></Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((restaurant) => <article key={restaurant.slug} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Link to="/restaurants/$id" params={{ id: restaurant.slug }}><div className="relative aspect-[4/3]"><img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#168b8b]">ORGANIC PICK</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl">{restaurant.name}</h3><span className="flex items-center gap-1 rounded-md bg-[#168b8b] px-1.5 py-1 text-xs font-bold text-white"><Star className="h-3 w-3 fill-current" /> {restaurant.rating}</span></div><p className="mt-2 text-sm text-slate-500">{restaurant.cuisine} · {restaurant.district}</p><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#e45d43]">Explore venue <ArrowUpRight className="ml-1 inline h-3 w-3" /></p></div></Link></article>)}</div></div></section>
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="mb-8 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">Dubai Eats offers</p><h2 className="font-display text-4xl sm:text-5xl">Good food, better privileges.</h2></div><Link to="/restaurants" className="flex items-center gap-1 text-sm font-bold text-[#e45d43]">See all offers <ChevronRight className="h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((restaurant) => <Link key={`offer-${restaurant.slug}`} to="/restaurants/$id" params={{ id: restaurant.slug }} className="group overflow-hidden rounded-2xl border border-[#dce2e2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[1.35]"><img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-3 left-3 rounded-md bg-[#b7ff9d] px-2 py-1 text-[10px] font-bold text-[#075b45]">Verified venue</span></div><div className="p-4"><h3 className="font-display text-lg">{restaurant.name}</h3><p className="mt-1 text-xs text-slate-500">{restaurant.cuisine} · {restaurant.area}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#168b8b]">Explore offer <ArrowUpRight className="ml-1 inline h-3 w-3" /></p></div></Link>)}</div></section>
        <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="mb-8 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">Pick your plate</p><h2 className="font-display text-4xl sm:text-5xl">What are you craving?</h2></div><Link to="/restaurants" className="flex items-center gap-1 text-sm font-bold text-[#e45d43]">Browse cuisines <ChevronRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{["European", "Japanese", "Italian", "Indian", "Arabic", "Seafood"].map((cuisine) => <button key={cuisine} onClick={() => navigate({ to: "/restaurants", search: { cuisine } })} className="group rounded-2xl border border-slate-100 bg-[#f8f6f1] p-3 text-center transition hover:-translate-y-1 hover:border-[#168b8b] hover:bg-[#e8f1ef]"><div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#d6eee8]"><img src={featured[0]?.image} alt="" className="h-full w-full object-cover opacity-85 transition group-hover:scale-110" /></div><span className="text-xs font-bold text-[#172d3d]">{cuisine}</span></button>)}</div></div></section>
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">Simple dining discovery</p><h2 className="font-display text-4xl sm:text-5xl">How Dubai Eats works</h2></div><div className="grid gap-4 md:grid-cols-4">{[{ icon: "⌕", title: "Search", copy: "Tell us your cuisine, area or occasion." }, { icon: "◇", title: "Compare", copy: "See ratings, prices, tags and privileges." }, { icon: "♡", title: "Choose", copy: "Find an organic recommendation that fits." }, { icon: "✓", title: "Book", copy: "Go directly to the venue's booking link." }].map((step) => <div key={step.title} className="rounded-2xl border border-[#dce2e2] bg-white p-5 shadow-sm"><div className="mb-8 text-3xl font-bold text-[#168b8b]">{step.icon}</div><h3 className="font-display text-xl">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{step.copy}</p></div>)}</div></section>
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#168b8b]">Explore by neighbourhood</p><h2 className="font-display text-5xl leading-none sm:text-6xl">Every corner has a story.</h2><p className="mt-6 max-w-md leading-relaxed text-slate-600">From the old souks of Deira to the bright lights of DIFC, find a table in the part of Dubai that feels like you.</p><Link to="/restaurants" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#172d3d] px-6 py-3 text-sm font-bold text-white">Explore Dubai <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{districts.map((district, index) => <Link key={district} to="/restaurants" search={{ area: district }} className={`group relative flex min-h-32 items-end overflow-hidden rounded-2xl p-4 ${index === 0 ? "bg-[#168b8b] text-white" : "bg-white text-[#172d3d] shadow-sm"}`}><span className="relative z-10 font-display text-xl leading-tight">{district}</span><ArrowUpRight className="absolute right-4 top-4 h-4 w-4 opacity-50 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>)}</div></div></section>
        <section className="bg-[#172d3d] px-6 py-20 text-white"><div className="mx-auto max-w-7xl lg:px-10"><div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#f2c45c]">A better way to discover</p><h2 className="font-display text-5xl leading-none sm:text-6xl">Good places.<br /><em className="text-[#f2c45c]">No pay-to-play.</em></h2><p className="mt-6 max-w-md text-white/70">Organic results are relevance-driven. When a venue is promoted, we tell you clearly. Your search should work for you.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/15 bg-white/5 p-6"><div className="mb-10 text-3xl">◎</div><h3 className="font-display text-2xl">Objective search</h3><p className="mt-2 text-sm leading-relaxed text-white/60">Ratings, relevance and verified details shape every organic result.</p></div><div className="rounded-2xl border border-white/15 bg-white/5 p-6"><div className="mb-10 text-3xl">✦</div><h3 className="font-display text-2xl">Real privileges</h3><p className="mt-2 text-sm leading-relaxed text-white/60">Filter by cards, memberships and offers you already use.</p></div></div></div></div></section>
        <OwnerCta />
      </main>
      <DubaiItRandomizerModal isOpen={randomizerOpen} onClose={() => setRandomizerOpen(false)} />
      <SiteFooter />
    </div>
  );
}