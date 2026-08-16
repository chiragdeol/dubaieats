import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  BadgePercent,
  TrendingUp,
  Award,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/merchant")({
  component: MerchantDashboardPage,
});

function MerchantDashboardPage() {
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([
    "Esaad",
    "Fazaa",
    "Emirates Platinum",
    "The Entertainer"
  ]);
  const [selectedAdTier, setSelectedAdTier] = useState<"banner" | "sponsored_card" | "verified_badge">("sponsored_card");
  const [submitted, setSubmitted] = useState(false);

  const toggleDiscount = (discount: string) => {
    setSelectedDiscounts(prev =>
      prev.includes(discount) ? prev.filter(d => d !== discount) : [...prev, discount]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#005743] via-[#00755c] to-[#0f4f62] border border-[#168b8b]/30 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
                <Building2 className="w-3.5 h-3.5" /> Merchant & Venue Portal
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight text-white mb-4">
                Manage Venue, Privileges & Transparent Ads
              </h1>
              <p className="text-white/80 text-sm leading-relaxed">
                Connect your venue to Dubai Eats. List accepted discount cards (Esaad, Fazaa, Entertainer), manage VIP deposits, and feature on transparent Google-style sponsored placements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Step 1: Claim Venue Info */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">1. Claim & Update Venue Information</h3>
                    <p className="text-xs text-muted-foreground">Keep your verified status, menus, and operating hours accurate.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Restaurant / Venue Name</label>
                    <input
                      placeholder="e.g. Zuma Dubai"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">District / Location</label>
                    <input
                      placeholder="e.g. DIFC, Gate Village"
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Accepted Discounts & Privileges */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">2. Accepted Discounts & Privilege Cards</h3>
                    <p className="text-xs text-muted-foreground">Select all card programs and app discounts your venue honours.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "Esaad",
                    "Fazaa",
                    "Emirates Platinum",
                    "The Entertainer",
                    "Supper Club",
                    "BOGO (Buy 1 Get 1)",
                    "Emirates NBD",
                    "HSBC",
                    "FAB",
                    "Mashreq",
                    "Concierge VIP"
                  ].map(discount => {
                    const active = selectedDiscounts.includes(discount);
                    return (
                      <button
                        key={discount}
                        type="button"
                        onClick={() => toggleDiscount(discount)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                          active
                            ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400"
                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{discount}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Google-Style Transparent Ad Engine */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">3. Transparent Ad Engine Placements</h3>
                    <p className="text-xs text-muted-foreground">Organic search is 100% unbiased. Sponsored ads are clearly labeled [SPONSORED].</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "sponsored_card",
                      title: "Sponsored Top Listing",
                      desc: "Featured top position on District search results with clear [SPONSORED] tag.",
                      price: "AED 1,499 / mo"
                    },
                    {
                      id: "banner",
                      title: "Hero Display Banner",
                      desc: "High-impact banner across top of Eateries Catalog & District Explorer.",
                      price: "AED 2,999 / mo"
                    },
                    {
                      id: "verified_badge",
                      title: "Verified Merchant Badge + VIP Lead Gateway",
                      desc: "Gold checkmark badge + direct Stripe/Telr table deposit capture.",
                      price: "AED 799 / mo"
                    }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedAdTier(tier.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        selectedAdTier === tier.id
                          ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      <div>
                        <p className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          {tier.title}
                          {selectedAdTier === tier.id && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Selected</span>}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{tier.desc}</p>
                      </div>
                      <span className="font-black text-sm text-amber-600 dark:text-amber-400 shrink-0">{tier.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <><CheckCircle2 className="w-5 h-5 text-white" /> Merchant Request Submitted Successfully!</>
                  ) : (
                    <><Sparkles className="w-5 h-5 fill-white" /> Save Venue Profile & Activate Ad Package <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-card to-muted border border-border rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Why Partner with Dubai Eats?
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>100% Organic Search Integrity:</strong> Pure relevance algorithms built on guest ratings & reviews.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>DET Dubai Open Data Sync:</strong> Automatic licensing & venue verification updates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>WhatsApp & AI Chatbot Integration:</strong> AI concierge directs guests to your venue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Zero Direct Commission:</strong> Direct redirects to SevenRooms, OpenTable, or Deliveroo/Talabat.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 space-y-3 shadow-sm">
                <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Supported Payment Gateways
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Collect VIP table deposits & private chef booking guarantees directly via <strong>Stripe UAE</strong> or <strong>Telr Payment Gateway</strong>.
                </p>
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
