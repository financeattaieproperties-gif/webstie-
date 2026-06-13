import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Globe, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Pillar {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const PILLARS: Pillar[] = [
  {
    Icon: MapPin,
    title: 'Local Expertise',
    desc: "15+ years operating in Kabul's most sought-after districts",
  },
  {
    Icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property personally vetted by our on-the-ground agents',
  },
  {
    Icon: Globe,
    title: 'Diaspora Trusted',
    desc: 'Helping overseas Afghans buy and invest remotely since 2015',
  },
  {
    Icon: MessageCircle,
    title: 'Fast Response',
    desc: 'WhatsApp replies within 2 hours, 7 days a week',
  },
];

export const WhyAttaieSection = () => (
  <section className="section-padding bg-brand-navy relative overflow-hidden">
    {/* Islamic pattern overlay */}
    <div className="absolute inset-0 islamic-pattern opacity-60" />
    {/* Gold top border */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

    <div className="container-custom relative z-10">
      <div className="text-center mb-16">
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-3">
          <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
          Why Choose Us
          <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
        </p>
        <h2 className="text-4xl font-bold text-white">The Attaie Difference</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-brand-gold/30 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 flex items-center justify-center mb-5 group-hover:bg-brand-gold/25 transition-colors duration-300">
              <Icon size={28} className="text-brand-gold" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
  </section>
);
