import { useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import {
  getDeliveryPartners,
  venueOffersDropoff,
  venueOffersPickup,
  type OrderMode,
} from "@/lib/delivery-apps";

type OrderVenue = {
  name: string;
  features?: string[];
  deliveryLinks?: { talabat?: string; deliveroo?: string };
};

export function OrderOnlineCard({
  venue,
  live,
}: {
  venue: OrderVenue;
  live?: { delivery?: boolean; takeout?: boolean };
}) {
  const canPickup = venueOffersPickup(venue, live);
  const canDeliver = venueOffersDropoff(venue, live);
  const [mode, setMode] = useState<OrderMode>(canDeliver ? "delivery" : "pickup");
  const partners = getDeliveryPartners(venue, mode);

  return (
    <div data-order-online className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-xs scroll-mt-28">
      <div>
        <h3 className="font-heading font-bold text-base text-[#111827]">Order online</h3>
        <p className="text-xs text-[#6B7280] mt-0.5 font-sans">{venue.name}</p>
      </div>

      {(canPickup || canDeliver) && (
        <div className="flex flex-wrap gap-2">
          {canPickup && (
            <button
              type="button"
              onClick={() => setMode("pickup")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading border transition-colors cursor-pointer ${
                mode === "pickup"
                  ? "bg-[#1A73E8] text-white border-[#1A73E8]"
                  : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F8F9FA]"
              }`}
            >
              {mode === "pickup" ? "× Pickup" : "Pickup"}
            </button>
          )}
          {canDeliver && (
            <button
              type="button"
              onClick={() => setMode("delivery")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading border transition-colors cursor-pointer ${
                mode === "delivery"
                  ? "bg-[#1A73E8] text-white border-[#1A73E8]"
                  : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#F8F9FA]"
              }`}
            >
              {mode === "delivery" ? "× Delivery" : "Delivery"}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] font-heading">
        <span>Place order with:</span>
        <Info className="w-3 h-3 text-[#9CA3AF]" />
      </div>

      <div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 py-3 text-left hover:bg-[#F8F9FA] transition-colors cursor-pointer"
          >
            <span
              className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-black text-lg ${
                partner.id === "talabat" ? "bg-[#FF5A00]" : "bg-[#00CDBC]"
              }`}
            >
              {partner.id === "talabat" ? "t" : "d"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading font-bold text-sm text-[#111827]">{partner.name}</span>
              <span className="block text-[11px] text-[#6B7280] font-sans">{partner.note}</span>
              <span className="block text-[11px] text-[#6B7280] font-sans">{partner.eta}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function ListingDeliveryButtons({
  venue,
  className = "",
}: {
  venue: { name: string; deliveryLinks?: { talabat?: string; deliveroo?: string } };
  className?: string;
}) {
  const partners = getDeliveryPartners(venue, "delivery");
  return (
    <div className={`grid grid-cols-2 gap-1.5 ${className}`}>
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] text-[#111827] font-heading font-semibold text-[11px] py-2 px-2 transition-colors"
        >
          <span
            className={`w-4 h-4 rounded-[4px] shrink-0 flex items-center justify-center text-white font-black text-[10px] leading-none ${
              partner.id === "talabat" ? "bg-[#FF5A00]" : "bg-[#00CDBC]"
            }`}
          >
            {partner.id === "talabat" ? "t" : "d"}
          </span>
          <span>{partner.name}</span>
        </a>
      ))}
    </div>
  );
}
