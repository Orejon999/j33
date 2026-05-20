'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface CarouselImage {
  id: string;
  url: string;
  label?: string | null;
}

interface CarouselProps {
  images: CarouselImage[];
  aspectRatio?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  aspectRatio = 'aspect-[4/3] md:aspect-[16/9]',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full ${aspectRatio} bg-brand-coal flex items-center justify-center rounded border border-brand-ash/55`}>
        <span className="text-gray-500 font-medium">Sin imágenes disponibles</span>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const activeImage = images[activeIndex];

  return (
    <div className="relative w-full overflow-hidden rounded group border border-brand-ash/60 bg-black/40">
      {/* Active slide */}
      <div className={`relative w-full ${aspectRatio}`}>
        <Image
          src={activeImage.url}
          alt={activeImage.label || `Imagen de producto ${activeIndex + 1}`}
          fill
          className="object-contain"
          referrerPolicy="no-referrer"
          priority
        />

        {/* Backdrop overlay for text label */}
        {activeImage.label && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-4 pt-10">
            <p className="text-sm font-medium text-white max-w-full truncate flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-fire shrink-0" />
              {activeImage.label}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-dark/85 hover:bg-brand-fire border border-brand-ash flex items-center justify-center text-white transition-all scale-90 group-hover:scale-100 cursor-pointer"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-dark/85 hover:bg-brand-fire border border-brand-ash flex items-center justify-center text-white transition-all scale-90 group-hover:scale-100 cursor-pointer"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-dark/65 px-3 py-1.5 rounded-full border border-brand-ash/40 backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === activeIndex ? 'bg-brand-fire w-4' : 'bg-gray-500'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
