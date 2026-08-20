import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OwnerCta } from "@/components/owner-cta";
import { DigitalMenu } from "@/components/digital-menu";
import { DepositModal } from "@/components/deposit-modal";
import { isCurrentlyOpenInDubai } from "@/lib/opening-hours";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Calendar,
  MessageSquare,
  UtensilsCrossed,
  Info,
  Clock,
  Award,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2,
  Car,
  Wind,
  Wifi,
  Baby,
  Briefcase,
  Wine,
  ArrowRight,
  ShieldCheck,
  BadgePercent,
  Dog,
  Accessibility,
  Shirt
} from "lucide-react";

export const Route = createFileRoute("/restaurants_/$id")({
  head: ({ params }) => {
    const restaurant = enrichedRestaurants.find((r) => r.slug === params.id);
    return {
      meta: [
        {
          title: restaurant
            ? `${restaurant.name} — Review, Menu, Deals & Booking in Dubai`
            : "Dubai Eat Restaurant Details",
        },
        {
          name: "description",
          content:
            restaurant?.address ||
            "Check out digital menus, dish search, Fazaa & Esaad deals, ratings and reservations on Dubai Eat.",
        },
      ],
    };
  },
  component: RestaurantDetail,
});

/* ─────────────────────────────────────────────
   Helper: generate photo pool
───────────────────────────────────────────── */
function buildGallery(name: string): string[] {
  const allPhotos = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800",
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800",
    "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?w=800",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [...allPhotos.slice(hash % allPhotos.length), ...allPhotos.slice(0, hash % allPhotos.length)];
}

