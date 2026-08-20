import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DubaiEatsLogo } from "@/components/logo";
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  LogIn, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Restaurant Vendor & Admin Portal — Dubai Eats" },
      { name: "description", content: "Secure sign-in for Dubai Eats restaurant partners and system administrators." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"vendor" | "admin">("vendor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo Auto-Fill Handlers
  const handleFillVendorDemo = () => {
    setRole("vendor");
    setEmail("vendor@dubaieats.ae");
    setPassword("vendor2026");
    setErrorMsg("");
  };

  const handleFillAdminDemo = () => {
    setRole("admin");
    setEmail("admin@dubaieats.ae");
    setPassword("admin2026");
    setErrorMsg("");
  };

  const handleInstantVendorLogin = () => {
    localStorage.setItem("dubai_eats_vendor_auth", JSON.stringify({
      venueName: "Zuma Dubai",
      district: "DIFC",
      email: "vendor@dubaieats.ae",
      tier: "Luxury & Michelin Tier"
    }));
    navigate({ to: "/merchant" });
  };

  const handleInstantAdminLogin = () => {
    localStorage.setItem("dubai_eats_admin_auth", JSON.stringify({
      adminName: "Superuser Admin",
      role: "Global Moderator",
      email: "admin@dubaieats.ae"
    }));
    navigate({ to: "/admin" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (role === "admin" || email.toLowerCase().includes("admin")) {
        localStorage.setItem("dubai_eats_admin_auth", JSON.stringify({
          adminName: "Superuser Admin",
          role: "Global Moderator",
          email
        }));
        navigate({ to: "/admin" });
      } else {
        localStorage.setItem("dubai_eats_vendor_auth", JSON.stringify({
          venueName: email.includes("zuma") ? "Zuma Dubai" : email.split("@")[0].toUpperCase() + " Dubai",
          district: "DIFC",
          email,
          tier: "Prime Growth Tier"
        }));
        navigate({ to: "/merchant" });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: MAIN AUTH CARD ── */}
            <div className="lg:col-span-7 bg-white border border-[#EAEAEA] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
              
              {/* Header & Logo */}
              <div className="space-y-2">
                <div className="w-fit mb-2">
                  <DubaiEatsLogo className="h-10 w-auto" />
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#FBF6E9] border border-[#EFE2B9] text-[#9C7D1A] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-heading">
                  <Sparkles className="w-3.5 h-3.5" /> Official Portal Authentication
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1A1A1A]">
                  Sign In to Your Portal
                </h1>
                <p className="text-xs text-[#757575] font-sans">
                  Access your restaurant management console, ad campaign analytics, or master administrative panel.
                </p>
              </div>

              {/* Account Role Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F5F5F5] rounded-2xl border border-[#E0E0E0] text-xs font-bold font-heading">
                <button
                  type="button"
                  onClick={() => { setRole("vendor"); setErrorMsg(""); }}
                  className={`py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "vendor"
                      ? "bg-[#1A1A1A] text-white shadow-xs"
                      : "text-[#757575] hover:text-[#1A1A1A]"
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${role === "vendor" ? "text-[#D4AF37]" : ""}`} />
                  <span>Restaurant Vendor</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole("admin"); setErrorMsg(""); }}
                  className={`py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === "admin"
                      ? "bg-[#1A1A1A] text-white shadow-xs"
                      : "text-[#757575] hover:text-[#1A1A1A]"
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${role === "admin" ? "text-[#D4AF37]" : ""}`} />
                  <span>Admin Superuser</span>
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Email input */}
                <div>
                  <label className="block text-xs font-bold font-heading text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                    {role === "vendor" ? "Restaurant Business Email" : "Administrator Email"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={role === "vendor" ? "vendor@dubaieats.ae" : "admin@dubaieats.ae"}
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
                    />
                    <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold font-heading text-[#1A1A1A] uppercase tracking-wide">
                      Password
                    </label>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert("A password reset link has been dispatched to your email."); }}
                      className="text-[11px] text-[#D4AF37] font-bold font-heading hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
                    />
                    <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#1A1A1A]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="accent-[#1A1A1A] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-[#757575] font-medium cursor-pointer">
                    Remember my credentials for 30 days
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold font-heading text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    <LogIn className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSubmitting ? "Authenticating..." : `Sign In to ${role === "vendor" ? "Vendor Dashboard" : "Admin Console"}`}</span>
                  </button>
                </div>
              </form>

              {/* Bottom Registration CTA */}
              <div className="border-t border-[#EAEAEA] pt-6 text-center text-xs text-[#757575]">
                <span>Are you a restaurant owner looking to join Dubai Eats? </span>
                <Link to="/join" className="font-bold text-[#1A1A1A] underline font-heading ml-1">
                  Register your restaurant & view plans →
                </Link>
              </div>

            </div>

            {/* ── RIGHT COLUMN: DEMO CREDENTIALS & QUICK ACCESS ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* DEMO BADGE CARD */}
              <div className="bg-[#1A1A1A] text-white border border-[#2E2E2E] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] font-heading">
                    <KeyRound className="w-3 h-3" /> PRE-CONFIGURED DEMO CREDENTIALS
                  </div>
                  <h3 className="font-heading font-black text-xl text-white">
                    Instant Demo Accounts
                  </h3>
                  <p className="text-xs text-[#A3A3A3] font-sans">
                    Use these credentials to test the live vendor and admin dashboards without creating an account:
                  </p>
                </div>

                {/* Account 1: Vendor Demo */}
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-heading text-[#D4AF37] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Restaurant Vendor Demo
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Zuma Dubai
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/10">
                    <div className="flex justify-between">
                      <span className="text-[#A3A3A3]">Email:</span>
                      <strong className="text-white">vendor@dubaieats.ae</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A3A3A3]">Password:</span>
                      <strong className="text-[#D4AF37]">vendor2026</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-heading text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={handleFillVendorDemo}
                      className="bg-white/15 hover:bg-white/25 text-white py-2 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={handleInstantVendorLogin}
                      className="bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer font-black"
                    >
                      <Zap className="w-3 h-3" />
                      <span>1-Click Sign In</span>
                    </button>
                  </div>
                </div>

                {/* Account 2: Admin Demo */}
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-heading text-[#D4AF37] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Console Demo
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                      Master Access
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/10">
                    <div className="flex justify-between">
                      <span className="text-[#A3A3A3]">Email:</span>
                      <strong className="text-white">admin@dubaieats.ae</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A3A3A3]">Password:</span>
                      <strong className="text-[#D4AF37]">admin2026</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-heading text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={handleFillAdminDemo}
                      className="bg-white/15 hover:bg-white/25 text-white py-2 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={handleInstantAdminLogin}
                      className="bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A] py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer font-black"
                    >
                      <Zap className="w-3 h-3" />
                      <span>1-Click Sign In</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Quick Feature Highlights Card */}
              <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-xs space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">
                  What's inside the Vendor Control Center?
                </h4>
                <ul className="space-y-2 text-xs text-[#757575] font-sans">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time impressions, CTR & ad campaign ROI analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interactive digital menu builder with photos & dietary badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fazaa, Esaad, and custom bank discount coupon management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct table booking links with 0% platform commission</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
