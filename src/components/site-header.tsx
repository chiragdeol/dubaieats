import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { GovernmentDubaiLogo } from "./logo";
import {
  X,
  BadgePercent,
  Users,
  Bot,
  Building2,
  UtensilsCrossed,
  Compass
} from "lucide-react";

export function SiteHeader() {
  const [showAdvisory, setShowAdvisory] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

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

      {/* ── MAIN NAVIGATION BAR ── */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 md:gap-6">
          
          {/* 1. Left: Government of Dubai Official Logo */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-95 transition-opacity py-1">
            <GovernmentDubaiLogo />
          </Link>

          {/* 2. Center: OUR PLATFORM MENU */}
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

          {/* 3. Right: Clean Vendor Login Button Only (Search, Heart and Dubai logo removed as requested) */}
          <div className="flex items-center gap-3">
            <Link
              to="/merchant"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#005971] bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-full transition-colors border border-teal-200/60"
            >
              <Building2 className="w-3.5 h-3.5 text-[#005971]" />
              <span>Vendor Login</span>
            </Link>
          </div>

        </div>
      </div>

    </header>
  );
}