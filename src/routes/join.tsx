import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiEatsLogo } from "@/components/logo";
import { DUBAI_DISTRICTS } from "@/lib/dubai-districts";
import { 
  Building2, 
  Mail, 
  Phone, 
  Lock,
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  BadgePercent,
  Calculator,
  ChevronRight,
  Eye,
  LogIn,
  UserPlus,
  Zap,
  HelpCircle,
  UploadCloud,
  FolderUp,
  Image as ImageIcon,
  Trash2
} from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Partner with Dubai Eats — Subscription Plans & Vendor Portal" },
      { name: "description", content: "List your restaurant, manage digital menus, accept VIP deposits, and drive high-spending diners with Dubai Eats." },
    ],
  }),
  component: JoinAndSubscriptionPage,
});

function JoinAndSubscriptionPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"plans" | "login" | "register">("plans");
  const [selectedTier, setSelectedTier] = useState<string>("prime");
  
  // ROI Calculator State
  const [coversPerDay, setCoversPerDay] = useState<number>(45);
  const [avgSpend, setAvgSpend] = useState<number>(350);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Registration State
  const [regVenueName, setRegVenueName] = useState("");
  const [regDistrict, setRegDistrict] = useState("DIFC");
  const [regCuisine, setRegCuisine] = useState("Fine Dining");
  const [regManagerName, setRegManagerName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regLicense, setRegLicense] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [regPhotos, setRegPhotos] = useState<{ id: string; url: string; name: string }[]>([]);
  const [regBanner, setRegBanner] = useState<string>("");

  const handleRegPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRegPhotos(prev => [...prev, { id: Date.now() + "_" + idx, url: event.target?.result as string, name: file.name }]);
          if (!regBanner && idx === 0) {
            setRegBanner(event.target?.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ROI Calculations
  const monthlyCovers = useMemo(() => coversPerDay * 30, [coversPerDay]);
  const estimatedNewRevenue = useMemo(() => Math.round(monthlyCovers * 0.18 * avgSpend), [monthlyCovers, avgSpend]);
  const estimatedRoiMultiplier = useMemo(() => ((estimatedNewRevenue / 899)).toFixed(1), [estimatedNewRevenue]);

  const handleDemoLogin = () => {
    localStorage.setItem("dubai_eats_vendor_auth", JSON.stringify({
      venueName: "Zuma Dubai",
      district: "DIFC",
      email: "manager@zumarestaurant.ae",
      tier: "Luxury Tier"
    }));
    navigate({ to: "/merchant" });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }
    localStorage.setItem("dubai_eats_vendor_auth", JSON.stringify({
      venueName: loginEmail.split("@")[0] || "My Restaurant",
      district: "DIFC",
      email: loginEmail,
      tier: selectedTier
    }));
    navigate({ to: "/merchant" });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSubmitted(true);
    setTimeout(() => {
      localStorage.setItem("dubai_eats_vendor_auth", JSON.stringify({
        venueName: regVenueName,
        district: regDistrict,
        email: regEmail,
        tier: selectedTier
      }));
      navigate({ to: "/merchant" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        {/* ── TOP HERO HEADER WITH BACKGROUND IMAGE ── */}
        <section className="bg-[#1A1A1A] text-white border-b border-[#2E2E2E] py-16 sm:py-24 px-6 lg:px-12 relative overflow-hidden">
          
          {/* Background Image & Cinematic Overlays */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-transparent to-[#1A1A1A]/90 pointer-events-none" />

          {/* Decorative Gold Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none z-1" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none z-1" />

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-heading">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Hospitality Partner & Merchant Network
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight drop-shadow-md">
              Grow Your Restaurant with Dubai Eats
            </h1>

            <p className="text-[#E5E5E5] text-base sm:text-lg max-w-2xl mx-auto font-normal font-sans drop-shadow-sm">
              Connect with 450,000+ local foodies, tourists, and corporate cardholders looking for verified bookings, digital menus, and exclusive dining privileges.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap justify-center items-center gap-3 pt-4 font-heading text-xs font-bold">
              <button
                onClick={() => setAuthMode("plans")}
                className={`px-6 py-3 rounded-xl transition-all cursor-pointer backdrop-blur-md ${
                  authMode === "plans"
                    ? "bg-[#D4AF37] text-[#1A1A1A] shadow-md"
                    : "bg-black/60 text-white hover:bg-black/80 border border-white/15"
                }`}
              >
                💎 Subscription Plans & Pricing
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className={`px-6 py-3 rounded-xl transition-all cursor-pointer backdrop-blur-md ${
                  authMode === "login"
                    ? "bg-[#D4AF37] text-[#1A1A1A] shadow-md"
                    : "bg-black/60 text-white hover:bg-black/80 border border-white/15"
                }`}
              >
                🔐 Vendor Login
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`px-6 py-3 rounded-xl transition-all cursor-pointer backdrop-blur-md ${
                  authMode === "register"
                    ? "bg-[#D4AF37] text-[#1A1A1A] shadow-md"
                    : "bg-black/60 text-white hover:bg-black/80 border border-white/15"
                }`}
              >
                📝 Register Restaurant
              </button>
            </div>
          </div>
        </section>

        {/* ── VIEW 1: VENDOR LOGIN FORM ── */}
        {authMode === "login" && (
          <main className="max-w-xl mx-auto px-6 py-16">
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
              <div className="text-center space-y-2">
                <div className="w-fit mx-auto mb-2">
                  <DubaiEatsLogo className="h-10 w-auto" />
                </div>
                <h2 className="font-heading font-black text-2xl text-[#1A1A1A]">Vendor Control Center Login</h2>
                <p className="text-xs text-[#757575] font-sans">
                  Access your restaurant dashboard, ad analytics, and digital menus.
                </p>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                    Business Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="manager@restaurant.ae"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
                    />
                    <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold font-heading text-[#1A1A1A] uppercase tracking-wide">
                      Password
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email."); }} className="text-[11px] text-[#D4AF37] font-bold font-heading hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
                    />
                    <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#D4AF37]" />
                    <span>Sign In to Dashboard</span>
                  </button>
                </div>
              </form>

              {/* 1-Click Instant Demo Login */}
              <div className="border-t border-[#EAEAEA] pt-6 text-center space-y-3">
                <p className="text-xs text-[#757575] font-medium">Quick Preview Access:</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-[#FBF6E9] hover:bg-[#F5ECD4] border border-[#EFE2B9] text-[#9C7D1A] font-extrabold font-heading text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-[#9C7D1A]" />
                  <span>1-Click Sign In as Zuma Dubai Demo</span>
                </button>
                <p className="text-xs text-[#757575]">
                  Don't have an account yet?{" "}
                  <button onClick={() => setAuthMode("register")} className="font-bold text-[#1A1A1A] underline">
                    Register your restaurant
                  </button>
                </p>
              </div>
            </div>
          </main>
        )}

        {/* ── VIEW 2: REGISTRATION FORM ── */}
        {authMode === "register" && (
          <main className="max-w-3xl mx-auto px-6 py-16">
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
              <div className="text-center space-y-2">
                <h2 className="font-heading font-black text-3xl text-[#1A1A1A]">Register Your Restaurant</h2>
                <p className="text-xs text-[#757575] font-sans">
                  Join Dubai Eats today. List your venue, showcase menus, and connect with diners.
                </p>
              </div>

              {regSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-heading font-black text-xl text-emerald-900">Registration Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-800">
                    Redirecting to your Vendor Control Center...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  
                  {/* Step 1: Restaurant Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold font-heading tracking-wider text-[#D4AF37] pb-2 border-b border-[#EAEAEA] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      1. Restaurant Profile
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Restaurant Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regVenueName}
                          onChange={e => setRegVenueName(e.target.value)}
                          placeholder="e.g. Gaia Dubai"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          District / Area *
                        </label>
                        <select
                          value={regDistrict}
                          onChange={e => setRegDistrict(e.target.value)}
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none cursor-pointer font-heading"
                        >
                          {DUBAI_DISTRICTS.map(d => (
                            <option key={d.name} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Cuisine Category *
                        </label>
                        <input
                          type="text"
                          required
                          value={regCuisine}
                          onChange={e => setRegCuisine(e.target.value)}
                          placeholder="e.g. Contemporary Greek / Mediterranean"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          DET Trade License Number
                        </label>
                        <input
                          type="text"
                          value={regLicense}
                          onChange={e => setRegLicense(e.target.value)}
                          placeholder="e.g. CN-1048291"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Contact Person */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold font-heading tracking-wider text-[#D4AF37] pb-2 border-b border-[#EAEAEA] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      2. Manager / Authorized Contact
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regManagerName}
                          onChange={e => setRegManagerName(e.target.value)}
                          placeholder="e.g. Chef Izu Ani"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Business WhatsApp / Phone *
                        </label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={e => setRegPhone(e.target.value)}
                          placeholder="+971 50 123 4567"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Account Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="manager@venue.ae"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase">
                          Account Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Upload Restaurant Photos & Banner from Laptop */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold font-heading tracking-wider text-[#D4AF37] pb-2 border-b border-[#EAEAEA] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      3. Restaurant Banner & Photos (Upload from Laptop)
                    </h3>

                    {/* Upload Dropzone */}
                    <div className="p-6 border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl bg-[#FBF6E9]/40 transition-all text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
                        <FolderUp className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold font-heading text-[#1A1A1A]">
                          Upload Multiple Venue & Food Photos from Your Laptop
                        </p>
                        <p className="text-[11px] text-[#757575]">
                          Select 1 or more images (JPG, PNG, WebP — hold Ctrl/Shift to choose multiple)
                        </p>
                      </div>
                      <div>
                        <label className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs transition-all">
                          <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                          <span>Browse Files from Laptop</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleRegPhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live Uploaded Thumbnails Preview */}
                    {regPhotos.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold font-heading text-[#757575] uppercase">
                          {regPhotos.length} Photos Selected from Laptop:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                          {regPhotos.map((photo, i) => (
                            <div key={photo.id} className="relative rounded-xl overflow-hidden aspect-video border border-[#E0E0E0] group bg-slate-100 shadow-2xs">
                              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setRegPhotos(prev => prev.filter(p => p.id !== photo.id))}
                                className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              {i === 0 && (
                                <span className="absolute bottom-1 left-1 bg-[#D4AF37] text-[#1A1A1A] font-bold text-[8px] px-1.5 py-0.5 rounded font-heading">
                                  Cover Banner
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 4: Plan Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold font-heading text-[#1A1A1A] uppercase">
                      4. Select Starting Plan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-heading text-xs">
                      {[
                        { id: "free", name: "Basic Starter", price: "Free" },
                        { id: "prime", name: "Prime Growth", price: "AED 899/mo" },
                        { id: "luxury", name: "Luxury & Michelin", price: "AED 2,499/mo" }
                      ].map(plan => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedTier(plan.id)}
                          className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${
                            selectedTier === plan.id
                              ? "border-[#D4AF37] bg-[#FBF6E9] text-[#1A1A1A] shadow-xs"
                              : "border-[#E0E0E0] bg-[#F5F5F5] text-[#757575] hover:border-slate-400"
                          }`}
                        >
                          <div className="font-bold">{plan.name}</div>
                          <div className="text-sm font-black text-[#D4AF37] mt-1">{plan.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Create Restaurant Account & Open Dashboard</span>
                  </button>
                </form>
              )}
            </div>
          </main>
        )}

        {/* ── VIEW 3: VALUE PROPOSITION & SUBSCRIPTION PLANS ── */}
        {authMode === "plans" && (
          <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-20">
            
            {/* 1. Value Proposition Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "450K+", label: "Monthly High-Intent Diners" },
                { number: "0%", label: "Commission on Direct Bookings" },
                { number: "+340%", label: "Average Growth in Direct Covers" },
                { number: "100%", label: "Objective & DET Verified" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-xs space-y-1">
                  <div className="font-display font-black text-3xl sm:text-4xl text-[#1A1A1A]">
                    {stat.number}
                  </div>
                  <div className="text-xs font-semibold text-[#757575] font-sans">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Subscription Pricing Cards (4 Tiers) */}
            <div className="space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#1A1A1A]">
                  Transparent Subscription Plans
                </h2>
                <p className="text-sm text-[#757575] font-sans">
                  Choose the plan that matches your restaurant's volume. Cancel or upgrade anytime with zero hidden fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                
                {/* Plan 1: Free Starter */}
                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#D4AF37] transition-all">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#757575] font-heading bg-[#F5F5F5] px-3 py-1 rounded-full">
                      Basic
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1A1A1A]">Starter</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-3xl text-[#1A1A1A]">AED 0</span>
                      <span className="text-xs text-[#757575]">/ month</span>
                    </div>
                    <p className="text-xs text-[#757575] font-sans">
                      Ideal for casual eateries and hidden gems wanting verified presence.
                    </p>

                    <ul className="space-y-2.5 text-xs text-[#4A4A4A] pt-4 border-t border-[#EAEAEA]">
                      <li className="flex items-center gap-2">✓ Official verified listing</li>
                      <li className="flex items-center gap-2">✓ Basic contact & Google Map pin</li>
                      <li className="flex items-center gap-2">✓ General operating hours</li>
                      <li className="flex items-center gap-2 text-[#A3A3A3]">✗ Digital menu builder</li>
                      <li className="flex items-center gap-2 text-[#A3A3A3]">✗ Fazaa / Esaad privilege tags</li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => { setSelectedTier("free"); setAuthMode("register"); }}
                      className="w-full border border-[#1A1A1A] hover:bg-[#F5F5F5] text-[#1A1A1A] font-bold font-heading text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Get Started Free
                    </button>
                  </div>
                </div>

                {/* Plan 2: Prime Growth (Highlighted) */}
                <div className="bg-[#1A1A1A] text-white border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative scale-105 z-10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#1A1A1A] font-black text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full font-heading">
                    ★ Most Popular
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] font-heading bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                      Prime Growth
                    </span>
                    <h3 className="font-heading font-black text-2xl text-white">Prime</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-4xl text-white">AED 899</span>
                      <span className="text-xs text-[#A3A3A3]">/ month</span>
                    </div>
                    <p className="text-xs text-[#A3A3A3] font-sans">
                      Complete digital menu, privilege discounts, and live booking routing.
                    </p>

                    <ul className="space-y-2.5 text-xs text-white/90 pt-4 border-t border-[#333333]">
                      <li className="flex items-center gap-2 text-[#D4AF37]">✓ Interactive Digital Menu & Photos</li>
                      <li className="flex items-center gap-2">✓ Fazaa, Esaad & Card Coupons</li>
                      <li className="flex items-center gap-2">✓ WhatsApp & SevenRooms Direct Links</li>
                      <li className="flex items-center gap-2">✓ Real-time Impression & Booking Stats</li>
                      <li className="flex items-center gap-2">✓ Photo Gallery (Up to 25 HD Photos)</li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => { setSelectedTier("prime"); setAuthMode("register"); }}
                      className="w-full bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-extrabold font-heading text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Start Prime Membership
                    </button>
                  </div>
                </div>

                {/* Plan 3: Luxury & Michelin */}
                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#D4AF37] transition-all">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C7D1A] font-heading bg-[#FBF6E9] px-3 py-1 rounded-full border border-[#EFE2B9]">
                      Fine Dining
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1A1A1A]">Luxury & VIP</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-3xl text-[#1A1A1A]">AED 2,499</span>
                      <span className="text-xs text-[#757575]">/ month</span>
                    </div>
                    <p className="text-xs text-[#757575] font-sans">
                      VIP table deposit engine, priority search placements & ad banner inclusion.
                    </p>

                    <ul className="space-y-2.5 text-xs text-[#4A4A4A] pt-4 border-t border-[#EAEAEA]">
                      <li className="flex items-center gap-2 font-bold text-[#1A1A1A]">✓ Everything in Prime</li>
                      <li className="flex items-center gap-2">✓ VIP Deposit Engine (Stripe / Telr)</li>
                      <li className="flex items-center gap-2">✓ District Top Sponsored Placement</li>
                      <li className="flex items-center gap-2">✓ Verified Gold Badge & Michelin Tag</li>
                      <li className="flex items-center gap-2">✓ AI Dining Concierge Priority Match</li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => { setSelectedTier("luxury"); setAuthMode("register"); }}
                      className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Choose Luxury Tier
                    </button>
                  </div>
                </div>

                {/* Plan 4: Enterprise Hospitality Group */}
                <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#D4AF37] transition-all">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#757575] font-heading bg-[#F5F5F5] px-3 py-1 rounded-full">
                      Multi-Venue
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1A1A1A]">Enterprise</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-3xl text-[#1A1A1A]">AED 5,999</span>
                      <span className="text-xs text-[#757575]">/ month</span>
                    </div>
                    <p className="text-xs text-[#757575] font-sans">
                      For hotel hospitality groups, multi-chain operations, and beach clubs.
                    </p>

                    <ul className="space-y-2.5 text-xs text-[#4A4A4A] pt-4 border-t border-[#EAEAEA]">
                      <li className="flex items-center gap-2 font-bold text-[#1A1A1A]">✓ Unlimited Venues in Dubai</li>
                      <li className="flex items-center gap-2">✓ Homepage Hero Rotating Banner Ads</li>
                      <li className="flex items-center gap-2">✓ Group-Wide Consolidated Analytics</li>
                      <li className="flex items-center gap-2">✓ Direct POS / API Integration</li>
                      <li className="flex items-center gap-2">✓ 24/7 Dedicated Account Director</li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => { setSelectedTier("enterprise"); setAuthMode("register"); }}
                      className="w-full border border-[#1A1A1A] hover:bg-[#F5F5F5] text-[#1A1A1A] font-bold font-heading text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Contact Enterprise Sales
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Interactive ROI Calculator */}
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAEAEA]">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-heading">
                    <Calculator className="w-4 h-4 text-[#D4AF37]" /> Interactive ROI Estimator
                  </div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
                    Calculate Your Revenue Lift
                  </h3>
                </div>
                <div className="text-xs text-[#757575] max-w-sm font-sans">
                  Estimate the return on direct reservations generated through your Dubai Eats verified profile and marketing campaigns.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Sliders */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold font-heading mb-2">
                      <span>Daily Guest Covers:</span>
                      <span className="text-[#D4AF37] text-sm">{coversPerDay} guests / day</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="250"
                      step="5"
                      value={coversPerDay}
                      onChange={e => setCoversPerDay(Number(e.target.value))}
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold font-heading mb-2">
                      <span>Average Spend Per Diner:</span>
                      <span className="text-[#D4AF37] text-sm">AED {avgSpend}</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="1200"
                      step="20"
                      value={avgSpend}
                      onChange={e => setAvgSpend(Number(e.target.value))}
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>
                </div>

                {/* ROI Output Card */}
                <div className="bg-[#1A1A1A] text-white p-8 rounded-2xl shadow-xl space-y-4 border border-[#333333]">
                  <div className="text-xs text-[#A3A3A3] font-heading uppercase tracking-wider">
                    Estimated Monthly New Revenue Lift:
                  </div>
                  <div className="font-display font-black text-4xl sm:text-5xl text-[#D4AF37]">
                    AED {estimatedNewRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/80 font-sans leading-relaxed">
                    Based on Prime Growth (AED 899/mo), your projected return on investment is <strong className="text-[#D4AF37] font-bold">{estimatedRoiMultiplier}x</strong> in net direct booking revenue.
                  </div>
                  <button
                    onClick={() => { setSelectedTier("prime"); setAuthMode("register"); }}
                    className="w-full bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] font-extrabold font-heading text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Claim This Growth Now
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Frequently Asked Questions */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="font-heading font-black text-2xl text-center text-[#1A1A1A]">
                Frequently Asked Questions for Restaurant Owners
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "How does Dubai Eats verify restaurant menus and trade licenses?",
                    a: "We cross-reference submissions with Dubai Department of Economy & Tourism (DET) registry data and merchant uploaded trade licenses to ensure 100% authenticity."
                  },
                  {
                    q: "Can I manage my own discount coupons (Fazaa, Esaad, Entertainer)?",
                    a: "Yes! In your Vendor Control Center, you can activate, modify, or add custom coupon codes, discount percentages, and validity dates in real-time."
                  },
                  {
                    q: "How do sponsored ads and marketing banners work?",
                    a: "You can upload high-resolution display banners for Homepage Hero, Top District Spotlight, or Verified Gold Badges with transparent cost-per-click and conversion tracking in your Analytics dashboard."
                  },
                  {
                    q: "Do you take any commission on table reservations?",
                    a: "No! Dubai Eats charges 0% commission on direct table bookings. Guests are routed straight to your SevenRooms, OpenTable, or direct WhatsApp line."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#EAEAEA] rounded-2xl p-5 space-y-2">
                    <h4 className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      {item.q}
                    </h4>
                    <p className="text-xs text-[#757575] leading-relaxed font-sans pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </main>
        )}

      </div>

      <SiteFooter />
    </div>
  );
}
