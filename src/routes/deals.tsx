import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { enrichedRestaurants, formatPrivilegeBadge, type EnrichedRestaurant, type PrivilegeCategory } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CardImageSlider, ImageSlideshowModal } from "@/components/image-slideshow-modal";
import { ClaimListingModal } from "@/components/claim-listing-modal";
import { MichelinBadge } from "@/components/michelin-badge";
import { toast } from "sonner";
import { 
  BadgePercent, 
  Sparkles, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Gift,
  ThumbsUp,
  ThumbsDown,
  Info,
  Building2,
  ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Dubai Dining Deals & Privilege Cards — Fazaa, Esaad, Entertainer" },
      { name: "description", content: "Explore verified restaurant discounts in Dubai with Fazaa, Esaad, Emirates Platinum, Entertainer, and UAE Bank Cards." },
    ],
  }),
  component: DealsDirectoryPage,
});

function buildGallery(name: string): string[] {
  const allPhotos = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900"
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [...allPhotos.slice(hash % allPhotos.length), ...allPhotos.slice(0, hash % allPhotos.length)];
}

const PRIVILEGE_CATEGORIES: {
  groupName: string;
  programs: { id: PrivilegeCategory | "All"; label: string; icon: string }[];
}[] = [
  {
    groupName: "All Programs",
    programs: [
      { id: "All", label: "All Privileges & Deals", icon: "✨" },
    ]
  },
  {
    groupName: "Government & Corporate",
    programs: [
      { id: "Esaad", label: "Esaad (Dubai Police)", icon: "🛡️" },
      { id: "Fazaa", label: "Fazaa (Ministry of Interior)", icon: "🇦🇪" },
      { id: "Homat Al Watan", label: "Homat Al Watan", icon: "🎖️" },
      { id: "ALSAADA", label: "ALSAADA Tourist & Resident", icon: "🌴" },
      { id: "Emirates Platinum", label: "Emirates Platinum Card", icon: "✈️" },
    ]
  },
  {
    groupName: "Developers & Master Estates",
    programs: [
      { id: "Tickit by Dubai Holding", label: "Tickit (Dubai Holding)", icon: "🎟️" },
      { id: "Viya by Wasl", label: "Viya (Wasl)", icon: "⛳" },
      { id: "U By Emaar", label: "U By Emaar", icon: "🏢" },
      { id: "Nakheel Rewards", label: "Nakheel Rewards", icon: "🏝️" },
    ]
  },
  {
    groupName: "UAE Bank Cards & Networks",
    programs: [
      { id: "American Express", label: "American Express Dining", icon: "💳" },
      { id: "Visa", label: "Visa Infinite/Signature", icon: "💳" },
      { id: "Mastercard", label: "Mastercard World", icon: "💳" },
      { id: "Emirates NBD", label: "Emirates NBD BonAppetit", icon: "💳" },
      { id: "Mashreq", label: "Mashreq Privileges", icon: "💳" },
      { id: "FAB", label: "FAB Rewards", icon: "💳" },
      { id: "ADCB", label: "ADCB TouchPoints", icon: "💳" },
      { id: "HSBC", label: "HSBC Dining", icon: "💳" },
      { id: "Standard Chartered", label: "Standard Chartered", icon: "💳" },
      { id: "CBD", label: "CBD Rewards", icon: "💳" },
      { id: "RAKBANK", label: "RAKBANK Dining", icon: "💳" },
    ]
  },
  {
    groupName: "Lifestyle & Discount Apps",
    programs: [
      { id: "Smiles by e&", label: "Smiles by e& (BOGO)", icon: "😊" },
      { id: "Careem DineOut", label: "Careem DineOut", icon: "🚗" },
      { id: "The Entertainer", label: "The Entertainer 2-for-1", icon: "🎟️" },
      { id: "Supperclub", label: "Supperclub Privileges", icon: "🥂" },
      { id: "Privilee", label: "Privilee Beach & F&B", icon: "🏖️" },
      { id: "Talabat Pro", label: "Talabat Pro Dine-in", icon: "🛵" },
      { id: "BOGO (Buy 1 Get 1)", label: "Buy 1 Get 1 Free", icon: "🍔" },
    ]
  },
  {
    groupName: "Hotel Group Loyalty & VIP",
    programs: [
      { id: "More Cravings by Marriott Bonvoy", label: "More Cravings (Marriott)", icon: "🏨" },
      { id: "Jumeirah One", label: "Jumeirah One", icon: "👑" },
      { id: "Atlantis Circle", label: "Atlantis Circle", icon: "🔱" },
      { id: "ALL Accor Live Limitless", label: "ALL Accor", icon: "⚜️" },
      { id: "Hilton Honors", label: "Hilton Honors", icon: "⭐" },
      { id: "Concierge VIP", label: "VIP Concierge Tables", icon: "🍾" },
    ]
  }
];

