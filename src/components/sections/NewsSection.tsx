import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

interface NewsPost {
  tag: string;
  title: string;
  date: string;
  image: string;
  href: string;
}

const POSTS: NewsPost[] = [
  {
    tag: 'Buying Guide',
    title: '5 Things to Check Before Buying Your First Home in Kabul',
    date: 'June 10, 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80',
    href: '/blog/buying-first-home-kabul',
  },
  {
    tag: 'Market Trends',
    title: 'Kabul Real Estate Prices: What Changed in 2026',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=700&q=80',
    href: '/blog/kabul-market-trends-2026',
  },
  {
    tag: 'Financing',
    title: 'A Practical Guide to Financing a Property Purchase',
    date: 'May 14, 2026',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80',
    href: '/blog/financing-a-property-purchase',
  },
];

export const NewsSection = () => (
  <section className="section-padding" style={{ background: 'var(--color-brand-ivory)' }}>
    <div className="container-custom">
      <SectionHeader
        eyebrow="Stay Informed"
        title="Latest News & Insights"
        subtitle="Straightforward advice on buying, renting and investing in Kabul."
        cta={{ label: 'View all articles', href: '/blog' }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {POSTS.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group block rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm border border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={p.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <span
                className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: 'var(--color-brand-navy)' }}
              >
                {p.tag}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-heading font-bold text-brand-navy text-base leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
                {p.title}
              </h3>
              <p className="text-neutral-400 text-xs mb-4">{p.date}</p>
              <span className="inline-flex items-center gap-2 text-brand-navy font-semibold text-sm">
                Read More
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1.5" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);
