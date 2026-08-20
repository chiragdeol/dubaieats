import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { 
  ArrowUpRight, 
  ChevronRight, 
  MapPin, 
  Search, 
  Sparkles, 
  Star, 
  Utensils, 
  Waves, 
  Wine, 
  BadgePercent,
  Calendar,
  Compass,
  Award,
  Building2,
  Users
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiItRandomizerModal } from "@/components/dubai-it-randomizer-modal";
import { OwnerCta } from "@/components/owner-cta";
import { enrichedRestaurants } from "@/lib/restaurants-enriched";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dubai Food & Dining Guide — Where To Eat, Drink & Book Tables" },
      { name: "description", content: "Explore Dubai’s culinary scene with top places to eat and drink across the city. From fine dining to authentic Emirati cuisine and privilege discounts." },
    ],
  }),
  component: Landing,
});

const moods = [
  { id: "Beachfront", title: "Sea-side & Beach Clubs", copy: "Sunset dining with sea breeze", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85", icon: Waves },
  { id: "Burj View", title: "Skyline & Burj Views", copy: "Dinner under the illuminated skyline", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&q=85", icon: Star },
  { id: "Sunday Brunch", title: "Weekend Brunch Edits", copy: "Long indulgent lunches with friends", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=85", icon: Utensils },
  { id: "Ladies Night", title: "Evening & Speakeasies", copy: "Dubai's award-winning nightlife spots", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=85", icon: Wine },
];

const districts = ["Downtown Dubai", "DIFC", "Palm Jumeirah", "Dubai Marina", "Jumeirah", "Old Dubai / Deira"];

function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [randomizerOpen, setRandomizerOpen] = useState(false);

  const areas = useMemo(() => Array.from(new Set(enrichedRestaurants.map((r) => r.district))).sort(), []);
  const featured = useMemo(() => enrichedRestaurants.filter((r) => !r.isSponsored).slice(0, 4), []);
  const dealsList = useMemo(() => enrichedRestaurants.filter((r) => r.discounts && r.discounts.length > 0).slice(0, 4), []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({
      to: "/restaurants",
      search: {
        area: area === "All" ? undefined : area,
        q: query || undefined,
        discount: selectedPrivileges[0] || undefined
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans text-left">
      <SiteHeader />

      <main>
        
        {/* ── MAJESTIC PALATE HERO BANNER WITH BACKGROUND VIDEO ── */}
        <section className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-6 lg:px-10">
          <div className="relative min-h-[480px] sm:min-h-[580px] overflow-hidden rounded-[32px] bg-[#1A1A1A] text-white shadow-2xl border border-[#2E2E2E]">
            
            {/* Background Autoplay Looping Video */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 scale-105"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                <source src="/792cd443c4.mp4" type="video/mp4" />
              </video>
              {/* Cinematic Dark & Gold Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/85 to-[#1A1A1A]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A]/30" />
            </div>

            {/* Background Decorative Gold Rings */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-1" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none z-1" />

            <div className="relative z-10 mx-auto flex min-h-[480px] sm:min-h-[580px] max-w-5xl items-center px-6 py-14 sm:px-14 lg:px-16">
              <div className="w-full max-w-2xl space-y-6">
                
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-heading">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Majestic Palate Dubai Dining Guide
                </div>

                <h1 className="font-display max-w-2xl text-4xl sm:text-6xl lg:text-[4rem] font-black leading-[1.08] tracking-tight text-white drop-shadow-md">
                  Discover and book the best restaurants in Dubai
                </h1>

                <p className="text-[#E5E5E5] text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-sm">
                  Explore thousands of verified venues, authentic Emirati flavours, Michelin dining, and exclusive Fazaa & Esaad privileges.
                </p>

                {/* Majestic Palate Search Bar */}
                <form
                  onSubmit={submitSearch}
                  className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center bg-white p-2 text-[#1A1A1A] shadow-2xl rounded-2xl sm:rounded-full border border-slate-200 backdrop-blur-md"
                >
                  <label className="flex items-center gap-2.5 px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 sm:w-64">
                    <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#1A1A1A] outline-none cursor-pointer font-heading"
                    >
                      <option value="All">All Dubai Areas</option>
                      {areas.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex min-w-0 flex-1 items-center gap-2.5 px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-[#757575]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cuisine, restaurant, or dish (e.g. Italian, Sushi, Wagyu)..."
                      className="w-full text-xs font-semibold text-[#1A1A1A] outline-none placeholder:text-[#757575]"
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-full bg-[#D4AF37] hover:bg-[#C29D2C] px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] transition-all shadow-md shrink-0 cursor-pointer font-heading"
                  >
                    SEARCH
                  </button>
                </form>

                {/* Quick discovery pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-white/90 font-heading">
                  <span className="text-white/70">Trending:</span>
                  {["DIFC Fine Dining", "Burj Khalifa View", "Fazaa Deals", "Beach Clubs"].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => navigate({ to: "/restaurants", search: { q: t } })}
                      className="bg-black/40 hover:bg-[#D4AF37] hover:text-[#1A1A1A] text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      {t}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 1: ATMOSPHERES & MOODS ── */}
        <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-16 lg:px-10">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="vd-eyebrow mb-2">CURATED EXPERIENCES</p>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-[#0f172a]">
                Find your kind of Dubai vibe
              </h2>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#005971] hover:underline"
            >
              See all experiences <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {moods.map(({ id, title, copy, image, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigate({ to: "/restaurants", search: { vibe: id } })}
                className="group relative aspect-[0.88] overflow-hidden rounded-3xl text-left text-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#005971]/95 via-[#005971]/20 to-transparent" />
                <div className="absolute bottom-0 p-6 space-y-1">
                  <Icon className="mb-4 h-6 w-6 text-amber-300" />
                  <h3 className="font-display font-extrabold text-xl leading-snug">{title}</h3>
                  <p className="text-xs text-white/80 font-normal">{copy}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: TOP RATED ORGANIC RESTAURANTS ── */}
        <section className="bg-slate-100/70 py-20 border-y border-slate-200/60">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="vd-eyebrow mb-2">THE DUBAI EDIT</p>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-[#0f172a]">
                  Iconic Places Worth Knowing
                </h2>
              </div>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#005971] hover:underline"
              >
                Browse all venues <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((restaurant) => (
                <article
                  key={restaurant.slug}
                  className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <Link to="/restaurants/$id" params={{ id: restaurant.slug }}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[#005971] text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        {restaurant.cuisine}
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display font-extrabold text-lg text-[#0f172a] hover:text-[#005971] transition-colors leading-tight">
                          {restaurant.name}
                        </h3>
                        <span className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-black text-white shrink-0">
                          <Star className="h-3 w-3 fill-current" /> {(restaurant.rating * 2).toFixed(1)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        📍 {restaurant.district} · ~AED {restaurant.priceMin}–{restaurant.priceMax}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400">{restaurant.valetInfo.type} Valet</span>
                        <span className="font-bold text-[#005971] flex items-center gap-0.5">
                          View menu <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PRIVILEGE DEALS & CARDS (Fazaa, Esaad, Entertainer) ── */}
        <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="vd-eyebrow mb-2">EXCLUSIVE OFFERS & DISCOUNTS</p>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-[#0f172a]">
                Fazaa, Esaad & Card Privileges
              </h2>
            </div>
            <Link
              to="/deals"
              className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#005971] hover:underline"
            >
              See all privileges directory <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dealsList.map((restaurant) => (
              <Link
                key={`offer-${restaurant.slug}`}
                to="/restaurants/$id"
                params={{ id: restaurant.slug }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[1.35] overflow-hidden bg-slate-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 text-white px-3 py-1 text-[10px] font-extrabold shadow-sm">
                      Up to 25% Off
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-extrabold text-base text-[#0f172a] group-hover:text-[#005971] transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-slate-500">{restaurant.cuisine} · {restaurant.district}</p>

                    {/* Badge array */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {restaurant.discounts?.slice(0, 3).map((d) => (
                        <span key={d} className="bg-amber-500/10 text-amber-800 font-extrabold text-[9px] px-2 py-0.5 rounded-md border border-amber-500/20">
                          💳 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005971] flex items-center gap-1">
                    Book with discount <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: EXPLORE BY DISTRICT (DIFC, Downtown, Palm, Marina, Deira) ── */}
        <section className="bg-white py-20 border-t border-slate-200/80">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-4">
                <p className="vd-eyebrow">NEIGHBOURHOOD DISCOVERY</p>
                <h2 className="font-display text-4xl sm:text-6xl font-black text-[#0f172a] leading-tight">
                  Every corner of Dubai has a culinary story.
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                  From traditional aromatic spice souks in Old Deira to glamorous sky-high restaurants in DIFC and beachfront cabanas on the Palm.
                </p>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-full bg-[#005971] hover:bg-[#00475b] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all"
                >
                  <Compass className="w-4 h-4" /> Open Interactive Dubai Map
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {districts.map((district, index) => (
                  <Link
                    key={district}
                    to="/restaurants"
                    search={{ area: district }}
                    className={`group relative flex min-h-36 items-end overflow-hidden rounded-3xl p-5 transition-all ${
                      index === 0
                        ? "bg-[#005971] text-white shadow-lg"
                        : "bg-slate-50 border border-slate-200 text-[#0f172a] hover:bg-teal-50/50 hover:border-[#005971]/30"
                    }`}
                  >
                    <span className="relative z-10 font-display font-extrabold text-base leading-snug">
                      {district}
                    </span>
                    <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 opacity-60 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: UNBIASED ORGANIC PROMISE ── */}
        <section className="bg-[#005971] px-6 py-20 text-white">
          <div className="mx-auto max-w-[1440px] lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-200">
                  OUR TRANSPARENT COMMITMENT
                </p>
                <h2 className="font-display text-4xl sm:text-6xl font-black leading-tight">
                  100% Unbiased Search.<br />
                  <span className="text-amber-300">No Pay-To-Play.</span>
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md font-normal">
                  Organic search rankings are strictly relevance and rating driven. All sponsored advertisements are clearly marked with [SPONSORED].
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                    ⚖️
                  </div>
                  <h3 className="font-display font-extrabold text-xl">Objective Algorithm</h3>
                  <p className="text-xs leading-relaxed text-white/80 font-normal">
                    Verified guest reviews, pricing accuracy, and DET trade licensing shape every organic listing.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                    💳
                  </div>
                  <h3 className="font-display font-extrabold text-xl">Local Privileges</h3>
                  <p className="text-xs leading-relaxed text-white/80 font-normal">
                    Filter thousands of Dubai spots by Fazaa, Esaad, Emirates Platinum, and UAE bank cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LAST SECTION: ARE YOU A RESTAURANT OWNER? (TheFork Layout) ── */}
        <OwnerCta />
      </main>

      <DubaiItRandomizerModal isOpen={randomizerOpen} onClose={() => setRandomizerOpen(false)} />
      <SiteFooter />
    </div>
  );
}