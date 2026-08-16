import { useState, useMemo } from "react";
import { Search, Sparkles, UtensilsCrossed, CheckCircle2, Flame } from "lucide-react";
import { type MenuItem } from "@/lib/restaurants-enriched";

interface DigitalMenuProps {
  restaurantName: string;
  items: MenuItem[];
}

const CATEGORIES = [
  "All Items",
  "Starters & Raw",
  "Mains & Grills",
  "Pasta & Pizza",
  "Desserts",
  "Beverages & Cocktails"
] as const;

export function DigitalMenu({ restaurantName, items }: DigitalMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [dishQuery, setDishQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    const q = dishQuery.trim().toLowerCase();
    return items.filter(item => {
      const matchCategory = activeCategory === "All Items" || item.category === activeCategory;
      const matchQuery = !q || 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [items, activeCategory, dishQuery]);

  return (
    <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 text-left shadow-sm space-y-6">
      
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Digital Menu & Dish Finder
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {restaurantName} Menu
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified prices, live dish lookup, dietary certifications, and chef specialties.
          </p>
        </div>

        {/* Dish Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={dishQuery}
            onChange={(e) => setDishQuery(e.target.value)}
            placeholder="Search dish (e.g. truffle, wagyu, pasta)..."
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          {dishQuery && (
            <button
              onClick={() => setDishQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-2xl border border-dashed border-border text-muted-foreground space-y-2">
          <UtensilsCrossed className="w-8 h-8 mx-auto text-muted-foreground/50" />
          <p className="text-sm font-bold text-foreground">No dishes found matching "{dishQuery}"</p>
          <p className="text-xs">Try searching for ingredients like truffle, burrata, steak, or pasta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(dish => (
            <div
              key={dish.id}
              className="bg-background/80 border border-border rounded-2xl p-4.5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                      {dish.name}
                      {dish.isPopular && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-amber-500" /> Popular
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-semibold">{dish.category}</span>
                  </div>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400 shrink-0">
                    AED {dish.price}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
                {dish.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground/80 border border-border"
                  >
                    {tag === "Halal" ? "🥩 Halal" : tag === "Chef Special" ? "⭐ Chef Special" : tag === "Gluten-Free" ? "🌾 Gluten-Free" : tag === "Vegan" ? "🌱 Vegan" : tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="text-right text-[10px] text-muted-foreground font-medium pt-2">
        * Menu items and prices are subject to seasonal updates and 5% VAT / 7% municipality fees where applicable.
      </div>
    </section>
  );
}
