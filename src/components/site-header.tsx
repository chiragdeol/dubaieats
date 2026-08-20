import { Link } from "@tanstack/react-router";
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
    <header className="sticky top-0 z-40 w-full bg-white text-[#1A1A1A] select-none font-sans" ref={navRef}>
      
      {/* ── TOP SAFETY ADVISORY BANNER (Majestic Palate Luxe Dark #1A1A1A with Gold #D4AF37) ── */}
      {showAdvisory && (
        <div className="bg-[#1A1A1A] text-white px-4 py-2 text-xs sm:text-[13px] font-normal flex items-center justify-between border-b border-[#2A2A2A] transition-all">
          <div className="flex-1 text-center">
            <span className="text-white/80">Your safety is our priority. </span>
            <Link
              to="/restaurants"
              className="underline font-bold text-[#D4AF37] hover:text-amber-300 ml-1 transition-colors font-heading"
            >
              Read our travel advisory.
            </Link>
          </div>
          <button
            onClick={() => setShowAdvisory(false)}
            aria-label="Close safety alert"
            className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-2 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── MAIN NAVIGATION BAR (Majestic Palate Navigation) ── */}
      <div className="border-b border-[#EAEAEA] bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 md:gap-6">
          
          {/* 1. Left: Government of Dubai Official Emblem Logo */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-90 transition-opacity py-1">
            <GovernmentDubaiLogo />
          </Link>

          {/* 2. Center: OUR PLATFORM MENU (Clean Customer Nav) */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 text-[13px] font-bold font-heading text-[#1A1A1A]">
            
            {/* Home */}
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors"
              activeProps={{ className: "text-[#1A1A1A] bg-[#F5F5F5] font-black" }}
            >
              Home
            </Link>

            {/* Restaurants */}
            <Link
              to="/restaurants"
              className="px-3.5 py-2 rounded-xl hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#1A1A1A] bg-[#F5F5F5] font-black" }}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Restaurants</span>
            </Link>

            {/* Map Explorer */}
            <Link
              to="/map"
              className="px-3.5 py-2 rounded-xl hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#1A1A1A] bg-[#F5F5F5] font-black" }}
            >
              <Compass className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Map Explorer</span>
            </Link>

            {/* Deals & Privileges */}
            <Link
              to="/deals"
              className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold shadow-xs hover:bg-[#000000] border border-[#333333] transition-all"
            >
              <BadgePercent className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Deals & Privileges</span>
            </Link>

            {/* WhatsApp Group Poll */}
            <Link
              to="/poll"
              className="px-3.5 py-2 rounded-xl hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#1A1A1A] bg-[#F5F5F5] font-black" }}
            >
              <Users className="w-3.5 h-3.5 text-[#757575]" />
              <span>Group Poll</span>
            </Link>

            {/* AI Dining Concierge */}
            <Link
              to="/ai-search"
              className="px-3.5 py-2 rounded-xl hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5"
              activeProps={{ className: "text-[#1A1A1A] bg-[#F5F5F5] font-black" }}
            >
              <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>AI Concierge</span>
            </Link>

          </nav>

          {/* 3. Right: Single Clean "For Restaurants" Link opening the Restaurant Information Page (/join) */}
          <div className="flex items-center gap-3">
            <Link
              to="/join"
              className="inline-flex items-center gap-1.5 text-xs font-bold font-heading text-[#1A1A1A] bg-[#F5F5F5] hover:bg-[#D4AF37] hover:text-[#1A1A1A] px-4 py-2 rounded-xl transition-all border border-[#E0E0E0] shadow-2xs cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>For Restaurants</span>
            </Link>
          </div>

        </div>
      </div>

    </header>
  );
}