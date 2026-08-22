import { useEffect, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import L from "leaflet";
import { type EnrichedRestaurant } from "@/lib/restaurants-enriched";
import { getAccurateBookHref, getAccurateBookLabel } from "@/lib/venue-actions";
import { getDeliveryPartners } from "@/lib/delivery-apps";
import { fetchGooglePlace, googlePlaceQueryKey, hasGooglePlacesKey, venueGallery } from "@/lib/google-places";

// Fix default leaflet marker icon assets if needed
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function RestaurantMap({
  restaurants,
  activeRestaurant,
  onSelectRestaurant,
  className = "w-full h-full min-h-[450px]",
  center = [25.1972, 55.2744],
  zoom = 12,
}: {
  restaurants: EnrichedRestaurant[];
  activeRestaurant?: EnrichedRestaurant | null;
  onSelectRestaurant?: (r: EnrichedRestaurant) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const placeResults = useQueries({
    queries: restaurants.map((r) => ({
      queryKey: googlePlaceQueryKey(r.name, r.address),
      queryFn: () =>
        fetchGooglePlace({
          name: r.name,
          address: r.address,
          latitude: r.latitude,
          longitude: r.longitude,
        }),
      staleTime: 1000 * 60 * 60,
      enabled: hasGooglePlacesKey(),
    })),
  });
  const placeSignature = placeResults
    .map((result) => `${result.data?.id || ""}:${result.data?.photos?.[0] || ""}:${result.data?.rating || ""}`)
    .join("|");

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // High quality Carto Voyager tile layer for luxury / clean look
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever restaurants or activeRestaurant changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    restaurants.forEach((r, index) => {
      if (!r.coordinates || !r.coordinates.lat || !r.coordinates.lng) return;

      const isSelected = activeRestaurant?.slug === r.slug;
      const place = placeResults[index]?.data;
      const photo = venueGallery(r.image, place)[0] || r.image;
      const rating = place?.rating ?? r.rating;

      // Custom HTML Pin Marker with price & gold accent
      const pinHtml = `
        <div class="restaurant-map-pin ${isSelected ? "is-active" : ""}" style="
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: ${isSelected ? "#D4AF37" : "#1A1A1A"};
          color: ${isSelected ? "#1A1A1A" : "#FFFFFF"};
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid ${isSelected ? "#FFFFFF" : "#D4AF37"};
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%) ${isSelected ? "scale(1.15)" : "scale(1)"};
          transition: transform 0.2s ease, background-color 0.2s ease;
        ">
          <span style="font-size: 10px;">🍽️</span>
          <span>AED ${r.priceMin}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-leaflet-pin",
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const marker = L.marker([r.coordinates.lat, r.coordinates.lng], { icon: customIcon });

      // Rich popup with restaurant card details
      const popupContent = `
        <div style="font-family: 'Hanken Grotesk', sans-serif; max-width: 260px; padding: 2px;">
          <div style="width: 100%; height: 120px; border-radius: 12px; overflow: hidden; position: relative; background: #eee;">
            <img src="${photo}" alt="${r.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.7); color: #fff; font-size: 9px; font-weight: 800; font-family: 'Montserrat', sans-serif; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">
              ${r.cuisine}
            </span>
          </div>
          <div style="padding-top: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px;">
              <h4 style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 14px; color: #1A1A1A; margin: 0; line-height: 1.2;">
                ${r.name}
              </h4>
              <span style="background: #FBF6E9; border: 1px solid #EFE2B9; color: #9C7D1A; font-weight: 900; font-size: 11px; padding: 2px 5px; border-radius: 6px; shrink: 0;">
                ★ ${(rating * 2).toFixed(1)}
              </span>
            </div>
            <p style="font-size: 11px; color: #757575; margin: 4px 0 6px 0;">
              📍 ${r.district || r.area}, Dubai
            </p>
            <div style="font-size: 11px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px;">
              Average price: AED ${r.priceMin}–${r.priceMax}
            </div>
            ${r.discounts && r.discounts.length > 0 ? `
              <div style="background: #FBF6E9; color: #9C7D1A; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-bottom: 8px; display: inline-block;">
                🏷️ ${r.discounts[0]} Privilege
              </div>
            ` : ""}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
              ${getDeliveryPartners(r, "delivery").map((partner) => `
                <a href="${partner.webUrl}" target="_blank" rel="noopener noreferrer" style="text-align: center; background: #fff; color: #111827; text-decoration: none; font-size: 11px; font-weight: 700; font-family: 'Montserrat', sans-serif; padding: 6px 8px; border-radius: 8px; border: 1px solid #E5E7EB;">
                  ${partner.name}
                </a>
              `).join("")}
            </div>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <a href="/restaurants/${r.slug}" style="flex: 1; text-align: center; background: #1A1A1A; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; font-family: 'Montserrat', sans-serif; padding: 6px 8px; border-radius: 8px;">
                View Details
              </a>
              <a href="${getAccurateBookHref(r)}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #D4AF37; color: #1A1A1A; text-decoration: none; font-size: 11px; font-weight: 800; font-family: 'Montserrat', sans-serif; padding: 6px 8px; border-radius: 8px;">
                ${getAccurateBookLabel(r)}
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, className: "luxury-leaflet-popup" });

      marker.on("click", () => {
        if (onSelectRestaurant) {
          onSelectRestaurant(r);
        }
      });

      group.addLayer(marker);
    });
  }, [restaurants, activeRestaurant, onSelectRestaurant, placeSignature]);

  // Pan to active restaurant when selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeRestaurant?.coordinates) return;

    map.flyTo([activeRestaurant.coordinates.lat, activeRestaurant.coordinates.lng], 14, {
      duration: 1.2,
    });
  }, [activeRestaurant]);

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
