import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { enrichedRestaurants, type EnrichedRestaurant } from "../lib/restaurants-enriched";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check, 
  Trophy, 
  Calendar, 
  Plus, 
  Trash2, 
  Vote,
  Share2,
  ExternalLink
} from "lucide-react";

export const Route = createFileRoute("/poll")({
  head: () => ({
    meta: [
      { title: "WhatsApp Group Food Poll — Dubai Eat" },
      { name: "description", content: "Can't decide where to eat? Create a group food poll for WhatsApp and vote on restaurants with friends." },
    ],
  }),
  component: GroupPollPage,
});

function GroupPollPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    enrichedRestaurants[0].slug,
    enrichedRestaurants[1].slug,
    enrichedRestaurants[2].slug
  ]);
  const [pollTitle, setPollTitle] = useState("Where are we eating tonight? 🍽️");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const selectedRestaurants = useMemo(() => {
    return selectedSlugs
      .map(slug => enrichedRestaurants.find(r => r.slug === slug))
      .filter((r): r is EnrichedRestaurant => r !== undefined);
  }, [selectedSlugs]);

  const toggleRestaurant = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      if (selectedSlugs.length <= 2) {
        alert("Please keep at least 2 restaurants in your poll.");
        return;
      }
      setSelectedSlugs(prev => prev.filter(s => s !== slug));
    } else {
      if (selectedSlugs.length >= 5) {
        alert("You can select up to 5 restaurants in a single poll.");
        return;
      }
      setSelectedSlugs(prev => [...prev, slug]);
    }
  };

  const castVote = (slug: string) => {
    setVotes(prev => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1
    }));
  };

  const winningVenue = useMemo(() => {
    if (selectedRestaurants.length === 0) return null;
    let maxVotes = -1;
    let winner = selectedRestaurants[0];
    selectedRestaurants.forEach(r => {
      const v = votes[r.slug] || 0;
      if (v > maxVotes) {
        maxVotes = v;
        winner = r;
      }
    });
    return winner;
  }, [selectedRestaurants, votes]);

  const whatsappPollText = useMemo(() => {
    let msg = `📊 *${pollTitle}*\n\nVote for our dining spot:\n\n`;
    selectedRestaurants.forEach((r, idx) => {
      msg += `${idx + 1}. *${r.name}* (${r.cuisine} · ${r.district}) ~AED ${r.priceMin}\n   👉 Menu & Details: https://blueviolet-bee-902792.hostingersite.com/restaurants/${r.slug}\n\n`;
    });
    msg += `Created via Dubai Eat Explorer 🇦🇪`;
    return msg;
  }, [pollTitle, selectedRestaurants]);

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappPollText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappPollText)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-left">
      <div>
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border border-white/20">
                <Users className="w-3.5 h-3.5" /> Group Food Polls (PDF Section 7)
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-black leading-tight mb-4">
                WhatsApp Group Food Poll Generator
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Shortlist 2 to 5 restaurants, generate a formatted poll for your WhatsApp group, vote in real-time, and instantly book the winning table.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Poll Creator & Vote Tracker */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Poll Configuration Card */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h3 className="font-display font-extrabold text-xl text-foreground flex items-center gap-2 border-b border-border pb-4">
                  <Vote className="w-5 h-5 text-primary" /> 1. Customize Group Poll
                </h3>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Poll Question / Title
                  </label>
                  <input
                    type="text"
                    value={pollTitle}
                    onChange={e => setPollTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Selected Restaurants List */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Shortlisted Options ({selectedRestaurants.length}/5)
                  </label>

                  <div className="space-y-2.5">
                    {selectedRestaurants.map((r, idx) => {
                      const count = votes[r.slug] || 0;
                      return (
                        <div
                          key={r.slug}
                          className="bg-muted/40 border border-border rounded-2xl p-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="font-extrabold text-xs text-foreground truncate">{r.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{r.cuisine} · {r.district}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => castVote(r.slug)}
                              className="bg-primary text-primary-foreground font-bold text-xs px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1"
                            >
                              <Vote className="w-3.5 h-3.5" />
                              <span>Vote ({count})</span>
                            </button>

                            <button
                              onClick={() => toggleRestaurant(r.slug)}
                              className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-muted"
                              title="Remove option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Add Venue Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Add Another Venue to Poll
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        toggleRestaurant(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground outline-none cursor-pointer"
                  >
                    <option value="">+ Click to add a restaurant from Dubai catalog...</option>
                    {enrichedRestaurants
                      .filter(r => !selectedSlugs.includes(r.slug))
                      .map(r => (
                        <option key={r.slug} value={r.slug}>{r.name} ({r.district})</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Winning Venue Card */}
              {winningVenue && (
                <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                    <Trophy className="w-4 h-4" /> Leading Group Choice
                  </div>
                  <div className="flex items-center gap-4 bg-card/80 p-4 rounded-2xl border border-border">
                    <img src={winningVenue.image} alt={winningVenue.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-base text-foreground truncate">{winningVenue.name}</h4>
                      <p className="text-xs text-muted-foreground">{winningVenue.cuisine} · {winningVenue.district}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                        🏆 Highest Voted with {votes[winningVenue.slug] || 0} votes!
                      </p>
                    </div>
                    <a
                      href={winningVenue.bookingPlatform?.url || winningVenue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground font-extrabold text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Table
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: WhatsApp Export & Share Preview */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border-b border-border pb-4">
                  <MessageSquare className="w-4 h-4 fill-current" /> 2. Share to WhatsApp Group
                </div>

                <div className="bg-muted/50 p-4 rounded-2xl border border-border font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {whatsappPollText}
                </div>

                <div className="space-y-2.5 pt-2">
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Send Poll to WhatsApp Group</span>
                  </a>

                  <button
                    onClick={handleCopy}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs py-3 rounded-xl border border-border transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 text-emerald-500" /> Copied to Clipboard!</>
                    ) : (
                      <><Copy className="w-4 h-4 text-muted-foreground" /> Copy Poll Text</>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