function callUrl(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function mapsUrl(name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Dubai")}`;
}

function RestaurantDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"menu" | "about" | "info">("menu");
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  // Gallery lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const r = useMemo(() => {
    return enrichedRestaurants.find((item) => item.slug === id) || null;
  }, [id]);

  const gallery = useMemo(() => {
    if (!r) return [];
    return [r.image, ...buildGallery(r.name)];
  }, [r]);

  const relatedRestaurants = useMemo(() => {
    if (!r) return [];
    return enrichedRestaurants
      .filter((item) => item.slug !== r.slug && item.district === r.district)
      .slice(0, 4);
  }, [r]);

  if (!r) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <SiteHeader />
        <div className="py-24 text-center">
          <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Venue Not Found</h2>
          <p className="text-muted-foreground text-sm mt-1">This restaurant listing could not be found.</p>
          <Link
            to="/restaurants"
            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs"
          >
            Browse All Eateries
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const liveStatus = isCurrentlyOpenInDubai(r.hours);
  const whatsappUrl = `https://wa.me/971562730030?text=Hi%20${encodeURIComponent(r.name)}%2C%20I%20found%20your%20venue%20on%20Dubai%20Eat.%20I%27d%20like%20to%20inquire%20about%20table%20availability.`;

  const openGallery = (idx = 0) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans text-left">
      <SiteHeader />

      <DepositModal
        restaurant={r}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      {/* ── PHOTO GALLERY LIGHTBOX ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={gallery[lightboxIndex]}
            alt={`${r.name} photo`}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white text-xs font-bold font-heading">{lightboxIndex + 1} / {gallery.length}</span>
            <button
              onClick={() => setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── HERO BANNER PHOTOS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[340px] sm:h-[420px] rounded-3xl overflow-hidden shadow-md relative">
          <div
            onClick={() => openGallery(0)}
            className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden bg-slate-100"
          >
            <img
              src={gallery[0]}
              alt={r.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-[#1A1A1A] text-xs font-bold font-heading bg-[#D4AF37] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              👑 Main Showcase
            </span>
          </div>

          <div
            onClick={() => openGallery(1)}
            className="hidden md:block h-full relative cursor-pointer group overflow-hidden bg-slate-100"
          >
            <img
              src={gallery[1]}
              alt={`${r.name} dining room`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
            <div
              onClick={() => openGallery(2)}
              className="relative cursor-pointer group overflow-hidden bg-slate-100"
            >
              <img
                src={gallery[2]}
                alt={`${r.name} dish`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => openGallery(3)}
              className="relative cursor-pointer group overflow-hidden bg-slate-100"
            >
              <img
                src={gallery[3]}
                alt={`${r.name} dish preview`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs font-heading">
                +{gallery.length - 4} More Photos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT & SIDEBAR ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Title Info */}
          <div className="space-y-4 border-b border-[#EAEAEA] pb-6">
            <div className="flex flex-wrap items-center gap-2 font-heading">
              {r.michelin && (
                <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Award className="w-3 h-3 fill-[#D4AF37]" /> Michelin Selected
                </span>
              )}
              {r.liquor === "Licensed" && (
                <span className="bg-[#F5F5F5] text-[#1A1A1A] border border-[#E0E0E0] text-[10px] font-bold px-3 py-1 rounded-full">
                  🍷 Licensed Bar
                </span>
              )}
              <span className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] text-[10px] font-bold px-3 py-1 rounded-full">
                ✓ Verified Venue
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#1A1A1A] tracking-tight leading-none">
              {r.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-sans">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-black text-sm px-2.5 py-0.5 rounded-lg font-heading">
                  {(r.rating * 2).toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(r.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <a href={mapsUrl(r.name)} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] font-bold font-heading hover:underline">
                  {r.reviews} reviews
                </a>
              </div>
              <span className="text-[#757575]">·</span>
              <span className="text-[#757575]">{r.cuisine}</span>
              <span className="text-[#757575]">·</span>
              <span className="text-[#1A1A1A] font-semibold">~AED {r.priceMin}–{r.priceMax} pp</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#757575] font-sans">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {r.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                {liveStatus.isOpen ? (
                  <span className="text-emerald-700 font-bold font-heading">Open Now</span>
                ) : (
                  <span className="text-rose-600 font-bold font-heading">Closed</span>
                )}
                <span className="ml-1">{r.hours}</span>
              </span>
            </div>

            {/* Accepted Privileges Cards Banner */}
            {r.discounts && r.discounts.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  <BadgePercent className="w-4 h-4" /> Accepted Privilege Cards & Special Rates
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.discounts.map(d => (
                    <span key={d} className="bg-background border border-amber-500/30 text-foreground font-bold text-xs px-3 py-1 rounded-xl shadow-2xs">
                      💳 {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="space-y-6">
            <div className="flex border-b border-border gap-2">
              {[
                { id: "menu", label: "🍽️ Digital Menu & Dishes" },
                { id: "about", label: "📋 Practical Info & Policies" },
                { id: "info", label: "📍 Location & Contact" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`py-3 px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: DIGITAL MENU */}
            {activeTab === "menu" && (
              <DigitalMenu restaurantName={r.name} items={r.digitalMenu || []} />
            )}

            {/* TAB: PRACTICAL INFO & POLICIES (PDF Section 2) */}
            {activeTab === "about" && (
              <div className="space-y-8">
                
                {/* Practical Information Matrix */}
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="font-display font-extrabold text-xl text-foreground flex items-center gap-2 border-b border-border pb-4">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Practical Information & Venue Policies
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Car className="w-4 h-4" /> Valet & Parking
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.valetInfo.type} Parking</p>
                      <p className="text-[11px] text-muted-foreground">{r.valetInfo.cost}</p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Shirt className="w-4 h-4" /> Dress Code
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.dressCode}</p>
                      <p className="text-[11px] text-muted-foreground">Smart attire encouraged; swimwear restricted indoors.</p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Baby className="w-4 h-4" /> Child & Age Policy
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.childPolicy}</p>
                      <p className="text-[11px] text-muted-foreground">Children under 12 must be accompanied by an adult.</p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Dog className="w-4 h-4" /> Pet Policy
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.petPolicy}</p>
                      <p className="text-[11px] text-muted-foreground">Water bowls available on outdoor terrace upon request.</p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Accessibility className="w-4 h-4" /> Wheelchair Accessibility
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.accessibility}</p>
                      <p className="text-[11px] text-muted-foreground">Step-free access & accessible washrooms available.</p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Wine className="w-4 h-4" /> Alcohol & Shisha
                      </div>
                      <p className="text-xs font-extrabold text-foreground">{r.liquor}</p>
                      <p className="text-[11px] text-muted-foreground">{r.logistics?.includes("Shisha Available") ? "Shisha lounge available outdoors" : "Non-shisha venue"}</p>
                    </div>
                  </div>

                  {/* Dietary Certifications */}
                  <div className="pt-2">
                    <h4 className="font-extrabold text-sm text-foreground mb-2">Dietary Certifications & Options</h4>
                    <div className="flex flex-wrap gap-2">
                      {r.dietaryTags.map(tag => (
                        <span key={tag} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-xl">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  {r.awardsList.length > 0 && (
                    <div className="pt-2">
                      <h4 className="font-extrabold text-sm text-foreground mb-2">Awards & Recognition</h4>
                      <div className="flex flex-wrap gap-2">
                        {r.awardsList.map(a => (
                          <span key={a} className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-extrabold text-xs px-3 py-1 rounded-xl flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LOCATION & CONTACT */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Venue Location & Directions
                  </h3>
                  <p className="text-xs text-muted-foreground">{r.address}</p>
                  
                  <div className="bg-muted/30 border border-border rounded-2xl p-6 text-center space-y-3">
                    <MapPin className="w-10 h-10 text-primary mx-auto" />
                    <p className="font-bold text-sm text-foreground">{r.name} in {r.district}</p>
                    <a
                      href={mapsUrl(r.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-extrabold text-xs px-6 py-3 rounded-xl shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Open in Google Maps Navigation
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <a
                      href={callUrl(r.phone)}
                      className="flex items-center gap-3 p-4 bg-muted/40 border border-border rounded-2xl hover:border-primary/40 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                        <p className="font-bold text-xs text-foreground">{r.phone}</p>
                      </div>
                    </a>

                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-muted/40 border border-border rounded-2xl hover:border-primary/40 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Official Website</p>
                        <p className="font-bold text-xs text-foreground truncate max-w-[180px]">{r.website}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR: RESERVATIONS, DEPOSIT & DELIVERY (PDF Section 3 & 4) ── */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-5">
            
            {/* Reservation Gateway Card */}
            <div className="bg-card border border-border/90 rounded-3xl p-6 shadow-xl space-y-5 text-left">
              <div>
                <h3 className="font-display font-black text-xl text-foreground">
                  Table Reservations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Direct official booking links with zero booking commission fees.
                </p>
              </div>

              {/* Status Pill */}
              <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border ${
                liveStatus.isOpen ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${liveStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
                {liveStatus.isOpen ? "Open Now · " : "Currently Closed · "}
                <span className="font-normal">{r.hours}</span>
              </div>

              {/* Multi-Platform Reservation Options (PDF Section 4: SevenRooms, EatApp, ReserveOut, OpenTable, WhatsApp) */}
              <div className="space-y-2.5">
                <a
                  href={r.bookingPlatform?.url || r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm transition-all text-center"
                >
                  <Calendar className="h-4 w-4" />
                  Book via {r.bookingPlatform?.name || "Official Engine"}
                </a>

                {/* VIP Table Deposit Modal Trigger */}
                <button
                  onClick={() => setIsDepositOpen(true)}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:opacity-95 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm transition-all"
                >
                  <ShieldCheck className="h-4 w-4 fill-white" />
                  VIP Table Deposit (Stripe / Telr)
                </button>

                {/* WhatsApp Fallback */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-extrabold transition-all text-center"
                >
                  <MessageSquare className="h-4 w-4 fill-current text-emerald-500" />
                  WhatsApp Direct Concierge
                </a>
              </div>

              {/* Delivery Hub Matrix (PDF Section 3: Keeta, Deliveroo, Talabat, Careem Food, Noon Food) */}
              <div className="border-t border-border/50 pt-4 space-y-2.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  🛵 Online Food Delivery Links
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { href: r.deliveryLinks?.keeta, emoji: "⏺️", label: "Keeta", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10 border-sky-500/25" },
                    { href: r.deliveryLinks?.deliveroo, emoji: "🛵", label: "Deliveroo", color: "text-[#00cdbc]", bg: "bg-[#00cdbc]/10 border-[#00cdbc]/25" },
                    { href: r.deliveryLinks?.talabat, emoji: "🚚", label: "Talabat", color: "text-[#ff5a00]", bg: "bg-[#ff5a00]/10 border-[#ff5a00]/25" },
                    { href: r.deliveryLinks?.careem, emoji: "🟢", label: "Careem", color: "text-[#47a13c] dark:text-[#5ce74f]", bg: "bg-green-500/10 border-green-500/25" },
                    { href: r.deliveryLinks?.noon, emoji: "🟡", label: "Noon", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-400/25" },
                  ].map((d) => (
                    <a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={d.label}
                      className={`${d.bg} ${d.color} border p-2 rounded-xl flex flex-col items-center gap-0.5 hover:scale-105 transition-transform text-center`}
                    >
                      <span className="text-base">{d.emoji}</span>
                      <span className="text-[8px] font-bold">{d.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── RELATED RESTAURANTS IN SAME DISTRICT ── */}
      {relatedRestaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-border/60">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Also in {r.district}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                More restaurants nearby
              </h2>
            </div>
            <Link
              to="/restaurants"
              search={{ area: r.district }}
              className="text-xs font-bold text-primary hover:underline hidden md:flex items-center gap-1"
            >
              See all in {r.district} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedRestaurants.map((rel) => (
              <Link
                key={rel.slug}
                to="/restaurants/$id"
                params={{ id: rel.slug || "" }}
                className="group bg-card border border-border/80 rounded-2xl overflow-hidden hover:shadow-md transition-all block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-emerald-500 text-white font-extrabold text-xs px-1.5 py-0.5 rounded-md">
                    {(rel.rating * 2).toFixed(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{rel.cuisine}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">AED {rel.priceMin}–{rel.priceMax} pp</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <OwnerCta />
      <SiteFooter />
    </div>
  );
}
