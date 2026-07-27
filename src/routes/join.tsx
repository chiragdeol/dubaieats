import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  UtensilsCrossed, 
  DollarSign, 
  Compass, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  FlameKindling
} from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Onboard Your Restaurant — Dubai-Eat Partners" },
      { name: "description", content: "Submit your venue to Dubai-Eat's curated collection. Reach premium diners searching for reviews, licenses, valet, and direct booking links." },
    ],
  }),
  component: JoinPartners,
});

function JoinPartners() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    contactName: "",
    email: "",
    phone: "",
    area: "DIFC",
    cuisine: "",
    priceTier: "AED AED (Casual)",
    liquor: "Licensed",
    website: "",
    bookingUrl: "",
    whatsappNumber: "",
    valet: false,
    shisha: false,
    evCharging: false,
    acTerrace: false,
    burjView: false,
    beachfront: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />

        <div className="max-w-4xl mx-auto px-6 py-20">
          
          {!submitted ? (
            <div>
              {/* Header block */}
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  🤝 Dubai-Eat Partner Network
                </span>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mt-4 leading-tight">
                  List your restaurant on Dubai-Eat
                </h1>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                  Join Dubai's premium directory. Connect with high-value tourists and local diners seeking verified bookings, amenities, and delivery options.
                </p>
              </div>

              {/* Form Card */}
              <form onSubmit={handleSubmit} className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-xl space-y-8">
                
                {/* 1. Basic Info */}
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <Building2 className="w-4 h-4 text-primary" /> Basic Restaurant Information
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Restaurant Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        placeholder="e.g. Zuma Dubai"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Cuisine Type *</label>
                      <input
                        type="text"
                        required
                        value={formData.cuisine}
                        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                        placeholder="e.g. Contemporary Japanese"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contact details */}
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <Mail className="w-4 h-4 text-primary" /> Contact Details
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. manager@restaurant.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +971 4 425 5660"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Location & Pricing */}
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <MapPin className="w-4 h-4 text-primary" /> Location & Price Band
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Dubai Area *</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                      >
                        <option value="DIFC">DIFC</option>
                        <option value="Palm Jumeirah">Palm Jumeirah</option>
                        <option value="Downtown Dubai">Downtown Dubai</option>
                        <option value="Jumeirah">Jumeirah</option>
                        <option value="Dubai Marina">Dubai Marina</option>
                        <option value="Business Bay">Business Bay</option>
                        <option value="Bluewaters">Bluewaters</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Price Tier *</label>
                      <select
                        value={formData.priceTier}
                        onChange={(e) => setFormData({ ...formData, priceTier: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                      >
                        <option value="AED">AED (Budget)</option>
                        <option value="AED AED">AED AED (Casual)</option>
                        <option value="AED AED AED">AED AED AED (Upscale)</option>
                        <option value="AED AED AED AED">AED AED AED AED (Fine Dining)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Liquor License *</label>
                      <select
                        value={formData.liquor}
                        onChange={(e) => setFormData({ ...formData, liquor: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
                      >
                        <option value="Licensed">Licensed (Serve alcohol)</option>
                        <option value="Non-Licensed">Non-Licensed (Dry venue)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Amenities */}
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <Compass className="w-4 h-4 text-primary" /> Amenities & Logistics
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: "valet", label: "🚗 Valet Parking" },
                      { id: "shisha", label: "💨 Shisha Available" },
                      { id: "evCharging", label: "⚡ EV Charging" },
                      { id: "acTerrace", label: "🪑 AC Terrace Seating" },
                      { id: "burjView", label: "🏙️ Burj Khalifa View" },
                      { id: "beachfront", label: "🏖️ Beachfront View" }
                    ].map((amenity) => (
                      <label key={amenity.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-border/70 hover:border-primary/30 bg-background cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={(formData as any)[amenity.id]}
                          onChange={(e) => setFormData({ ...formData, [amenity.id]: e.target.checked })}
                          className="rounded text-primary border-border focus:ring-primary/20 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-foreground">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Online Platforms */}
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <FlameKindling className="w-4 h-4 text-primary" /> Booking & Web Links
                  </h3>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Website URL</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://www.restaurant.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">Reservation URL (SevenRooms/OpenTable)</label>
                      <input
                        type="url"
                        value={formData.bookingUrl}
                        onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                        placeholder="https://www.sevenrooms.com/..."
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wide">WhatsApp Concierge Phone Number</label>
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="e.g. +971 56 273 0030"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground font-bold text-sm py-4 rounded-xl hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-1.5"
                  >
                    Submit Submission Request <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Success State */
            <div className="bg-card border border-border p-12 sm:p-20 rounded-3xl shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Submission Received!
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                Thank you for submitting **{formData.restaurantName}**. Our Dubai-Eat curation committee will review your submission details, check GMB profile status, and contact you at **{formData.email}** within 48 hours.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link to="/" className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-colors">
                  Go to Home Page
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Submit Another Venue
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
