import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse tracking for particle parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

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

  // Three.js — subtle gold particle field on right panel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    // Gold dust particles
    const COUNT = 600;
    const pos = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xb8944a) } },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        void main(){
          vec3 p = position;
          p.y += sin(uTime * 0.4 + p.x * 0.8) * 0.12;
          p.x += cos(uTime * 0.3 + p.y * 0.6) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (200.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float a = 1.0 - smoothstep(0.2, 0.5, d);
          gl_FragColor = vec4(uColor, a * 0.45);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geo, mat));

    const clock = new THREE.Clock();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = clock.getElapsedTime();
      // Gentle parallax on camera
      camera.position.x += (mouseRef.current.x * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (mouseRef.current.y * 0.2 - camera.position.y) * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  const slide = SLIDES[slideIdx];

  return (
    <section
      className="relative w-full min-h-screen flex overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — navy authority column
      ════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-28 pb-16 w-full lg:w-[52%] shrink-0"
        style={{ background: '#1A2335' }}
      >
        {/* Subtle pattern on navy */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.04] pointer-events-none" />

        {/* Gold accent line left edge */}
        <div className="absolute left-0 top-24 bottom-24 w-[3px] bg-gradient-to-b from-transparent via-[#B8944A] to-transparent" />

        <div className="relative">
          {/* Eye-brow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="inline-block w-8 h-[1px] bg-[#B8944A]" />
            <span className="text-[#B8944A] text-[11px] font-bold uppercase tracking-[0.3em]">
              Kabul's Premier Real Estate
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.25rem)' }}
          >
            Find Your
            <br />
            <span style={{ color: '#B8944A' }}>Dream Home</span>
            <br />
            in Kabul
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-[#F5EFE6]/60 text-base leading-relaxed mb-10 max-w-sm"
          >
            Premium villas, apartments &amp; commercial spaces across
            Kabul's finest districts — for sale and for rent.
          </motion.p>

          {/* Property type pill toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-1 p-1 rounded-xl mb-4 w-fit"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(184,148,74,0.2)' }}
          >
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setPropType(t)}
                className="relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                style={{
                  color: propType === t ? '#1A2335' : 'rgba(245,239,230,0.55)',
                }}
              >
                {propType === t && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: '#B8944A' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-4 mb-10"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(184,148,74,0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <MapPin size={17} style={{ color: '#B8944A', flexShrink: 0 }} />
              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center text-white/30 text-sm font-medium pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {PLACEHOLDERS[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
                <input
                  type="text"
                  aria-label="Search location or property"
                  placeholder=""
                  className="relative z-10 w-full bg-transparent border-none outline-none text-white text-sm font-medium"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shrink-0 bg-brand-gold text-brand-navy hover:brightness-110 transition-[filter] duration-150"
              >
                <Search size={14} />
                Search
              </motion.button>
            </div>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="grid grid-cols-3 gap-4"
          >
            {([
              ['200+', 'Properties', 'Listed across Kabul'],
              ['15+', 'Projects', 'Active developments'],
              ['10+', 'Years', 'Trusted experience'],
            ] as const).map(([val, lbl, sub]) => (
              <div
                key={lbl}
                className="flex flex-col gap-1 pl-3"
                style={{ borderLeft: '2px solid rgba(184,148,74,0.45)' }}
              >
                <span className="text-2xl font-bold text-[#B8944A] leading-none">{val}</span>
                <span className="text-white text-xs font-semibold">{lbl}</span>
                <span className="text-white/35 text-[10px] leading-tight">{sub}</span>
              </div>
            ))}
          </motion.div>

          {/* Browse CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <a
              href="/properties"
              className="inline-flex items-center gap-2 text-[#B8944A] text-sm font-semibold hover:gap-3 transition-all duration-200 group"
            >
              Browse all properties
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — full-bleed property photos
      ════════════════════════════════════════════════════ */}
      <div className="relative flex-1 min-h-screen overflow-hidden hidden lg:block">

        {/* Crossfading photos */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={slide.img}
              alt={slide.label}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Left-edge feather into navy */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #1A2335, transparent)' }}
        />
        {/* Top + bottom fades */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(26,35,53,0.6), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(26,35,53,0.8), transparent)' }}
        />

        {/* Gold particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 2 }}
        />

        {/* ── Current property badge (top-right) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${slideIdx}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute top-24 right-6 z-10"
          >
            <div
              className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
              style={{ background: '#B8944A', color: '#1A2335' }}
            >
              {slide.type}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Property info card (bottom-left of right panel) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${slideIdx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="absolute bottom-28 left-8 z-10"
          >
            <div
              className="rounded-2xl px-5 py-4"
              style={{
                background: 'rgba(26,35,53,0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(184,148,74,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(184,148,74,0.2)',
              }}
            >
              <p className="text-white font-bold text-base leading-tight">{slide.label}</p>
              <p className="text-[#F5EFE6]/55 text-xs mt-0.5 mb-2">{slide.location}</p>
              <p className="text-[#B8944A] font-bold text-lg">{slide.price}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Progressive thumbnail strip (bottom) ── */}
        <div
          className="absolute bottom-6 left-8 right-6 z-10 flex items-end gap-2"
        >
          {SLIDES.map((s, i) => {
            const isActive = i === slideIdx;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.label}`}
                className="relative group rounded-lg overflow-hidden shrink-0 transition-all duration-300"
                style={{
                  width: isActive ? 88 : 56,
                  height: isActive ? 60 : 44,
                  border: isActive ? '1.5px solid #B8944A' : '1.5px solid rgba(255,255,255,0.15)',
                }}
              >
                <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: isActive ? 'rgba(26,35,53,0.15)' : 'rgba(26,35,53,0.45)' }}
                />
                {/* Progress fill on active */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{
                      width: `${progress * 100}%`,
                      background: '#B8944A',
                      transition: 'width 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: full-bleed bg for small screens ── */}
      <div className="absolute inset-0 lg:hidden" style={{ zIndex: 0 }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={`mob-${slideIdx}`}
            src={slide.img}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>

      {/* Scroll chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-8 z-20 hidden lg:flex flex-col items-center gap-1"
        style={{ color: 'rgba(184,148,74,0.5)' }}
      >
        <div className="scroll-bounce">
          <ChevronDown size={18} />
        </div>
      </motion.div>
    </section>
  );
};
