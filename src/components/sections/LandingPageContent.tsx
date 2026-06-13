import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { StatsTicker } from './StatsTicker';
import { WhyAttaieSection } from './WhyAttaieSection';
import { PropertyCard } from '../ui/PropertyCard';
import { ProjectCard } from '../ui/ProjectCard';
import { Button } from '../ui/Button';
import { ArrowRight, Home, Building2, MessageCircle, Phone, Star } from 'lucide-react';

const WHATSAPP_NUMBER = '93700123456';

const FEATURED_PROPERTIES = [
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
];

const TESTIMONIALS = [
  {
    name: 'Ahmad Karimi',
    role: 'Property Investor, Kabul',
    quote:
      'Attaie Properties helped me acquire two villas in Wazir Akbar Khan at the right price. Their market knowledge and honesty are unmatched.',
  },
  {
    name: 'Fatima Ahmadi',
    role: 'First-time Buyer, Shahr-e-Naw',
    quote:
      'As a first-time buyer I was nervous, but the team guided me every step. Found my perfect apartment within two weeks.',
  },
  {
    name: 'Tariq Noori',
    role: 'Business Owner, Taimani',
    quote:
      'Needed a commercial space quickly. They showed me three options in one day and closed the deal in a week. Highly professional.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const LandingPageContent = () => {
  return (
    <>
      <HeroSection />
      <StatsTicker />

      {/* Featured Properties */}
      <section className="section-padding bg-brand-ivory">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">
                Browse Listings
              </p>
              <h2 className="text-4xl font-bold text-brand-navy">Individual Properties</h2>
              <p className="text-neutral-500 mt-3 max-w-xl">
                Standalone homes, apartments and commercial spaces available for sale or rent
                across Kabul&apos;s top districts.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/properties?category=individual"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-bold"
              >
                <Home size={16} /> Individual
              </a>
              <a
                href="/properties?category=projects"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-navy text-brand-navy text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors"
              >
                <Building2 size={16} /> Projects
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROPERTIES.map((prop, i) => (
              <motion.div
                key={prop.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <PropertyCard {...prop} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <a href="/properties?category=individual">
              <Button variant="ghost" className="gap-2">
                View All Individual Properties <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <WhyAttaieSection />

      {/* Signature Projects */}
      <section className="section-padding bg-brand-ivory">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">
                Developments
              </p>
              <h2 className="text-4xl font-bold text-brand-navy">Signature Projects</h2>
              <p className="text-neutral-500 mt-3 max-w-xl">
                Multi-unit residential developments offering off-plan and ready units across
                Kabul&apos;s growth corridors.
              </p>
            </div>
            <a href="/properties?category=projects" className="shrink-0">
              <Button variant="ghost" className="hidden md:flex gap-2">
                View All Projects <ArrowRight size={18} />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <ProjectCard {...proj} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <a href="/properties?category=projects">
              <Button variant="outline" className="w-full gap-2">
                View All Projects <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="container-custom relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center justify-center gap-3"
          >
            <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
            Get in Touch
            <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Ready to Find Your Property in Kabul?
          </motion.h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-white/60 leading-relaxed">
            Our local experts know every district. Whether buying, renting, or investing —
            we&apos;ll find the right property for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              aria-label="Contact us via WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg bg-[#25D366] text-white hover:bg-[#1EB85B] transition-colors shadow-lg"
            >
              <MessageCircle size={22} aria-hidden="true" /> WhatsApp Us
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              aria-label="Call us at +93 700 123 456"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg bg-brand-gold text-white hover:bg-brand-gold/90 transition-colors shadow-lg"
            >
              <Phone size={22} aria-hidden="true" /> +93 700 123 456
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-brand-ivory">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
              Client Stories
              <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
            </p>
            <h2 className="text-4xl font-bold text-brand-navy">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="bg-white p-8 rounded-2xl border border-brand-gold/10 shadow-sm hover:shadow-md hover:border-brand-gold/25 transition-all duration-300"
              >
                <div className="flex gap-1 text-brand-gold mb-5" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-neutral-600 italic mb-8 leading-relaxed text-sm">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
                  <div className="w-11 h-11 bg-brand-navy rounded-full flex items-center justify-center text-brand-gold font-bold text-base shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy text-sm">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
