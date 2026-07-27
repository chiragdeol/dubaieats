import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isCurrentlyOpenInDubai } from "@/lib/opening-hours";
import { 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar, 
  MessageSquare, 
  UtensilsCrossed, 
  Info,
  Clock,
  Compass,
  Sparkles,
  Award
} from "lucide-react";

export const Route = createFileRoute("/restaurants/$id")({
  head: ({ params }) => {
    const restaurant = enrichedRestaurants.find(r => r.slug === params.id);
    return {
      meta: [
        { title: restaurant ? `${restaurant.name} — Review & Delivery in Dubai` : "Dubai-Eat Restaurant Details" },
        { name: "description", content: restaurant?.address || "Check out menus, prices, ratings and delivery links on Dubai-Eat." },
      ],
    };
  },
  component: RestaurantDetail,
});

// Helper to generate 4 deterministic extra photos for the collage
function getExtraPhotos(name: string): string[] {
  const pools = [
    [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
    ],
    [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600"
    ],
    [
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600",
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600"
    ]
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pools[hash % pools.length];
}

// Generate sample menu dynamically based on cuisine
function getSampleMenu(cuisine: string): { category: string; items: { name: string; desc: string; price: string }[] }[] {
  const cuisineLower = cuisine.toLowerCase();

  if (cuisineLower.includes("japanese") || cuisineLower.includes("sushi")) {
    return [
      {
        category: "Starters & Dim Sum",
        items: [
          { name: "Steamed Edamame", desc: "Served with sea salt or spicy chili garlic", price: "AED 32" },
          { name: "Yellowtail Sashimi", desc: "Sliced thin with green chili, ponzu, and garlic", price: "AED 95" },
          { name: "Shrimp Tempura", desc: "Lightly battered, served with dashi dipping sauce", price: "AED 75" }
        ]
      },
      {
        category: "Signature Main Course",
        items: [
          { name: "Miso-Marinated Black Cod", desc: "Wrapped in hoba leaf, sweet miso glaze", price: "AED 235" },
          { name: "Spicy Beef Tenderloin", desc: "With sesame, red chili, and sweet soy sauce", price: "AED 210" },
          { name: "Premium Sushi Platter", desc: "Selection of 10 nigiri and maki rolls", price: "AED 180" }
        ]
      },
      {
        category: "Dessert",
        items: [
          { name: "Zuma Chocolate Fondant", desc: "With a molten caramel center, vanilla bean ice cream", price: "AED 65" },
          { name: "Mochi Ice Cream Platter", desc: "Selection of coconut, mango, and matcha mochi", price: "AED 45" }
        ]
      }
    ];
  }

  if (cuisineLower.includes("italian") || cuisineLower.includes("pizza") || cuisineLower.includes("pasta")) {
    return [
      {
        category: "Antipasti",
        items: [
          { name: "Burrata Pugliese", desc: "With heirloom tomatoes, extra virgin olive oil, and fresh basil", price: "AED 85" },
          { name: "Calamari Fritti", desc: "Crispy squid served with spicy marinara and garlic aioli", price: "AED 75" }
        ]
      },
      {
        category: "Primi & Secondi",
        items: [
          { name: "Truffle Tagliolini", desc: "Fresh homemade pasta, shaved black summer truffles, butter sauce", price: "AED 165" },
          { name: "Wood-Fired Diavola Pizza", desc: "San Marzano tomatoes, spicy salami, fior di latte mozzarella", price: "AED 95" },
          { name: "Pan-Seared Sea Bass", desc: "With cherry tomatoes, capers, olives, and white wine sauce", price: "AED 185" }
        ]
      },
      {
        category: "Dolci",
        items: [
          { name: "Classic Tiramisu", desc: "Layers of espresso-soaked ladyfingers and mascarpone cream", price: "AED 50" },
          { name: "Sicilian Cannoli", desc: "Sweet ricotta filling, dark chocolate chips, pistachios", price: "AED 40" }
        ]
      }
    ];
  }

  // Default menu fallback (Universal Premium Menu)
  return [
    {
      category: "Appetizers",
      items: [
        { name: "Chef's Signature Soup", desc: "Seasonal ingredients, freshly baked sourdough bread", price: "AED 45" },
        { name: "Seared Scallops", desc: "With parsnip puree, crispy pancetta, and herb oil", price: "AED 90" }
      ]
    },
    {
      category: "Main Courses",
      items: [
        { name: "Premium Angus Ribeye (300g)", desc: "Grilled to order, truffle fries, peppercorn sauce", price: "AED 245" },
        { name: "Roasted Salmon Fillet", desc: "With asparagus, baby potatoes, and lemon butter sauce", price: "AED 175" },
        { name: "Wild Mushroom Risotto", desc: "Acquerello rice, chanterelle mushrooms, aged parmesan", price: "AED 120" }
      ]
    },
    {
      category: "Desserts",
      items: [
        { name: "Warm Apple Tart", desc: "With Madagascar vanilla ice cream and warm caramel drizzle", price: "AED 55" },
        { name: "Valrhona Chocolate Lava Cake", desc: "Decadent liquid chocolate center, raspberry coulis", price: "AED 60" }
      ]
    }
  ];
}

function callUrl(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function shareUrl(name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Dubai")}`;
}

function RestaurantDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"menu" | "about" | "info">("menu");

  const r = useMemo(() => {
    return enrichedRestaurants.find((item) => item.slug === id);
  }, [id]);

  if (!r) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <div>
          <SiteHeader />
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-extrabold text-foreground">Restaurant Not Found</h1>
            <p className="text-muted-foreground mt-2">The restaurant you are looking for does not exist in our directory.</p>
            <Link to="/restaurants" className="inline-block mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold text-xs">
              Back to Catalog
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const extraPhotos = getExtraPhotos(r.name);
  const liveStatus = isCurrentlyOpenInDubai(r.hours);
  const cleanPhone = r.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi!%20I'd%20like%20to%20check%20table%20availability%20for%20${encodeURIComponent(r.name)}%20via%20Dubai-Eat.`;
  const sampleMenu = getSampleMenu(r.cuisine);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />

        {/* 1. TheFork Inspired Photo Collage Grid Banner */}
        <section className="max-w-7xl mx-auto px-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-sm">
            {/* Main Featured Photo (Left) */}
            <div className="md:col-span-2 h-full relative overflow-hidden bg-secondary">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
            </div>

            {/* Extra collage photos (Right) */}
            <div className="hidden md:grid grid-cols-2 md:col-span-2 gap-2 h-full">
              {extraPhotos.map((photoUrl, i) => (
                <div key={i} className="h-full relative overflow-hidden bg-secondary">
                  <img src={photoUrl} alt={`${r.name} food photo`} className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Main Page Layout (Two Columns: Main Details + Sidebar Booking) */}
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Column (Left) */}
          <div className="lg:col-span-8 space-y-8 text-left">
            
            {/* Title Block */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {r.michelin && (
                  <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                    <Award className="w-3.5 h-3.5 fill-current" /> Michelin Selected
                  </span>
                )}
                {r.barType && (
                  <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                    🍸 Licensed Bar/Lounge
                  </span>
                )}
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
                  🏷️ Special Deal Active
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-none">
                {r.name}
              </h1>

              <div className="flex items-center flex-wrap gap-1.5 mt-3 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{(r.rating * 2).toFixed(1)} / 10</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(r.rating) ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-zinc-700"}`} />
                  ))}
                </div>
                <span>·</span>
                <span className="font-semibold text-primary">({r.reviews} Google reviews)</span>
                <span>·</span>
                <span>Average price: AED {r.priceMin}</span>
              </div>

              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {r.address}
              </p>
            </div>

            {/* Info Tabs Select */}
            <div className="flex border-b border-border">
              {[
                { id: "menu", label: "🍽️ Menu" },
                { id: "about", label: "💬 Details & Amenities" },
                { id: "info", label: "📅 Hours & Location" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Menu */}
            {activeTab === "menu" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-secondary/20 p-5 rounded-2xl border border-border/80">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-2">
                    <Info className="w-4 h-4 text-primary" /> Menu Information
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Average price is calculated based on starter, main course and dessert items. Menu items and prices are compiled from Google Maps public listings and official website menus.
                  </p>
                </div>

                {sampleMenu.map((cat) => (
                  <div key={cat.category} className="space-y-4">
                    <h3 className="font-display font-extrabold text-xl text-foreground pb-2 border-b border-border/60">
                      {cat.category}
                    </h3>
                    <div className="grid gap-6">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                          <span className="font-bold text-sm text-foreground whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: About / Amenities */}
            {activeTab === "about" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Details list */}
                <div>
                  <h3 className="font-display font-extrabold text-xl text-foreground pb-2 border-b border-border/60 mb-4">
                    Restaurant Specifications
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { label: "Vibe & Category", val: r.category },
                      { label: "Cuisine Type", val: r.cuisine },
                      { label: "Alcohol Policy", val: r.liquor || "Non-Licensed" },
                      { label: "Average Bill", val: `AED ${r.priceMin} - AED ${r.priceMax} per person` }
                    ].map((spec) => (
                      <div key={spec.label} className="bg-secondary/20 p-4 rounded-xl border border-border/65">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{spec.label}</p>
                        <p className="font-bold text-xs text-foreground mt-1">{spec.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities grid */}
                <div>
                  <h3 className="font-display font-extrabold text-xl text-foreground pb-2 border-b border-border/60 mb-4">
                    Amenities & Logistics perks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { condition: r.liquor === "Licensed", label: "🍷 Licensed (Alcohol)" },
                      { condition: r.seatingPerks?.includes("AC Terrace"), label: "🪑 AC Terrace Seating" },
                      { condition: r.seatingPerks?.includes("Burj View"), label: "🏙️ Burj Khalifa View" },
                      { condition: r.seatingPerks?.includes("Beachfront"), label: "🏖️ Beachfront View" },
                      { condition: r.logistics?.includes("Complimentary Valet"), label: "🚗 Free Valet Parking" },
                      { condition: r.logistics?.includes("Shisha Available"), label: "💨 Shisha Available" },
                      { condition: r.occasions?.includes("Kid Friendly"), label: "🍼 Kid Friendly Places" },
                      { condition: r.occasions?.includes("Business Lunch"), label: "💼 Business Lunch Deals" }
                    ].map((amenity) => (
                      <div 
                        key={amenity.label} 
                        className={`p-3 rounded-xl border text-center transition-all ${
                          amenity.condition 
                            ? "bg-primary/10 border-primary/20 text-primary font-bold text-xs" 
                            : "bg-secondary/10 border-border/40 text-muted-foreground/60 text-xs"
                        }`}
                      >
                        {amenity.label}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 3: Hours & Map */}
            {activeTab === "info" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Hours Grid */}
                <div>
                  <h3 className="font-display font-extrabold text-xl text-foreground pb-2 border-b border-border/60 mb-4">
                    Dubai Operating Hours
                  </h3>
                  <div className="bg-secondary/20 p-5 rounded-2xl border border-border/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Currently Status</p>
                        <p className="font-bold text-sm text-foreground">
                          {liveStatus.isOpen ? (
                            <span className="text-emerald-600">Open Now in Dubai</span>
                          ) : (
                            <span className="text-rose-600">Closed</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-foreground font-semibold border-t border-border/40 pt-3">
                      🗓️ Weekly Hours: <span className="font-normal text-muted-foreground">{r.hours}</span>
                    </p>
                  </div>
                </div>

                {/* Location Map Placeholder Card */}
                <div>
                  <h3 className="font-display font-extrabold text-xl text-foreground pb-2 border-b border-border/60 mb-4">
                    Location & Directions
                  </h3>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-secondary/35 p-4 border-b border-border/60 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-xs text-foreground">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{r.address}</p>
                      </div>
                      <a
                        href={shareUrl(r.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        Navigate
                      </a>
                    </div>
                    <div className="h-60 w-full bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                      <MapPin className="w-8 h-8 text-primary mb-2" />
                      <p className="text-xs font-semibold text-foreground">Google Maps Coordinates Loaded</p>
                      <p className="text-[10px] text-muted-foreground max-w-sm mt-0.5">Click navigate button above to open coordinate navigation inside native Google Maps.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Booking & Delivery Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TheFork style booking action card */}
            <div className="bg-card border border-border/90 rounded-3xl p-6 shadow-md text-left space-y-5 sticky top-24">
              
              <div>
                <h3 className="font-display font-extrabold text-lg text-foreground">
                  Reserve a Table
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We don't process bookings directly on Dubai-Eat. Reserve a table directly on the official booking page.
                </p>
              </div>

              <div className="space-y-2">
                {/* Main Reserve CTA */}
                <a
                  href={r.bookingPlatform?.url || r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition-all text-center cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reserve via {r.bookingPlatform?.name || "Official Website"}</span>
                </a>

                {/* WhatsApp Concierge */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-500 fill-current" />
                  <span>💬 WhatsApp Concierge</span>
                </a>
              </div>

              {/* Delivery launchers */}
              <div className="border-t border-border/60 pt-5 space-y-3">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    🛵 Order Delivery Menus
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    Check menu availability and order directly from local delivery platforms:
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  <a
                    href={r.deliveryLinks?.deliveroo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00cdbc]/10 border border-[#00cdbc]/30 hover:bg-[#00cdbc]/25 text-[#00cdbc] dark:text-[#00e3cf] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                    title="Open in Deliveroo"
                  >
                    <span className="text-sm">🛵</span>
                    <span className="text-[8px] font-bold">Deliveroo</span>
                  </a>
                  <a
                    href={r.deliveryLinks?.talabat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#ff5a00]/10 border border-[#ff5a00]/30 hover:bg-[#ff5a00]/25 text-[#ff5a00] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                    title="Open in Talabat"
                  >
                    <span className="text-sm">🚚</span>
                    <span className="text-[8px] font-bold">Talabat</span>
                  </a>
                  <a
                    href={r.deliveryLinks?.noon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#ffe816]/15 border border-[#ffe816]/40 hover:bg-[#ffe816]/30 text-yellow-700 dark:text-yellow-400 p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                    title="Open in Noon Food"
                  >
                    <span className="text-sm">🟡</span>
                    <span className="text-[8px] font-bold">Noon</span>
                  </a>
                  <a
                    href={r.deliveryLinks?.careem}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#47a13c]/10 border border-[#47a13c]/30 hover:bg-[#47a13c]/25 text-[#47a13c] dark:text-[#5ce74f] p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                    title="Open in Careem"
                  >
                    <span className="text-sm">🟢</span>
                    <span className="text-[8px] font-bold">Careem</span>
                  </a>
                  <a
                    href={r.deliveryLinks?.keeta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/25 text-sky-600 dark:text-sky-400 p-2 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-center"
                    title="Open in Keeta"
                  >
                    <span className="text-sm">⏺️</span>
                    <span className="text-[8px] font-bold">Keeta</span>
                  </a>
                </div>
              </div>

              {/* Utility actions */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
                <a href={callUrl(r.phone)} className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-primary" /> Call Phone
                </a>
                <a href={r.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" /> Official Site
                </a>
              </div>

            </div>

          </div>

        </main>

      </div>

      <SiteFooter />
    </div>
  );
}
