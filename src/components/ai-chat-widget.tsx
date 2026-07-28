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
import { Star, Send, X, ChevronDown, MapPin, ExternalLink, Bot, Sparkles, RefreshCw } from "lucide-react";

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
      className="flex gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
    >
      <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-white/10">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-xs text-white leading-tight truncate group-hover:text-amber-300 transition-colors">
          {r.name}
        </p>
        <p className="text-[10px] text-white/60 mt-0.5 truncate">{r.cuisine} · {r.district}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {r.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-white/50">AED {r.priceMin}–{r.priceMax}</span>
          {r.michelin && (
            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded-full font-bold">
              Michelin
            </span>
          )}
        </div>
      </div>
      <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
    </Link>
  );
}

/* ────────────────────────────────────────────────
   Typing indicator
──────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-amber-400/70 animate-bounce"
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
    <p className="text-xs text-white/90 leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="text-white font-bold">
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
   Main Widget
──────────────────────────────────────────────── */
export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: hasGemini
        ? "Hi! I'm your **Dubai Eats AI** — powered by Gemini. Tell me what you're craving, where you are, or how much you'd like to spend, and I'll find the perfect spot. 🍽️"
        : "Hi! I'm your **Dubai Eats** food finder. Tell me what you're craving — cuisine, neighbourhood, budget, or vibe — and I'll find the perfect spot. 🍽️",
    },
  ]);
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const addMessage = (msg: Omit<BotMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  };

  const updateMessage = useCallback((id: string, patch: Partial<BotMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInputVal("");
    setIsLoading(true);

    // Add user message
    addMessage({ role: "user", text });

    // Add loading placeholder
    const botId = addMessage({ role: "bot", text: "", loading: true });

    try {
      if (hasGemini) {
        // ── Gemini mode ──
        const newHistory: ChatMessage[] = [...geminiHistory, { role: "user", text }];
        const { reply, matchedIds } = await callGemini(newHistory);

        // Resolve matched restaurant objects
        const { enrichedRestaurants } = await import("@/lib/restaurants-enriched");
        const restaurants = matchedIds.length > 0
          ? matchedIds.map(id => enrichedRestaurants.find(r => r.slug === id)).filter(Boolean) as EnrichedRestaurant[]
          : undefined;

        updateMessage(botId, { text: reply, loading: false, restaurants });
        setGeminiHistory([...newHistory, { role: "model", text: reply }]);
      } else {
        // ── Rule-based mode ──
        const intent = parseIntent(text);
        const matched = matchRestaurants(intent);
        const reply = buildReply(matched, intent);
        await new Promise(r => setTimeout(r, 600)); // brief UX delay
        updateMessage(botId, {
          text: reply,
          loading: false,
          restaurants: matched.length > 0 ? matched : undefined,
        });
      }
    } catch (err) {
      console.error(err);
      updateMessage(botId, {
        text: "Sorry, something went wrong. Please try again!",
        loading: false,
      });
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
        ? "Hi! I'm your **Dubai Eats AI** — powered by Gemini. Tell me what you're craving! 🍽️"
        : "Hi! I'm your **Dubai Eats** food finder. Tell me what you're craving! 🍽️",
    }]);
    setGeminiHistory([]);
    setInputVal("");
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open food finder"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-zinc-800 text-white scale-95 rotate-0"
            : "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white scale-100 hover:scale-110"
        }`}
        style={{ boxShadow: open ? undefined : "0 0 0 4px rgba(251,191,36,0.25), 0 8px 32px rgba(249,115,22,0.5)" }}
      >
        {open ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <span className="text-2xl" style={{ lineHeight: 1 }}>🍽️</span>
        )}
      </button>

      {/* Pulse ring on button (only when closed) */}
      {!open && (
        <span
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full animate-ping opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.6), rgba(249,115,22,0.3))" }}
        />
      )}

      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxHeight: "520px",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: "linear-gradient(90deg, #b45309 0%, #ea580c 50%, #be185d 100%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
              🍽️
            </div>
            <div>
              <p className="font-extrabold text-white text-sm leading-none">Dubai Eats AI</p>
              <p className="text-[10px] text-white/70 mt-0.5 flex items-center gap-1">
                {hasGemini ? (
                  <><Sparkles className="w-2.5 h-2.5" /> Powered by Gemini</>
                ) : (
                  <><Bot className="w-2.5 h-2.5" /> Smart Food Finder</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetChat}
              title="New conversation"
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide" style={{ minHeight: 0, maxHeight: 340 }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" ? (
                <div className="max-w-[90%] space-y-2">
                  <div className="bg-white/8 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    {msg.loading ? (
                      <TypingDots />
                    ) : (
                      <BotText text={msg.text} />
                    )}
                  </div>
                  {/* Inline restaurant cards */}
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
                  className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-xs text-white font-medium"
                  style={{ background: "linear-gradient(135deg, #b45309, #ea580c)" }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts (shown when only welcome message exists) */}
        {messages.length === 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.slice(0, 4).map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-1 shrink-0">
          <div
            className="flex items-center gap-2 rounded-2xl border px-3 py-2"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you craving? 🍴"
              disabled={isLoading}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/35 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim() || isLoading}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #b45309, #ea580c)",
              }}
            >
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
