import { useState } from "react";
import { restaurants, Restaurant } from "../data/restaurants";
import { X, Sparkles, MapPin, Phone, ExternalLink, Star } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DubaiItRandomizerModal({ isOpen, onClose }: Props) {
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [selectedMichelinOnly, setSelectedMichelinOnly] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDubaiIt = () => {
    setIsSpinning(true);

    setTimeout(() => {
      let filtered = [...restaurants];

      if (selectedBudget === "budget") {
        filtered = filtered.filter((r) => r.priceMax <= 150);
      } else if (selectedBudget === "mid") {
        filtered = filtered.filter((r) => r.priceMin >= 100 && r.priceMax <= 500);
      } else if (selectedBudget === "luxury") {
        filtered = filtered.filter((r) => r.priceMin >= 400);
      }

      if (selectedMichelinOnly) {
        filtered = filtered.filter((r) => Boolean(r.michelin));
      }

      if (filtered.length < 3) {
        filtered = [...restaurants];
      }

      // Shuffle and pick 3
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 3));
      setIsSpinning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Interactive Decision Maker
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Can't Decide? <span className="text-primary italic">Let’s Dubai-it!</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Where are we eating? Tell us your vibe and we'll instantly pick 3 perfect Dubai spots for you.
          </p>
        </div>

        {/* Filter Quick Picks */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedBudget("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedBudget === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            Any Budget
          </button>
          <button
            onClick={() => setSelectedBudget("budget")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedBudget === "budget"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            💡 Budget Friendly (under 150 AED)
          </button>
          <button
            onClick={() => setSelectedBudget("luxury")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedBudget === "luxury"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            ✨ High-End Luxury (400+ AED)
          </button>
          <button
            onClick={() => setSelectedMichelinOnly(!selectedMichelinOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedMichelinOnly
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            ⭐ Michelin Starred Only
          </button>
        </div>

        {/* Big Dubai-it Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleDubaiIt}
            disabled={isSpinning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
            {isSpinning ? "Picking your spots..." : "Let’s Dubai-it!"}
          </button>
        </div>

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Your 3 Top "Dubai-it" Picks
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {recommendations.map((item) => (
                <div
                  key={item.name}
                  className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                      <span className="text-muted-foreground font-normal">({item.reviews})</span>
                    </div>
                    <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.cuisine} · {item.area}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        item.name + " " + item.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 font-medium"
                    >
                      <MapPin className="w-3 h-3" /> Map
                    </a>
                    <a
                      href={`tel:${item.phone.replace(/\s+/g, "")}`}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Web
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
