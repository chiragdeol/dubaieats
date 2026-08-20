import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { GovernmentDubaiLogo, VisitDubaiLogo } from "./logo";
import {
  Search,
  Heart,
  ChevronDown,
  X,
  Sparkles,
  MapPin,
  BadgePercent,
  Users,
  Bot,
  Building2,
  ShieldCheck,
  MoreHorizontal,
  Calendar,
  UtensilsCrossed,
  Wine,
  Coffee,
  Compass,
  Check
} from "lucide-react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [showAdvisory, setShowAdvisory] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(3);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/restaurants", search: { q: searchQuery.trim() } });
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white text-[#1e293b] select-none font-sans" ref={navRef}>
      
      {/* ── TOP SAFETY ADVISORY BANNER (Visit Dubai Official) ── */}
      {showAdvisory && (
        <div className="bg-[#005971] text-white px-4 py-2.5 text-xs sm:text-[13px] font-medium flex items-center justify-between border-b border-[#00475b] transition-all">
          <div className="flex-1 text-center font-normal">
            <span>Your safety is our priority. </span>
            <Link
              to="/restaurants"
              className="underline font-semibold hover:text-teal-200 ml-1 transition-colors"
            >
              Read our travel advisory.
            </Link>
          </div>
          <button
            onClick={() => setShowAdvisory(false)}
            aria-label="Close safety alert"
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-2 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── MAIN NAVIGATION BAR ── */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 md:gap-6">
          
          {/* 1. Left: Government of Dubai Official Emblem Logo */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-95 transition-opacity py-1">
            <GovernmentDubaiLogo />
          </Link>

          {/* 2. Center: Visit Dubai Main Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 text-[14px] font-semibold text-[#1e293b]">
            
            {/* Home */}
            <Link
              to="/"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors"
            >
              Home
            </Link>

            {/* Explore Dubai ▾ */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("explore")}
                className={`px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors ${
                  activeDropdown === "explore" ? "text-[#005971] bg-slate-50" : "hover:text-[#005971] hover:bg-slate-50"
                }`}
              >
                <span>Explore Dubai</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {activeDropdown === "explore" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#005971] px-3 py-1.5">
                    Neighbourhoods & Districts
                  </div>
                  <Link
                    to="/restaurants"
                    search={{ area: "DIFC" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>DIFC (Financial Centre)</span>
                    <span className="text-[10px] text-slate-400">Fine dining</span>
                  </Link>
                  <Link
                    to="/restaurants"
                    search={{ area: "Downtown Dubai" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>Downtown & Burj Khalifa</span>
                    <span className="text-[10px] text-slate-400">Iconic views</span>
                  </Link>
                  <Link
                    to="/restaurants"
                    search={{ area: "Palm Jumeirah" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>Palm Jumeirah & Beaches</span>
                    <span className="text-[10px] text-slate-400">Beachfront</span>
                  </Link>
                  <Link
                    to="/map"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-teal-50/70 text-[#005971] hover:bg-teal-100/70 mt-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Open Interactive Dubai Map →</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Things to do ▾ */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("things")}
                className={`px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors ${
                  activeDropdown === "things" ? "text-[#005971] bg-slate-50" : "hover:text-[#005971] hover:bg-slate-50"
                }`}
              >
                <span>Things to do</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {activeDropdown === "things" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <Link
                    to="/restaurants"
                    search={{ vibe: "Beachfront" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>🏖️ Beach Clubs & Lounges</span>
                  </Link>
                  <Link
                    to="/restaurants"
                    search={{ vibe: "Sunday Brunch" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>🥂 Dubai Weekend Brunches</span>
                  </Link>
                  <Link
                    to="/restaurants"
                    search={{ vibe: "Ladies Night" }}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <span>🍸 Nightlife & Speakeasies</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Eat & Drink ▾ (OFFICIAL ACTIVE HIGHLIGHTED PILL) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("eat")}
                className="bg-[#005971] text-white px-5 py-2.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-xs hover:bg-[#00475b] transition-all"
              >
                <span>Eat & Drink</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/90" />
              </button>

              {activeDropdown === "eat" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#005971] px-3 py-1">
                    Culinary Guide & Explorer
                  </div>
                  
                  <Link
                    to="/restaurants"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-teal-50/60 text-slate-800 hover:text-[#005971] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#005971]/10 flex items-center justify-center text-sm shrink-0">
                      🍽️
                    </div>
                    <div>
                      <p className="text-xs font-bold">All Dubai Restaurants</p>
                      <p className="text-[11px] text-slate-500">Unbiased search across 20,000+ venues</p>
                    </div>
                  </Link>

                  <Link
                    to="/map"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-teal-50/60 text-slate-800 hover:text-[#005971] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#005971]/10 flex items-center justify-center text-sm shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="text-xs font-bold">Interactive Culinary Map</p>
                      <p className="text-[11px] text-slate-500">Geo-pins, valet cost & radius discovery</p>
                    </div>
                  </Link>

                  <Link
                    to="/deals"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-amber-50/60 text-slate-800 hover:text-amber-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-sm shrink-0">
                      💳
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Deals & Privilege Cards</p>
                      <p className="text-[11px] text-slate-500">Fazaa, Esaad, Entertainer, Bank cards</p>
                    </div>
                  </Link>

                  <Link
                    to="/poll"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50/60 text-slate-800 hover:text-emerald-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                      📊
                    </div>
                    <div>
                      <p className="text-xs font-bold">WhatsApp Group Food Poll</p>
                      <p className="text-[11px] text-slate-500">Vote on restaurants with friends</p>
                    </div>
                  </Link>

                  <Link
                    to="/ai-search"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-purple-50/60 text-slate-800 hover:text-purple-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center text-sm shrink-0">
                      🤖
                    </div>
                    <div>
                      <p className="text-xs font-bold">AI Dining Concierge</p>
                      <p className="text-[11px] text-slate-500">Ask natural language food queries</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Events & Festivals ▾ */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("events")}
                className={`px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors ${
                  activeDropdown === "events" ? "text-[#005971] bg-slate-50" : "hover:text-[#005971] hover:bg-slate-50"
                }`}
              >
                <span>Events & Festivals</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {activeDropdown === "events" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#005971] px-3 py-1.5">
                    Culinary Calendar
                  </div>
                  <Link
                    to="/restaurants"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    🎪 Dubai Food Festival 2026
                  </Link>
                  <Link
                    to="/deals"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    🌙 Ramadan Iftar & Suhoor Guides
                  </Link>
                </div>
              )}
            </div>

            {/* More Button ••• */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("more")}
                aria-label="More options"
                className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center text-slate-700 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {activeDropdown === "more" && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <Link
                    to="/merchant"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <Building2 className="w-4 h-4 text-[#005971]" />
                    <span>Merchant Portal & Ads</span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>Admin Control Center</span>
                  </Link>
                  <Link
                    to="/join"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#005971]"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-[#005971]" />
                    <span>For Restaurant Owners</span>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* 3. Right: Search, Favorites, Language, Login, Visit Dubai Logo */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-slate-700">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search restaurants"
              className="p-2 text-slate-700 hover:text-[#005971] rounded-full hover:bg-slate-100/70 transition-colors"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Saved / Favorites Heart Icon */}
            <Link
              to="/poll"
              aria-label="Saved venues & polls"
              className="relative p-2 text-slate-700 hover:text-[#d92d20] rounded-full hover:bg-slate-100/70 transition-colors"
            >
              <Heart className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#005971] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            </Link>

            {/* Language Selector (English ▾) */}
            <div className="hidden lg:flex items-center gap-1 text-[13.5px] font-semibold text-slate-700 hover:text-[#005971] cursor-pointer">
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Login Button */}
            <Link
              to="/merchant"
              className="hidden sm:inline-block text-[13.5px] font-bold text-slate-800 hover:text-[#005971] transition-colors"
            >
              Login
            </Link>

            {/* Visit Dubai Official Brand Logo + Dropdown */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <Link to="/" className="hover:opacity-90 transition-opacity">
                <VisitDubaiLogo />
              </Link>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 cursor-pointer hidden sm:block" />
            </div>

          </div>

        </div>
      </div>

      {/* ── SEARCH MODAL OVERLAY ── */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#005971] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Quick Dining & Venue Search
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant name, cuisine (e.g. Japanese, Italian), or area..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#005971]/20 focus:border-[#005971]"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 py-1">Popular in Dubai:</span>
              {["DIFC Fine Dining", "Burj Khalifa View", "Fazaa Discount", "Beachfront Lounge", "Authentic Emirati", "Sunday Brunch"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    navigate({ to: "/restaurants", search: { q: tag } });
                    setSearchModalOpen(false);
                  }}
                  className="bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-[#005971] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}