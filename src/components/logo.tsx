export function Logo({ className = "h-8 w-auto", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Premium SVG Icon Mark */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 shrink-0 drop-shadow-sm"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* Amber 500 */}
            <stop offset="50%" stopColor="#ef4444" /> {/* Red 500 */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet 500 */}
          </linearGradient>
        </defs>

        {/* Location Pin Silhouette / Plate Background */}
        <path
          d="M50 5C27.9 5 10 22.9 10 45C10 70.8 45 92.7 46.5 93.6C47.5 94.2 48.7 94.5 50 94.5C51.3 94.5 52.5 94.2 53.5 93.6C55 92.7 90 70.8 90 45C90 22.9 72.1 5 50 5ZM50 78C32.5 63.8 20 49.8 20 45C20 28.5 33.5 15 50 15C66.5 15 80 28.5 80 45C80 49.8 67.5 63.8 50 78Z"
          fill="url(#logo-gradient)"
        />

        {/* Fork & Knife negative space emblem */}
        {/* Fork */}
        <path
          d="M43 30V44C43 45.7 44.3 47 46 47V60C46 61.1 46.9 62 48 62H52C53.1 62 54 61.1 54 60V47C55.7 47 57 45.7 57 44V30C57 28.9 56.1 28 55 28H53C51.9 28 51 28.9 51 30V40C51 40.6 50.6 41 50 41C49.4 41 49 40.6 49 40V30C49 28.9 48.1 28 47 28H45C43.9 28 43 28.9 43 30Z"
          fill="url(#logo-gradient)"
        />
        
      </svg>

      {/* Stylized Logo Text */}
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight">
          Dubai<span className="text-primary italic ml-0.5">Eats</span>
        </span>
      )}
    </div>
  );
}
