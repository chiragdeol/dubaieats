import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-display font-bold">D</span>
          <span className="font-display text-xl font-bold tracking-tight">
            Dubai<span className="italic text-primary"> Eats</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/restaurants" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Restaurants</Link>
        </nav>
        <Link to="/restaurants" className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity">
          Let’s Dubai-it →
        </Link>
      </div>
    </header>
  );
}