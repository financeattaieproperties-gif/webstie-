import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero3DSection } from './Hero3DSection';
import { TrustBadgesStrip } from './TrustBadgesStrip';
import { PropertyTypesSection } from './PropertyTypesSection';
import { PromoBanner } from './PromoBanner';
import { WhyAttaieSection } from './WhyAttaieSection';
import { PopularLocationsSection } from './PopularLocationsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TrustBlock } from './TrustBlock';
import { ServicesSection } from './ServicesSection';
import { HotDealsSection } from './HotDealsSection';
import { StatsTicker, type StatItem } from './StatsTicker';
import { NewsSection } from './NewsSection';
import { NewsletterBanner } from './NewsletterBanner';
import { PropertyCard } from '../ui/PropertyCard';
import { ProjectCard } from '../ui/ProjectCard';
import { SectionHeader } from '../ui/SectionHeader';
import { HorizontalCarousel } from '../ui/HorizontalCarousel';
import { MessageCircle, Phone, Star, Quote } from 'lucide-react';
import { ClickToCallButton } from '../ui/ClickToCallButton';

const SECONDARY_STATS: StatItem[] = [
  { target: 10000, suffix: '+', label: 'Happy Clients' },
  { target: 15000, suffix: '+', label: 'Properties Listed' },
  { target: 50, suffix: '+', label: 'Expert Agents' },
  { target: 99, suffix: '%', label: 'Client Satisfaction' },
];

const WHATSAPP_NUMBER = '93782222279';

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Villa with Mountain Views',
    price: 450000,
    location: 'Wazir Akbar Khan, Kabul',
    beds: 6,
    baths: 5,
    area: 380,
    status: 'available' as const,
    type: 'Villa',
    listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Luxury Apartment in City Centre',
    price: 1200,
    location: 'Shahr-e-Naw, Kabul',
    beds: 3,
    baths: 2,
    area: 175,
    status: 'available' as const,
    type: 'Apartment',
    listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Executive Villa with Garden',
    price: 320000,
    location: 'Karte Seh, Kabul',
    beds: 5,
    baths: 4,
    area: 310,
    status: 'available' as const,
    type: 'Villa',
    listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    price: 3500,
    location: 'Taimani, Kabul',
    area: 220,
    status: 'available' as const,
    type: 'Commercial',
    listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Penthouse with City Panorama',
    price: 580000,
    location: 'Macroyan, Kabul',
    beds: 4,
    baths: 3,
    area: 280,
    status: 'available' as const,
    type: 'Apartment',
    listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Retail Showroom Ground Floor',
    price: 4200,
    location: 'Karte Parwan, Kabul',
    area: 340,
    status: 'available' as const,
    type: 'Commercial',
    listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80',
  },
];

const FEATURED_PROJECTS = [
  {
    id: 'p1',
    name: 'Aria Residences',
    location: 'Macroyan, Kabul',
    deliveryDate: 'Q2 2027',
    status: 'Under Construction' as const,
    availableUnits: 32,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    name: 'Kabul Heights',
    location: 'Karte Parwan, Kabul',
    status: 'Ready' as const,
    availableUnits: 12,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    name: 'Green Valley Villas',
    location: 'Qala-e-Fatullah, Kabul',
    deliveryDate: 'Q4 2027',
    status: 'Under Construction' as const,
    availableUnits: 8,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    name: 'Wazir Gardens',
    location: 'Wazir Akbar Khan, Kabul',
    deliveryDate: 'Q1 2026',
    status: 'Under Construction' as const,
    availableUnits: 5,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ahmad Karimi',
    role: 'Property Investor',
    location: 'Kabul',
    quote:
      'Attaie Properties helped me acquire two villas in Wazir Akbar Khan at the right price. Their market knowledge and honesty are unmatched.',
    initials: 'AK',
  },
  {
    name: 'Fatima Ahmadi',
    role: 'First-time Buyer',
    location: 'Shahr-e-Naw',
    quote:
      'As a first-time buyer I was nervous, but the team guided me every step. Found my perfect apartment within two weeks.',
    initials: 'FA',
  },
  {
    name: 'Tariq Noori',
    role: 'Business Owner',
    location: 'Taimani',
    quote:
      'Needed a commercial space quickly. They showed me three options in one day and closed the deal in a week. Highly professional.',
    initials: 'TN',
  },
];

// ── Filter types ──────────────────────────────────────────────────────────────

type FilterTab = 'All' | 'For Sale' | 'For Rent' | 'Commercial';
const FILTER_TABS: FilterTab[] = ['All', 'For Sale', 'For Rent', 'Commercial'];

// ── Animations ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Main Component ────────────────────────────────────────────────────────────

