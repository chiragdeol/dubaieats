import { Link } from "@tanstack/react-router";
import { GovernmentDubaiLogo, VisitDubaiLogo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#00475b] bg-[#005971] text-white mt-20 text-left font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl w-fit border border-white/15">
            <GovernmentDubaiLogo />
            <div className="h-6 w-px bg-white/20 mx-1" />
            <VisitDubaiLogo />
          </div>

          <p className="text-sm text-white/85 max-w-md leading-relaxed font-normal">
            <strong className="text-white font-bold">Dubai Eat & Drink Guide — Official Hospitality Portal.</strong> Discover authentic Emirati culinary culture, world-class Michelin star dining, local hidden gems, and exclusive Fazaa & Esaad dining privileges.
          </p>

          <div className="text-xs text-white/70 pt-2 space-y-1 font-medium">
            <p>✓ 100% Objective, Relevance-Driven Restaurant Rankings</p>
            <p>✓ DET Dubai Department of Economy & Tourism Open Data Ingestion</p>
            <p>✓ Verified Menus, Dietary Certifications & Instant Booking</p>
          </div>
        </div>

        {/* Discovery Links */}
        <div>
          <div className="text-xs uppercase tracking-widest text-teal-200 font-extrabold mb-4">
            Eat & Drink Discovery
          </div>
          <ul className="space-y-2.5 text-xs text-white/85 font-medium">
            <li>
              <Link to="/restaurants" className="hover:text-teal-200 transition-colors">
                🍽️ All Dubai Eateries & Dining
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-teal-200 transition-colors">
                📍 Interactive Dubai Map Explorer
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-teal-200 transition-colors">
                💳 Fazaa, Esaad & Card Privileges
              </Link>
            </li>
            <li>
              <Link to="/poll" className="hover:text-teal-200 transition-colors">
                📊 WhatsApp Group Dining Poll
              </Link>
            </li>
            <li>
              <Link to="/ai-search" className="hover:text-teal-200 transition-colors">
                🤖 Smart AI Dining Concierge
              </Link>
            </li>
          </ul>
        </div>

        {/* B2B & Merchant Portal */}
        <div>
          <div className="text-xs uppercase tracking-widest text-teal-200 font-extrabold mb-4">
            For Venues & Merchants
          </div>
          <ul className="space-y-2.5 text-xs text-white/85 font-medium">
            <li>
              <Link to="/merchant" className="hover:text-teal-200 transition-colors">
                🏢 Claim & Verify Your Venue
              </Link>
            </li>
            <li>
              <Link to="/merchant" className="hover:text-teal-200 transition-colors">
                🎯 Sponsored Advertising Engine
              </Link>
            </li>
            <li>
              <Link to="/merchant" className="hover:text-teal-200 transition-colors">
                🔐 Stripe & Telr VIP Table Deposits
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-teal-200 transition-colors">
                ⚙️ Platform Admin Console
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-teal-200 transition-colors">
                📄 Hospitality Partner Program
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/15 bg-[#00475b]/60">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Government of Dubai · Department of Economy and Tourism. All rights reserved.</div>
          <div>Dubai Official Culinary & Dining Guide</div>
        </div>
      </div>
    </footer>
  );
}