"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

const PLACEHOLDERS = [
  'Wazir Akbar Khan...',
  'Macroyan apartments...',
  '3-bed villa for sale...',
];

export const HeroSection = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = PLACEHOLDERS[idx];
    let pauseId: ReturnType<typeof setTimeout>;
    const id = setTimeout(
      () => {
        if (!deleting) {
          if (text.length < target.length) {
            setText(target.slice(0, text.length + 1));
          } else {
            pauseId = setTimeout(() => setDeleting(true), 2200);
          }
        } else {
          if (text.length > 0) {
            setText(target.slice(0, text.length - 1));
          } else {
            setDeleting(false);
            setIdx((i) => (i + 1) % PLACEHOLDERS.length);
          }
        }
      },
      deleting ? 45 : 80
    );
    return () => {
      clearTimeout(id);
      clearTimeout(pauseId);
    };
  }, [text, deleting, idx]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background layers: photo → navy overlay → geometric pattern */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1920&q=80"
          alt="Kabul"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/65" />
        <div className="absolute inset-0 islamic-pattern" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-brand-gold text-sm font-bold uppercase tracking-[0.2em] mb-5"
        >
          Kabul&apos;s Premier Real Estate
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Find Your Home
          <br />
          <span className="text-brand-gold">in Kabul</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-neutral-200 leading-relaxed"
        >
          Browse premium homes, apartments &amp; commercial spaces across
          Kabul&apos;s finest neighbourhoods — for sale and for rent.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-neutral-100">
              <MapPin className="text-brand-gold shrink-0" size={20} />
              <input
                type="text"
                aria-label="Search location or property"
                placeholder={text || PLACEHOLDERS[idx].slice(0, 1)}
                className="w-full bg-transparent border-none outline-none text-brand-navy font-medium placeholder:text-neutral-400 text-base"
              />
            </div>
            <div className="w-full md:w-44 px-4 py-3 border-b md:border-b-0 md:border-r border-neutral-100 flex items-center">
              <select aria-label="Property type" className="w-full bg-transparent border-none outline-none text-brand-navy font-bold appearance-none cursor-pointer">
                <option>Buy</option>
                <option>Rent</option>
                <option>Commercial</option>
              </select>
            </div>
            <Button className="w-full md:w-auto px-8 gap-2 rounded-xl">
              <Search size={18} /> Search
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};
