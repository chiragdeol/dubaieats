import { Link } from "@tanstack/react-router";

export function OwnerCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-16 text-left font-sans">
      
      {/* ── SECTION TITLE (Matching Screenshot) ── */}
      <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight mb-8">
        Are you a restaurant owner?
      </h2>

      {/* ── 2-COLUMN LAYOUT: Image on Left, 2 Action Blocks on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Chef Kitchen Photograph */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-sm relative group">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
              alt="Professional chef plating dishes in restaurant kitchen"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: 2 Action Blocks */}
        <div className="lg:col-span-6 space-y-10 lg:pl-4">
          
          {/* Block 1: Register or Claim your Restaurant */}
          <div className="space-y-2.5">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-[#111827]">
              Claim or Register your Restaurant
            </h3>
            <p className="text-sm text-[#4A4A4A] font-normal leading-relaxed font-sans">
              Are you the owner? Claim your venue listing to update your menus, publish accepted privilege cards (Fazaa, Esaad, ENBD), and receive direct bookings.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/merchant"
                className="btn-action-primary text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Claim Venue Profile
              </Link>
              <Link
                to="/merchant"
                className="inline-flex items-center justify-center border border-[#D1D5DB] hover:border-[#111827] bg-white hover:bg-[#F9FAFB] text-[#111827] font-bold font-heading text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Block 2: Already a Client */}
          <div className="space-y-2.5">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-[#111827]">
              Already a Merchant Partner
            </h3>
            <p className="text-sm text-[#4A4A4A] font-normal leading-relaxed font-sans">
              Log in to Dubai Eat Manager to adjust table seatings, verify guest privilege vouchers, and view performance metrics.
            </p>
            <div className="pt-2">
              <Link
                to="/merchant"
                className="inline-flex items-center justify-center border border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] font-bold font-heading text-xs px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Log in to Dubai Eat Manager
              </Link>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
