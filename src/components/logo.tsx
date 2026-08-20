import React from "react";

export function GovernmentDubaiLogo({ className = "h-8 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Arabic + English Government Text */}
      <div className="flex flex-col items-start leading-none text-left">
        <span className="font-bold text-[13px] sm:text-[14px] text-[#1e293b] tracking-tight font-sans">
          حـكـومــة دبـــي
        </span>
        <span className="font-extrabold text-[8px] sm:text-[8.5px] text-[#475569] tracking-[0.15em] uppercase font-sans mt-0.5">
          GOVERNMENT OF DUBAI
        </span>
      </div>

      {/* Official Dubai Falcon & Dhow Crest Emblem */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 drop-shadow-xs"
      >
        {/* Falcon Wings and Head Outline */}
        <path
          d="M60 12C63 12 65 14 67 17L72 25C76 23 80 22 84 22C90 22 96 25 100 29C104 33 107 38 108 44C108 52 104 60 97 67C92 72 85 76 77 78L78 84C82 86 86 89 89 93L87 96C83 93 79 91 75 90L73 98C71 99 69 99 67 99C65 99 63 99 61 98L60 92L59 98C57 99 55 99 53 99C51 99 49 99 47 98L45 90C41 91 37 93 33 96L31 93C34 89 38 86 42 84L43 78C35 76 28 72 23 67C16 60 12 52 12 44C13 38 16 33 20 29C24 25 30 22 36 22C40 22 44 23 48 25L53 17C55 14 57 12 60 12Z"
          fill="#b8860b"
          opacity="0.9"
        />
        <path
          d="M60 15C62 15 63.5 16.5 65 19L69.5 26.5C74 24.5 78.5 23.5 83 23.5C88.5 23.5 94 26.5 97.5 30C101 33.5 103.5 38 104.5 43C104.5 50 101 57 95 63.5C90.5 68 84 71.5 76.5 73.5L77.5 80C81 82 84.5 85 87 88.5L85.5 90.5C82 88 78.5 86.5 75 85.5L73.5 92C72 92.5 70.5 92.5 69 92.5C67.5 92.5 66 92.5 64.5 92L63.5 86.5L60 86.5L56.5 86.5L55.5 92C54 92.5 52.5 92.5 51 92.5C49.5 92.5 48 92.5 46.5 92L45 85.5C41.5 86.5 38 88 34.5 90.5L33 88.5C35.5 85 39 82 42.5 80L43.5 73.5C36 71.5 29.5 68 25 63.5C19 57 15.5 50 15.5 43C16.5 38 19 33.5 22.5 30C26 26.5 31.5 23.5 37 23.5C41.5 23.5 46 24.5 50.5 26.5L55 19C56.5 16.5 58 15 60 15Z"
          fill="#d4af37"
        />

        {/* Crossed UAE Flags Red Accents */}
        <path d="M48 38L30 26V36L48 48V38Z" fill="#d92d20" />
        <path d="M72 38L90 26V36L72 48V38Z" fill="#d92d20" />
        <path d="M48 42L30 36V44L48 50V42Z" fill="#16a34a" />
        <path d="M72 42L90 36V44L72 50V42Z" fill="#16a34a" />
        <path d="M48 46L30 44V50L48 52V46Z" fill="#0f172a" />
        <path d="M72 46L90 44V50L72 52V46Z" fill="#0f172a" />

        {/* Center Shield with Traditional Arabian Dhow & Palm */}
        <circle cx="60" cy="56" r="22" fill="#0284c7" stroke="#b8860b" strokeWidth="2.5" />
        <path d="M38 66C44 74 76 74 82 66C76 77 44 77 38 66Z" fill="#b91c1c" />
        
        {/* White Dhow Sail */}
        <path d="M60 40C60 40 50 48 48 58H72C70 48 60 40 60 40Z" fill="#ffffff" />
        <path d="M60 40V61H61.5V40H60Z" fill="#b8860b" />
        <path d="M45 58C45 58 52 64 68 64C72 64 75 58 75 58H45Z" fill="#78350f" />
        
        {/* Palm Tree Detail */}
        <path d="M59 47C57 44 54 44 54 44C56 46 58 48 59 49V53H61V49C62 48 64 46 66 44C66 44 63 44 61 47V45C63 43 66 42 66 42C64 43 62 45 61 46V47H59Z" fill="#15803d" />
      </svg>
    </div>
  );
}

export function VisitDubaiLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      {/* Iconic DUBAI colorful lettermark */}
      <div className="flex items-center tracking-tight font-black text-xl sm:text-2xl leading-none font-sans">
        <span className="text-[#d92d20] font-black">D</span>
        <span className="text-[#16a34a] font-black">u</span>
        <span className="text-[#0f172a] dark:text-white font-black">b</span>
        <span className="text-[#d92d20] font-black">a</span>
        <span className="text-[#16a34a] font-black">i</span>
      </div>
    </div>
  );
}

export function Logo({ className = "h-8 w-auto", showText = true }: { className?: string; showText?: boolean }) {
  return <GovernmentDubaiLogo className={className} />;
}