function DealsDirectoryPage() {
  const [selectedProgram, setSelectedProgram] = useState<PrivilegeCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSlideshowRestaurant, setActiveSlideshowRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [activeSlideshowIndex, setActiveSlideshowIndex] = useState<number>(0);
  const [activeClaimRestaurant, setActiveClaimRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [communityVotes, setCommunityVotes] = useState<Record<string, "up" | "down">>({});

  const handleVote = (slug: string, type: "up" | "down") => {
    setCommunityVotes((prev) => ({ ...prev, [slug]: type }));
    if (type === "up") {
      toast.success("Thank you! Marked as active discount.");
    } else {
      toast.info("Thank you! Our data team will review this deal.");
    }
  };

  const filteredDeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedRestaurants.filter(r => {
      const matchProgram = selectedProgram === "All" || (r.discounts && r.discounts.includes(selectedProgram));
      const matchQuery = !q || 
        r.name.toLowerCase().includes(q) || 
        r.cuisine.toLowerCase().includes(q) || 
        r.district.toLowerCase().includes(q) ||
        r.discounts?.some(d => d.toLowerCase().includes(q));
      return matchProgram && matchQuery;
    });
  }, [selectedProgram, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#6B7280] font-heading">
              <Link to="/" className="text-[#111827] font-bold hover:text-[#D4AF37]">Home</Link>
              <span>›</span>
              <Link to="/restaurants" className="text-[#111827] font-bold hover:text-[#D4AF37]">Eat & Drink</Link>
              <span>›</span>
              <span>Deals & Privilege Cards</span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-8 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-heading">
                <Gift className="w-3.5 h-3.5 text-[#D4AF37]" /> UAE Dining Privileges Directory
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
                Unlock Exclusive Dining Privileges & Discounts
              </h1>
              <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed font-normal font-sans">
                Discover verified dining offers across Dubai accepting your <strong className="text-white">Esaad, Fazaa, Emirates Platinum, Entertainer, Smiles, Supperclub, and UAE Bank cards</strong>.
              </p>
            </div>
          </div>

          {/* Global Safety & Terms Disclaimer Banner */}
          <div className="mb-8 p-4 rounded-2xl bg-white border border-[#E5E7EB] flex items-start gap-3 text-xs text-[#6B7280] shadow-2xs">
            <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <strong className="text-[#111827] font-bold">Safety & Privilege Verification:</strong> All privilege card listings (💳 Esaad, 💳 Fazaa, 💳 ENBD, 💳 Smiles, 💳 Entertainer, 💳 Hotel Loyalty) are aggregated from public merchant partner registries and verified by community members. Terms, cardholder tiers, and minimum spend rules apply per venue discretion.
            </p>
          </div>

          {/* Search & Category Filter Section */}
          <div className="space-y-6 mb-10">
            
            {/* Search Input */}
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search venue or deal (e.g. Zuma, DIFC, Fazaa, Esaad, Marriott)..."
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#D4AF37] shadow-xs font-sans"
              />
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Privilege Categories Grouped Tabs */}
            <div className="space-y-4">
              {PRIVILEGE_CATEGORIES.map((category) => (
                <div key={category.groupName} className="space-y-1.5">
                  <p className="text-[10px] font-bold font-heading uppercase tracking-widest text-[#6B7280]">
                    {category.groupName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.programs.map(prog => {
                      const isSelected = selectedProgram === prog.id;
                      return (
                        <button
                          key={prog.id}
                          onClick={() => setSelectedProgram(prog.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-[#D9381E] text-white shadow-md scale-105"
                              : "bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] hover:border-[#D4AF37]"
                          }`}
                        >
                          <span>{prog.icon}</span>
                          <span>{prog.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Deals Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold font-heading text-[#6B7280]">
              <span>Showing {filteredDeals.length} venues with active privileges</span>
              {selectedProgram !== "All" && (
                <button
                  onClick={() => setSelectedProgram("All")}
                  className="text-[#D9381E] font-bold hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map(r => {
                const userVoted = communityVotes[r.slug];
                const cardGallery = [r.image, ...buildGallery(r.name)];

                return (
                  <article
                    key={r.slug}
                    className="bg-white border border-[#E5E7EB] hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Slider */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        <CardImageSlider
                          images={cardGallery}
                          title={r.name}
                          onImageClick={(idx) => {
                            setActiveSlideshowRestaurant(r);
                            setActiveSlideshowIndex(idx || 0);
                          }}
                          className="w-full h-full"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10 pointer-events-none">
                          {r.michelin && (
                            <MichelinBadge tier={r.michelin} size="sm" />
                          )}
                          <span className="bg-[#D4AF37] text-[#111827] font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm font-heading">
                            Verified Privileges
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 text-white text-xs font-bold z-10 pointer-events-none drop-shadow-md">
                          📍 {r.district}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-display font-bold text-lg text-[#111827] group-hover:text-[#D4AF37] transition-colors leading-snug">
                              <Link to="/restaurants/$id" params={{ id: r.slug }}>
                                {r.name}
                              </Link>
                            </h3>
                            <p className="text-xs text-[#6B7280] font-sans">{r.cuisine} · Average AED {r.priceMin}</p>
                          </div>
                          <span className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#8D6E18] font-black text-xs px-2 py-0.5 rounded-md font-heading shrink-0">
                            {(r.rating * 2).toFixed(1)}
                          </span>
                        </div>

                        {/* Accepted Privilege Generic Text Badges */}
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] font-bold font-heading text-[#8D6E18] uppercase tracking-wider">
                            Accepted Cards & Programs
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {r.discounts?.map(d => (
                              <span
                                key={d}
                                className={`text-[10px] font-bold font-heading px-2.5 py-1 rounded-lg border transition-all ${
                                  selectedProgram === d
                                    ? "bg-[#D9381E] text-white border-[#D9381E] shadow-xs"
                                    : "bg-[#FBF6E9] text-[#8D6E18] border-[#EFE2B9]"
                                }`}
                              >
                                {formatPrivilegeBadge(d)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Community Verification Vote on Card */}
                        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
                          <span className="font-sans">Did offer work?</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleVote(r.slug, "up")}
                              className={`px-2 py-0.5 rounded-md border text-[10px] font-bold font-heading transition-colors cursor-pointer flex items-center gap-1 ${
                                userVoted === "up"
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-emerald-50"
                              }`}
                              title="Yes, received discount"
                            >
                              <ThumbsUp className="w-2.5 h-2.5" /> Yes
                            </button>
                            <button
                              onClick={() => handleVote(r.slug, "down")}
                              className={`px-2 py-0.5 rounded-md border text-[10px] font-bold font-heading transition-colors cursor-pointer flex items-center gap-1 ${
                                userVoted === "down"
                                  ? "bg-red-600 text-white border-red-600"
                                  : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-red-50"
                              }`}
                              title="No, discount not honored"
                            >
                              <ThumbsDown className="w-2.5 h-2.5" /> No
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0">
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E5E7EB]">
                        <Link
                          to="/restaurants/$id"
                          params={{ id: r.slug }}
                          className="border border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] font-bold font-heading text-xs py-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Show Profile</span>
                        </Link>

                        <a
                          href={r.bookingPlatform?.url || r.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action-primary text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-white" />
                          <span>Book Table</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </main>
      </div>

      {/* ── PHOTO GALLERY LIGHTBOX MODAL ── */}
      <ImageSlideshowModal
        isOpen={!!activeSlideshowRestaurant}
        onClose={() => setActiveSlideshowRestaurant(null)}
        images={activeSlideshowRestaurant ? [activeSlideshowRestaurant.image, ...buildGallery(activeSlideshowRestaurant.name)] : []}
        initialIndex={activeSlideshowIndex}
        title={activeSlideshowRestaurant?.name}
      />

      {/* ── OWNER CLAIM LISTING MODAL ── */}
      <ClaimListingModal
        isOpen={!!activeClaimRestaurant}
        onClose={() => setActiveClaimRestaurant(null)}
        restaurantName={activeClaimRestaurant?.name || ""}
        restaurantAddress={activeClaimRestaurant?.address || ""}
      />

      <SiteFooter />
    </div>
  );
}
