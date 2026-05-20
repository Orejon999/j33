"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SquareArrowOutUpRight, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing defaults. Sizing will be capped to container width automatically! */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,

  cardWidth: baseCardWidth = 520,
  cardHeight: baseCardHeight = 320,

  overlap = 0.48,
  spreadDeg = 36,

  perspectivePx = 1100,
  depthPx = 120,
  tiltXDeg = 10,

  activeLiftPx = 20,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 3500,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [prevLen, setPrevLen] = React.useState(len);
  const [hovering, setHovering] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(520);

  if (len !== prevLen) {
    setPrevLen(len);
    setActive(wrapIndex(active, len));
  }

  // Dynamically measure container width to remain fully mobile-first responsive
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate scaled dimensions to fit available space perfectly
  const cardWidth = Math.min(baseCardWidth, containerWidth - 24);
  const scaleRatio = cardWidth / baseCardWidth;
  const cardHeight = Math.round(baseCardHeight * scaleRatio);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active, len, items, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  // Overlap spacer calculation
  const cardSpacing = Math.max(8, Math.round(cardWidth * (1 - overlap) * 0.45));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay mechanics
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(1000, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      ref={containerRef}
      className={cn("w-full relative select-none", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      id="j3-card-stack-root"
    >
      {/* Navigation Controls Overlay (Very useful for accessibility and click-friendly users) */}
      {len > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-50 pointer-events-none flex justify-between px-2">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={!canGoPrev}
            className={cn(
              "pointer-events-auto w-10 h-10 rounded-full bg-brand-dark/90 hover:bg-brand-fire hover:text-white border border-brand-ash/60 text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xl",
              !canGoPrev && "opacity-30 cursor-not-allowed hover:bg-brand-dark hover:text-gray-300"
            )}
            aria-label="Anterior"
            id="j3-card-stack-prev-btn"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={!canGoNext}
            className={cn(
              "pointer-events-auto w-10 h-10 rounded-full bg-brand-dark/90 hover:bg-brand-fire hover:text-white border border-brand-ash/60 text-gray-300 flex items-center justify-center transition-all cursor-pointer shadow-xl",
              !canGoNext && "opacity-30 cursor-not-allowed hover:bg-brand-dark hover:text-gray-300"
            )}
            aria-label="Siguiente"
            id="j3-card-stack-next-btn"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stage */}
      <div
        className="relative w-full outline-none"
        style={{ height: Math.max(300, cardHeight + 60) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        id="j3-card-stack-stage"
      >
        {/* Amber flame highlight spotlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-32 w-[65%] rounded-full bg-brand-fire/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center pb-6"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              // beautiful fan arcs
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 8; // gentle arch downward curvature
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(130, cardWidth * 0.22);

                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-xl overflow-hidden shadow-2xl border transition-all duration-300",
                    isActive
                      ? "border-amber-500/80 cursor-grab active:cursor-grabbing shadow-brand-fire/10"
                      : "border-brand-ash/40 cursor-pointer hover:border-gray-500/60",
                    "will-change-transform"
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 30,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: x * 1.5,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                  id={`j3-card-item-${item.id}`}
                >
                  <div
                    className="h-full w-full bg-brand-coal"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation */}
      {showDots && len > 1 && (
        <div className="mt-2 flex items-center justify-center gap-3" id="j3-card-stack-dots">
          <div className="flex items-center gap-2 bg-brand-coal/90 px-3 py-1.5 rounded-full border border-brand-ash/40 backdrop-blur-sm">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all cursor-pointer",
                    on
                      ? "bg-brand-fire w-4"
                      : "bg-gray-500 hover:bg-gray-400 w-2",
                  )}
                  aria-label={`Ir a imagen ${idx + 1}`}
                  id={`j3-card-dot-${idx}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full bg-brand-carbon text-gray-400 hover:text-brand-fire transition-colors border border-brand-ash/45"
              aria-label="Abrir enlace de imagen"
              id="j3-card-stack-link"
            >
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

function DefaultFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full bg-brand-coal flex flex-col justify-end">
      {/* Image container using Next.js Image */}
      <div className="absolute inset-0 w-full h-full bg-black/50">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="(max-width: 600px) 100vw, 520px"
            className="object-contain"
            draggable={false}
            referrerPolicy="no-referrer"
            priority={active}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-coal text-xs text-gray-500 font-mono uppercase">
            Sin Imagen
          </div>
        )}
      </div>

      {/* Subtle fire/shadow overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent" />

      {/* Text details content */}
      <div className="relative z-10 p-4 pt-12 space-y-1 text-left">
        <div className="truncate text-base font-black uppercase text-white tracking-wider flex items-center gap-1.5">
          {active && <MessageSquare className="w-4 h-4 text-brand-fire shrink-0" />}
          {item.title}
        </div>
        {item.description && active && (
          <div className="line-clamp-2 text-xs text-gray-300 font-sans font-medium">
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}
