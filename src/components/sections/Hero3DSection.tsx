import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown } from 'lucide-react';

// ─── slides ───────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85',
    label: 'Modern Villa',
    location: 'Wazir Akbar Khan, Kabul',
    price: '$450,000',
    type: 'Villa for Sale',
  },
  {
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    label: 'Executive Residence',
    location: 'Karte Parwan, Kabul',
    price: '$320,000',
    type: 'Villa for Sale',
  },
  {
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
    label: 'Luxury Apartment',
    location: 'Shahr-e-Naw, Kabul',
    price: '$1,200 / mo',
    type: 'Apartment for Rent',
  },
  {
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85',
    label: 'Aria Residences',
    location: 'Macroyan, Kabul',
    price: 'From $180,000',
    type: 'Development Project',
  },
  {
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=85',
    label: 'Garden Villa',
    location: 'Karte Seh, Kabul',
    price: '$290,000',
    type: 'Villa for Sale',
  },
];

const SLIDE_DURATION = 5000; // ms

// ─── search placeholders ──────────────────────────────────────────────────────
const PLACEHOLDERS = [
  'Search by district or address...',
  'Wazir Akbar Khan villas...',
  '3-bed apartment in Shahr-e-Naw...',
];

type PropertyType = 'Buy' | 'Rent' | 'Commercial';
const PROPERTY_TYPES: PropertyType[] = ['Buy', 'Rent', 'Commercial'];

export const Hero3DSection: React.FC = () => {

  // Slideshow
  const [slideIdx, setSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const goTo = useCallback((n: number) => {
    setSlideIdx(((n % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgress(0);
    progressRef.current = 0;
    startRef.current = null;
  }, []);

  // Ticker for progress bar
  useEffect(() => {
    let raf: number;
    const tick = (now: number) => {
      if (!pausedRef.current) {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const p = Math.min(elapsed / SLIDE_DURATION, 1);
        progressRef.current = p;
        setProgress(p);
        if (p >= 1) {
          setSlideIdx((i) => (i + 1) % SLIDES.length);
          startRef.current = null;
          progressRef.current = 0;
          setProgress(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Word crossfade placeholder
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Property type toggle
  const [propType, setPropType] = useState<PropertyType>('Buy');


  const slide = SLIDES[slideIdx];

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* ── Full-bleed photo slideshow ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slideIdx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img src={slide.img} alt={slide.label} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />

      {/* ── Center card ── */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-3xl px-8 py-10 text-center"
          style={{
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 32px 80px rgba(2,14,58,0.25), 0 4px 16px rgba(2,14,58,0.12)',
            border: '1px solid rgba(255,255,255,0.85)',
          }}
        >
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-overline text-brand-gold mb-4"
          >
            Kabul's Premier Real Estate
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="font-heading font-bold text-brand-navy leading-tight mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Find Your Dream Home<br />in Kabul
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="text-neutral-500 text-sm mb-7 leading-relaxed"
          >
            Premium villas, apartments &amp; commercial spaces — for sale and for rent.
          </motion.p>

          {/* Property type pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.45 }}
            className="flex items-center gap-1 p-1 rounded-xl mb-4 w-fit mx-auto"
            style={{ background: 'rgba(2,14,58,0.07)' }}
          >
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setPropType(t)}
                className="relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                style={{ color: propType === t ? '#ffffff' : 'rgba(2,14,58,0.5)' }}
              >
                {propType === t && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-lg bg-brand-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.45 }}
            className="flex items-center gap-2 rounded-xl px-4 py-3 mb-7"
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(2,14,58,0.12)',
              boxShadow: '0 2px 8px rgba(2,14,58,0.06)',
            }}
          >
            <MapPin size={16} className="text-brand-gold shrink-0" />
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center text-neutral-400 text-sm pointer-events-none select-none"
                  aria-hidden="true"
                >
                  {PLACEHOLDERS[phraseIdx]}
                </motion.span>
              </AnimatePresence>
              <input
                type="text"
                aria-label="Search location or property"
                placeholder=""
                className="relative z-10 w-full bg-transparent border-none outline-none text-brand-navy text-sm font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shrink-0 bg-brand-gold text-white hover:brightness-110 transition-[filter] duration-150"
            >
              <Search size={14} />
              Search
            </motion.button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex items-center justify-center gap-10"
          >
            {([
              ['200+', 'Properties'],
              ['15+', 'Projects'],
              ['10+', 'Years'],
            ] as const).map(([val, lbl], i) => (
              <React.Fragment key={lbl}>
                {i > 0 && <div className="w-px h-8 bg-neutral-200" />}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-bold text-brand-gold leading-none">{val}</span>
                  <span className="text-neutral-500 text-xs font-medium">{lbl}</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* Browse CTA below card */}
        <motion.a
          href="/properties"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5 inline-flex items-center gap-2 text-white/90 text-sm font-semibold drop-shadow-md hover:gap-3 transition-all duration-200 group"
        >
          Browse all properties
          <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform duration-200" />
        </motion.a>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2 px-6">
        {SLIDES.map((s, i) => {
          const isActive = i === slideIdx;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.label}`}
              className="relative rounded-lg overflow-hidden shrink-0 transition-all duration-300"
              style={{
                width: isActive ? 80 : 52,
                height: isActive ? 56 : 40,
                border: isActive ? '1.5px solid rgba(255,255,255,0.9)' : '1.5px solid rgba(255,255,255,0.3)',
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 h-[2px] bg-white"
                  style={{
                    width: `${progress * 100}%`,
                    transition: 'width 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Current property label (bottom-left) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${slideIdx}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-20 left-8 z-10 hidden lg:block"
        >
          <p className="text-white font-semibold text-sm drop-shadow-md">{slide.label}</p>
          <p className="text-white/60 text-xs drop-shadow-md">{slide.location} · {slide.price}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
