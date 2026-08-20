import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  BadgePercent,
  TrendingUp,
  Award,
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
  Calendar
} from "lucide-react";
import { DUBAI_DISTRICTS } from "@/lib/dubai-districts";
import { PrivilegeCategory } from "@/lib/restaurants-enriched";

export const Route = createFileRoute("/merchant")({
  head: () => ({
    meta: [
      { title: "Restaurant Vendor Portal — Manage Menus, Coupons, Photos & Ads" },
      { name: "description", content: "Vendor control center for Dubai restaurant owners to upload digital menus, food photo galleries, Fazaa/Esaad coupons, and marketing banners." },
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

function MerchantDashboardPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "filters" | "coupons" | "menu" | "gallery" | "marketing" | "preview">("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    "Gluten-Free Options",
    "Vegetarian Options",
    "Keto Friendly"
  ]);

  // 3. Coupons & Privilege Deals State
  const [coupons, setCoupons] = useState<CouponItem[]>([
    { id: "1", code: "FAZAA20", title: "20% Off Total Food & Beverage", discount: "20%", program: "Fazaa Card", expiry: "31 Dec 2026" },
    { id: "2", code: "ESAAD15", title: "15% Dining Privilege", discount: "15%", program: "Esaad Card", expiry: "31 Dec 2026" },
    { id: "3", code: "PLATINUM25", title: "Emirates Platinum 25% Off Lunch", discount: "25%", program: "Emirates Platinum", expiry: "30 Nov 2026" },
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("20%");
  const [newCouponProgram, setNewCouponProgram] = useState("Fazaa Card");
  const [newCouponExpiry, setNewCouponExpiry] = useState("31 Dec 2026");

  // 4. Digital Menu Items State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "m1", name: "Black Cod Miso", category: "Mains & Grills", price: "245", description: "Marinated black cod wrapped in hoba leaf with sweet saikyo miso", dietary: "Chef Signature", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600" },
    { id: "m2", name: "Wagyu Beef Tataki", category: "Starters & Raw", price: "185", description: "Thinly sliced seared wagyu with truffle ponzu and fried garlic chips", dietary: "Halal Certified", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600" },
    { id: "m3", name: "Crispy Fried Squid", category: "Starters & Raw", price: "85", description: "Green chili and lime sea salt with dashi dipping sauce", dietary: "Halal Certified", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
    { id: "m4", name: "Spicy Beef Tenderloin", category: "Mains & Grills", price: "220", description: "Sesame, red chili and sweet soy glaze", dietary: "Halal Certified", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600" },
    { id: "m5", name: "Special Chocolate Fondant", category: "Desserts", price: "75", description: "Rich molten chocolate center with vanilla bean ice cream", dietary: "Vegetarian", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600" },
  ]);
  const [newDishName, setNewDishName] = useState("");
  const [newDishCategory, setNewDishCategory] = useState("Starters & Raw");
  const [newDishPrice, setNewDishPrice] = useState("");
  const [newDishDesc, setNewDishDesc] = useState("");
  const [newDishDietary, setNewDishDietary] = useState("Halal Certified");
  const [newDishImage, setNewDishImage] = useState("");

  // 5. Photos Gallery State
  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: "p1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", caption: "Main Dining Room & Open Robata Kitchen", type: "interior", isPrimary: true },
    { id: "p2", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", caption: "Signature Black Cod Miso Dish", type: "food" },
    { id: "p3", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", caption: "Premium Wagyu Tataki", type: "food" },
    { id: "p4", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", caption: "Sashimi Omakase Platter", type: "food" },
    { id: "p5", url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", caption: "DIFC Skyline View Terrace", type: "view" },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [newPhotoType, setNewPhotoType] = useState<"food" | "interior" | "view">("food");

  // 6. Marketing & Ad Banner Campaign State
  const [adCampaignType, setAdCampaignType] = useState<"hero_banner" | "top_district" | "verified_badge">("top_district");
  const [adBudgetDuration, setAdBudgetDuration] = useState("1_month");
  const [marketingBannerUrl, setMarketingBannerUrl] = useState("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200");
  const [marketingHeadline, setMarketingHeadline] = useState("Experience DIFC's Best Japanese Cuisine");

  // Handlers
  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddCoupon = () => {
    if (!newCouponCode || !newCouponTitle) return;
    const item: CouponItem = {
      id: Date.now().toString(),
      code: newCouponCode.toUpperCase().trim(),
      title: newCouponTitle.trim(),
      discount: newCouponDiscount,
      program: newCouponProgram,
      expiry: newCouponExpiry
    };
    setCoupons(prev => [item, ...prev]);
    setNewCouponCode("");
    setNewCouponTitle("");
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const handleAddMenuItem = () => {
    if (!newDishName || !newDishPrice) return;
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newDishName.trim(),
      category: newDishCategory,
      price: newDishPrice.trim(),
      description: newDishDesc.trim(),
      dietary: newDishDietary,
      image: newDishImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
    };
    setMenuItems(prev => [...prev, item]);
    setNewDishName("");
    setNewDishPrice("");
    setNewDishDesc("");
    setNewDishImage("");
  };

  const handleDeleteMenuItem = (id: string) => {
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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          
          {/* ── BREADCRUMB & HEADER BANNER ── */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link to="/" className="text-[#005971] font-bold">Home</Link>
              <span>›</span>
              <span>For Restaurant Owners</span>
              <span>›</span>
              <span>Merchant & Vendor Control Portal</span>
            </div>
          </div>

          <div className="bg-[#005971] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-teal-200 border border-white/20">
                <Building2 className="w-3.5 h-3.5 text-amber-300" /> OFFICIAL DUBAI EAT VENDOR PORTAL
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                Restaurant Owner Control Center
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal">
                Manage your venue profile, add coupon codes, publish digital menus with dish photos, manage photo galleries, and run targeted marketing banner campaigns.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={handleSaveAll}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Changes</span>
              </button>
            </div>
          </div>

          {/* Success Notification Alert */}
          {savedSuccess && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Venue profile and marketing updates published live!</p>
                <p className="text-emerald-700">Your digital menu, coupons, and photo gallery are now updated on Dubai Eat discovery and search.</p>
              </div>
            </div>
          )}

          {/* ── PORTAL NAVIGATION TABS ── */}
          <div className="flex border-b border-slate-200 gap-2 mb-8 overflow-x-auto pb-1">
            {[
              { id: "profile", label: "🏢 1. Profile & Info", icon: Building2 },
              { id: "filters", label: "🎯 2. Policies & Filters", icon: ShieldCheck },
              { id: "coupons", label: "💳 3. Discount Coupons", icon: BadgePercent },
              { id: "menu", label: "🍽️ 4. Digital Menu & Dishes", icon: UtensilsCrossed },
              { id: "gallery", label: "📸 5. Photo Gallery", icon: ImageIcon },
              { id: "marketing", label: "🚀 6. Marketing Banners & Ads", icon: TrendingUp },
              { id: "preview", label: "👁️ 7. Live Preview", icon: Eye },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 font-bold text-xs sm:text-sm rounded-t-2xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#005971] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── TAB 1: VENUE PROFILE & CONTACT INFO ── */}
          {activeTab === "profile" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Venue Profile & Contact Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your restaurant name, district, address, and live contact channels updated for diners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Restaurant Name</label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Dubai District / Area</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971] cursor-pointer"
                  >
                    {DUBAI_DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name} ({d.zone})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Primary Cuisine</label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={e => setCuisine(e.target.value)}
                    placeholder="e.g. Contemporary Japanese, Italian, Mediterranean"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Avg Bill Min (AED)</label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Avg Bill Max (AED)</label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Direct Phone Reservation</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">WhatsApp Concierge Mobile</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Official Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Physical Address / Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Operating Hours</label>
                <input
                  type="text"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                />
              </div>
            </div>
          )}

          {/* ── TAB 2: POLICIES & LIFESTYLE FILTERS ── */}
          {activeTab === "filters" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Venue Policies & Discovery Lifestyle Filters
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define your parking policies, dress code, pet rules, accessibility, and dietary certifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Valet Parking Service</label>
                  <select
                    value={valetType}
                    onChange={e => setValetType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  >
                    <option value="Complimentary">Complimentary Valet (Free)</option>
                    <option value="Paid Valet">Paid Valet Parking (e.g. AED 25-50)</option>
                    <option value="Self-Parking">Self-Parking / Mall Parking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Valet Cost / Validation Notes</label>
                  <input
                    type="text"
                    value={valetCost}
                    onChange={e => setValetCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Dress Code</label>
                  <select
                    value={dressCode}
                    onChange={e => setDressCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  >
                    <option value="Smart Elegant (No sportswear or beachwear)">Smart Elegant</option>
                    <option value="Smart Casual">Smart Casual</option>
                    <option value="Casual & Relaxed">Casual & Relaxed</option>
                    <option value="Beach Chic / Resort Wear">Beach Chic / Resort Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Alcohol & Liquor Licensing</label>
                  <select
                    value={liquorStatus}
                    onChange={e => setLiquorStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  >
                    <option value="Licensed Full Bar & Lounge">Licensed (Alcohol Served)</option>
                    <option value="Non-Alcoholic (Dry Venue)">Non-Alcoholic (Dry / Family)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Child & Age Policy</label>
                  <input
                    type="text"
                    value={childPolicy}
                    onChange={e => setChildPolicy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Pet Policy</label>
                  <input
                    type="text"
                    value={petPolicy}
                    onChange={e => setPetPolicy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#005971]"
                  />
                </div>
              </div>

              {/* Dietary Tags Selector */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Dietary Certifications & Options</label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Halal Certified",
                    "Vegan Options",
                    "Vegetarian Options",
                    "Gluten-Free Options",
                    "Keto Friendly",
                    "Organic Ingredients",
                    "Dairy-Free Options",
                    "Nut-Free Kitchen Option"
                  ].map(tag => {
                    const active = dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietaryTag(tag)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? "bg-[#005971] text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: DISCOUNT COUPONS & PRIVILEGE CARDS ── */}
          {activeTab === "coupons" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Promotional Coupons & Privilege Programs
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add exclusive discount codes for diners and link your venue to Fazaa, Esaad, and UAE banking privilege cards.
                </p>
              </div>

              {/* Add Coupon Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005971] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create New Discount Coupon / Offer
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FAZAA20, SUMMER25"
                      value={newCouponCode}
                      onChange={e => setNewCouponCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Offer Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 20% off total food bill"
                      value={newCouponTitle}
                      onChange={e => setNewCouponTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Privilege Card / Program</label>
                    <select
                      value={newCouponProgram}
                      onChange={e => setNewCouponProgram(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="Fazaa Card">Fazaa Card</option>
                      <option value="Esaad Card">Esaad Card</option>
                      <option value="Emirates Platinum">Emirates Platinum</option>
                      <option value="The Entertainer">The Entertainer</option>
                      <option value="Supperclub">Supperclub</option>
                      <option value="BOGO (Buy 1 Get 1)">Buy One Get One (BOGO)</option>
                      <option value="Emirates NBD">Emirates NBD Card</option>
                      <option value="General Public Promo">General Public Promo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddCoupon}
                    className="bg-[#005971] hover:bg-[#00475b] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Coupon to Directory</span>
                  </button>
                </div>
              </div>

              {/* Active Coupons List Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#0f172a]">Active Coupons & Offers ({coupons.length})</h4>
                
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {coupons.map(c => (
                    <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-mono bg-amber-500/15 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-black">
                          {c.code}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-slate-800">{c.title}</p>
                          <p className="text-[11px] text-slate-500">{c.program} · Valid until {c.expiry}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Active Live
                        </span>
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: DIGITAL MENU & DISHES CREATOR ── */}
          {activeTab === "menu" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Digital Menu & Dish Creator
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload individual dishes with high-resolution photos, AED pricing, ingredients, and dietary certification badges.
                </p>
              </div>

              {/* Add Dish Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005971] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add New Dish / Menu Item
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Dish Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Truffle Wagyu Ribeye"
                      value={newDishName}
                      onChange={e => setNewDishName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Menu Category</label>
                    <select
                      value={newDishCategory}
                      onChange={e => setNewDishCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="Starters & Raw">Starters & Raw</option>
                      <option value="Mains & Grills">Mains & Grills</option>
                      <option value="Pasta & Pizza">Pasta & Pizza</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Cocktails & Beverages">Cocktails & Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Price (AED)</label>
                    <input
                      type="number"
                      placeholder="e.g. 195"
                      value={newDishPrice}
                      onChange={e => setNewDishPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Description & Key Ingredients</label>
                    <input
                      type="text"
                      placeholder="e.g. Australian MB9+ wagyu served with black truffle sauce"
                      value={newDishDesc}
                      onChange={e => setNewDishDesc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Dish Photo Image URL / File Preview</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newDishImage}
                      onChange={e => setNewDishImage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddMenuItem}
                    className="bg-[#005971] hover:bg-[#00475b] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Dish to Menu</span>
                  </button>
                </div>
              </div>

              {/* Dish List */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#0f172a]">Published Digital Dishes ({menuItems.length})</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map(m => (
                    <div key={m.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex gap-4 items-start relative group">
                      {m.image && (
                        <img src={m.image} alt={m.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" />
                      )}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-xs text-slate-900 truncate">{m.name}</p>
                          <span className="font-black text-xs text-[#005971] shrink-0">AED {m.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">{m.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-white border border-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {m.category}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {m.dietary}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMenuItem(m.id)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: PHOTO GALLERY & RESTAURANT PHOTOS ── */}
          {activeTab === "gallery" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Food & Restaurant Photo Gallery
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload multiple photos of dishes, interior ambience, and outdoor skyline views.
                </p>
              </div>

              {/* Add Photo Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005971] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Upload New Photo to Gallery
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Image URL / Storage Link</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newPhotoUrl}
                      onChange={e => setNewPhotoUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Caption / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Main dining room with skyline view"
                      value={newPhotoCaption}
                      onChange={e => setNewPhotoCaption(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Photo Category</label>
                    <select
                      value={newPhotoType}
                      onChange={e => setNewPhotoType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="food">🍽️ Food Dish</option>
                      <option value="interior">🏛️ Interior & Dining Room</option>
                      <option value="view">🏙️ Outdoor Terrace & View</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-[#005971] hover:bg-[#00475b] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo to Gallery</span>
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#0f172a]">Active Photo Gallery ({photos.length})</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map(p => (
                    <div key={p.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] shadow-2xs">
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                      
                      {p.isPrimary && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          👑 Primary Cover
                        </span>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-[10px] font-bold truncate max-w-[120px]">{p.caption}</span>
                        <div className="flex items-center gap-1">
                          {!p.isPrimary && (
                            <button
                              onClick={() => handleSetPrimaryPhoto(p.id)}
                              className="text-[9px] bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded text-white font-bold cursor-pointer"
                              title="Set as cover photo"
                            >
                              Cover
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePhoto(p.id)}
                            className="p-1 bg-black/40 hover:bg-rose-600 rounded text-white transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: MARKETING BANNERS & TRANSPARENT ADS ── */}
          {activeTab === "marketing" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Marketing Banners & Transparent Ad Server
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload marketing display banners and choose transparent sponsored placements (clearly marked [SPONSORED]).
                </p>
              </div>

              {/* Ad Tier Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    id: "hero_banner",
                    title: "Homepage Hero Banner",
                    price: "AED 2,999 / mo",
                    desc: "Prime placement on the Dubai Eat homepage hero slider seen by 200,000+ monthly food lovers.",
                    badge: "Highest Reach"
                  },
                  {
                    id: "top_district",
                    title: "District Top Sponsored",
                    price: "AED 1,499 / mo",
                    desc: `Guaranteed top 3 sponsored placement when diners search for ${district} or ${cuisine}.`,
                    badge: "Best ROI"
                  },
                  {
                    id: "verified_badge",
                    title: "Verified Gold Badge",
                    price: "AED 499 / mo",
                    desc: "Verified Gold Merchant badge, direct WhatsApp booking priority, and Gemini AI priority.",
                    badge: "Essential"
                  }
                ].map(tier => {
                  const selected = adCampaignType === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAdCampaignType(tier.id as any)}
                      className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        selected
                          ? "bg-teal-50/60 border-[#005971] ring-2 ring-[#005971]/20 shadow-md"
                          : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-3">
                        <span className="inline-block bg-[#005971] text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                          {tier.badge}
                        </span>
                        <h4 className="font-display font-black text-lg text-slate-900">{tier.title}</h4>
                        <p className="text-2xl font-black text-[#005971]">{tier.price}</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{tier.desc}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                        <span className={selected ? "text-[#005971]" : "text-slate-500"}>
                          {selected ? "✓ Active Selection" : "Click to select tier"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Marketing Banner Details Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005971]">
                  Campaign Creative & Banner Asset
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Image URL / High-Res Creative</label>
                    <input
                      type="text"
                      value={marketingBannerUrl}
                      onChange={e => setMarketingBannerUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Ad Headline / Callout Copy</label>
                    <input
                      type="text"
                      value={marketingHeadline}
                      onChange={e => setMarketingHeadline(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Banner Live Preview */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Placement Preview:</label>
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 shadow-xs">
                    <img src={marketingBannerUrl} alt="Ad Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-center text-white">
                      <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded w-fit mb-1">
                        [SPONSORED AD]
                      </span>
                      <h4 className="font-display font-black text-xl leading-tight">{venueName}</h4>
                      <p className="text-xs text-white/90 font-medium mt-0.5">{marketingHeadline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 7: LIVE VENUE PREVIEW ── */}
          {activeTab === "preview" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-display font-black text-xl text-[#0f172a]">
                  Real-time Diner Listing Preview
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This is how your venue profile, digital menu, coupons, and verified policies appear to food lovers on Dubai Eat.
                </p>
              </div>

              {/* Simulated Restaurant Card & Profile */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-md bg-white">
                <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
                  <img src={photos[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} alt={venueName} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#005971] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                        {cuisine}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        ✓ Verified Listing
                      </span>
                    </div>
                    <h2 className="font-display font-black text-3xl sm:text-4xl text-white">{venueName}</h2>
                    <p className="text-xs sm:text-sm text-white/80">📍 {address} · ~AED {priceMin}–{priceMax} per person</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Active Coupons Banner */}
                  {coupons.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BadgePercent className="w-4 h-4 text-amber-600" /> Accepted Privilege Offers
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coupons.map(c => (
                          <span key={c.id} className="bg-white border border-amber-300 text-amber-950 text-xs font-bold px-3 py-1 rounded-xl shadow-2xs">
                            💳 {c.code} — {c.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Policies Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Valet Parking</p>
                      <p className="font-bold text-slate-800 mt-0.5">{valetType}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Dress Code</p>
                      <p className="font-bold text-slate-800 mt-0.5">{dressCode}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Alcohol License</p>
                      <p className="font-bold text-slate-800 mt-0.5">{liquorStatus}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Hours</p>
                      <p className="font-bold text-slate-800 mt-0.5 truncate">{hours}</p>
                    </div>
                  </div>

                  {/* Digital Menu Sample */}
                  <div>
                    <h4 className="font-bold text-sm text-[#0f172a] mb-3">Sample Digital Menu ({menuItems.length} items)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {menuItems.slice(0, 4).map(m => (
                        <div key={m.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-start gap-3">
                          <div>
                            <p className="font-bold text-xs text-slate-900">{m.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{m.description}</p>
                          </div>
                          <span className="font-black text-xs text-[#005971] shrink-0">AED {m.price}</span>
                        </div>
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