export const LandingPageContent = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredProperties = ALL_PROPERTIES.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'For Sale') return p.listingType === 'sale';
    if (activeFilter === 'For Rent') return p.listingType === 'rent';
    if (activeFilter === 'Commercial') return p.type === 'Commercial';
    return true;
  });

  return (
    <>
      <Hero3DSection />
      <TrustBadgesStrip />
      <PropertyTypesSection />

      {/* ── Featured Properties ───────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--color-brand-ivory)' }}>
        <div className="container-custom">
          <SectionHeader
            eyebrow="Browse Listings"
            title="Individual Properties"
            subtitle="Standalone homes, apartments and commercial spaces available for sale or rent across Kabul's top districts."
            cta={{ label: 'View all properties', href: '/properties' }}
          />

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-10 flex-wrap"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = tab === activeFilter;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  style={{
                    background: isActive ? 'var(--color-brand-navy)' : 'rgba(255,255,255,0.55)',
                    color: isActive ? '#ffffff' : 'rgba(2,14,58,0.55)',
                    border: isActive ? '1.5px solid var(--color-brand-navy)' : '1.5px solid rgba(2,14,58,0.1)',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'var(--color-brand-navy)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProperties.length > 0 ? (
                <HorizontalCarousel
                  items={filteredProperties}
                  cardWidth={340}
                  gap={24}
                  renderItem={(prop) => <PropertyCard {...prop} />}
                />
              ) : (
                <div className="py-20 text-center text-neutral-400 text-sm">
                  No properties match this filter.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <PromoBanner
        eyebrow="List With Us"
        title="List Your Property With Us"
        description="Get maximum visibility and the best value for your property, backed by our agents and marketing network."
        bullets={['Free property evaluation', 'Professional photography', 'Targeted marketing', 'Expert negotiation']}
        ctaLabel="List Your Property"
        ctaHref="/contact"
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
        imageSide="left"
      />

      <WhyAttaieSection />

      <PopularLocationsSection />

      <HowItWorksSection />

      <TrustBlock />

      <ServicesSection />

      <PromoBanner
        eyebrow="Financing"
        title="Get Pre-Approved For Easy Financing"
        description="Fast approval and flexible payment options so you can move on the right property without delay."
        ctaLabel="Learn More"
        ctaHref="/contact"
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
        imageSide="right"
      />

      <HotDealsSection />

      <StatsTicker stats={SECONDARY_STATS} />

      {/* ── Signature Projects ────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--color-brand-cream)' }}>
        <div className="container-custom">
          <SectionHeader
            eyebrow="Developments"
            title="Signature Projects"
            subtitle="Multi-unit residential developments offering off-plan and ready units across Kabul's growth corridors."
            cta={{ label: 'View all projects', href: '/properties?category=projects' }}
          />

          <HorizontalCarousel
            items={FEATURED_PROJECTS}
            cardWidth={340}
            gap={24}
            renderItem={(proj) => <ProjectCard {...proj} />}
          />
        </div>
      </section>

      <NewsSection />

      {/* ── CTA Strip ────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'var(--color-brand-navy)' }}>
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(1,69,242,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-25 pointer-events-none" />
        {/* Top/bottom gold rules */}
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(1,69,242,0.5), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(1,69,242,0.5), transparent)' }} />

        <div className="container-custom relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] mb-5 flex items-center justify-center gap-3"
            style={{ color: 'var(--color-brand-gold)' }}
          >
            <span className="inline-block w-8 h-px" style={{ background: 'rgba(1,69,242,0.4)' }} />
            Get in Touch
            <span className="inline-block w-8 h-px" style={{ background: 'rgba(1,69,242,0.4)' }} />
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold text-white mb-6 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Ready to Find Your<br />
            <span style={{ color: 'var(--color-brand-gold)' }}>Dream Property</span> in Kabul?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-base mb-12 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Our local experts know every district. Whether buying, renting, or investing —
            we'll find the right property for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.26 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              aria-label="Contact us via WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-colors shadow-lg"
              style={{ background: '#25D366', boxShadow: '0 8px 28px rgba(37,211,102,0.35)' }}
            >
              <MessageCircle size={20} aria-hidden="true" /> WhatsApp Us
            </motion.a>
            <motion.a
              href="tel:+93782222279"
              aria-label="Call us"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-colors"
              style={{
                background: 'var(--color-brand-gold)',
                boxShadow: '0 8px 28px rgba(1,69,242,0.4)',
              }}
            >
              <Phone size={20} aria-hidden="true" /> +93 782 222 279
            </motion.a>
            <ClickToCallButton
              className="px-8 py-4 rounded-2xl font-bold text-base"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--color-brand-ivory)' }}>
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerParent}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-3"
              style={{ color: 'var(--color-brand-gold)' }}
            >
              <span className="inline-block w-8 h-px" style={{ background: 'rgba(1,69,242,0.4)' }} />
              Client Stories
              <span className="inline-block w-8 h-px" style={{ background: 'rgba(1,69,242,0.4)' }} />
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-heading font-bold text-brand-navy"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              What Our Clients Say
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 flex flex-col gap-6 cursor-default"
                style={{
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Quote icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-brand-gold-lt)' }}
                >
                  <Quote size={20} style={{ color: 'var(--color-brand-gold)' }} />
                </div>

                {/* Stars */}
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor"
                      style={{ color: 'var(--color-brand-gold)' }} aria-hidden="true" />
                  ))}
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-offset-2"
                    style={{
                      background: 'var(--color-brand-navy)',
                      color: 'var(--color-brand-gold)',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy text-sm">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </>
  );
};
