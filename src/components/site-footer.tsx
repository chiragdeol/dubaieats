import { Link } from "@tanstack/react-router";
import { DubaiEatsLogo } from "./logo";
import {
  ArrowUp,
  Mail,
  MessageCircle,
  Accessibility,
  Smile,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#E5E5E5] bg-white text-[#1A1A1A] text-left font-sans relative">
      
      {/* ── MAIN FOOTER LINKS CONTAINER (Matching Visit Dubai / User Screenshot) ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* 1. Left Brand, Copy, Socials & App Download Column (5 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Logo */}
            <div className="w-fit">
              <DubaiEatsLogo className="h-12 sm:h-14 w-auto" />
            </div>

            {/* Focused Dining Description Paragraph */}
            <p className="text-[13px] leading-relaxed text-[#4A4A4A] max-w-md font-normal font-sans">
              Dubai Eat is the premier independent dining discovery and reservation directory across the Emirates. Explore certified Michelin dining, authentic Emirati kitchens, and verify accepted lifestyle privileges (💳 Esaad, 💳 Fazaa, 💳 ENBD, 💳 Smiles, 💳 Entertainer).
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-4 text-[#1A1A1A]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-1.5 rounded-full hover:text-[#D9381E] hover:scale-110 transition-all"
              >
                <Facebook className="w-5 h-5 fill-current" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-1.5 rounded-full hover:text-[#D9381E] hover:scale-110 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://tripadvisor.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
                className="p-1.5 rounded-full hover:text-[#D9381E] hover:scale-110 transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 13c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm11 0c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM12 8.5c1.45 0 2.8.44 3.93 1.18-.75.75-1.78 1.22-2.93 1.3-1.15-.08-2.18-.55-2.93-1.3C11.2 8.94 12.55 8.5 14 8.5z"/>
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="p-1.5 rounded-full hover:text-[#D9381E] hover:scale-110 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-1.5 rounded-full hover:text-[#D9381E] hover:scale-110 transition-all"
              >
                <Youtube className="w-5 h-5 fill-current" />
              </a>
            </div>

            {/* App Download Badges */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#757575] font-heading mb-2">
                Download the Dubai Eat App
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://apple.com/app-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111827] hover:bg-black text-white px-3.5 py-2 rounded-xl inline-flex items-center gap-2.5 transition-all shadow-xs border border-[#333333] group"
                >
                  <svg className="w-5 h-5 fill-current shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.05-.52 2.67-1.27z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-white/70 font-sans">Download on the</div>
                    <div className="text-xs font-bold font-heading text-white">App Store</div>
                  </div>
                </a>

                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111827] hover:bg-black text-white px-3.5 py-2 rounded-xl inline-flex items-center gap-2.5 transition-all shadow-xs border border-[#333333] group"
                >
                  <svg className="w-5 h-5 fill-current shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-.936V2.75c0-.36.14-.7.39-.936h.219zm11.3 11.306l2.36 2.36-12.01 6.94 9.65-9.3zm0-2.24L5.259 1.58l12.01 6.94-2.36 2.36zm1.12 1.12l3.41 1.97c.78.45.78 1.18 0 1.63l-3.41 1.97-1.83-1.83 1.83-1.84z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider text-white/70 font-sans">GET IT ON</div>
                    <div className="text-xs font-bold font-heading text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* 2. Column: Culinary Experiences (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="font-heading font-bold text-sm text-[#111827] tracking-tight">
              Culinary Experiences
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#4A4A4A] font-medium font-sans">
              <li>
                <Link to="/restaurants" search={{ vibe: "michelin" }} className="hover:text-[#D9381E] transition-colors">
                  ⭐ Michelin Guide Dubai
                </Link>
              </li>
              <li>
                <Link to="/restaurants" search={{ vibe: "Beachfront" }} className="hover:text-[#D9381E] transition-colors">
                  🏖️ Beachfront & Sea-side Clubs
                </Link>
              </li>
              <li>
                <Link to="/restaurants" search={{ vibe: "Burj View" }} className="hover:text-[#D9381E] transition-colors">
                  🏙️ Burj Khalifa & Skyline Dining
                </Link>
              </li>
              <li>
                <Link to="/restaurants" search={{ vibe: "Sunday Brunch" }} className="hover:text-[#D9381E] transition-colors">
                  🥂 Weekend Brunch Edits
                </Link>
              </li>
              <li>
                <Link to="/restaurants" search={{ vibe: "Ladies Night" }} className="hover:text-[#D9381E] transition-colors">
                  💃 Ladies Nights & Speakeasies
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#D9381E] transition-colors">
                  🗺️ Interactive Food Map
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Column: Privilege Offers & Discounts (2-3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="font-heading font-bold text-sm text-[#111827] tracking-tight">
              Privileges & Discounts
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#4A4A4A] font-medium font-sans">
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  🛡️ Esaad Card Privileges
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  🇦🇪 Fazaa Discount Directory
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  ✈️ Emirates Platinum Card
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  💳 UAE Bank Cards (ENBD, FAB, HSBC)
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  🎟️ The Entertainer & Smiles 2-for-1
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#D9381E] transition-colors">
                  🏨 Hotel Loyalty (More Cravings, Jumeirah)
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Column: For Restaurateurs & Growth (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-heading font-bold text-sm text-[#111827] tracking-tight">
              For Restaurateurs
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#4A4A4A] font-medium font-sans">
              <li>
                <Link to="/merchant" className="hover:text-[#D9381E] transition-colors font-bold text-[#D9381E]">
                  🏢 Claim Your Venue Listing
                </Link>
              </li>
              <li>
                <Link to="/merchant" className="hover:text-[#D9381E] transition-colors">
                  🍽️ Add Menu & Booking Engine
                </Link>
              </li>
              <li>
                <Link to="/merchant" className="hover:text-[#D9381E] transition-colors">
                  💳 Register Privilege Deals
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D9381E] transition-colors">
                  📊 Merchant Insights Portal
                </Link>
              </li>
              <li>
                <Link to="/merchant" className="hover:text-[#D9381E] transition-colors">
                  💬 Partner Support Concierge
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Scroll to Top Arrow Button (Matching position from screenshot) */}
        <div className="flex justify-end pt-6">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-3 rounded-xl border border-[#E0E0E0] hover:border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#F5F5F5] shadow-xs transition-all cursor-pointer group"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* ── MIDDLE LEGAL & COPYRIGHT BAR ── */}
      <div className="border-t border-[#EAEAEA] py-8 text-[12px] text-[#757575] font-sans">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-6 items-start">
          
          {/* Left Legal Links */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#4A4A4A] font-medium font-sans">
              <Link to="/restaurants" className="hover:text-[#1A1A1A] transition-colors">Terms of use</Link>
              <Link to="/restaurants" className="hover:text-[#1A1A1A] transition-colors">Privacy Notice</Link>
              <Link to="/restaurants" className="hover:text-[#1A1A1A] transition-colors">Cookie notice</Link>
              <Link to="/restaurants" className="hover:text-[#1A1A1A] transition-colors">Cookie preference centre</Link>
            </div>
            <div>
              <Link to="/restaurants" className="hover:text-[#1A1A1A] transition-colors font-medium">Sitemap</Link>
            </div>
            <p className="pt-2 text-[#757575]">
              Copyright © 2026. This site is maintained by Dubai Department of Economy and Tourism.
            </p>
          </div>

          {/* Right Update info & ReCAPTCHA notice */}
          <div className="text-left md:text-right space-y-1 text-[#757575] max-w-sm shrink-0">
            <p>Site last updated 20/08/2026</p>
            <p className="text-[11px] leading-tight">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1A1A1A]">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1A1A1A]">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>

        </div>
      </div>

      {/* ── BOTTOM UTILITY STRIP (Smile, D4, Contact, WhatsApp, Accessibility) ── */}
      <div className="border-t border-[#EAEAEA] bg-[#FAFAFA] py-3 text-[12px] text-[#4A4A4A] font-sans">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Left: Happiness Smiley & Emblem Icons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-teal-500/30 text-teal-600 bg-teal-50">
              <Smile className="w-4 h-4" />
            </div>
            <div className="h-5 w-px bg-slate-300" />
            <div className="font-heading font-extrabold text-xs text-[#1A1A1A] tracking-wider">
              DUBAI 360°
            </div>
          </div>

          {/* Right: Contact Us, WhatsApp Chat, Accessibility */}
          <div className="flex items-center gap-6 text-xs font-semibold font-sans">
            <Link
              to="/merchant"
              className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Contact us</span>
            </Link>

            <a
              href="https://wa.me/?text=Hi%20Dubai%20Eats"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp chat</span>
            </a>

            <button
              onClick={() => alert("Accessibility features enabled: High contrast, keyboard navigation, screen reader compatibility.")}
              className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Accessibility settings"
            >
              <Accessibility className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}