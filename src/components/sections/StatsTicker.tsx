import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface StatItem {
  target: number;
  decimals?: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 200, suffix: '+', label: 'Properties Listed' },
  { target: 15, suffix: '+', label: 'Signature Projects' },
  { target: 10, suffix: '+', label: 'Years in Kabul' },
  { target: 4.8, decimals: 1, suffix: '/5', label: 'Client Rating' },
];

const CountUp = ({
  target,
  decimals = 0,
  suffix,
}: {
  target: number;
  decimals?: number;
  suffix: string;
}) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1600;
    const id = setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (t >= 1) {
        setValue(target);
        clearInterval(id);
      }
    }, 16);
    return () => clearInterval(id);
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </span>
  );
};

export const StatsTicker = () => (
  <section className="relative bg-brand-navy islamic-pattern py-16 overflow-hidden" aria-label="Key statistics">
    {/* Subtle gold glow top */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
    <div className="container-custom">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {STATS.map(({ target, decimals, suffix, label }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center text-center px-6 py-4 ${
              i < STATS.length - 1 ? 'md:border-r md:border-white/10' : ''
            } ${i < 2 ? 'border-b md:border-b-0 border-white/10 pb-10 md:pb-4' : 'pt-10 md:pt-4'}`}
          >
            <div className="w-8 h-[2px] bg-brand-gold/50 rounded-full mb-5" />
            <p className="text-5xl font-bold text-white mb-2 tabular-nums">
              <CountUp target={target} decimals={decimals} suffix={suffix} />
            </p>
            <p className="text-brand-gold/70 text-[10px] uppercase tracking-[0.2em] font-bold">{label}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
  </section>
);
