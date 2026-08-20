import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OwnerCta } from "@/components/owner-cta";
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
  Clock,
  Award,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  BadgePercent,
  QrCode,
  Image as ImageIcon,
  Flame,
  ChevronDown,
  Tag,
  Car,
  Shirt,
  Baby,
  Dog,
  Accessibility,
  Wine,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/restaurants_/$id")({
  head: ({ params }) => {
    const restaurant = enrichedRestaurants.find((r) => r.slug === params.id);
    return {
      meta: [
        {
          title: restaurant
            ? `${restaurant.name} — Reviews, Digital QR Menu & Table Booking in Dubai`
            : "Dubai Eats Restaurant Details",
        },
        {
          name: "description",
          content:
            restaurant?.address ||
            "Explore digital QR menus, food photo galleries, diner reviews, and direct table bookings on Dubai Eats.",
        },
      ],
    };
  },
  component: RestaurantDetail,
});

function buildGallery(name: string): string[] {
  const allPhotos = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1000",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1000",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1000",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1000"
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [...allPhotos.slice(hash % allPhotos.length), ...allPhotos.slice(0, hash % allPhotos.length)];
}

function RestaurantDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"about" | "menu" | "reviews">("about");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Gallery & QR Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Booking Widget Form state
  const [bookingDate, setBookingDate] = useState("2026-08-20");
  const [bookingTime, setBookingTime] = useState("20:00");
  const [bookingGuests, setBookingGuests] = useState("2");

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
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between text-left">
        <SiteHeader />
        <div className="py-24 text-center">
          <UtensilsCrossed className="h-16 w-16 mx-auto text-[#757575] mb-4" />
          <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">Venue Not Found</h2>
          <p className="text-[#757575] text-sm mt-1">This restaurant listing could not be found.</p>
          <Link
            to="/restaurants"
            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#1A1A1A] text-white font-bold font-heading text-xs"
          >
            Browse All Restaurants
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const liveStatus = isCurrentlyOpenInDubai(r.hours);
  const whatsappUrl = `https://wa.me/971562730030?text=Hi%20${encodeURIComponent(r.name)}%2C%20I%20found%20your%20venue%20on%20Dubai%20Eats.%20I%27d%20like%20to%20inquire%20about%20table%20availability.`;

  const openGallery = (idx = 0) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const scrollToSection = (tab: "about" | "menu" | "reviews") => {
    setActiveTab(tab);
    const el = document.getElementById(`section-${tab}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 cursor-pointer"
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
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white text-xs font-semibold font-heading">{lightboxIndex + 1} / {gallery.length}</span>
            <button
              onClick={() => setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── DIGITAL QR CODE MODAL ── */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl relative border border-[#EAEAEA]">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#757575] hover:text-[#1A1A1A] rounded-full hover:bg-[#F5F5F5] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold font-heading uppercase text-[#D4AF37] bg-[#FBF6E9] px-3 py-1 rounded-full border border-[#EFE2B9]">
                <QrCode className="w-3.5 h-3.5" /> Official Digital Menu
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">{r.name}</h3>
              <p className="text-xs text-[#757575]">Scan on your phone to view live prices, ingredients, and chef specials.</p>
            </div>

            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-[#E0E0E0] inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(r.website || 'https://dubaieats.ae/restaurants/' + r.slug)}`}
                alt="Digital QR Menu"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="text-[11px] text-[#757575] font-mono">
              Direct Link: <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline font-bold">Open Menu in Browser</a>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8">
        
        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#757575] font-heading">
          <Link to="/" className="text-[#1A1A1A] font-semibold hover:text-[#D4AF37]">Home</Link>
          <span>›</span>
          <Link to="/restaurants" className="text-[#1A1A1A] font-semibold hover:text-[#D4AF37]">Dubai restaurants</Link>
          <span>›</span>
          <span>{r.name}</span>
        </div>

        {/* ── 1. HEADER SECTION & THEFORK PHOTO GRID (Screenshot 1) ── */}
        <section className="space-y-4">
          
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                {r.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] font-sans flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{r.address || `${r.district}, Dubai`}</span>
              </p>
              <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium font-sans">
                🍽️ {r.cuisine} · Average price AED {r.priceMin}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-xs text-[#757575] font-sans">
                <span className="inline-flex items-center gap-1 font-heading font-bold text-sm text-[#1A1A1A]">
                  ★ {(r.rating * 2).toFixed(1)}
                </span>
                <span className="font-semibold text-[#1A1A1A] font-heading">({r.reviews} reviews)</span>
                <span>·</span>
                <span className="text-[#757575]">71 reviews in the last 30 days</span>
              </div>
            </div>

            {/* Favorite Heart Button */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              aria-label="Save to favorites"
              className="p-3 rounded-full border border-[#E0E0E0] bg-white hover:bg-[#F5F5F5] transition-all shadow-xs cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${bookmarked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#1A1A1A]"}`} />
            </button>
          </div>

          {/* 4-Photo Grid Gallery (TheFork Layout with +150 Photos) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-sm">
            
            {/* Left Large Photo */}
            <div
              onClick={() => openGallery(0)}
              className="md:col-span-5 h-full relative cursor-pointer group overflow-hidden bg-slate-100"
            >
              <img
                src={gallery[0]}
                alt={`${r.name} facade`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Middle Interior Photo */}
            <div
              onClick={() => openGallery(1)}
              className="hidden md:block md:col-span-4 h-full relative cursor-pointer group overflow-hidden bg-slate-100"
            >
              <img
                src={gallery[1]}
                alt={`${r.name} dining room`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right 2 Stacked Photos */}
            <div className="hidden md:grid md:col-span-3 grid-rows-2 gap-3 h-full">
              <div
                onClick={() => openGallery(2)}
                className="relative cursor-pointer group overflow-hidden bg-slate-100 rounded-2xl"
              >
                <img
                  src={gallery[2]}
                  alt={`${r.name} food dish`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Right Photo with +150 Photos Badge */}
              <div
                onClick={() => openGallery(3)}
                className="relative cursor-pointer group overflow-hidden bg-slate-100 rounded-2xl"
              >
                <img
                  src={gallery[3]}
                  alt={`${r.name} gallery preview`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/55 hover:bg-black/70 transition-colors flex items-center justify-center text-white font-bold text-sm font-heading gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>+150 photos</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── 2. TABS BAR & TWO-COLUMN WORKSPACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: ABOUT, MENU, REVIEWS ── */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Navigation Tabs Header */}
            <div className="flex items-center gap-8 border-b border-[#EAEAEA] text-sm font-semibold font-heading sticky top-20 bg-[#F5F5F5] pt-2 z-20">
              {[
                { id: "about", label: "About" },
                { id: "menu", label: "Menu" },
                { id: "reviews", label: "Reviews" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => scrollToSection(t.id as any)}
                  className={`pb-3 transition-all cursor-pointer relative ${
                    activeTab === t.id
                      ? "text-[#1A1A1A] font-bold"
                      : "text-[#757575] hover:text-[#1A1A1A]"
                  }`}
                >
                  <span>{t.label}</span>
                  {activeTab === t.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* ── SECTION: ABOUT & PRACTICAL POLICIES ── */}
            <div id="section-about" className="space-y-6 scroll-mt-28">
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1A1A1A]">
                  About {r.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#757575] leading-relaxed font-sans font-normal">
                  {r.description || `Experience world-class culinary excellence at ${r.name}, located in the heart of ${r.district}, Dubai. Featuring master chefs, curated beverage selections, and exceptional luxury service.`}
                </p>

                {/* Practical Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans text-xs">
                  <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-[#D4AF37]" /> Valet Parking</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{r.valetInfo.type} ({r.valetInfo.cost})</strong>
                  </div>
                  <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><Shirt className="w-3.5 h-3.5 text-[#D4AF37]" /> Dress Code</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{r.dressCode}</strong>
                  </div>
                  <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Hours</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{r.hours}</strong>
                  </div>
                  <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><Wine className="w-3.5 h-3.5 text-[#D4AF37]" /> Alcohol License</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{r.liquor}</strong>
                  </div>
                </div>

                {/* Privilege Card tags */}
                {r.discounts && r.discounts.length > 0 && (
                  <div className="bg-[#FBF6E9] border border-[#EFE2B9] p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-semibold font-heading text-[#9C7D1A] uppercase tracking-wider flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4" /> Accepted Privilege Offers
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {r.discounts.map(d => (
                        <span key={d} className="bg-white border border-[#EFE2B9] text-[#9C7D1A] font-semibold text-xs px-3 py-1 rounded-xl shadow-2xs font-heading">
                          💳 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── SECTION: RESTAURANT MENU ── */}
            <div id="section-menu" className="space-y-6 scroll-mt-28">
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                  Restaurant menu
                </h3>

                {/* 2-Card Row: Menu Photo (QR Code) & Food Photo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: Menu photo with QR Code */}
                  <div
                    onClick={() => setQrModalOpen(true)}
                    className="p-5 rounded-2xl border border-[#EAEAEA] bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-white border border-[#E0E0E0] p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <QrCode className="w-12 h-12 text-[#1A1A1A]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-base text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">
                        Menu photo
                      </h4>
                      <p className="text-xs text-[#757575] font-sans font-normal">8 photos · Scan QR Code</p>
                      <span className="inline-block text-[11px] font-semibold font-heading text-[#D4AF37] pt-1">
                        View Digital Menu →
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Food photo gallery */}
                  <div
                    onClick={() => openGallery(0)}
                    className="p-5 rounded-2xl border border-[#EAEAEA] bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <img
                      src={gallery[2] || r.image}
                      alt="Food photo"
                      className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform bg-slate-200"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-base text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">
                        Food photo
                      </h4>
                      <p className="text-xs text-[#757575] font-sans font-normal">+150 photos</p>
                      <span className="inline-block text-[11px] font-semibold font-heading text-[#D4AF37] pt-1">
                        View Food Gallery →
                      </span>
                    </div>
                  </div>

                </div>

                {/* Practical Cuisine & Price Info Box */}
                <div className="border border-[#EAEAEA] rounded-2xl divide-y divide-[#EAEAEA] font-sans text-xs bg-white">
                  <div className="p-4 flex items-center gap-3">
                    <UtensilsCrossed className="w-4 h-4 text-[#757575] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1A1A1A]">Type of cuisine</div>
                      <div className="text-[#757575]">{r.cuisine}</div>
                    </div>
                  </div>

                  <div className="p-4 flex items-center gap-3">
                    <Tag className="w-4 h-4 text-[#757575] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1A1A1A]">Average price</div>
                      <div className="text-[#757575]">AED {r.priceMin}</div>
                    </div>
                  </div>

                  <div className="p-4 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#757575] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1A1A1A]">Dietary options</div>
                      <div className="text-[#757575]">Halal certified, Vegetarian dishes, Gluten-Free available</div>
                    </div>
                  </div>
                </div>

                {/* A La Carte Dishes List */}
                <div className="space-y-4 pt-4 border-t border-[#EAEAEA]">
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
                    Signature Dishes & À La Carte
                  </h4>

                  <div className="divide-y divide-[#EAEAEA]">
                    {(r.digitalMenu && r.digitalMenu.length > 0 ? r.digitalMenu : [
                      { id: "1", name: "Black Cod Miso (Gindara)", price: 245, description: "Sweet miso marinated black cod wrapped in hoba leaf" },
                      { id: "2", name: "Thinly Sliced Seabass with Yuzu & Truffle", price: 135, description: "Fresh seabass carpaccio with salmon roe, yuzu oil, and winter truffle" },
                      { id: "3", name: "Japanese Wagyu Ribeye Tataki (Grade A5)", price: 320, description: "Seared A5 Wagyu beef slices with ponzu and crispy garlic chips" },
                      { id: "4", name: "Artisanal Chocolate Fondant with Green Tea Ice Cream", price: 75, description: "Warm molten chocolate dome with premium Uji matcha green tea ice cream" }
                    ]).map((dish: any) => (
                      <div key={dish.id} className="py-3 flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h5 className="font-heading font-semibold text-sm text-[#1A1A1A]">{dish.name}</h5>
                          {dish.description && (
                            <p className="text-xs text-[#757575] leading-relaxed font-normal">{dish.description}</p>
                          )}
                        </div>
                        <span className="font-heading font-bold text-sm text-[#1A1A1A] shrink-0">
                          AED {dish.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION: REVIEWS ── */}
            <div id="section-reviews" className="space-y-6 scroll-mt-28">
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                  Reviews
                </h3>

                {/* Score & Breakdown Bars */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EAEAEA]">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-3xl sm:text-4xl text-[#1A1A1A] flex items-center">
                      <Star className="w-7 h-7 fill-[#1A1A1A] inline mr-1" />
                      {(r.rating * 2).toFixed(1)}
                      <span className="text-base text-[#757575] font-normal">/10</span>
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-heading font-bold text-sm text-[#1A1A1A]">Excellent</div>
                      <div className="text-xs text-[#757575]">{r.reviews} reviews</div>
                    </div>
                  </div>

                  {/* 3 Progress Bars */}
                  <div className="flex-1 max-w-sm space-y-2 text-xs font-heading font-medium">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#1A1A1A]">Food</span>
                      <div className="flex-1 bg-[#EAEAEA] h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: "95%" }} />
                      </div>
                      <span className="text-[#1A1A1A] w-6 text-right font-semibold">9.5</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#1A1A1A]">Service</span>
                      <div className="flex-1 bg-[#EAEAEA] h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: "97%" }} />
                      </div>
                      <span className="text-[#1A1A1A] w-6 text-right font-semibold">9.7</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#1A1A1A]">Ambience</span>
                      <div className="flex-1 bg-[#EAEAEA] h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: "94%" }} />
                      </div>
                      <span className="text-[#1A1A1A] w-6 text-right font-semibold">9.4</span>
                    </div>
                  </div>
                </div>

                {/* Verified Diners Banner */}
                <div className="bg-[#EAF8F4] border border-[#CDECE3] p-5 rounded-2xl space-y-1 text-xs text-[#00604A]">
                  <div className="font-heading font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Real experiences from real diners</span>
                  </div>
                  <p className="text-xs text-[#00604A]/90 font-normal">
                    Ratings and reviews can only be left by guests who have booked with Dubai Eats.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-medium font-heading">
                  <span className="text-xs font-heading font-bold text-[#1A1A1A] mr-2">All reviews</span>
                  {["Newest ∨", "Only in English ∨", "Occasion ∨"].map(filter => (
                    <button
                      key={filter}
                      className="px-3.5 py-1.5 rounded-full border border-[#E0E0E0] bg-white hover:bg-[#F5F5F5] text-[#1A1A1A] transition-all cursor-pointer font-medium"
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Verified Diner Review Cards */}
                <div className="space-y-4 pt-4">
                  {[
                    {
                      name: "Jennifer E.",
                      tenure: "3 months on Dubai Eats",
                      rating: 10,
                      date: "5 days ago",
                      comment: "Lovely dining room away from the busy streets. Excellent service from the hostess to table staff, and the Wagyu tartare was incredible! Will definitely book again.",
                      photos: [
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300",
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300"
                      ]
                    },
                    {
                      name: "Rashid Al Mansoori",
                      tenure: "1 year on Dubai Eats",
                      rating: 9.8,
                      date: "2 weeks ago",
                      comment: "One of our go-to spots in Dubai. The ambiance on the terrace is unmatched with views of the skyline. Fazaa card discount was honored smoothly at checkout.",
                      photos: [
                        "https://images.unsplash.com/photo-1544025162-d76694265947?w=300",
                        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300"
                      ]
                    }
                  ].map((review, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-[#EAEAEA] bg-[#F9FAFB] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E0E0E0] flex items-center justify-center font-heading font-bold text-xs text-[#1A1A1A]">
                            {review.name[0]}
                          </div>
                          <div>
                            <div className="font-heading font-semibold text-sm text-[#1A1A1A]">{review.name}</div>
                            <div className="text-[10px] text-[#757575] font-normal">{review.tenure}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-heading font-bold text-sm text-[#1A1A1A]">★ {review.rating}</span>
                          <span className="text-[10px] text-[#757575] font-normal block">{review.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#4A4A4A] leading-relaxed font-sans font-normal">{review.comment}</p>

                      {/* Review Photos Thumbnails */}
                      <div className="flex gap-2 pt-1">
                        {review.photos.map((p, pIdx) => (
                          <img
                            key={pIdx}
                            src={p}
                            alt="Diner photo"
                            onClick={() => openGallery(pIdx)}
                            className="w-14 h-14 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-[#E0E0E0]"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: STICKY BOOKING WIDGET ── */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-xl space-y-5 text-left">
              
              <div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  Book a table
                </h3>
                <p className="text-xs text-[#757575] font-sans font-normal">
                  Direct official booking · Free instant confirmation
                </p>
              </div>

              {/* Hot Activity Banner */}
              <div className="bg-[#FFF4E5] border border-[#FFE2B8] p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#B25E00] font-heading">
                <Flame className="w-4 h-4 text-orange-500 shrink-0 fill-orange-500" />
                <span>Already 13 bookings for today</span>
              </div>

              {/* Date & Guest Selectors */}
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-[11px] font-semibold font-heading text-[#757575] uppercase mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold font-heading text-[#757575] uppercase mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3 py-2.5 text-xs font-medium text-[#1A1A1A] outline-none font-heading cursor-pointer"
                    >
                      <option value="19:00">19:00 (-20%)</option>
                      <option value="19:30">19:30 (-20%)</option>
                      <option value="20:00">20:00 (Standard)</option>
                      <option value="20:30">20:30 (Standard)</option>
                      <option value="21:00">21:00 (-15%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold font-heading text-[#757575] uppercase mb-1">
                      Guests
                    </label>
                    <select
                      value={bookingGuests}
                      onChange={e => setBookingGuests(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-3 py-2.5 text-xs font-medium text-[#1A1A1A] outline-none font-heading cursor-pointer"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8+ Guests (VIP Table)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={r.bookingPlatform?.url || r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-bold font-heading text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Confirm Table Booking</span>
                </a>

                {/* VIP Table Deposit Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(true)}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold font-heading text-xs py-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>VIP Table Deposit (Stripe / Telr)</span>
                </button>

                {/* WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-[#E0E0E0] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#1A1A1A] font-semibold font-heading text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Hostess Concierge</span>
                </a>
              </div>

              {/* Online Food Delivery Hub */}
              <div className="border-t border-[#EAEAEA] pt-4 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#757575] font-heading">
                  🛵 Online Food Delivery
                </p>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-semibold font-heading">
                  {[
                    { href: r.deliveryLinks?.keeta, label: "Keeta", bg: "bg-sky-50 text-sky-700 border-sky-200" },
                    { href: r.deliveryLinks?.deliveroo, label: "Deliveroo", bg: "bg-teal-50 text-teal-700 border-teal-200" },
                    { href: r.deliveryLinks?.talabat, label: "Talabat", bg: "bg-orange-50 text-orange-700 border-orange-200" },
                    { href: r.deliveryLinks?.careem, label: "Careem", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { href: r.deliveryLinks?.noon, label: "Noon", bg: "bg-amber-50 text-amber-800 border-amber-200" },
                  ].map(d => (
                    <a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${d.bg} border py-1.5 rounded-lg hover:scale-105 transition-transform`}
                    >
                      {d.label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── RELATED RESTAURANTS IN SAME DISTRICT ── */}
      {relatedRestaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-[#EAEAEA]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#D4AF37] font-heading uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Also in {r.district}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                More restaurants nearby
              </h2>
            </div>
            <Link
              to="/restaurants"
              search={{ area: r.district }}
              className="text-xs font-semibold font-heading text-[#1A1A1A] hover:text-[#D4AF37] hidden md:flex items-center gap-1"
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
                className="group bg-white border border-[#EAEAEA] hover:border-[#D4AF37] rounded-2xl overflow-hidden hover:shadow-md transition-all block shadow-2xs"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-bold text-xs px-2 py-0.5 rounded-md font-heading">
                    {(rel.rating * 2).toFixed(1)}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-heading font-semibold text-sm text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-[#757575] font-sans font-normal">{rel.cuisine}</p>
                  <p className="text-xs font-semibold text-[#1A1A1A] font-heading">AED {rel.priceMin}–{rel.priceMax} pp</p>
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
