import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OwnerCta } from "@/components/owner-cta";
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
} from "lucide-react";

export const Route = createFileRoute("/restaurants_/$id")({
  head: ({ params }) => {
    const restaurant = enrichedRestaurants.find((r) => r.slug === params.id);
    return {
      meta: [
        {
          title: restaurant
            ? `${restaurant.name} — Review & Delivery in Dubai`
            : "Dubai-Eat Restaurant Details",
        },
        {
          name: "description",
          content:
            restaurant?.address ||
            "Check out menus, prices, ratings and delivery links on Dubai-Eat.",
        },
      ],
    };
  },
  component: RestaurantDetail,
});

/* ─────────────────────────────────────────────
   Helper: generate a large photo pool (gallery)
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
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
    "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800",
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800",
    "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800",
    "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Rotate the pool based on restaurant name hash so each restaurant has a unique order
  const rotated = [
    ...allPhotos.slice(hash % allPhotos.length),
    ...allPhotos.slice(0, hash % allPhotos.length),
  ];
  return rotated;
}

/* ─────────────────────────────────────────────
   Helper: sample menu by cuisine
───────────────────────────────────────────── */
function getSampleMenu(
  cuisine: string
): { category: string; items: { name: string; desc: string; price: string }[] }[] {
  const c = cuisine.toLowerCase();
  if (c.includes("japanese") || c.includes("sushi"))
    return [
      {
        category: "Starters",
        items: [
          { name: "Edamame", desc: "Sea salt or spicy chili garlic", price: "AED 32" },
          { name: "Yellowtail Sashimi", desc: "Green chili, ponzu, garlic", price: "AED 95" },
          { name: "Shrimp Tempura", desc: "Light batter, dashi dipping sauce", price: "AED 75" },
        ],
      },
      {
        category: "Mains",
        items: [
          { name: "Miso Black Cod", desc: "Sweet miso glaze, hoba leaf", price: "AED 235" },
          { name: "Spicy Beef Tenderloin", desc: "Sesame, red chili, sweet soy", price: "AED 210" },
          { name: "Premium Sushi Platter", desc: "10 nigiri & maki rolls", price: "AED 180" },
        ],
      },
      {
        category: "Desserts",
        items: [
          { name: "Chocolate Fondant", desc: "Caramel center, vanilla ice cream", price: "AED 65" },
          { name: "Mochi Ice Cream", desc: "Coconut, mango, matcha selection", price: "AED 45" },
        ],
      },
    ];
  if (c.includes("italian") || c.includes("pizza") || c.includes("pasta"))
    return [
      {
        category: "Antipasti",
        items: [
          { name: "Burrata Pugliese", desc: "Heirloom tomatoes, basil, EVOO", price: "AED 85" },
          { name: "Calamari Fritti", desc: "Spicy marinara, garlic aioli", price: "AED 75" },
        ],
      },
      {
        category: "Primi & Secondi",
        items: [
          { name: "Truffle Tagliolini", desc: "Black summer truffles, butter sauce", price: "AED 165" },
          { name: "Wood-Fired Diavola", desc: "San Marzano, spicy salami, fior di latte", price: "AED 95" },
          { name: "Branzino al Forno", desc: "Cherry tomatoes, capers, white wine", price: "AED 185" },
        ],
      },
      {
        category: "Dolci",
        items: [
          { name: "Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone", price: "AED 50" },
          { name: "Sicilian Cannoli", desc: "Ricotta, chocolate chips, pistachios", price: "AED 40" },
        ],
      },
    ];
  return [
    {
      category: "Starters",
      items: [
        { name: "Chef's Signature Soup", desc: "Seasonal, sourdough bread", price: "AED 45" },
        { name: "Seared Scallops", desc: "Parsnip puree, crispy pancetta", price: "AED 90" },
      ],
    },
    {
      category: "Mains",
      items: [
        { name: "Angus Ribeye 300g", desc: "Truffle fries, peppercorn sauce", price: "AED 245" },
        { name: "Salmon Fillet", desc: "Asparagus, baby potatoes, lemon butter", price: "AED 175" },
        { name: "Wild Mushroom Risotto", desc: "Chanterelles, aged parmesan", price: "AED 120" },
      ],
    },
    {
      category: "Desserts",
      items: [
        { name: "Warm Apple Tart", desc: "Vanilla ice cream, caramel", price: "AED 55" },
        { name: "Chocolate Lava Cake", desc: "Liquid center, raspberry coulis", price: "AED 60" },
      ],
    },
  ];
}

