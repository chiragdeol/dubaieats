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
  UtensilsCrossed,
  Compass,
  Tag
} from "lucide-react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [showAdvisory, setShowAdvisory] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(3);
  const navRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/restaurants", search: { q: searchQuery.trim() } });
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white text-[#1e293b] select-none font-sans" ref={navRef}>
      
      {/* ── TOP SAFETY ADVISORY BANNER ── */}
      {showAdvisory && (
        <div className="bg-[#005971] text-white px-4 py-2 text-xs sm:text-[13px] font-medium flex items-center justify-between border-b border-[#00475b] transition-all">
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
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── MAIN NAVIGATION BAR (OUR DIRECT PLATFORM MENU) ── */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 md:gap-6">
          
          {/* 1. Left: Government of Dubai Official Logo */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-95 transition-opacity py-1">
            <GovernmentDubaiLogo />
          </Link>

          {/* 2. Center: OUR PLATFORM MENU (Direct, Clear Navigation) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-[13.5px] font-bold text-[#1e293b]">
            
            {/* Home */}
            <Link
              to="/"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors"
              activeProps={{ className: "text-[#005971] bg-slate-50" }}
            >
              Home
            </Link>

            {/* Restaurants / Explore */}
            <Link
              to="/restaurants"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#005971] bg-slate-50" }}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#005971]" />
              <span>Restaurants</span>
            </Link>

            {/* Interactive Map */}
            <Link
              to="/map"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#005971] bg-slate-50" }}
            >
              <Compass className="w-3.5 h-3.5 text-[#005971]" />
              <span>Map Explorer</span>
            </Link>

            {/* Deals & Privileges (Highlight Pill) */}
            <Link
              to="/deals"
              className="bg-[#005971] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-extrabold shadow-xs hover:bg-[#00475b] transition-all"
            >
              <BadgePercent className="w-3.5 h-3.5 text-amber-300" />
              <span>Deals & Privileges</span>
            </Link>

            {/* WhatsApp Group Poll */}
            <Link
              to="/poll"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#005971] bg-slate-50" }}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Group Poll</span>
            </Link>

            {/* AI Dining Concierge */}
            <Link
              to="/ai-search"
              className="px-3.5 py-2 rounded-full hover:text-[#005971] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#005971] bg-slate-50" }}
            >
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Concierge</span>
            </Link>

            {/* Vendor Portal */}
            <Link
              to="/merchant"
              className="px-3.5 py-2 rounded-full bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 border border-amber-500/20"
              activeProps={{ className: "font-black" }}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Vendor Portal</span>
            </Link>

            {/* Admin Console */}
            <Link
              to="/admin"
              className="px-3 py-2 rounded-full hover:text-[#005971] text-slate-500 hover:bg-slate-50 transition-colors text-xs font-semibold"
              activeProps={{ className: "text-slate-800 font-bold" }}
            >
              <span>⚙️ Admin</span>
            </Link>

          </nav>

          {/* 3. Right: Search, Saved, Vendor Login & Visit Dubai Logo */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-slate-700">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search restaurants"
              className="p-2 text-slate-700 hover:text-[#005971] rounded-full hover:bg-slate-100/70 transition-colors cursor-pointer"
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

            {/* Vendor Login Button */}
            <Link
              to="/merchant"
              className="hidden sm:inline-flex items-center gap-1 text-[13px] font-bold text-[#005971] bg-teal-50 hover:bg-teal-100/80 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vendor Login</span>
            </Link>

            {/* Visit Dubai Brand Logo */}
            <div className="flex items-center pl-2 border-l border-slate-200">
              <Link to="/" className="hover:opacity-90 transition-opacity">
                <VisitDubaiLogo />
              </Link>
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
                <Sparkles className="w-4 h-4 text-amber-500" /> Quick Dining & Venue Search
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
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
                placeholder="Search by restaurant name, cuisine (e.g. Japanese, Italian), or dish..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#005971]/20 focus:border-[#005971]"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 py-1">Popular in Dubai:</span>
              {["DIFC Fine Dining", "Burj Khalifa View", "Fazaa Discount", "Beachfront Lounge", "Authentic Emirati", "Sunday Brunch"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    navigate({ to: "/restaurants", search: { q: tag } });
                    setSearchModalOpen(false);
                  }}
                  className="bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-[#005971] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
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