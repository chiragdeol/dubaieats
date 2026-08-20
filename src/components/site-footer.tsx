import { Link } from "@tanstack/react-router";
import { GovernmentDubaiLogo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#1A1A1A] text-white mt-20 text-left font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl w-fit border border-white/10">
            <GovernmentDubaiLogo />
          </div>

          <p className="text-sm text-[#A3A3A3] max-w-md leading-relaxed font-normal">
            <strong className="text-white font-bold font-heading">Majestic Palate Dubai — Culinary Discovery Guide.</strong> Discover authentic Emirati culinary culture, world-class Michelin star dining, local hidden gems, and exclusive Fazaa & Esaad dining privileges.
          </p>

          <div className="text-xs text-[#757575] pt-2 space-y-1 font-medium font-heading">
            <p>✓ 100% Objective, Relevance-Driven Restaurant Rankings</p>
            <p>✓ DET Dubai Department of Economy & Tourism Open Data Ingestion</p>
            <p>✓ Verified Menus, Dietary Certifications & Instant Booking</p>
          </div>
        </div>

        {/* Discovery Links */}
        <div>
          <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-heading mb-4">
            Eat & Drink Discovery
          </div>
          <ul className="space-y-2.5 text-xs text-[#A3A3A3] font-medium font-heading">
            <li>
              <Link to="/restaurants" className="hover:text-[#D4AF37] transition-colors">
                🍽️ All Dubai Eateries & Dining
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-[#D4AF37] transition-colors">
                📍 Interactive Dubai Map Explorer
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-[#D4AF37] transition-colors">
                💳 Fazaa, Esaad & Card Privileges
              </Link>
            </li>
            <li>
              <Link to="/poll" className="hover:text-[#D4AF37] transition-colors">
                📊 WhatsApp Group Dining Poll
              </Link>
            </li>
            <li>
              <Link to="/ai-search" className="hover:text-[#D4AF37] transition-colors">
                🤖 Smart AI Dining Concierge
              </Link>
            </li>
          </ul>
        </div>

        {/* B2B & Merchant Portal */}
        <div>
          <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-heading mb-4">
            For Venues & Merchants
          </div>
          <ul className="space-y-2.5 text-xs text-[#A3A3A3] font-medium font-heading">
            <li>
              <Link to="/merchant" className="hover:text-[#D4AF37] transition-colors">
                🏢 Claim & Verify Your Venue
              </Link>
            </li>
            <li>
              <Link to="/merchant" className="hover:text-[#D4AF37] transition-colors">
                🎯 Sponsored Advertising Engine
              </Link>
            </li>
            <li>
              <Link to="/merchant" className="hover:text-[#D4AF37] transition-colors">
                🔐 Stripe & Telr VIP Table Deposits
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#D4AF37] transition-colors">
                ⚙️ Platform Admin Console
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-[#D4AF37] transition-colors">
                📄 Hospitality Partner Program
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-[#2A2A2A] bg-[#141414]">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#757575] font-heading">
          <div>© {new Date().getFullYear()} Government of Dubai · Department of Economy and Tourism. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/restaurants" className="hover:text-[#D4AF37]">Privacy Policy</Link>
            <Link to="/restaurants" className="hover:text-[#D4AF37]">Terms of Service</Link>
            <Link to="/merchant" className="hover:text-[#D4AF37]">Merchant Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}