import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export function ImageSlideshowModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title = "Photo Gallery",
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Container */}
      <div
        className="relative flex flex-col items-center max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between py-3 px-4 text-white mb-2">
          <div className="flex items-center gap-2 font-heading font-bold text-sm sm:text-base">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            <span className="truncate max-w-md">{title}</span>
            <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close photo gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image Display with Controls */}
        <div className="relative w-full h-[55vh] sm:h-[65vh] flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden group">
          <img
            src={images[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none transition-all duration-300"
          />

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D9381E] text-white backdrop-blur-sm transition-all duration-200 shadow-lg cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D9381E] text-white backdrop-blur-sm transition-all duration-200 shadow-lg cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="w-full flex items-center justify-center gap-2 mt-4 overflow-x-auto py-2 px-4 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "border-[#D9381E] scale-105 shadow-md ring-2 ring-[#D9381E]/40"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CardImageSlider({
  images,
  title,
  onImageClick,
  className = "w-full h-48 md:h-[200px]"
}: {
  images: string[];
  title: string;
  onImageClick?: (index: number) => void;
  className?: string;
}) {
  const [slideIndex, setSlideIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleCardImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(slideIndex);
    }
  };

  return (
    <div className={`relative shrink-0 overflow-hidden bg-slate-900 group select-none ${className}`}>
      <img
        src={images[slideIndex] || images[0]}
        alt={`${title} photo`}
        onClick={handleCardImageClick}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Slide Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-[#D9381E] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-[#D9381E] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none">
            {images.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === slideIndex ? "bg-white w-3" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Click to view gallery hint */}
      <button
        onClick={handleCardImageClick}
        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white text-[9px] font-heading font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
      >
        <ImageIcon className="w-2.5 h-2.5 text-[#D4AF37]" /> Slides ({images.length})
      </button>
    </div>
  );
}
