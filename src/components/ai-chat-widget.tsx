import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  parseIntent,
  matchRestaurants,
  buildReply,
  callGemini,
  hasGemini,
  SUGGESTED_PROMPTS,
  type ChatMessage,
  type EnrichedRestaurant,
} from "@/lib/restaurant-ai";
import { enrichedRestaurants } from "@/lib/restaurants-enriched";
import { 
  Star, 
  Send, 
  X, 
  ChevronDown, 
  ExternalLink, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Maximize2,
  Minimize2,
  Compass
} from "lucide-react";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
type BotMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  restaurants?: EnrichedRestaurant[];
  loading?: boolean;
};

/* ────────────────────────────────────────────────
   Restaurant Result Card (inside chat)
──────────────────────────────────────────────── */
function ChatRestaurantCard({ r }: { r: EnrichedRestaurant }) {
  return (
    <Link
      to="/restaurants/$id"
      params={{ id: r.slug || "" }}
      className="flex gap-3 p-3 bg-white/5 hover:bg-white/12 border border-white/10 hover:border-[#D4AF37]/40 rounded-2xl transition-all group shadow-sm text-left"
    >
      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-white/10">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-white leading-tight truncate group-hover:text-[#D4AF37] transition-colors font-heading">
          {r.name}
        </p>
        <p className="text-xs text-white/60 mt-0.5 truncate font-sans">{r.cuisine} · {r.district}</p>
        <div className="flex items-center gap-2.5 mt-1.5 font-sans">
          <span className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold font-heading">
            <Star className="w-3 h-3 fill-[#D4AF37]" />
            {r.rating.toFixed(1)}
          </span>
          <span className="text-xs text-white/50">AED {r.priceMin}–{r.priceMax}</span>
          {r.michelin && (
            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-full font-bold font-heading">
              Michelin
            </span>
          )}
          {r.liquor === "Licensed" && (
            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full font-bold font-heading">
              Licensed
            </span>
          )}
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D4AF37] shrink-0 mt-1 transition-colors" />
    </Link>
  );
}

