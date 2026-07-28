/**
 * restaurant-ai.ts
 * ─────────────────────────────────────────────────────
 * AI brain for the Dubai Eats chatbot.
 * Works in two modes:
 *   1. Rule-based (no API key): fast, reliable, offline
 *   2. Gemini-powered (VITE_GEMINI_API_KEY set): fully conversational
 */

import { enrichedRestaurants } from "./restaurants-enriched";
import { DUBAI_DISTRICTS } from "./dubai-districts";

export type EnrichedRestaurant = (typeof enrichedRestaurants)[number];

// ── Intent types ──────────────────────────────────────────────────────────────
export type ChatIntent = {
  cuisines: string[];
  districts: string[];
  maxPrice: number | null;
  minRating: number | null;
  vibes: string[];   // "burj view", "licensed", "michelin", "beachfront", "shisha", "brunch"
  openNow: boolean;
  deliveryOnly: boolean;
  query: string;
};

// ── Keyword maps ──────────────────────────────────────────────────────────────
const CUISINE_KEYWORDS: Record<string, string[]> = {
  japanese: ["japanese", "sushi", "ramen", "izakaya", "tempura", "sashimi", "wagyu", "maki", "omakase"],
  italian: ["italian", "pizza", "pasta", "risotto", "tiramisu", "carbonara", "lasagna", "trattoria"],
  indian: ["indian", "curry", "biryani", "tandoori", "masala", "naan", "dal", "mughal", "ravi"],
  chinese: ["chinese", "dim sum", "dumplings", "peking", "szechuan", "wok", "noodles", "fried rice"],
  arabic: ["arabic", "lebanese", "persian", "turkish", "mezza", "hummus", "shawarma", "mansaf", "ouzi"],
  french: ["french", "bistro", "croissant", "brasserie", "foie gras", "escargot"],
  mediterranean: ["mediterranean", "greek", "mezze", "falafel", "halloumi", "seafood"],
  american: ["american", "burger", "bbq", "steak", "grill", "smash burger", "fried chicken"],
  thai: ["thai", "pad thai", "green curry", "tom yum", "massaman"],
  seafood: ["seafood", "fish", "lobster", "shrimp", "oyster", "crab", "branzino"],
  steakhouse: ["steak", "ribeye", "tenderloin", "wagyu", "angus", "prime cut"],
  brunch: ["brunch", "breakfast", "eggs", "pancakes", "avocado toast"],
};

const VIBE_KEYWORDS: Record<string, string[]> = {
  "Burj View": ["burj", "burj view", "khalifa", "tower view", "city view"],
  "Licensed": ["licensed", "alcohol", "drinks", "cocktails", "wine", "beer", "bar"],
  "Michelin": ["michelin", "starred", "guide", "award"],
  "Beachfront": ["beach", "sea view", "waterfront", "ocean"],
  "Shisha Available": ["shisha", "hookah", "hubbly"],
  "Sunday Brunch": ["brunch", "sunday brunch", "friday brunch"],
  "Date Night": ["date", "romantic", "intimate", "anniversary"],
  "Kid Friendly": ["kids", "children", "family", "family friendly"],
  "Business Lunch": ["business", "corporate", "meeting", "lunch"],
  "Yacht Party": ["yacht", "boat", "cruise"],
};

// ── Parse natural language → Intent ───────────────────────────────────────────
export function parseIntent(query: string): ChatIntent {
  const q = query.toLowerCase();
  
  // Cuisines
  const cuisines: string[] = [];
  for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) cuisines.push(cuisine);
  }

  // Districts — match against all known district names + aliases
  const districts: string[] = [];
  for (const d of DUBAI_DISTRICTS) {
    const allNames = [d.name.toLowerCase(), ...(d.aliases || [])];
    if (allNames.some(alias => q.includes(alias.toLowerCase()))) {
      if (!districts.includes(d.name)) districts.push(d.name);
    }
  }

  // Budget — "under 200", "below 300", "budget", "cheap"
  let maxPrice: number | null = null;
  const priceMatch = q.match(/(?:under|below|less than|max|budget|aed)\s*(\d+)/);
  if (priceMatch) maxPrice = parseInt(priceMatch[1], 10);
  if (q.includes("cheap") || q.includes("budget") || q.includes("affordable")) maxPrice = 100;

  // Rating
  let minRating: number | null = null;
  const ratingMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:star|rating|rated)/);
  if (ratingMatch) minRating = parseFloat(ratingMatch[1]);
  if (q.includes("best") || q.includes("top rated") || q.includes("highly rated")) minRating = 4.5;

  // Vibes
  const vibes: string[] = [];
  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) vibes.push(vibe);
  }

  // Modifiers
  const openNow = q.includes("open now") || q.includes("open tonight") || q.includes("right now");
  const deliveryOnly =
    q.includes("delivery") || q.includes("order") || q.includes("deliver");

  return { cuisines, districts, maxPrice, minRating, vibes, openNow, deliveryOnly, query };
}