function callUrl(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
function mapsUrl(name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Dubai")}`;
}

/* ─────────────────────────────────────────────
   Sub-component: Full-screen Gallery Modal
───────────────────────────────────────────── */
function GalleryModal({
  photos,
  startIndex,
  onClose,
}: {
  photos: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white text-sm font-bold">
          {current + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main image */}
      <div
        className="flex-1 flex items-center justify-center relative px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <img
          src={photos[current]}
          alt={`Photo ${current + 1}`}
          className="max-h-[70vh] max-w-full object-contain rounded-xl"
        />
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex gap-2 overflow-x-auto px-6 py-4 shrink-0 scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
              i === current ? "border-amber-400" : "border-transparent opacity-50 hover:opacity-75"
            }`}
          >
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
function RestaurantDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"menu" | "about" | "info">("menu");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);

  const r = useMemo(
    () => enrichedRestaurants.find((item) => item.slug === id),
    [id]
  );

  const relatedRestaurants = useMemo(() => {
    if (!r) return [];
    return enrichedRestaurants
      .filter((item) => item.slug !== r.slug && item.area === r.area)
      .slice(0, 4);
  }, [r]);

  if (!r) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Restaurant Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            The restaurant you're looking for does not exist in our directory.
          </p>
          <Link
            to="/restaurants"
            className="inline-block mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold text-xs"
          >
            Back to Catalog
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const gallery = [r.image, ...buildGallery(r.name)];
  const liveStatus = isCurrentlyOpenInDubai(r.hours);
  const cleanPhone = r.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi!%20I'd%20like%20to%20check%20table%20availability%20for%20${encodeURIComponent(r.name)}%20via%20Dubai-Eat.`;
  const sampleMenu = getSampleMenu(r.cuisine);

  const openGallery = (idx: number) => {
    setGalleryStart(idx);
    setGalleryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Gallery Modal */}
      {galleryOpen && (
        <GalleryModal
          photos={gallery}
          startIndex={galleryStart}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* ── HERO PHOTO COLLAGE (TheFork Style) ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-3xl overflow-hidden">
          {/* Large main photo */}
          <button
            onClick={() => openGallery(0)}
            className="col-span-2 row-span-2 relative overflow-hidden group bg-secondary"
          >
            <img
              src={gallery[0]}
              alt={r.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
          {/* 4 smaller photos */}
          {gallery.slice(1, 5).map((ph, i) => (
            <button
              key={i}
              onClick={() => openGallery(i + 1)}
              className="relative overflow-hidden group bg-secondary"
            >
              <img
                src={ph}
                alt={`${r.name} photo ${i + 2}`}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              {/* "See all photos" overlay on last visible tile */}
              {i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-extrabold">{gallery.length}+</span>
                  <span className="text-xs font-bold mt-0.5">See all photos</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── MAIN LAYOUT ── */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-10 text-left">

          {/* TITLE BLOCK (TheFork style) */}
          <div className="space-y-3">
            {/* Breadcrumb */}
            <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">{r.name}</span>
            </nav>

            {/* Badge row */}
            <div className="flex flex-wrap gap-2">
              {r.michelin && (
                <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Award className="w-3 h-3 fill-current" /> Michelin Selected
                </span>
              )}
              {r.liquor === "Licensed" && (
                <span className="bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-600/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  🍷 Licensed Bar
                </span>
              )}
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                ✅ Verified Listing
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-none">
              {r.name}
            </h1>

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-500 text-white font-extrabold text-sm px-2.5 py-0.5 rounded-lg">
                  {(r.rating * 2).toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(r.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-gray-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <a
                  href={mapsUrl(r.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  {r.reviews} reviews
                </a>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{r.cuisine}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">~AED {r.priceMin}–{r.priceMax} pp</span>
            </div>

            {/* Address row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {r.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {liveStatus.isOpen ? (
                  <span className="text-emerald-600 font-bold">Open Now</span>
                ) : (
                  <span className="text-rose-600 font-bold">Closed</span>
                )}
                <span className="ml-1">{r.hours}</span>
              </span>
            </div>

            {/* Action row */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: r.name, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose-500 border border-border rounded-full px-3 py-1.5 transition-colors">
                <Heart className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={() => openGallery(0)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary border border-border rounded-full px-3 py-1.5 transition-colors"
              >
                📷 {gallery.length}+ Photos
              </button>
            </div>
          </div>

          {/* ── TABS ── */}
          <div>
            <div className="flex border-b border-border gap-1">
              {(["menu", "about", "info"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "menu" ? "🍽️ Menu" : tab === "about" ? "💬 Details" : "📍 Location"}
                </button>
              ))}
            </div>

            {/* TAB: MENU */}
            {activeTab === "menu" && (
              <div className="space-y-8 pt-8">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Menu items and prices are compiled from Google Maps listings and official restaurant websites. Prices may vary — please confirm with the venue.
                  </p>
                </div>

                {sampleMenu.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="font-display font-extrabold text-lg text-foreground mb-4 pb-2 border-b border-border/60">
                      {cat.category}
                    </h3>
                    <div className="space-y-5">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex justify-between items-start gap-6 group">
                          <div>
                            <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                          <span className="font-extrabold text-sm text-foreground whitespace-nowrap shrink-0">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: ABOUT / DETAILS */}
            {activeTab === "about" && (
              <div className="space-y-8 pt-8">
                {/* Quick info grid (TheFork style) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: "🍽️", label: "Cuisine", val: r.cuisine },
                    { icon: "💰", label: "Avg. bill", val: `AED ${r.priceMin}–${r.priceMax}` },
                    { icon: "📍", label: "Neighborhood", val: r.area },
                    { icon: "🕐", label: "Hours", val: r.hours },
                    { icon: "🍷", label: "Alcohol", val: r.liquor || "Non-Licensed" },
                    { icon: "⭐", label: "Rating", val: `${(r.rating * 2).toFixed(1)} / 10` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-secondary/30 border border-border/60 rounded-2xl p-4 space-y-1"
                    >
                      <p className="text-lg">{s.icon}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </p>
                      <p className="font-bold text-xs text-foreground">{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-display font-extrabold text-lg text-foreground mb-4 pb-2 border-b border-border/60">
                    Amenities & Perks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        ok: r.liquor === "Licensed",
                        icon: <Wine className="w-4 h-4" />,
                        label: "Licensed (Alcohol)",
                      },
                      {
                        ok: r.seatingPerks?.includes("Burj View"),
                        icon: "🏙️",
                        label: "Burj Khalifa View",
                      },
                      {
                        ok: r.seatingPerks?.includes("Beachfront"),
                        icon: "🏖️",
                        label: "Beachfront Dining",
                      },
                      {
                        ok: r.seatingPerks?.includes("AC Terrace"),
                        icon: <Wind className="w-4 h-4" />,
                        label: "AC Terrace Seating",
                      },
                      {
                        ok: r.logistics?.includes("Complimentary Valet"),
                        icon: <Car className="w-4 h-4" />,
                        label: "Free Valet Parking",
                      },
                      {
                        ok: r.occasions?.includes("Kid Friendly"),
                        icon: <Baby className="w-4 h-4" />,
                        label: "Kid Friendly",
                      },
                      {
                        ok: r.occasions?.includes("Business Lunch"),
                        icon: <Briefcase className="w-4 h-4" />,
                        label: "Business Lunch",
                      },
                      {
                        ok: r.logistics?.includes("Shisha Available"),
                        icon: "💨",
                        label: "Shisha Available",
                      },
                      {
                        ok: r.occasions?.includes("Sunday Brunch"),
                        icon: "🥂",
                        label: "Sunday Brunch",
                      },
                    ].map((a) => (
                      <div
                        key={a.label}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-colors ${
                          a.ok
                            ? "bg-primary/10 border-primary/25 text-primary"
                            : "bg-secondary/15 border-border/40 text-muted-foreground/50 line-through"
                        }`}
                      >
                        <span>{typeof a.icon === "string" ? a.icon : a.icon}</span>
                        <span>{a.label}</span>
                        {a.ok && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LOCATION */}
            {activeTab === "info" && (
              <div className="space-y-8 pt-8">
                {/* Hours card */}
                <div className="bg-secondary/20 rounded-2xl border border-border/80 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Opening Hours
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                    ].map((day) => (
                      <div
                        key={day}
                        className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0"
                      >
                        <span className="font-semibold text-foreground">{day}</span>
                        <span className="text-muted-foreground">{r.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${liveStatus.isOpen ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    <span className={`w-2 h-2 rounded-full ${liveStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {liveStatus.isOpen ? "Open right now in Dubai" : "Currently closed"}
                  </div>
                </div>

                {/* Map embed placeholder */}
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                  <div className="bg-secondary/30 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.address}</p>
                    </div>
                    <a
                      href={mapsUrl(r.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Get Directions
                    </a>
                  </div>
                  <div className="h-64 bg-secondary/20 flex flex-col items-center justify-center text-center p-8 space-y-2">
                    <MapPin className="w-10 h-10 text-primary" />
                    <p className="font-bold text-sm text-foreground">Map Navigation</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Click "Get Directions" above to open this restaurant in Google Maps for turn-by-turn navigation.
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={callUrl(r.phone)}
                    className="flex items-center gap-3 p-4 bg-secondary/20 border border-border/60 rounded-2xl hover:border-primary/30 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone</p>
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{r.phone}</p>
                    </div>
                  </a>
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-secondary/20 border border-border/60 rounded-2xl hover:border-primary/30 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</p>
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-[160px]">
                        {r.website.replace(/^https?:\/\//, "").split("/")[0]}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── PHOTO GALLERY STRIP ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-xl text-foreground">
                📷 Photos ({gallery.length}+)
              </h2>
              <button
                onClick={() => openGallery(0)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {gallery.slice(0, 15).map((ph, i) => (
                <button
                  key={i}
                  onClick={() => openGallery(i)}
                  className={`relative overflow-hidden rounded-xl bg-secondary group ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <img
                    src={ph}
                    alt={`${r.name} photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {i === 14 && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                      <span className="text-xl font-extrabold">+{gallery.length - 14}</span>
                      <span className="text-[10px] font-bold">more</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-card border border-border/90 rounded-3xl p-6 shadow-lg space-y-5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-foreground">
                  Reserve a Table
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We redirect you directly to the venue's official booking platform — no middleman.
                </p>
              </div>

              {/* Open/Closed status pill */}
              <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border ${liveStatus.isOpen ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${liveStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
                {liveStatus.isOpen ? "Open Now · " : "Currently Closed · "}
                <span className="font-normal">{r.hours}</span>
              </div>

              <div className="space-y-2.5">
                <a
                  href={r.bookingPlatform?.url || r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm transition-all text-center"
                >
                  <Calendar className="h-4 w-4" />
                  Reserve via {r.bookingPlatform?.name || "Official Website"}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-extrabold transition-all text-center"
                >
                  <MessageSquare className="h-4 w-4 fill-current" />
                  💬 WhatsApp Concierge
                </a>
              </div>

              {/* Delivery section */}
              <div className="border-t border-border/50 pt-4 space-y-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  🛵 Order Delivery
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { href: r.deliveryLinks?.deliveroo, emoji: "🛵", label: "Deliveroo", color: "text-[#00cdbc]", bg: "bg-[#00cdbc]/10 border-[#00cdbc]/25" },
                    { href: r.deliveryLinks?.talabat, emoji: "🚚", label: "Talabat", color: "text-[#ff5a00]", bg: "bg-[#ff5a00]/10 border-[#ff5a00]/25" },
                    { href: r.deliveryLinks?.noon, emoji: "🟡", label: "Noon", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-400/25" },
                    { href: r.deliveryLinks?.careem, emoji: "🟢", label: "Careem", color: "text-[#47a13c] dark:text-[#5ce74f]", bg: "bg-green-500/10 border-green-500/25" },
                    { href: r.deliveryLinks?.keeta, emoji: "⏺️", label: "Keeta", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10 border-sky-500/25" },
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

              {/* Utility links */}
              <div className="border-t border-border/50 pt-4 flex justify-between text-xs font-bold text-muted-foreground">
                <a href={callUrl(r.phone)} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Call
                </a>
                <a href={mapsUrl(r.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Map
                </a>
                <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── RELATED RESTAURANTS IN SAME AREA ── */}
      {relatedRestaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-border/60">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Also in {r.area}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                More restaurants nearby
              </h2>
            </div>
            <Link
              to="/restaurants"
              search={{ area: r.area }}
              className="text-xs font-bold text-primary hover:underline hidden md:flex items-center gap-1"
            >
              See all in {r.area} <ArrowRight className="w-3.5 h-3.5" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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

      {/* ── OWNER CTA ── */}
      <OwnerCta />

      <SiteFooter />
    </div>
  );
}
