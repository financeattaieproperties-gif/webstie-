import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';

interface District {
  name: string;
  count: number;
  image: string;
}

const DISTRICTS: District[] = [
  {
    name: 'Wazir Akbar Khan',
    count: 58,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Shahr-e-Naw',
    count: 41,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Karte Parwan',
    count: 29,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Taimani',
    count: 17,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80',
  },
];

export const PopularLocationsSection = () => (
  <section className="section-padding" style={{ background: 'var(--color-brand-cream)' }}>
    <div className="container-custom">
      <SectionHeader
        eyebrow="Where to Look"
        title="Popular Districts"
        subtitle="The Kabul neighborhoods our clients ask for most."
        cta={{ label: 'Explore all districts', href: '/properties' }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DISTRICTS.map((d, i) => (
          <motion.a
            key={d.name}
            href={`/properties?location=${encodeURIComponent(d.name)}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <img
              src={d.image}
              alt={`${d.name}, Kabul`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-heading font-bold text-white text-lg leading-tight">{d.name}</p>
              <p className="text-brand-gold-lt text-xs mt-1">{d.count} Properties</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);
