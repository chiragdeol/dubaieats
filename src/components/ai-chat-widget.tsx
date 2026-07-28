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
import { Star, Send, X, ChevronDown, ExternalLink, Bot, Sparkles, RefreshCw, Maximize2 } from "lucide-react";

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
      className="flex gap-3 p-3 bg-white/5 hover:bg-white/12 border border-white/10 hover:border-amber-400/30 rounded-xl transition-all group"
    >
      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-white/10">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-white leading-tight truncate group-hover:text-amber-300 transition-colors">
          {r.name}
        </p>
        <p className="text-xs text-white/60 mt-0.5 truncate">{r.cuisine} · {r.district}</p>
        <div className="flex items-center gap-2.5 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            {r.rating.toFixed(1)}
          </span>
          <span className="text-xs text-white/50">AED {r.priceMin}–{r.priceMax}</span>
          {r.michelin && (
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded-full font-bold">
              Michelin
            </span>
          )}
          {r.liquor === "Licensed" && (
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded-full font-bold">
              Licensed
            </span>
          )}
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
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
          className="w-2.5 h-2.5 rounded-full bg-amber-400/70 animate-bounce"
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
    <p className="text-sm text-white/90 leading-relaxed">
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
  const [expanded, setExpanded] = useState(false); // full-width expanded mode
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: hasGemini
        ? "Hi! I'm your **Dubai Eats AI** — powered by Gemini ✨\n\nTell me what you're craving, where in Dubai you are, or how much you'd like to spend — I'll find the perfect spot instantly! 🍽️"
        : "Hi! I'm your **Dubai Eats** food finder 🍽️\n\nTell me what you're craving — cuisine, neighbourhood, budget, or vibe — and I'll find the perfect spot right away!",
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
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
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

    addMessage({ role: "user", text });
    const botId = addMessage({ role: "bot", text: "", loading: true });

    try {
      if (hasGemini) {
        const newHistory: ChatMessage[] = [...geminiHistory, { role: "user", text }];
        const { reply, matchedIds } = await callGemini(newHistory);
        const { enrichedRestaurants } = await import("@/lib/restaurants-enriched");
        const restaurants = matchedIds.length > 0
          ? matchedIds.map(id => enrichedRestaurants.find(r => r.slug === id)).filter(Boolean) as EnrichedRestaurant[]
          : undefined;
        updateMessage(botId, { text: reply, loading: false, restaurants });
        setGeminiHistory([...newHistory, { role: "model", text: reply }]);
      } else {
        const intent = parseIntent(text);
        const matched = matchRestaurants(intent);
        const reply = buildReply(matched, intent);
        await new Promise(r => setTimeout(r, 700));
        updateMessage(botId, {
          text: reply,
          loading: false,
          restaurants: matched.length > 0 ? matched : undefined,
        });
      }
    } catch (err) {
      console.error(err);
      updateMessage(botId, { text: "Sorry, something went wrong. Please try again! 🙏", loading: false });
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
        ? "Hi! I'm your **Dubai Eats AI** — powered by Gemini ✨\n\nTell me what you're craving! 🍽️"
        : "Hi! I'm your **Dubai Eats** food finder 🍽️\n\nWhat are you craving?",
    }]);
    setGeminiHistory([]);
    setInputVal("");
  };

  // Panel dimensions
  const panelWidth = expanded ? "min(560px, calc(100vw - 24px))" : "min(440px, calc(100vw - 24px))";
  const messagesMaxHeight = expanded ? "460px" : "380px";

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open food finder"
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-zinc-800 text-white scale-90"
            : "scale-100 hover:scale-110"
        }`}
        style={open ? undefined : {
          background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 55%, #be185d 100%)",
          boxShadow: "0 0 0 5px rgba(251,191,36,0.2), 0 10px 40px rgba(249,115,22,0.55)",
        }}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <span style={{ fontSize: 28, lineHeight: 1 }}>🍽️</span>
        )}
      </button>

      {/* Pulse ring */}
      {!open && (
        <span
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full animate-ping opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.7), rgba(249,115,22,0.4))" }}
        />
      )}

      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-28 right-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          width: panelWidth,
          background: "linear-gradient(160deg, #1c1917 0%, #09090b 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: "linear-gradient(90deg, #92400e 0%, #c2410c 50%, #9d174d 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-xl shadow-inner">
              🍽️
            </div>
            <div>
              <p className="font-extrabold text-white text-base leading-none">Dubai Eats AI</p>
              <p className="text-xs text-white/65 mt-0.5 flex items-center gap-1">
                {hasGemini ? (
                  <><Sparkles className="w-3 h-3" /> Powered by Gemini</>
                ) : (
                  <><Bot className="w-3 h-3" /> Smart Food Finder · {enrichedRestaurants.length} restaurants</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(e => !e)}
              title={expanded ? "Compact mode" : "Expand"}
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={resetChat}
              title="New conversation"
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
          style={{ minHeight: 0, maxHeight: messagesMaxHeight }}
        >
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" ? (
                <div className="max-w-[92%] space-y-3">
                  <div className="bg-white/7 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
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
                  className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white font-medium leading-relaxed"
                  style={{ background: "linear-gradient(135deg, #92400e, #c2410c)" }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, expanded ? 6 : 4).map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 text-white/65 hover:text-white hover:border-amber-500/60 hover:bg-amber-500/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-3"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.13)" }}
          >
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you craving? E.g. sushi in Marina 🍣"
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-35 shrink-0"
              style={{ background: "linear-gradient(135deg, #92400e, #c2410c)" }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-white/25 text-center mt-2">
            Try: "Japanese food near Marina under AED 200 with alcohol"
          </p>
        </div>
      </div>
    </>
  );
}

// Need to import this for the bot label
import { enrichedRestaurants } from "@/lib/restaurants-enriched";
