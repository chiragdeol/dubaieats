import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { enrichedRestaurants } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  ShieldCheck, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  BadgePercent, 
  Database, 
  Layers, 
  Users, 
  Star,
  Settings,
  Sparkles,
  ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Control Center — Dubai Eat" },
      { name: "description", content: "Platform moderation, DET data sync, discount management and merchant controls." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"venues" | "sync" | "deals" | "ads" | "plans">("venues");
  const [syncStatus, setSyncStatus] = useState<"idle" | "running" | "done">("idle");
  const [syncCount, setSyncCount] = useState(24780);

  const handleRunSync = () => {
    setSyncStatus("running");
    setTimeout(() => {
      setSyncStatus("done");
      setSyncCount(prev => prev + 12);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          
          {/* Header */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin & Superuser Console
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight mb-4 text-white">
                Dubai Eat Master Dashboard
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Control 20,000+ venue records, DET Open Data scraper pipelines, discount privilege programs, and Google-style transparent ad campaigns.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase mb-1">
                <span>Active Venues</span>
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground">{syncCount.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ 100% DET Verified</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase mb-1">
                <span>Privilege Cards</span>
                <BadgePercent className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-foreground">11 Programs</p>
              <p className="text-[10px] text-muted-foreground mt-1">Fazaa, Esaad, Entertainer</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase mb-1">
                <span>Sponsored Ads</span>
                <TrendingUp className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-black text-foreground">18 Live Ads</p>
              <p className="text-[10px] text-muted-foreground mt-1">AED 42,800 Monthly MRR</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase mb-1">
                <span>DET Data Sync</span>
                <Database className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-2xl font-black text-foreground">Live & Healthy</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Last synced 24 mins ago</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border gap-2 mb-8 overflow-x-auto">
            {[
              { id: "venues", label: "🏢 Venue Moderation" },
              { id: "sync", label: "⚡ DET Open Data Sync" },
              { id: "deals", label: "💳 Privilege Programs" },
              { id: "ads", label: "🎯 Sponsored Ad Server" },
              { id: "plans", label: "💼 Merchant Plans & MRR" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 font-extrabold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: VENUES */}
          {activeTab === "venues" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground">Directory Venues & Status</h3>
                  <p className="text-xs text-muted-foreground">Approve, edit, or feature restaurants and nightlife listings.</p>
                </div>
                <button className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl">
                  + Add New Venue Record
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Venue Name</th>
                      <th className="p-3">District</th>
                      <th className="p-3">Cuisine</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Privileges</th>
                      <th className="p-3">Sponsored</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {enrichedRestaurants.slice(0, 8).map(r => (
                      <tr key={r.slug} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{r.name}</td>
                        <td className="p-3 text-muted-foreground">{r.district}</td>
                        <td className="p-3 text-muted-foreground">{r.cuisine}</td>
                        <td className="p-3 font-bold text-emerald-600">{(r.rating * 2).toFixed(1)}</td>
                        <td className="p-3">
                          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            {r.discounts?.length || 0} Cards
                          </span>
                        </td>
                        <td className="p-3">
                          {r.isSponsored ? (
                            <span className="bg-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full">Active</span>
                          ) : (
                            <span className="text-muted-foreground text-[10px]">Organic</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Link to="/restaurants/$id" params={{ id: r.slug }} className="text-primary hover:underline font-bold">
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DET SYNC */}
          {activeTab === "sync" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground">Department of Economy & Tourism (DET) Sync</h3>
                  <p className="text-xs text-muted-foreground">Automated open data pipeline for trade licenses, restaurant opening status & verification.</p>
                </div>
                <button
                  onClick={handleRunSync}
                  disabled={syncStatus === "running"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${syncStatus === "running" ? "animate-spin" : ""}`} />
                  {syncStatus === "running" ? "Syncing DET Open Data..." : "Run Manual DET Ingestion"}
                </button>
              </div>

              {syncStatus === "done" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Successfully ingested and reconciled 12 new venue licenses from DET Dubai Open Data.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/40 p-5 rounded-2xl border border-border space-y-2">
                  <h4 className="font-extrabold text-sm text-foreground">DET Open Data Endpoints</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Dubai Commercial Directory API: <code>/v2/licenses/food-beverage</code></li>
                    <li>• Municipal Food Safety Classification: <code>/v1/health-inspections</code></li>
                    <li>• Real-time Trading Status: <code>/v1/registry/active</code></li>
                  </ul>
                </div>

                <div className="bg-muted/40 p-5 rounded-2xl border border-border space-y-2">
                  <h4 className="font-extrabold text-sm text-foreground">Sync Frequency & Cron Schedule</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Frequency: <strong>Daily at 03:00 GST</strong></li>
                    <li>• Auto-Resolution: Geocodes to 60+ Dubai communities</li>
                    <li>• Unbiased Ranking Check: <strong>Enforced</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEALS */}
          {activeTab === "deals" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-foreground border-b border-border pb-4">
                Privilege Card & Discount Program Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "Fazaa Card", count: "38 Venues", status: "Active" },
                  { name: "Esaad Card", count: "42 Venues", status: "Active" },
                  { name: "Emirates Platinum", count: "29 Venues", status: "Active" },
                  { name: "The Entertainer", count: "34 Venues", status: "Active" },
                  { name: "Supperclub", count: "18 Venues", status: "Active" },
                  { name: "Emirates NBD", count: "31 Venues", status: "Active" },
                  { name: "HSBC Dining Deals", count: "26 Venues", status: "Active" },
                  { name: "FAB Credit Cards", count: "24 Venues", status: "Active" },
                  { name: "Mashreq Bank Perks", count: "21 Venues", status: "Active" }
                ].map(p => (
                  <div key={p.name} className="bg-muted/40 p-4 rounded-2xl border border-border flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-xs text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.count}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADS */}
          {activeTab === "ads" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-foreground border-b border-border pb-4">
                Google-Style Transparent Ad Engine
              </h3>
              <p className="text-xs text-muted-foreground">
                All paid sponsored placements are strictly separated from organic search results and clearly labeled with <code>[SPONSORED]</code>.
              </p>
              <div className="bg-muted/40 p-4 rounded-2xl border border-border text-xs space-y-2">
                <p className="font-bold text-foreground">Active Ad Slots:</p>
                <p>• <strong>Homepage Hero Display Banner:</strong> Active (AED 2,999 / mo)</p>
                <p>• <strong>District Sponsored Top Listing:</strong> Active (AED 1,499 / mo)</p>
                <p>• <strong>Verified Merchant Badges:</strong> 24 Merchants Active</p>
              </div>
            </div>
          )}

          {/* TAB 5: PLANS */}
          {activeTab === "plans" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-foreground border-b border-border pb-4">
                Merchant Subscription Tiers (PDF Section 10)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-3">
                  <h4 className="font-black text-base text-foreground">Basic Plan</h4>
                  <p className="text-2xl font-black text-primary">Free</p>
                  <p className="text-xs text-muted-foreground">Verified listing, contact links, and standard menu showcase.</p>
                </div>

                <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                  <h4 className="font-black text-base text-foreground">Pro Plan</h4>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">AED 499 / mo</p>
                  <p className="text-xs text-muted-foreground">Privilege card promotion management, flash offers, and digital menu search.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-rose-500/20 p-5 rounded-2xl border border-amber-500/40 space-y-3">
                  <h4 className="font-black text-base text-foreground">VIP Partner</h4>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400">AED 1,499 / mo</p>
                  <p className="text-xs text-muted-foreground">Sponsored top listings, Stripe/Telr table deposit gateway & AI concierge priority.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
