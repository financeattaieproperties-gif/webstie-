"use client";

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
    const duration = 1400;
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
  <section className="bg-brand-navy py-14">
    <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {STATS.map(({ target, decimals, suffix, label }) => (
        <div key={label}>
          <p className="text-5xl font-bold text-brand-gold mb-2">
            <CountUp target={target} decimals={decimals} suffix={suffix} />
          </p>
          <p className="text-neutral-400 text-xs uppercase tracking-widest font-bold">{label}</p>
        </div>
      ))}
    </div>
  </section>
);
