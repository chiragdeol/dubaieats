import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-bold">
            Dubai<span className="italic text-accent"> Eats</span>
          </div>
          <p className="mt-4 text-sm text-background/70 max-w-sm leading-relaxed">
            Food cravings? <span className="text-accent font-semibold">Let’s Dubai-it at Dubai-Eat.</span> A hand-curated guide to 50 of Dubai's most iconic restaurants.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-background/50 mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/restaurants" className="hover:text-accent">All restaurants</Link></li>
            <li><Link to="/join" className="hover:text-accent">For Restaurant Owners</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-background/50 mb-4">About</div>
          <ul className="space-y-2 text-sm text-background/70">
            <li>Curated · not sponsored</li>
            <li>Live links via Google Maps</li>
            <li>Prices in AED</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-background/60">
          <div>© {new Date().getFullYear()} Dubai Eats · Made with saffron in DXB</div>
          <div>Data compiled from public sources · Not affiliated with any listed venue</div>
        </div>
      </div>
    </footer>
  );
}