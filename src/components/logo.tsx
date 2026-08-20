import React from "react";

export function DubaiEatsLogo({ 
  className = "h-9 sm:h-11 md:h-12 w-auto max-w-[220px] sm:max-w-[260px]", 
  alt = "Dubai Eats — Discover • Indulge • Repeat" 
}: { 
  className?: string; 
  alt?: string;
}) {
  return (
    <img
      src="/dubai-eats-logo.png"
      alt={alt}
      className={`object-contain select-none transition-transform duration-200 ${className}`}
      loading="eager"
    />
  );
}

export function GovernmentDubaiLogo({ className = "h-9 sm:h-11 md:h-12 w-auto max-w-[220px] sm:max-w-[260px]" }: { className?: string }) {
  return <DubaiEatsLogo className={className} />;
}

export function VisitDubaiLogo({ className = "h-9 sm:h-11 md:h-12 w-auto max-w-[220px] sm:max-w-[260px]" }: { className?: string }) {
  return <DubaiEatsLogo className={className} />;
}
