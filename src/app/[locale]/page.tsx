import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { HeroSection } from '../../components/sections/HeroSection';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Star, Building2, Home } from 'lucide-react';

const featuredProperties = [
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

const featuredProjects = [
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

const HomePage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />

      <HeroSection />

      {/* Stats Bar */}
      <section className="bg-brand-navy py-12">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-brand-gold mb-2">200+</p>
            <p className="text-neutral-400 text-sm uppercase tracking-widest font-bold">Properties Listed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-brand-gold mb-2">15+</p>
            <p className="text-neutral-400 text-sm uppercase tracking-widest font-bold">Signature Projects</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-brand-gold mb-2">10+</p>
            <p className="text-neutral-400 text-sm uppercase tracking-widest font-bold">Years in Kabul</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-brand-gold mb-2">4.8/5</p>
            <p className="text-neutral-400 text-sm uppercase tracking-widest font-bold">Client Rating</p>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          {/* Category Tab Headers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">Browse Listings</p>
              <h2 className="text-4xl font-bold text-brand-navy">Individual Properties</h2>
              <p className="text-neutral-500 mt-3 max-w-xl">Standalone homes, apartments and commercial spaces available for sale or rent across Kabul's top districts.</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/properties?category=individual" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-bold">
                <Home size={16} /> Individual
              </a>
              <a href="/properties?category=projects" className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-navy text-brand-navy text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors">
                <Building2 size={16} /> Projects
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>

          <div className="mt-10 flex justify-center md:justify-start">
            <a href="/properties?category=individual">
              <Button variant="ghost" className="gap-2">
                View All Individual Properties <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Signature Projects */}
      <section className="section-padding bg-brand-ivory">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">Developments</p>
              <h2 className="text-4xl font-bold text-brand-navy">Signature Projects</h2>
              <p className="text-neutral-500 mt-3 max-w-xl">Multi-unit residential developments offering off-plan and ready units across Kabul's growth corridors.</p>
            </div>
            <a href="/properties?category=projects">
              <Button variant="ghost" className="hidden md:flex gap-2">
                View All Projects <ArrowRight size={18} />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((proj) => (
              <ProjectCard key={proj.id} {...proj} />
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

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1920&q=80"
            alt="Kabul"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/85"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Find Your Home in Kabul?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Our local experts know every district in Kabul. Whether buying, renting, or investing — we'll find the right property for you.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-gold text-white hover:bg-brand-gold/90 shadow-xl">
              Contact an Agent
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-navy">
              WhatsApp Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">Client Stories</p>
            <h2 className="text-4xl font-bold text-brand-navy">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ahmad Karimi',
                role: 'Property Investor, Kabul',
                quote: 'Attaie Properties helped me acquire two villas in Wazir Akbar Khan at the right price. Their market knowledge and honesty are unmatched.'
              },
              {
                name: 'Fatima Ahmadi',
                role: 'First-time Buyer, Shahr-e-Naw',
                quote: 'As a first-time buyer I was nervous, but the team guided me every step of the way. Found my perfect apartment within two weeks.'
              },
              {
                name: 'Tariq Noori',
                role: 'Business Owner, Taimani',
                quote: 'Needed a commercial space quickly. They showed me three options in one day and closed the deal in a week. Highly professional.'
              }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-card shadow-sm border border-neutral-100">
                <div className="flex gap-1 text-brand-gold mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-neutral-700 italic mb-8 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">{t.name}</p>
                    <p className="text-sm text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