/* ────────────────────────────────────────────────
   Typing indicator
──────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Format bot text with markdown-style bolding
──────────────────────────────────────────────── */
function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
      {parts.map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="text-white font-bold font-heading">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

/* ────────────────────────────────────────────────
   Main AI Chat Widget Component
──────────────────────────────────────────────── */
export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: hasGemini
        ? "Welcome to **Dubai Eats AI Concierge** ✨\n\nI can recommend fine dining in DIFC, romantic rooftop lounges in Marina, family spots with kids menus, or verified discount tables. What are you in the mood for?"
        : "Welcome to **Dubai Eats AI** 🍽️\n\nTell me what you're craving — cuisine, district, budget, or occasion — and I'll find the best verified tables!",
    },
  ]);
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const addMessage = useCallback((msg: Omit<BotMessage, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<BotMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }, []);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputVal).trim();
    if (!text || isLoading) return;

    setInputVal("");
    setIsLoading(true);
    addMessage({ role: "user", text });
    const botId = addMessage({ role: "bot", text: "", loading: true });

    try {
      if (hasGemini) {
        const newHistory: ChatMessage[] = [...geminiHistory, { role: "user", text }];
        const { reply, matchedIds } = await callGemini(newHistory);
        const restaurants = matchedIds.length > 0
          ? matchedIds.map(id => enrichedRestaurants.find(r => r.slug === id)).filter(Boolean) as EnrichedRestaurant[]
          : undefined;
        updateMessage(botId, { text: reply, loading: false, restaurants });
        setGeminiHistory([...newHistory, { role: "model", text: reply }]);
      } else {
        const intent = parseIntent(text);
        const matched = matchRestaurants(intent);
        const reply = buildReply(matched, intent);
        await new Promise(r => setTimeout(r, 600));
        updateMessage(botId, {
          text: reply,
          loading: false,
          restaurants: matched.length > 0 ? matched : undefined,
        });
      }
    } catch (err) {
      console.error(err);
      updateMessage(botId, { text: "I encountered an error connecting to our dining database. Please try again! 🙏", loading: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputVal);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: "welcome",
      role: "bot",
      text: hasGemini
        ? "Welcome to **Dubai Eats AI Concierge** ✨\n\nWhat are you craving today?"
        : "Welcome to **Dubai Eats AI** 🍽️\n\nTell me what you're craving — cuisine, district, budget, or occasion!",
    }]);
    setGeminiHistory([]);
    setInputVal("");
  };

  // Panel dimensions
  const panelWidth = expanded ? "min(600px, calc(100vw - 32px))" : "min(440px, calc(100vw - 32px))";
  const messagesMaxHeight = expanded ? "480px" : "390px";

  return (
    <>
      {/* ── 1. LUXURY AI FLOATING BUTTON (LEFT SIDE) ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Ask Dubai Eats AI"
        className={`fixed bottom-6 left-6 z-50 group flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer border border-[#D4AF37]/50 hover:border-[#D4AF37] ${
          open 
            ? "bg-[#1A1A1A] text-white scale-95 shadow-inner" 
            : "bg-[#1A1A1A]/95 text-white hover:scale-105 hover:bg-[#1A1A1A]"
        }`}
        style={{
          boxShadow: open 
            ? "0 4px 20px rgba(0,0,0,0.6)" 
            : "0 8px 30px rgba(212, 175, 55, 0.32), 0 0 0 1px rgba(212, 175, 55, 0.4)",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9C7D1A] via-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-md relative shrink-0">
          <Sparkles className="w-4 h-4 text-[#1A1A1A] animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1A1A1A]" />
        </div>

        <div className="flex flex-col text-left pr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] font-heading leading-none flex items-center gap-1">
            AI Food Finder
          </span>
          <span className="text-xs font-semibold text-white font-sans leading-tight mt-0.5">
            Ask Dubai Eats ✨
          </span>
        </div>

        {open ? (
          <X className="w-4 h-4 text-white/70 hover:text-white ml-1 shrink-0" />
        ) : (
          <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded-full font-heading border border-[#D4AF37]/30 shrink-0">
            AI
          </span>
        )}
      </button>

      {/* Subtle pulse ring behind left button */}
      {!open && (
        <span
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full animate-ping opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212, 175, 55, 0.8), rgba(212, 175, 55, 0.2))" }}
        />
      )}

      {/* ── 2. CHAT PANEL (ANCHORED BOTTOM-LEFT) ── */}
      <div
        className={`fixed bottom-24 left-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-left text-left ${
          open ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none translate-y-4"
        }`}
        style={{
          width: panelWidth,
          background: "linear-gradient(160deg, #1C1917 0%, #121212 100%)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 35px rgba(212, 175, 55, 0.15)"
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10"
          style={{ background: "linear-gradient(90deg, #1A1A1A 0%, #2A2416 50%, #1A1A1A 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9C7D1A] via-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-xl shadow-md text-[#1A1A1A]">
              ✨
            </div>
            <div>
              <p className="font-extrabold text-white text-base leading-none font-heading flex items-center gap-1.5">
                <span>Dubai Eats AI</span>
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded-full font-bold">
                  2026 Concierge
                </span>
              </p>
              <p className="text-[11px] text-white/60 mt-1 flex items-center gap-1 font-sans">
                {hasGemini ? (
                  <><Sparkles className="w-3 h-3 text-[#D4AF37]" /> Powered by Google Gemini</>
                ) : (
                  <><Bot className="w-3 h-3 text-[#D4AF37]" /> Instant Table & Food Matcher ({enrichedRestaurants.length} Venues)</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setExpanded(e => !e)}
              title={expanded ? "Compact view" : "Expand view"}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={resetChat}
              title="Reset conversation"
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide font-sans"
          style={{ minHeight: 0, maxHeight: messagesMaxHeight }}
        >
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" ? (
                <div className="max-w-[92%] space-y-3 text-left">
                  <div className="bg-white/7 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-inner">
                    {msg.loading ? (
                      <TypingDots />
                    ) : (
                      <BotText text={msg.text} />
                    )}
                  </div>
                  {msg.restaurants && msg.restaurants.length > 0 && (
                    <div className="space-y-2">
                      {msg.restaurants.map(r => (
                        <ChatRestaurantCard key={r.slug} r={r} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm text-[#1A1A1A] font-semibold leading-relaxed shadow-md text-left"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5ECD4 100%)" }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {[
              "Find sushi in Dubai Marina 🍣",
              "Michelin restaurants in DIFC 🏆",
              "Romantic dinner with Burj Khalifa view 🏙️",
              "Fazaa 20% discount dining 💳"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 text-white/75 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all cursor-pointer font-heading"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/5">
          <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all focus-within:border-[#D4AF37]"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}
          >
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you craving? E.g. Wagyu in DIFC 🍽️"
              disabled={isLoading}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 outline-none disabled:opacity-50 font-sans"
            />
            <button
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim() || isLoading}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 shrink-0 cursor-pointer shadow-md bg-[#D4AF37] hover:bg-[#C29D2C] text-[#1A1A1A]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-2 font-sans">
            Try: "Japanese food near Marina under AED 200 with alcohol"
          </p>
        </div>
      </div>
    </>
  );
}
