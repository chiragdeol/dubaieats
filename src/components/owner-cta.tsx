import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export function OwnerCta() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-800 shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        
        <div className="text-left relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> For Restaurant Owners
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Are you a restaurant owner?
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Join Dubai-Eat to promote your dining venue, list your delivery menus (Deliveroo, Talabat, Noon Food), and direct food enthusiasts straight to your SevenRooms or OpenTable reservation systems.
          </p>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto">
          <Link
            to="/join"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-6 py-4 rounded-xl transition-colors shadow-lg w-full md:w-auto text-center cursor-pointer"
          >
            <span>Register My Restaurant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
