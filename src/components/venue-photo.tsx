import { type ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";
import { CardImageSlider, ImageSlideshowModal } from "@/components/image-slideshow-modal";
import { useVenueLive, type VenueLiveInput } from "@/hooks/use-google-place";

export function VenuePhoto({
  venue,
  alt,
  className,
}: {
  venue: VenueLiveInput;
  alt?: string;
  className?: string;
}) {
  const { gallery } = useVenueLive(venue);
  const src = gallery[0];
  if (!src) return <div className={className} />;
  return <img src={src} alt={alt || venue.name || "Venue"} className={className} />;
}

export function VenueCardGallery({
  venue,
  onImageClick,
  className,
}: {
  venue: VenueLiveInput;
  onImageClick?: (index: number) => void;
  className?: string;
}) {
  const { gallery } = useVenueLive(venue);
  return (
    <CardImageSlider
      images={gallery}
      title={venue.name || "Venue"}
      onImageClick={onImageClick}
      className={className}
    />
  );
}

export function LiveRatingText({
  venue,
  className,
  scale = 1,
}: {
  venue: VenueLiveInput;
  className?: string;
  scale?: number;
}) {
  const { rating } = useVenueLive(venue);
  if (rating == null) return null;
  return <span className={className}>{(rating * scale).toFixed(1)}</span>;
}

export function LiveHoursText({
  venue,
  className,
}: {
  venue: VenueLiveInput;
  className?: string;
}) {
  const { hours } = useVenueLive(venue);
  if (!hours) return null;
  return <span className={className}>{hours}</span>;
}

export function VenuePhotoLightbox({
  restaurant,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  restaurant: VenueLiveInput | null;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const { gallery } = useVenueLive(restaurant);
  return (
    <ImageSlideshowModal
      isOpen={isOpen && Boolean(restaurant)}
      onClose={onClose}
      images={gallery}
      initialIndex={initialIndex}
      title={restaurant?.name}
    />
  );
}

function GalleryTile({
  src,
  alt,
  onClick,
  className,
  overlay,
}: {
  src?: string;
  alt: string;
  onClick: () => void;
  className?: string;
  overlay?: ReactNode;
}) {
  if (!src) return <div className={`bg-slate-100 ${className || ""}`} />;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-100 text-left group ${className || ""}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      {overlay}
    </button>
  );
}

/** Compact 3-column profile gallery: two tall photos + two stacked thumbs with a count overlay. */
export function ProfilePhotoGallery({
  images,
  title,
  loading,
  onOpen,
}: {
  images: string[];
  title: string;
  loading?: boolean;
  onOpen: (index: number) => void;
}) {
  if (loading && images.length === 0) {
    return <div className="h-[220px] sm:h-[248px] md:h-[268px] rounded-2xl bg-slate-200 animate-pulse" />;
  }
  if (!images.length) return null;

  const count = images.length;
  const overlay = (
    <span className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white gap-1">
      <ImageIcon className="w-5 h-5" />
      <span className="font-heading font-bold text-lg leading-none">{count}</span>
    </span>
  );

  return (
    <div className="h-[220px] sm:h-[248px] md:h-[268px] grid grid-cols-2 md:grid-cols-[1.15fr_1.15fr_0.85fr] grid-rows-2 gap-1.5 sm:gap-2 overflow-hidden rounded-2xl">
      <GalleryTile
        src={images[0]}
        alt={`${title} photo 1`}
        onClick={() => onOpen(0)}
        className="row-span-2 rounded-l-2xl"
      />
      <GalleryTile
        src={images[1] || images[0]}
        alt={`${title} photo 2`}
        onClick={() => onOpen(images[1] ? 1 : 0)}
        className="hidden md:block md:row-span-2"
      />
      <GalleryTile
        src={images[2] || images[1] || images[0]}
        alt={`${title} photo 3`}
        onClick={() => onOpen(images[2] ? 2 : images[1] ? 1 : 0)}
        className="rounded-tr-2xl"
      />
      <GalleryTile
        src={images[3] || images[2] || images[1] || images[0]}
        alt={`${title} more photos`}
        onClick={() => onOpen(images[3] ? 3 : 0)}
        className="rounded-br-2xl"
        overlay={overlay}
      />
    </div>
  );
}
