import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#006b54] bg-[#005743] text-white mt-20 text-left">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Logo className="text-white" />
          <p className="text-sm text-white/80 max-w-sm leading-relaxed">
            <strong className="text-[#f3cf68]">Dubai Eat — Web Platform.</strong> A one-stop discovery engine for 20,000+ restaurants, Fazaa & Esaad discount privileges, verified digital menus, and table reservations in Dubai.
          </p>
          <div className="text-xs text-white/60 pt-2 space-y-1">
            <p>✓ 100% Unbiased Organic Ranking</p>
            <p>✓ DET Dubai Open Data Commercial Sync</p>
            <p>✓ Transparent Google-Style Sponsored Ad Engine</p>
          </div>
        </div>

        {/* Discovery Links */}
        <div>
          <div className="text-xs uppercase tracking-widest text-white/60 font-bold mb-4">Discovery & Features</div>
          <ul className="space-y-2.5 text-xs text-white/85 font-semibold">
            <li><Link to="/restaurants" className="hover:text-[#f3cf68] transition-colors">🍽️ All Eateries & Venues</Link></li>
            <li><Link to="/map" className="hover:text-[#f3cf68] transition-colors">📍 Interactive Map Explorer</Link></li>
            <li><Link to="/deals" className="hover:text-[#f3cf68] transition-colors">💳 Deals & Privilege Cards</Link></li>
            <li><Link to="/poll" className="hover:text-[#f3cf68] transition-colors">📊 WhatsApp Group Food Poll</Link></li>
            <li><Link to="/ai-search" className="hover:text-[#f3cf68] transition-colors">🤖 AI Dining Concierge</Link></li>
          </ul>
        </div>

        {/* B2B & Merchant Portal */}
        <div>
          <div className="text-xs uppercase tracking-widest text-white/60 font-bold mb-4">Merchants & Platform</div>
          <ul className="space-y-2.5 text-xs text-white/85 font-semibold">
            <li><Link to="/merchant" className="hover:text-[#f3cf68] transition-colors">🏢 Merchant Claim Portal</Link></li>
            <li><Link to="/merchant" className="hover:text-[#f3cf68] transition-colors">🎯 Buy Sponsored Ad Placements</Link></li>
            <li><Link to="/merchant" className="hover:text-[#f3cf68] transition-colors">🔐 Stripe / Telr Deposit Setup</Link></li>
            <li><Link to="/admin" className="hover:text-[#f3cf68] transition-colors">⚙️ Platform Admin Console</Link></li>
            <li><Link to="/join" className="hover:text-[#f3cf68] transition-colors">📄 Venue Partnership</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Dubai Eat — Dubai Restaurant & Hospitality Platform</div>
          <div>100% Objective Organic Search Rankings · DET Dubai Verified Open Data</div>
        </div>
      </div>
    </footer>
  );
}