"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const slides = [
  { src: "/me/aquarium.jpg", alt: "Phonlatat at an aquarium tunnel", caption: "Osaka · Japan" },
  { src: "/me/beach.jpg",    alt: "Photographing the ocean",         caption: "Kamakura · Japan" },
  { src: "/me/vending.jpg",  alt: "Vending machines in the snow",    caption: "Hokkaido · Japan" },
  { src: "/me/snow.jpg",     alt: "Snowstorm in Hokkaido",           caption: "Hokkaido · Japan" },
  { src: "/me/night.jpg",    alt: "Nighttime in Hokkaido",           caption: "Hokkaido · Japan" },
  { src: "/me/store.jpg",    alt: "At a Japanese electronics store", caption: "Tokyo · Japan" },
];

const CARD_W = 260;
const CARD_H = Math.round(CARD_W * (4 / 3)); // 346
const STEP   = CARD_W + 24;                   // 284

export default function PhotoSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const next = useCallback(() => setActive((p) => (p + 1) % n), [n]);
  const prev = useCallback(() => setActive((p) => (p - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Card track ──────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: CARD_H }}>
        {slides.map((slide, i) => {
          let offset = i - active;
          if (offset >  n / 2) offset -= n;
          if (offset < -n / 2) offset += n;

          const isActive   = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;

          return (
            <motion.div
              key={slide.src}
              className={`absolute top-0 rounded-2xl overflow-hidden ${!isActive ? "cursor-pointer" : ""}`}
              style={{
                width:      CARD_W,
                height:     CARD_H,
                left:       "50%",
                marginLeft: -(CARD_W / 2),
              }}
              animate={{
                x:       offset * STEP,
                scale:   isActive ? 1 : 0.87,
                opacity: isActive ? 1 : isAdjacent ? 0.55 : 0,
                zIndex:  isActive ? 10 : isAdjacent ? 5 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                if (offset ===  1) next();
                if (offset === -1) prev();
              }}
            >
              {/* Photo */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="260px"
              />

              {/* Dim overlay on non-active */}
              <motion.div
                className="absolute inset-0 bg-stone-900"
                animate={{ opacity: isActive ? 0 : 0.28 }}
                transition={{ duration: 0.5 }}
              />

              {/* Bottom gradient on active */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* Caption */}
              <motion.div
                className="absolute bottom-4 left-4 pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                transition={{ duration: 0.4, delay: isActive ? 0.22 : 0 }}
              >
                <span className="inline-block rounded-lg bg-white/90 px-3 py-1.5 font-mono text-xs text-stone-600 backdrop-blur-sm shadow-sm">
                  {slide.caption}
                </span>
              </motion.div>

              {/* Auto-play progress bar */}
              {isActive && !paused && (
                <motion.div
                  key={active}
                  className="absolute bottom-0 left-0 h-[2px] bg-white/60 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Navigation arrows ──────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 shadow-lg text-stone-600 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-stone-900 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 shadow-lg text-stone-600 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-stone-900 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* ── Dot indicators ──────────────────────────── */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Photo ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 h-1.5 bg-stone-700"
                : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
