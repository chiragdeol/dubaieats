import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  BadgePercent,
  TrendingUp,
  ArrowRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  UtensilsCrossed,
  Tag,
  DollarSign,
  MapPin,
  Phone,
  Globe,
  Clock,
  Car,
  Shirt,
  Baby,
  Dog,
  Accessibility,
  Wine,
  Save,
  Check,
  Eye,
  Calendar,
  BarChart3,
  MousePointerClick,
  Users,
  MessageSquare,
  LogOut,
  Target,
  Zap
} from "lucide-react";
import { DUBAI_DISTRICTS } from "@/lib/dubai-districts";
import { PrivilegeCategory } from "@/lib/restaurants-enriched";

export const Route = createFileRoute("/merchant")({
  head: () => ({
    meta: [
      { title: "Vendor Portal & Ad Analytics — Dubai Eats" },
      { name: "description", content: "Vendor control center for Dubai restaurant owners to upload digital menus, food photo galleries, Fazaa/Esaad coupons, and track ad campaign analytics." },
    ],
  }),
  component: MerchantDashboardPage,
});

interface CouponItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  program: string;
  expiry: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  dietary: string;
  image?: string;
}

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  type: "food" | "interior" | "view";
  isPrimary?: boolean;
}

interface AdCampaign {
  id: string;
  name: string;
  placement: string;
  status: "Active" | "Scheduled" | "Completed";
  budgetPerMonth: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  revenueGenerated: number;
}

function MerchantDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"analytics" | "profile" | "filters" | "coupons" | "menu" | "gallery" | "marketing" | "preview">("analytics");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Authenticated Vendor Info
  const [vendorAuth, setVendorAuth] = useState<{ venueName: string; district: string; email: string; tier?: string }>({
    venueName: "Zuma Dubai",
    district: "DIFC",
    email: "manager@zumarestaurant.ae",
    tier: "Luxury & Michelin Tier"
  });

  useEffect(() => {
    const stored = localStorage.getItem("dubai_eats_vendor_auth");
    if (stored) {
      try {
        setVendorAuth(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dubai_eats_vendor_auth");
    navigate({ to: "/join" });
  };

  // 1. Profile State
  const [venueName, setVenueName] = useState("Zuma Dubai");
  const [district, setDistrict] = useState("DIFC");
  const [cuisine, setCuisine] = useState("Contemporary Japanese");
  const [priceMin, setPriceMin] = useState("350");
  const [priceMax, setPriceMax] = useState("700");
  const [phone, setPhone] = useState("+971 4 425 5660");
  const [whatsapp, setWhatsapp] = useState("+971 56 273 0030");
  const [website, setWebsite] = useState("https://zumarestaurant.com/locations/dubai/");
  const [address, setAddress] = useState("Gate Village 06, DIFC, Dubai");
  const [hours, setHours] = useState("12:00 PM – 3:30 PM, 7:00 PM – 1:00 AM");
  const [tradeLicense, setTradeLicense] = useState("DET-DXB-984210");

  // 2. Policies & Filters State
  const [valetType, setValetType] = useState("Complimentary");
  const [valetCost, setValetCost] = useState("Free with restaurant validation");
  const [dressCode, setDressCode] = useState("Smart Elegant (No sportswear or beachwear)");
  const [childPolicy, setChildPolicy] = useState("Children welcome until 9:00 PM; 21+ only late evening");
  const [petPolicy, setPetPolicy] = useState("Permitted on outdoor terrace only");
  const [accessibility, setAccessibility] = useState("Fully wheelchair accessible via DIFC Gate Village elevator");
  const [liquorStatus, setLiquorStatus] = useState("Licensed Full Bar & Lounge");
  const [hasShisha, setHasShisha] = useState(false);
  const [dietaryTags, setDietaryTags] = useState<string[]>([
    "Halal Certified",
    "Vegan Options Available",
    "Gluten-Free Available",
    "Keto Friendly"
  ]);

  // 3. Coupons & Privileges State
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: "1",
      code: "FAZAA20",
      title: "Fazaa Cardholders Privilege",
      discount: "20% Off Total Bill",
      program: "Fazaa",
      expiry: "31 Dec 2026"
    },
    {
      id: "2",
      code: "ESAAD25",
      title: "Esaad Government Exclusive",
      discount: "25% Off Food & Beverage",
      program: "Esaad",
      expiry: "31 Dec 2026"
    },
    {
      id: "3",
      code: "SUMMERVIP",
      title: "Direct Online Booking Privilege",
      discount: "Complimentary Chef Welcome Drink",
      program: "Dubai Eats VIP",
      expiry: "30 Sep 2026"
    }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponProgram, setNewCouponProgram] = useState("Fazaa");

  // 4. Digital Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Black Cod Miso (Gindara)",
      category: "Mains & Grills",
      price: "245",
      description: "Marinated black cod wrapped in hoba leaf with sweet miso glaze",
      dietary: "Halal, Gluten-Free",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80"
    },
    {
      id: "2",
      name: "Thinly Sliced Seabass with Yuzu & Truffle",
      category: "Starters & Raw",
      price: "135",
      description: "Fresh seabass carpaccio with salmon roe, yuzu oil, and black winter truffle",
      dietary: "Halal, Keto",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80"
    },
    {
      id: "3",
      name: "Japanese Wagyu Ribeye Tataki (Grade A5)",
      category: "Mains & Grills",
      price: "320",
      description: "Seared A5 Wagyu beef slices with ponzu sauce and crispy garlic chips",
      dietary: "Halal, Keto",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
    },
    {
      id: "4",
      name: "Special Chocolate Fondant with Green Tea Ice Cream",
      category: "Desserts",
      price: "75",
      description: "Warm molten chocolate dome with premium Uji matcha green tea ice cream",
      dietary: "Halal",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"
    }
  ]);
  const [newDishName, setNewDishName] = useState("");
  const [newDishCat, setNewDishCat] = useState("Mains & Grills");
  const [newDishPrice, setNewDishPrice] = useState("");
  const [newDishDesc, setNewDishDesc] = useState("");
  const [newDishDietary, setNewDishDietary] = useState("Halal");
  const [newDishImg, setNewDishImg] = useState("");

  // 5. Photo Gallery State
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=85",
      caption: "Main Dining Room & Open Robata Counter",
      type: "interior",
      isPrimary: true
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=85",
      caption: "Signature Black Cod Miso Plating",
      type: "food"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&q=85",
      caption: "Lounge Bar & Mixology Counter",
      type: "interior"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=85",
      caption: "Robata Charcoal Grill Wagyu Skewers",
      type: "food"
    }
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [newPhotoType, setNewPhotoType] = useState<"food" | "interior" | "view">("food");

  // 6. Ad Campaigns & Analytics State
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([
    {
      id: "ad-1",
      name: "Homepage Hero Featured Placement",
      placement: "Homepage Hero Display",
      status: "Active",
      budgetPerMonth: 2999,
      spent: 2450,
      impressions: 114800,
      clicks: 4120,
      conversions: 384,
      cpc: 0.59,
      revenueGenerated: 134400
    },
    {
      id: "ad-2",
      name: "DIFC District Top Spotlight",
      placement: "District Sponsored #1",
      status: "Active",
      budgetPerMonth: 1499,
      spent: 1200,
      impressions: 68400,
      clicks: 2840,
      conversions: 246,
      cpc: 0.42,
      revenueGenerated: 86100
    },
    {
      id: "ad-3",
      name: "Fazaa Privilege Hub Featured Card",
      placement: "Deals & Privileges Directory",
      status: "Active",
      budgetPerMonth: 899,
      spent: 750,
      impressions: 42100,
      clicks: 1980,
      conversions: 192,
      cpc: 0.38,
      revenueGenerated: 67200
    }
  ]);

  // Marketing ad creative state
  const [bannerTarget, setBannerTarget] = useState("hero");
  const [bannerHeading, setBannerHeading] = useState("Award-Winning Contemporary Japanese in DIFC");
  const [bannerSubtext, setBannerSubtext] = useState("Book direct for complimentary chef welcome cocktail and Fazaa 20% privilege.");
  const [bannerImageUrl, setBannerImageUrl] = useState("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85");

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = bannerTarget === "hero" ? 2999 : bannerTarget === "district" ? 1499 : 899;
    const newAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      name: `${venueName} — ${bannerHeading.slice(0, 32)}...`,
      placement: bannerTarget === "hero" ? "Homepage Hero Display" : bannerTarget === "district" ? `${district} Top Sponsored` : "Privilege Directory",
      status: "Active",
      budgetPerMonth: budget,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cpc: 0.45,
      revenueGenerated: 0
    };
    setAdCampaigns(prev => [newAd, ...prev]);
    alert("Marketing campaign launched successfully! Real-time analytics tracking is now active.");
    setActiveTab("analytics");
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddCoupon = () => {
    if (!newCouponCode || !newCouponTitle) return;
    const item: CouponItem = {
      id: Date.now().toString(),
      code: newCouponCode.toUpperCase().trim(),
      title: newCouponTitle.trim(),
      discount: newCouponDiscount.trim() || "15% Off",
      program: newCouponProgram,
      expiry: "31 Dec 2026"
    };
    setCoupons(prev => [...prev, item]);
    setNewCouponCode("");
    setNewCouponTitle("");
    setNewCouponDiscount("");
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const handleAddDish = () => {
    if (!newDishName || !newDishPrice) return;
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newDishName.trim(),
      category: newDishCat,
      price: newDishPrice.trim(),
      description: newDishDesc.trim() || "Chef prepared artisanal dish with fresh ingredients",
      dietary: newDishDietary,
      image: newDishImg.trim() || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
    };
    setMenuItems(prev => [...prev, item]);
    setNewDishName("");
    setNewDishPrice("");
    setNewDishDesc("");
    setNewDishImg("");
  };

  const handleDeleteDish = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl) return;
    const item: PhotoItem = {
      id: Date.now().toString(),
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || "Venue Photograph",
      type: newPhotoType,
      isPrimary: false
    };
    setPhotos(prev => [...prev, item]);
    setNewPhotoUrl("");
    setNewPhotoCaption("");
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSetPrimaryPhoto = (id: string) => {
    setPhotos(prev => prev.map(p => ({
      ...p,
      isPrimary: p.id === id
    })));
  };

  const toggleDietaryTag = (tag: string) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* ── BREADCRUMB & HEADER BANNER ── */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#757575] font-heading">
              <Link to="/" className="text-[#1A1A1A] font-bold hover:text-[#D4AF37]">Home</Link>
              <span>›</span>
              <Link to="/join" className="text-[#1A1A1A] font-bold hover:text-[#D4AF37]">Vendor Portal</Link>
              <span>›</span>
              <span>Merchant Control Center</span>
            </div>

            {/* Logged in badge & logout */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold font-heading bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                🏢 {vendorAuth.venueName} ({vendorAuth.district}) · {vendorAuth.tier || "Prime Tier"}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold font-heading text-[#757575] hover:text-rose-600 hover:bg-white px-3 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2E2E2E] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-heading">
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" /> OFFICIAL DUBAI EATS VENDOR PORTAL
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                Restaurant Owner Control Center
              </h1>
              <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed font-normal font-sans">
                Track ad campaign analytics, upload digital menus with dish photos, add discount coupon codes, manage photo galleries, and launch sponsored listings.
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-extrabold font-heading text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#1A1A1A]" />
                    <span>Saved to Live Portal!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#1A1A1A]" />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── 8 DASHBOARD TABS ── */}
          <div className="flex flex-wrap items-center gap-2 pb-4 mb-8 border-b border-[#EAEAEA] text-xs font-bold font-heading">
            {[
              { id: "analytics", label: "📊 Ad Analytics & Traffic", icon: BarChart3 },
              { id: "profile", label: "🏢 Profile & Contact", icon: Building2 },
              { id: "filters", label: "🎯 Policies & Certifications", icon: ShieldCheck },
              { id: "coupons", label: "💳 Coupons & Privileges", icon: BadgePercent },
              { id: "menu", label: "🍽️ Digital Menu & Dishes", icon: UtensilsCrossed },
              { id: "gallery", label: "📸 Photo Gallery", icon: ImageIcon },
              { id: "marketing", label: "🚀 Ad Studio & Banners", icon: TrendingUp },
              { id: "preview", label: "👁️ Live Diner Preview", icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#1A1A1A] text-white shadow-xs"
                      : "bg-white hover:bg-[#F5F5F5] text-[#757575] border border-[#EAEAEA]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : "text-[#757575]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: REAL-TIME AD & TRAFFIC ANALYTICS ── */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              
              {/* Key KPI Metrics Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Total Profile Views", value: "225,300", change: "+18.4% vs last month", icon: Eye, highlight: false },
                  { label: "Direct Table Bookings", value: "3,820 covers", change: "0% Commission", icon: Calendar, highlight: true },
                  { label: "Menu & Dish Clicks", value: "94,150 views", change: "+24.2% engagement", icon: UtensilsCrossed, highlight: false },
                  { label: "WhatsApp Inquiries", value: "1,240 chats", change: "Direct to Hostess", icon: MessageSquare, highlight: false },
                  { label: "Ad Campaign Revenue", value: "AED 287,700", change: "14.2x Ad ROI", icon: TrendingUp, highlight: true }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className={`p-5 rounded-3xl border ${kpi.highlight ? "bg-[#1A1A1A] text-white border-[#333333]" : "bg-white text-[#1A1A1A] border-[#EAEAEA]"} shadow-xs space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-heading font-bold uppercase tracking-wider ${kpi.highlight ? "text-[#D4AF37]" : "text-[#757575]"}`}>
                          {kpi.label}
                        </span>
                        <Icon className={`w-4 h-4 ${kpi.highlight ? "text-[#D4AF37]" : "text-[#757575]"}`} />
                      </div>
                      <div className={`font-display font-black text-2xl ${kpi.highlight ? "text-white" : "text-[#1A1A1A]"}`}>
                        {kpi.value}
                      </div>
                      <div className={`text-[10px] font-heading font-semibold ${kpi.highlight ? "text-[#D4AF37]" : "text-emerald-700"}`}>
                        {kpi.change}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Ad Campaigns Performance Table */}
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#1A1A1A] flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#D4AF37]" />
                      Live Marketing & Sponsored Ad Campaigns
                    </h3>
                    <p className="text-xs text-[#757575] font-sans mt-0.5">
                      Real-time impressions, click-through rates, and guest booking revenue attribution.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("marketing")}
                    className="bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs px-4 py-2 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Launch New Campaign</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAEAEA] text-[#757575] font-heading uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-bold">Campaign & Placement</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Impressions</th>
                        <th className="pb-3 font-bold">Clicks</th>
                        <th className="pb-3 font-bold">CTR</th>
                        <th className="pb-3 font-bold">Avg. CPC</th>
                        <th className="pb-3 font-bold">Spend</th>
                        <th className="pb-3 font-bold text-right">Attributed Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEAEA] font-sans">
                      {adCampaigns.map(ad => {
                        const ctr = ((ad.clicks / (ad.impressions || 1)) * 100).toFixed(2);
                        return (
                          <tr key={ad.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-4">
                              <div className="font-heading font-bold text-sm text-[#1A1A1A]">{ad.name}</div>
                              <div className="text-[11px] text-[#757575]">{ad.placement}</div>
                            </td>
                            <td className="py-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-heading text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {ad.status}
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-[#1A1A1A]">
                              {ad.impressions.toLocaleString()}
                            </td>
                            <td className="py-4 font-semibold text-[#1A1A1A]">
                              {ad.clicks.toLocaleString()}
                            </td>
                            <td className="py-4 font-bold text-[#D4AF37] font-heading">
                              {ctr}%
                            </td>
                            <td className="py-4 font-medium text-[#757575]">
                              AED {ad.cpc.toFixed(2)}
                            </td>
                            <td className="py-4 font-bold text-[#1A1A1A]">
                              AED {ad.spent.toLocaleString()}
                            </td>
                            <td className="py-4 text-right font-heading font-black text-sm text-emerald-700">
                              AED {ad.revenueGenerated.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conversion Attribution & Diner Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 space-y-4 shadow-xs">
                  <h4 className="font-heading font-bold text-base text-[#1A1A1A]">Top Booking Referral Channels</h4>
                  <div className="space-y-3 font-sans text-xs">
                    {[
                      { channel: "SevenRooms / Direct Online Reservation", pct: "54%", covers: "2,060 guests" },
                      { channel: "WhatsApp Direct Concierge Concierge", pct: "26%", covers: "990 guests" },
                      { channel: "Fazaa & Esaad Privilege Cardholders", pct: "14%", covers: "535 guests" },
                      { channel: "Interactive Map Explorer & Google Pin", pct: "6%", covers: "235 guests" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#1A1A1A]">{item.channel}</span>
                          <span className="font-bold font-heading text-[#D4AF37]">{item.pct} ({item.covers})</span>
                        </div>
                        <div className="w-full bg-[#F5F5F5] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#1A1A1A] h-full rounded-full" style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 space-y-4 shadow-xs">
                  <h4 className="font-heading font-bold text-base text-[#1A1A1A]">Diner Geographic Audience</h4>
                  <div className="space-y-3 font-sans text-xs">
                    {[
                      { area: "Downtown & DIFC Corporate Professionals", pct: "42%" },
                      { area: "Palm Jumeirah & Marina Luxury Residents", pct: "31%" },
                      { area: "International Tourists (UK, GCC, Europe, US)", pct: "18%" },
                      { area: "Emirati Nationals & UAE Govt Employees", pct: "9%" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#1A1A1A]">{item.area}</span>
                          <span className="font-bold font-heading text-[#D4AF37]">{item.pct}</span>
                        </div>
                        <div className="w-full bg-[#F5F5F5] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#D4AF37] h-full rounded-full" style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── TAB 2: PROFILE & BASIC INFO ── */}
          {activeTab === "profile" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">General Venue Details</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Manage your core listing information, trading hours, and trade license credentials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Venue Name</label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">District</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    {DUBAI_DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Cuisine Category</label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={e => setCuisine(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">DET Trade License #</label>
                  <input
                    type="text"
                    value={tradeLicense}
                    onChange={e => setTradeLicense(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Price Range (AED Min – Max)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                      placeholder="350"
                      className="w-1/2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                    />
                    <span>–</span>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                      placeholder="700"
                      className="w-1/2 bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Direct Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Official WhatsApp Line</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Official Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Trading Hours</label>
                  <input
                    type="text"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: POLICIES & CERTIFICATIONS ── */}
          {activeTab === "filters" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Policies & Dietary Badges</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Define your valet parking policies, alcohol licensing, dress codes, and dietary options.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Valet Parking</label>
                  <select
                    value={valetType}
                    onChange={e => setValetType(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="Complimentary">Complimentary Valet Parking</option>
                    <option value="Paid">Paid Valet Parking (AED 25–50)</option>
                    <option value="Self-Parking">Self Parking Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Dress Code Requirement</label>
                  <select
                    value={dressCode}
                    onChange={e => setDressCode(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="Smart Elegant (No sportswear or beachwear)">Smart Elegant</option>
                    <option value="Smart Casual">Smart Casual</option>
                    <option value="Casual">Casual</option>
                    <option value="Beach Chic">Beach Chic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Alcohol Licensing</label>
                  <select
                    value={liquorStatus}
                    onChange={e => setLiquorStatus(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="Licensed Full Bar & Lounge">Licensed Full Bar & Lounge</option>
                    <option value="Non-Licensed (Dry Venue)">Non-Licensed (Dry Venue)</option>
                    <option value="Mocktail & Specialty Drinks Only">Mocktail & Specialty Drinks Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">Children & Age Policy</label>
                  <input
                    type="text"
                    value={childPolicy}
                    onChange={e => setChildPolicy(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] uppercase">
                    Dietary & Health Certifications
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1 font-heading text-xs">
                    {[
                      "Halal Certified",
                      "Vegan Options Available",
                      "Gluten-Free Available",
                      "Keto Friendly",
                      "Organic / Farm-To-Table",
                      "Nut-Free Kitchen Option"
                    ].map(tag => {
                      const isChecked = dietaryTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleDietaryTag(tag)}
                          className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#D4AF37] border-[#D4AF37] text-[#1A1A1A] font-bold"
                              : "bg-[#F5F5F5] border-[#E0E0E0] text-[#757575]"
                          }`}
                        >
                          {isChecked ? "✓ " : "+ "}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: COUPONS & PRIVILEGES ── */}
          {activeTab === "coupons" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Manage Dining Privileges & Coupons</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Activate or modify exclusive promo codes for Fazaa, Esaad, and Cardholders.</p>
              </div>

              {/* Add New Coupon Form */}
              <div className="bg-[#F5F5F5] border border-[#E0E0E0] p-5 rounded-2xl space-y-4">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                  + Add New Privilege Coupon
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value)}
                    placeholder="CODE (e.g. FAZAA20)"
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none uppercase font-heading"
                  />
                  <input
                    type="text"
                    value={newCouponTitle}
                    onChange={e => setNewCouponTitle(e.target.value)}
                    placeholder="Offer Title (e.g. 20% Off Bill)"
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                  <select
                    value={newCouponProgram}
                    onChange={e => setNewCouponProgram(e.target.value)}
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="Fazaa">Fazaa Card</option>
                    <option value="Esaad">Esaad Card</option>
                    <option value="Emirates Platinum">Emirates Platinum</option>
                    <option value="The Entertainer">The Entertainer</option>
                    <option value="Dubai Eats VIP">Dubai Eats VIP</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCoupon}
                    className="bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Publish Coupon</span>
                  </button>
                </div>
              </div>

              {/* Existing Coupons Grid */}
              <div className="space-y-3">
                {coupons.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl border border-[#EAEAEA] bg-[#FBF6E9] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-sm text-[#1A1A1A]">{c.code}</span>
                        <span className="bg-[#D4AF37] text-[#1A1A1A] text-[9px] font-black font-heading px-2 py-0.5 rounded-full uppercase">
                          {c.program}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#4A4A4A]">{c.title} ({c.discount})</p>
                      <p className="text-[10px] text-[#757575]">Valid until: {c.expiry}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-2 text-[#757575] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: DIGITAL MENU BUILDER ── */}
          {activeTab === "menu" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Digital Menu & Dishes</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Add signature dishes with prices, descriptions, and high-res photos.</p>
              </div>

              {/* Add Dish Form */}
              <div className="bg-[#F5F5F5] border border-[#E0E0E0] p-5 rounded-2xl space-y-4">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                  + Add New Menu Item
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newDishName}
                    onChange={e => setNewDishName(e.target.value)}
                    placeholder="Dish Name (e.g. Black Cod Miso)"
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                  <select
                    value={newDishCat}
                    onChange={e => setNewDishCat(e.target.value)}
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="Starters & Raw">Starters & Raw</option>
                    <option value="Mains & Grills">Mains & Grills</option>
                    <option value="Pasta & Pizza">Pasta & Pizza</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages & Cocktails">Beverages & Cocktails</option>
                  </select>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={e => setNewDishPrice(e.target.value)}
                    placeholder="Price in AED (e.g. 245)"
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none font-heading"
                  />
                  <input
                    type="text"
                    value={newDishDesc}
                    onChange={e => setNewDishDesc(e.target.value)}
                    placeholder="Ingredients & preparation description..."
                    className="sm:col-span-2 bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                  <input
                    type="text"
                    value={newDishImg}
                    onChange={e => setNewDishImg(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddDish}
                    className="bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add Dish to Menu</span>
                  </button>
                </div>
              </div>

              {/* Existing Menu Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map(m => (
                  <div key={m.id} className="p-4 rounded-2xl border border-[#EAEAEA] bg-white flex gap-4 items-start justify-between shadow-2xs">
                    <div className="flex gap-3">
                      {m.image && (
                        <img src={m.image} alt={m.name} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-[#1A1A1A]">{m.name}</span>
                        </div>
                        <span className="font-heading font-black text-xs text-[#D4AF37]">AED {m.price}</span>
                        <p className="text-[11px] text-[#757575] line-clamp-2 leading-relaxed">{m.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDish(m.id)}
                      className="p-1.5 text-[#757575] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 6: PHOTO GALLERY ── */}
          {activeTab === "gallery" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Photo Gallery & Ambience</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Upload high-resolution photography for your dining rooms, signature food, and terrace views.</p>
              </div>

              {/* Add Photo Form */}
              <div className="bg-[#F5F5F5] border border-[#E0E0E0] p-5 rounded-2xl space-y-4">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1A1A]">
                  + Upload / Add Photograph
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                    placeholder="Image URL (https://...)"
                    className="sm:col-span-2 bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                  <select
                    value={newPhotoType}
                    onChange={e => setNewPhotoType(e.target.value as any)}
                    className="bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none font-heading cursor-pointer"
                  >
                    <option value="food">Food Dish</option>
                    <option value="interior">Interior Dining Room</option>
                    <option value="view">Outdoor Terrace & View</option>
                  </select>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={e => setNewPhotoCaption(e.target.value)}
                    placeholder="Caption (e.g. Sunset terrace seating)..."
                    className="sm:col-span-2 bg-white border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add to Gallery</span>
                  </button>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map(p => (
                  <div key={p.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-[#EAEAEA] bg-slate-100">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase bg-black/60 px-2 py-0.5 rounded">
                          {p.type}
                        </span>
                        <button onClick={() => handleDeletePhoto(p.id)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] line-clamp-2 leading-tight">{p.caption}</p>
                        <button
                          onClick={() => handleSetPrimaryPhoto(p.id)}
                          className={`w-full py-1 text-[10px] font-bold rounded ${p.isPrimary ? "bg-[#D4AF37] text-[#1A1A1A]" : "bg-white/20 hover:bg-white/40 text-white"}`}
                        >
                          {p.isPrimary ? "👑 Primary Cover" : "Set as Primary"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 7: AD STUDIO & MARKETING CAMPAIGNS ── */}
          {activeTab === "marketing" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              <div className="pb-4 border-b border-[#EAEAEA]">
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Marketing Ad Studio & Campaign Creator</h3>
                <p className="text-xs text-[#757575] font-sans mt-0.5">Launch transparent sponsored banners to gain priority visibility across 450,000+ monthly diners.</p>
              </div>

              <form onSubmit={handleCreateAd} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left: Campaign Config */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                      Select Placement Target
                    </label>
                    <div className="grid grid-cols-3 gap-2.5 font-heading text-xs">
                      {[
                        { id: "hero", name: "Homepage Hero", price: "AED 2,999/mo" },
                        { id: "district", name: "Top District", price: "AED 1,499/mo" },
                        { id: "privilege", name: "Privilege Card", price: "AED 899/mo" }
                      ].map(target => (
                        <div
                          key={target.id}
                          onClick={() => setBannerTarget(target.id)}
                          className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                            bannerTarget === target.id
                              ? "border-[#D4AF37] bg-[#FBF6E9] text-[#1A1A1A]"
                              : "border-[#E0E0E0] bg-[#F5F5F5] text-[#757575]"
                          }`}
                        >
                          <div className="font-bold">{target.name}</div>
                          <div className="text-[11px] font-black text-[#D4AF37] mt-0.5">{target.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                      Ad Headline Message
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerHeading}
                      onChange={e => setBannerHeading(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                      Ad Subheading / Offer Callout
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerSubtext}
                      onChange={e => setBannerSubtext(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                      Banner Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerImageUrl}
                      onChange={e => setBannerImageUrl(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-extrabold font-heading text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#1A1A1A]" />
                    <span>Launch Ad Campaign Instantly</span>
                  </button>
                </div>

                {/* Right: Live Creative Preview */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold font-heading text-[#757575] uppercase">
                    Live Display Creative Preview
                  </span>
                  <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-xl border border-slate-200">
                    <img src={bannerImageUrl} alt="Ad preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-between text-white">
                      <span className="bg-[#D4AF37] text-[#1A1A1A] font-black text-[9px] px-2.5 py-0.5 rounded-md uppercase font-heading w-fit">
                        [SPONSORED DUBAI EATS AD]
                      </span>
                      <div className="space-y-1.5">
                        <h4 className="font-heading font-black text-lg sm:text-xl leading-tight text-white">{bannerHeading}</h4>
                        <p className="text-xs text-white/80 font-sans">{bannerSubtext}</p>
                        <div className="pt-2">
                          <span className="inline-block bg-white text-[#1A1A1A] font-bold font-heading text-[10px] px-3.5 py-1.5 rounded-xl">
                            Book Table Direct →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* ── TAB 8: LIVE DINER LISTING PREVIEW ── */}
          {activeTab === "preview" && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#EAEAEA] flex justify-between items-center">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Simulated Guest View</h3>
                  <p className="text-xs text-[#757575] font-sans mt-0.5">This is how your verified profile appears to diners on Dubai Eats.</p>
                </div>
                <Link
                  to="/restaurants"
                  className="text-xs font-bold font-heading text-[#D4AF37] hover:underline"
                >
                  View on Live Directory →
                </Link>
              </div>

              {/* Simulated Diner Card */}
              <div className="p-6 bg-[#F5F5F5] rounded-3xl border border-[#E0E0E0] space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={photos[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"}
                    alt={venueName}
                    className="w-full md:w-64 h-48 rounded-2xl object-cover bg-slate-200"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 font-heading">
                      <span className="bg-[#1A1A1A] text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Michelin Selected
                      </span>
                      <span className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        ✓ DET Verified
                      </span>
                    </div>
                    <h2 className="font-display font-black text-2xl text-[#1A1A1A]">{venueName}</h2>
                    <p className="text-xs text-[#757575] font-sans">{address || `${district}, Dubai`}</p>
                    <p className="text-xs font-bold text-[#1A1A1A] font-heading">{cuisine} · Average price AED {priceMin}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {coupons.map(c => (
                        <span key={c.id} className="bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] font-bold text-xs px-3 py-1 rounded-full font-heading">
                          🏷️ {c.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
