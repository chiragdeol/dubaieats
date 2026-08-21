import React from "react";
import type { MichelinTier } from "@/data/restaurants";

export function MichelinBadge({
  tier,
  size = "md",
  className = ""
}: {
  tier: MichelinTier;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  switch (tier) {
    case "3 Stars":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-heading font-extrabold uppercase tracking-wider text-white bg-[#D9381E] border border-red-700/40 rounded-md shadow-xs ${
            isSmall ? "text-[9px] px-2 py-0.5" : isLarge ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
          } ${className}`}
          title="3 MICHELIN Stars — Exceptional cuisine, worth a special journey"
        >
          <span className="text-amber-200 tracking-tighter">⭐⭐⭐</span>
          <span>3 MICHELIN Stars</span>
        </span>
      );
    case "2 Stars":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-heading font-extrabold uppercase tracking-wider text-white bg-[#D9381E] border border-red-700/40 rounded-md shadow-xs ${
            isSmall ? "text-[9px] px-2 py-0.5" : isLarge ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
          } ${className}`}
          title="2 MICHELIN Stars — Excellent cooking, worth a detour"
        >
          <span className="text-amber-200 tracking-tighter">⭐⭐</span>
          <span>2 MICHELIN Stars</span>
        </span>
      );
    case "1 Star":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-heading font-extrabold uppercase tracking-wider text-white bg-[#D9381E] border border-red-700/40 rounded-md shadow-xs ${
            isSmall ? "text-[9px] px-2 py-0.5" : isLarge ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
          } ${className}`}
          title="1 MICHELIN Star — High quality cooking, worth a stop"
        >
          <span className="text-amber-200">⭐</span>
          <span>1 MICHELIN Star</span>
        </span>
      );
    case "Bib Gourmand":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-heading font-extrabold uppercase tracking-wider text-white bg-[#D9381E] border border-red-700/40 rounded-md shadow-xs ${
            isSmall ? "text-[9px] px-2 py-0.5" : isLarge ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
          } ${className}`}
          title="Bib Gourmand — Good quality, good value cooking"
        >
          <span className="text-xs">😋</span>
          <span>Bib Gourmand</span>
        </span>
      );
    case "Michelin Selected":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-heading font-bold uppercase tracking-wider text-white bg-[#111827] border border-[#D9381E]/60 rounded-md shadow-xs ${
            isSmall ? "text-[9px] px-2 py-0.5" : isLarge ? "text-xs px-3 py-1.5" : "text-[10px] px-2.5 py-1"
          } ${className}`}
          title="Michelin Guide Selected — Recommended by the Michelin Guide Inspectors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]" />
          <span>Michelin Selected</span>
        </span>
      );
  }
}
