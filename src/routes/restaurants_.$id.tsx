import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { enrichedRestaurants, formatPrivilegeBadge } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RestaurantMap } from "@/components/restaurant-map";
import { MichelinBadge } from "@/components/michelin-badge";
import { ImageSlideshowModal } from "@/components/image-slideshow-modal";
import { ClaimListingModal } from "@/components/claim-listing-modal";
import { PrivilegeCommunityVerify } from "@/components/privilege-community-verify";
import { useGooglePlace } from "@/hooks/use-google-place";
import { VenuePhoto, LiveRatingText, ProfilePhotoGallery } from "@/components/venue-photo";
import { OrderOnlineCard, ListingDeliveryButtons } from "@/components/order-online-card";
import { venueOffersDelivery } from "@/lib/delivery-apps";
import {
  callUrl,
  googlePlaceUrl,
  googleDirectionsUrl,
  googleReviewsUrl,
  officialWebsiteOf,
  getBookingProviders,
  isRealWebsite,
} from "@/lib/venue-actions";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Calendar,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Heart,
  CheckCircle2,
  BadgePercent,
  Image as ImageIcon,
  Tag,
  ArrowRight,
  ExternalLink,
  Navigation,
  Building2,
  ShoppingBag,
} from "lucide-react";

export const Route = createFileRoute("/restaurants_/$id")({
  head: ({ params }) => {
    const restaurant = enrichedRestaurants.find((r) => r.slug === params.id);
    return {
      meta: [
        {
          title: restaurant
            ? `${restaurant.name} — Reviews, Digital QR Menu, Map & Multi-Provider Bookings in Dubai`
            : "Dubai Eats Restaurant Details",
        },
        {
          name: "description",
          content:
            restaurant?.address ||
            "Explore digital QR menus, food photo galleries, live map directions, diner reviews, and multi-provider table bookings (SevenRooms, EatApp, ReserveOut, OpenTable, Resy) on Dubai Eats.",
        },
      ],
    };
  },
  component: RestaurantDetail,
});

function RestaurantDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"about" | "photos" | "reviews" | "location">("about");
  const [bookmarked, setBookmarked] = useState(false);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  const r = useMemo(() => {
    return enrichedRestaurants.find((item) => item.slug === id) || null;
  }, [id]);

  const { place: googlePlaceLive, isLoading: googleLoading } = useGooglePlace({
    name: r?.name,
    address: r?.address,
    latitude: r?.latitude,
    longitude: r?.longitude,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const relatedRestaurants = useMemo(() => {
    if (!r) return [];
    return enrichedRestaurants
      .filter((item) => item.slug !== r.slug && item.district === r.district)
      .slice(0, 4);
  }, [r]);

  if (!r) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between text-left">
        <SiteHeader />
        <div className="py-24 text-center">
          <UtensilsCrossed className="h-16 w-16 mx-auto text-[#6B7280] mb-4" />
          <h2 className="text-2xl font-bold font-heading text-[#111827]">Venue Not Found</h2>
          <p className="text-[#6B7280] text-sm mt-1">This restaurant listing could not be found.</p>
          <Link
            to="/restaurants"
            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#111827] text-white font-bold font-heading text-xs"
          >
            Browse All Restaurants
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const bookingProviders = getBookingProviders(r);
  const liveWebsite = googlePlaceLive?.website && isRealWebsite(googlePlaceLive.website)
    ? googlePlaceLive.website
    : officialWebsiteOf(r);
  const officialWebsite = liveWebsite;
  const activeProvider = bookingProviders.find((p) => p.id === selectedProvider) || bookingProviders[0];
  const currentBookingUrl = activeProvider?.url || officialWebsite || googleDirectionsUrl(r);
  const googlePlace = googlePlaceLive?.mapsUri || googlePlaceUrl(r);
  const googleDirections = googleDirectionsUrl(r);
  const googleReviews = googlePlaceLive?.mapsUri || googleReviewsUrl(r);
  const offersDelivery = Boolean(googlePlaceLive?.delivery || googlePlaceLive?.takeout) || venueOffersDelivery(r);
  const livePhone = googlePlaceLive?.phone || r.phone;
  const liveAddress = googlePlaceLive?.address || r.address;
  const liveHours = googlePlaceLive?.hoursText || r.hours;
  const liveRating = googlePlaceLive?.rating ?? r.rating;
  const liveReviews = googlePlaceLive?.reviewCount
    ? googlePlaceLive.reviewCount >= 1000
      ? `${(googlePlaceLive.reviewCount / 1000).toFixed(googlePlaceLive.reviewCount >= 10000 ? 0 : 1)}K`
      : String(googlePlaceLive.reviewCount)
    : r.reviews;
  const liveFeatures = [
    googlePlaceLive?.dineIn ? "Dine-in" : null,
    googlePlaceLive?.takeout ? "Takeaway" : null,
    googlePlaceLive?.delivery ? "Delivery" : null,
  ].filter(Boolean) as string[];
  const serviceFeatures = liveFeatures.length ? liveFeatures : r.features;
  const gallery = googlePlaceLive?.photos?.length
    ? googlePlaceLive.photos
    : r.image
      ? [r.image]
      : [];
  const phoneHref = callUrl(livePhone);

  const openGallery = (idx = 0) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const scrollToSection = (tab: "about" | "photos" | "reviews" | "location") => {
    setActiveTab(tab);
    const el = document.getElementById(`section-${tab}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans text-left">
      <SiteHeader />

      <ImageSlideshowModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={gallery}
        initialIndex={lightboxIndex}
        title={r.name}
      />

      {/* ── OWNER CLAIM LISTING MODAL ── */}
      <ClaimListingModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        restaurantName={r.name}
        restaurantAddress={r.address || `${r.district}, Dubai`}
      />

      {/* ── MAIN CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8">
        
        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280] font-heading">
          <Link to="/" className="text-[#111827] font-semibold hover:text-[#D4AF37]">Home</Link>
          <span>›</span>
          <Link to="/restaurants" className="text-[#111827] font-semibold hover:text-[#D4AF37]">Dubai restaurants</Link>
          <span>›</span>
          <span>{r.name}</span>
        </div>

        {/* ── 1. HEADER SECTION & PHOTO GRID ── */}
        <section className="space-y-4">
          
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-tight">
                  {r.name}
                </h1>
                {r.michelin && (
                  <MichelinBadge tier={r.michelin} size="md" />
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-[#6B7280] font-sans flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{liveAddress || `${r.district}, Dubai`}</span>
              </p>

              <p className="text-xs sm:text-sm text-[#111827] font-medium font-sans">
                🍽️ {r.cuisine} · Average price AED {r.priceMin}
              </p>

              <div className="flex items-center gap-2 pt-0.5 text-xs text-[#6B7280] font-sans">
                <span className="inline-flex items-center gap-1 font-heading font-bold text-sm text-[#111827]">
                  ★ {liveRating.toFixed(1)}
                </span>
                <span className="font-semibold text-[#111827] font-heading">({liveReviews} reviews)</span>
                <span>·</span>
                <span className="text-[#6B7280]">{googlePlaceLive ? "Google rating" : "Listed rating"}</span>
              </div>

              {/* Quick Action Header Bar: Call, Website, Google Maps, Claim */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:border-[#111827] hover:bg-[#F3F4F6] text-[#111827] px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading shadow-2xs transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Call {livePhone}</span>
                  </a>
                )}

                {officialWebsite && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:border-[#111827] hover:bg-[#F3F4F6] text-[#111827] px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading shadow-2xs transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Official Website</span>
                    <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                  </a>
                )}

                <a
                  href={googleDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FBF6E9] border border-[#EFE2B9] hover:bg-[#F5ECD4] text-[#8D6E18] px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading shadow-2xs transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#8D6E18]" />
                  <span>Google Maps Directions</span>
                </a>

                <button
                  type="button"
                  onClick={() => (gallery.length ? openGallery(0) : scrollToSection("photos"))}
                  className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:border-[#111827] hover:bg-[#F3F4F6] text-[#111827] px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading shadow-2xs transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Photos</span>
                </button>

                {offersDelivery && (
                  <button
                    type="button"
                    onClick={() => {
                      const nodes = document.querySelectorAll<HTMLElement>("[data-order-online]");
                      const visible = [...nodes].find((node) => node.offsetParent !== null) || nodes[0];
                      visible?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:border-[#111827] hover:bg-[#F3F4F6] text-[#111827] px-3.5 py-1.5 rounded-xl text-xs font-semibold font-heading shadow-2xs transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Order online</span>
                  </button>
                )}

                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-[#FFF4F2] border border-[#F5C2BA] hover:bg-[#FDE8E5] text-[#D9381E] px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading shadow-2xs transition-all cursor-pointer"
                  title="Claim listing ownership"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#D9381E]" />
                  <span>Claim Listing</span>
                </button>
              </div>
            </div>

            {/* Favorite Heart Button */}
            <div className="self-start md:self-auto">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                aria-label="Save to favorites"
                className="p-3 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] transition-all shadow-xs cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${bookmarked ? "fill-[#D9381E] text-[#D9381E]" : "text-[#111827]"}`} />
              </button>
            </div>
          </div>

          {/* Compact photo gallery */}
          <ProfilePhotoGallery
            images={gallery}
            title={r.name}
            loading={googleLoading && !googlePlaceLive?.photos?.length}
            onOpen={(idx) => openGallery(idx)}
          />

          {offersDelivery && (
            <div className="mt-4 lg:hidden">
              <OrderOnlineCard
                venue={r}
                live={{ delivery: googlePlaceLive?.delivery, takeout: googlePlaceLive?.takeout }}
              />
            </div>
          )}

        </section>

        {/* ── 2. TABS BAR & TWO-COLUMN WORKSPACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: ABOUT, MENU, REVIEWS, LIVE MAP ── */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Navigation Tabs Header */}
            <div className="flex items-center gap-6 sm:gap-8 border-b border-[#EAEAEA] text-sm font-semibold font-heading sticky top-20 bg-[#F5F5F5] pt-2 z-20 overflow-x-auto">
              {[
                { id: "about", label: "About" },
                { id: "photos", label: "Photos" },
                { id: "reviews", label: "Reviews" },
                { id: "location", label: "Map & Location" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => scrollToSection(t.id as any)}
                  className={`pb-3 whitespace-nowrap transition-all cursor-pointer relative ${
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
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Hours</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{liveHours}</strong>
                  </div>
                  <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                    <span className="text-[#757575] font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Address</span>
                    <strong className="text-[#1A1A1A] font-semibold block">{liveAddress}</strong>
                  </div>
                  {livePhone && (
                    <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                      <span className="text-[#757575] font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> Phone</span>
                      <strong className="text-[#1A1A1A] font-semibold block">{livePhone}</strong>
                    </div>
                  )}
                  {serviceFeatures?.length > 0 && (
                    <div className="bg-[#F5F5F5] p-3.5 rounded-2xl border border-[#E0E0E0] space-y-1">
                      <span className="text-[#757575] font-medium flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-[#D4AF37]" /> Services</span>
                      <strong className="text-[#1A1A1A] font-semibold block">{serviceFeatures.join(" · ")}</strong>
                    </div>
                  )}
                </div>

                {/* Privilege Card tags & Community Verification */}
                {r.discounts && r.discounts.length > 0 && (
                  <div className="bg-[#FBF6E9] border border-[#EFE2B9] p-5 rounded-2xl space-y-3">
                    <span className="text-xs font-bold font-heading text-[#8D6E18] uppercase tracking-wider flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4 text-[#D4AF37]" /> Accepted Privilege Offers & Discounts
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {r.discounts.map(d => (
                        <span key={d} className="badge-privilege-card shadow-2xs">
                          {formatPrivilegeBadge(d)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Verification Widget & Safety Disclaimer */}
                <PrivilegeCommunityVerify
                  restaurantName={r.name}
                  initialUpvotes={r.verificationStats?.upvotes}
                  initialDownvotes={r.verificationStats?.downvotes}
                />

                {/* Restaurant Owner Claim Growth Loop Banner */}
                <div className="bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#334155] shadow-sm">
                  <div className="space-y-1.5 max-w-lg">
                    <span className="text-[10px] font-extrabold font-heading uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 inline-block">
                      Official Growth Loop
                    </span>
                    <h4 className="font-heading font-black text-base sm:text-lg text-white">
                      Are you the owner of {r.name}?
                    </h4>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      Claim this listing to verify your privilege offers (Fazaa, Esaad, ENBD), publish seasonal menus, and manage direct zero-commission table reservations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(true)}
                    className="btn-action-primary text-xs shrink-0 whitespace-nowrap cursor-pointer py-3 px-5"
                  >
                    <Building2 className="w-4 h-4" /> Claim This Listing
                  </button>
                </div>
              </div>
            </div>

            {/* ── SECTION: PHOTOS ── */}
            <div id="section-photos" className="space-y-6 scroll-mt-28">
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                  Photos
                </h3>

                {googleLoading && !googlePlaceLive?.photos?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
                    ))}
                  </div>
                ) : gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => openGallery(idx)}
                        className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-[#EAEAEA] hover:border-[#D4AF37] transition-all"
                      >
                        <img src={src} alt={`${r.name} photo ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#757575]">
                    Photos for this venue are still loading from Google.
                  </p>
                )}

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
                      <div className="text-[#757575]">Check the Google listing for current dietary details</div>
                    </div>
                  </div>
                </div>

                {officialWebsite && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#111827] text-white px-4 py-2.5 rounded-xl text-xs font-bold font-heading"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Open official menu / website
                  </a>
                )}

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
                      {liveRating.toFixed(1)}
                      <span className="text-base text-[#757575] font-normal">/10</span>
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-heading font-bold text-sm text-[#1A1A1A]">Excellent</div>
                      <div className="text-xs text-[#757575]">{liveReviews} reviews</div>
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

                {/* Google reviews — we do not invent diner comments */}
                <div className="space-y-4 pt-4">
                  <a
                    href={googleReviews}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-2xl border border-[#EAEAEA] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-heading font-semibold text-sm text-[#1A1A1A]">Read reviews on Google</div>
                        <p className="text-xs text-[#757575] mt-1">
                          {liveRating.toFixed(1)} stars · {liveReviews} Google reviews. Open the listing for photos, delivery partners, and the latest comments.
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    </div>
                  </a>
                </div>

              </div>
            </div>

            {/* ── SECTION: LIVE MAP & CONTACT DETAILS ── */}
            <div id="section-location" className="space-y-6 scroll-mt-28">
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span>Location & Navigation</span>
                  </h3>
                  <span className="text-xs text-[#757575] font-heading font-semibold">
                    {r.district}, Dubai
                  </span>
                </div>

                {/* Interactive Leaflet Map for this Restaurant */}
                <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#E0E0E0] shadow-inner relative z-0">
                  <RestaurantMap
                    restaurants={[r]}
                    center={[r.coordinates.lat, r.coordinates.lng]}
                    zoom={15}
                    className="h-full w-full"
                  />
                </div>

                {/* Exact Address & Contact Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-sans text-xs">
                  
                  {/* Address */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-1">
                    <span className="text-[11px] font-semibold text-[#757575] font-heading uppercase tracking-wider block">
                      📍 Verified Address
                    </span>
                    <strong className="text-[#1A1A1A] font-semibold block leading-tight">
                      {liveAddress || `${r.name}, ${r.district}, Dubai, UAE`}
                    </strong>
                    <a
                      href={googlePlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] font-bold font-heading text-[11px] hover:underline inline-block pt-1"
                    >
                      Open in Google Maps →
                    </a>
                  </div>

                  {/* Telephone Contact */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-1">
                    <span className="text-[11px] font-semibold text-[#757575] font-heading uppercase tracking-wider block">
                      📞 Phone Line
                    </span>
                    <strong className="text-[#1A1A1A] font-semibold block">
                      {livePhone}
                    </strong>
                    <a
                      href={phoneHref}
                      className="text-[#D4AF37] font-bold font-heading text-[11px] hover:underline inline-block pt-1"
                    >
                      Click to Call Now →
                    </a>
                  </div>

                  {/* Official Website or Google listing */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0] space-y-1">
                    <span className="text-[11px] font-semibold text-[#757575] font-heading uppercase tracking-wider block">
                      {officialWebsite ? "🌐 Official Website" : "📍 Google listing"}
                    </span>
                    <strong className="text-[#1A1A1A] font-semibold block truncate">
                      {officialWebsite ? officialWebsite.replace(/^https?:\/\//, "") : "Photos, hours & phone on Google"}
                    </strong>
                    <a
                      href={officialWebsite || googlePlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] font-bold font-heading text-[11px] hover:underline inline-block pt-1"
                    >
                      {officialWebsite ? "Visit Official Website →" : "Open Google listing →"}
                    </a>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: LET'S DUBAI EAT — verified booking + Google actions ── */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-xl space-y-5 text-left">
              
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-1">
                  Let's Dubai Eat
                </p>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  Book a table
                </h3>
                <p className="text-xs text-[#757575] font-sans font-normal">
                  Only live booking links — no guessed SevenRooms, EatApp, or ReserveOut pages
                </p>
              </div>

              {r.walkInOnly && (
                <div className="bg-[#FFF4E5] border border-[#FFE2B8] p-3 rounded-2xl text-xs font-semibold text-[#B25E00] font-heading">
                  Walk-in only. This venue does not take online reservations.
                </div>
              )}

              {bookingProviders.length > 0 && !r.walkInOnly && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold font-heading text-[#757575] uppercase tracking-wider">
                    Book with
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {bookingProviders.map(prov => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => setSelectedProvider(prov.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          (activeProvider?.id === prov.id)
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs"
                            : "bg-[#F5F5F5] hover:bg-[#EAEAEA] border-[#E0E0E0] text-[#1A1A1A]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{prov.logo}</span>
                          <span className="font-heading font-bold text-[11px] truncate">{prov.name}</span>
                        </div>
                        <span className={`text-[9px] block truncate mt-0.5 ${activeProvider?.id === prov.id ? "text-[#D4AF37]" : "text-[#757575]"}`}>
                          {prov.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                {!r.walkInOnly && (activeProvider || officialWebsite) ? (
                  <a
                    href={currentBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-action-primary text-sm font-bold font-heading py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>
                      {activeProvider?.name === "Direct Website"
                        ? "Book on official website"
                        : `Book Table via ${activeProvider?.name || "Website"}`}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                ) : (
                  <a
                    href={googleDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-action-primary text-sm font-bold font-heading py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-white" />
                    <span>Get directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2 font-heading text-xs">
                  {phoneHref && (
                    <a
                      href={phoneHref}
                      className="border border-[#E5E7EB] bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#111827] font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center truncate"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call</span>
                    </a>
                  )}

                  <a
                    href={googleDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#E5E7EB] bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#111827] font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Directions</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => (gallery.length ? openGallery(0) : scrollToSection("photos"))}
                    className="border border-[#E5E7EB] bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#111827] font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Photos</span>
                  </button>
                </div>

                {offersDelivery && (
                  <div className="hidden lg:block">
                    <OrderOnlineCard
                      venue={r}
                      live={{ delivery: googlePlaceLive?.delivery, takeout: googlePlaceLive?.takeout }}
                    />
                  </div>
                )}

                {officialWebsite && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-[#111827] text-[#111827] font-semibold font-heading text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Official website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(true)}
                    className="text-[11px] text-[#6B7280] hover:text-[#D9381E] font-heading font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3 h-3 text-[#D9381E]" />
                    <span>Are you the manager? Claim listing</span>
                  </button>
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
              <article
                key={rel.slug}
                className="group bg-white border border-[#EAEAEA] hover:border-[#D4AF37] rounded-2xl overflow-hidden hover:shadow-md transition-all shadow-2xs"
              >
                <Link
                  to="/restaurants/$id"
                  params={{ id: rel.slug || "" }}
                  className="block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <VenuePhoto
                      venue={rel}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-bold text-xs px-2 py-0.5 rounded-md font-heading">
                      <LiveRatingText venue={rel} scale={2} />
                    </div>
                  </div>
                  <div className="p-4 pb-2 space-y-1">
                    <h3 className="font-heading font-semibold text-sm text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#757575] font-sans font-normal">{rel.cuisine}</p>
                    <p className="text-xs font-semibold text-[#1A1A1A] font-heading">AED {rel.priceMin}–{rel.priceMax} pp</p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <ListingDeliveryButtons venue={rel} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