// ── Score & match restaurants ─────────────────────────────────────────────────
export function matchRestaurants(intent: ChatIntent, limit = 5): EnrichedRestaurant[] {
  type Scored = { r: EnrichedRestaurant; score: number };

  const scored: Scored[] = enrichedRestaurants.map(r => {
    let score = 0;
    const nameLower = r.name.toLowerCase();
    const cuisineLower = r.cuisine.toLowerCase();

    // Cuisine match (heavy weight)
    if (intent.cuisines.length > 0) {
      for (const c of intent.cuisines) {
        const keywords = CUISINE_KEYWORDS[c] || [];
        if (keywords.some(kw => cuisineLower.includes(kw) || nameLower.includes(kw))) {
          score += 40;
        }
      }
    }

    // District match (heavy weight)
    if (intent.districts.length > 0) {
      if (intent.districts.some(d => r.district === d)) score += 35;
    }

    // Budget
    if (intent.maxPrice !== null) {
      if (r.priceMin <= intent.maxPrice) score += 20;
      else score -= 30; // penalize over budget
    }

    // Rating
    if (intent.minRating !== null) {
      if (r.rating >= intent.minRating) score += 15;
      else score -= 20;
    }

    // Vibes
    for (const vibe of intent.vibes) {
      if (vibe === "Licensed" && r.liquor === "Licensed") score += 15;
      else if (vibe === "Michelin" && r.michelin) score += 25;
      else if (r.seatingPerks?.includes(vibe)) score += 20;
      else if (r.occasions?.includes(vibe)) score += 15;
      else if (r.logistics?.includes(vibe)) score += 15;
    }

    // Base quality score
    score += r.rating * 3;

    return { r, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.r);
}

// ── Build natural reply message ───────────────────────────────────────────────
export function buildReply(matches: EnrichedRestaurant[], intent: ChatIntent): string {
  if (matches.length === 0) {
    return "I couldn't find an exact match — try relaxing the filters a bit. For example, remove the district or budget constraint. Dubai has so much to offer! 🍽️";
  }

  const parts: string[] = [];

  if (intent.cuisines.length > 0 && intent.districts.length > 0) {
    parts.push(`Here are the best **${intent.cuisines.join(" & ")}** spots in **${intent.districts.join(", ")}**:`);
  } else if (intent.cuisines.length > 0) {
    parts.push(`Great taste! Here are top **${intent.cuisines.join(" & ")}** restaurants in Dubai:`);
  } else if (intent.districts.length > 0) {
    parts.push(`Here are the top dining options in **${intent.districts.join(", ")}**:`);
  } else if (intent.deliveryOnly) {
    parts.push("Here are restaurants you can order from — click any delivery platform button on the card:");
  } else {
    parts.push("Based on what you're looking for, I'd recommend these:");
  }

  if (intent.maxPrice !== null) {
    parts.push(`*(All options below AED ${intent.maxPrice} per person)*`);
  }

  return parts.join(" ");
}

// ── Gemini API call ───────────────────────────────────────────────────────────
const GEMINI_KEY = typeof import.meta !== "undefined"
  ? (import.meta as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY
  : undefined;

export const hasGemini = Boolean(GEMINI_KEY);

export type ChatMessage = { role: "user" | "model"; text: string };

export async function callGemini(
  messages: ChatMessage[],
  onPartial?: (text: string) => void
): Promise<{ reply: string; matchedIds: string[] }> {
  if (!GEMINI_KEY) throw new Error("No Gemini API key configured");

  const restaurantIndex = enrichedRestaurants.map(r => ({
    id: r.slug,
    name: r.name,
    cuisine: r.cuisine,
    district: r.district,
    area: r.area,
    priceMin: r.priceMin,
    priceMax: r.priceMax,
    rating: r.rating,
    liquor: r.liquor,
    michelin: r.michelin,
    seatingPerks: r.seatingPerks,
    occasions: r.occasions,
    logistics: r.logistics,
    features: r.features,
  }));

  const systemPrompt = `You are DubaiEats AI, a friendly and knowledgeable Dubai food guide assistant. You help users find the perfect restaurant in Dubai.

You have access to this restaurant database (JSON):
${JSON.stringify(restaurantIndex, null, 2)}

When a user asks for restaurant recommendations:
1. Identify their cuisine preference, location in Dubai, budget (AED per person), and any special requirements (licensed, views, Michelin, etc.)
2. Search the database and pick the BEST 1-5 matching restaurants
3. Return a JSON block like this (always use this exact format):
<results>{"reply": "Your friendly message here", "ids": ["slug-1", "slug-2"]}</results>
4. Then optionally add a conversational follow-up.

If they ask a general question about Dubai food, answer helpfully. Keep replies concise and enthusiastic. Use emojis sparingly but effectively.`;

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm ready to help find the perfect Dubai dining experience. What are you in the mood for? 🍽️" }] },
    ...messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
  ];

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini error: ${err}`);
  }

  const data = await resp.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Extract structured results
  const match = text.match(/<results>([\s\S]*?)<\/results>/);
  let reply = text.replace(/<results>[\s\S]*?<\/results>/g, "").trim();
  let matchedIds: string[] = [];

  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.reply) reply = parsed.reply + (reply ? "\n\n" + reply : "");
      if (parsed.ids) matchedIds = parsed.ids;
    } catch (_) { /* ignore parse error */ }
  }

  if (onPartial) onPartial(reply);
  return { reply, matchedIds };
}

// ── Suggested starter prompts ─────────────────────────────────────────────────
export const SUGGESTED_PROMPTS = [
  "Find me sushi in Dubai Marina 🍣",
  "Best restaurants with a Burj Khalifa view 🏙️",
  "Lebanese food under AED 100 in Deira 🥙",
  "Romantic dinner spots with alcohol 🍷",
  "Top Michelin restaurants in Dubai ⭐",
  "Where can I order Italian food for delivery? 🛵",
  "Family-friendly brunch in JBR this weekend 👨‍👩‍👧",
  "Cheap eats in Karama 💰",
];
