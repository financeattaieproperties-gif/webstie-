import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&q=80',
];

export const TrustBlock = () => (
  <section className="section-padding" style={{ background: 'var(--color-brand-cream)' }}>
    <div className="container-custom">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-10 flex flex-col justify-center overflow-hidden"
          style={{ background: 'var(--color-brand-navy)' }}
        >
          <div className="absolute inset-0 islamic-pattern opacity-40" />
          <div className="relative z-10">
            <p className="text-white font-heading font-bold text-2xl mb-1">Trusted by Thousands</p>
            <p className="text-white/55 text-sm mb-6">Loved by clients across Kabul and the diaspora.</p>

            <p className="font-bold text-white tabular-nums leading-none" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)' }}>
              4.9
            </p>
            <div className="flex gap-1 my-3" aria-label="4.9 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" className="text-brand-gold" aria-hidden="true" />
              ))}
            </div>
            <p className="text-white/55 text-sm mb-6">Based on 850+ reviews</p>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ border: '2px solid var(--color-brand-navy)' }}
                  />
                ))}
              </div>
              <span className="text-white/70 text-xs font-semibold">+850 clients</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden min-h-[280px]"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
            alt="A family celebrating the keys to their new home"
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  </section>
);
