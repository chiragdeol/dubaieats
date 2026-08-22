import { sponsoredRestaurants } from "../data/restaurants";
import { type EnrichedRestaurant } from "@/lib/restaurants-enriched";
import { VenuePhoto, LiveRatingText } from "@/components/venue-photo";
import { X, MapPin, Phone, Globe, Star, MoreVertical, ExternalLink, Navigation } from "lucide-react";

interface Props {
  targetRestaurant: EnrichedRestaurant | null;
  onClose: () => void;
}

export function SponsoredDirectionsModal({ targetRestaurant, onClose }: Props) {
  if (!targetRestaurant) return null;

  const targetMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    targetRestaurant.name + " " + targetRestaurant.address
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Directions & Nearby Sponsored</span>
            <h3 className="font-display font-bold text-lg leading-tight text-foreground line-clamp-1">
              {targetRestaurant.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Main Target Restaurant Directions Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex gap-3 items-center">
              <VenuePhoto
                venue={targetRestaurant}
                alt={targetRestaurant.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-base text-foreground leading-snug truncate">
                  {targetRestaurant.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{targetRestaurant.address}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <LiveRatingText venue={targetRestaurant} />
                  <span className="text-muted-foreground font-normal">({targetRestaurant.reviews})</span>
                  <span className="text-muted-foreground font-normal">· {targetRestaurant.cuisine}</span>
                </div>
              </div>
            </div>

            <a
              href={targetMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
            >
              <Navigation className="w-4 h-4 fill-current" />
              Get Directions to {targetRestaurant.name}
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
            <span className="uppercase tracking-wider text-[11px] text-muted-foreground">Sponsored Suggestions</span>
            <span className="text-muted-foreground text-[11px]">Ads</span>
          </div>

          {/* Sponsored Listings */}
          {sponsoredRestaurants.map((sponsored) => (
            <div
              key={sponsored.name}
              className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-3 relative"
            >
              {/* Sponsored Header Tag */}
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span className="text-foreground font-bold tracking-tight">Sponsored</span>
                <MoreVertical className="w-4 h-4 cursor-pointer hover:text-foreground" />
              </div>

              {/* Title & Info */}
              <div>
                <h4 className="font-bold text-base text-foreground leading-snug">
                  {sponsored.name}
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    {sponsored.rating} <Star className="w-3.5 h-3.5 fill-current inline" />
                  </span>
                  <span>({sponsored.reviewsCount})</span>
                  <span>·</span>
                  <span>{sponsored.category}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="text-red-500 font-medium">{sponsored.statusText}</span>
                  <span>·</span>
                  <span>{sponsored.distance}</span>
                </div>
                {sponsored.floor && (
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">{sponsored.floor}</div>
                )}
              </div>

              {/* Photo Strip */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {sponsored.images.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${sponsored.name} photo ${i + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-border/40"
                  />
                ))}
              </div>

              {/* Tagline / Callout Box */}
              {sponsored.tagline && (
                <div className="bg-muted/40 border border-border/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{sponsored.name}</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2">{sponsored.tagline}</p>
                  </div>
                  <a
                    href={sponsored.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold hover:opacity-90 text-xs transition-opacity"
                  >
                    Visit Site
                  </a>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    sponsored.name + " " + sponsored.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-full border border-sky-400/50 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Directions
                </a>
                <a
                  href={`tel:${sponsored.phone.replace(/\s+/g, "")}`}
                  className="flex-1 py-2 px-3 rounded-full border border-sky-400/50 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={sponsored.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-full border border-sky-400/50 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-sky-100 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-md p-4 border-t border-border mt-auto">
          <a
            href={targetMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <ExternalLink className="w-4 h-4" /> Open Directions on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

