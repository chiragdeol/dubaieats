import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/restaurants" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Restaurants</Link>
          <Link to="/join" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>For Owners</Link>
        </nav>
        <Link to="/restaurants" className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity">
          Let’s Dubai-it →
        </Link>
      </div>
    </header>
  );
}