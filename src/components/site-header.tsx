import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Sparkles, MapPin, BadgePercent, Users, Bot, Building2, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-muted-foreground">
          <Link
            to="/restaurants"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            🍽️ Explore
          </Link>
          <Link
            to="/map"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            📍 Map
          </Link>
          <Link
            to="/deals"
            className="hover:text-foreground transition-colors text-amber-600 dark:text-amber-400"
            activeProps={{ className: "font-black" }}
          >
            💳 Deals & Privileges
          </Link>
          <Link
            to="/poll"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            📊 WhatsApp Poll
          </Link>
          <Link
            to="/ai-search"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            🤖 AI Concierge
          </Link>
          <Link
            to="/merchant"
            className="hover:text-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            🏢 Merchant Portal
          </Link>
          <Link
            to="/admin"
            className="hover:text-foreground transition-colors text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            activeProps={{ className: "text-foreground font-bold" }}
          >
            ⚙️ Admin
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            to="/ai-search"
            className="hidden sm:inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Search
          </Link>

          <Link
            to="/restaurants"
            className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-extrabold hover:opacity-90 transition-opacity shadow-xs"
          >
            Let’s Dubai-it →
          </Link>
        </div>

      </div>
    </header>
  );
}