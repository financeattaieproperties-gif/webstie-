"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Globe, MessageCircle } from 'lucide-react';

const PILLARS = [
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
  <section className="section-padding bg-white">
    <div className="container-custom">
      <div className="text-center mb-16">
        <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">
          Why Choose Us
        </p>
        <h2 className="text-4xl font-bold text-brand-navy">The Attaie Difference</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {PILLARS.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-5">
              <Icon size={30} className="text-brand-gold" />
            </div>
            <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
