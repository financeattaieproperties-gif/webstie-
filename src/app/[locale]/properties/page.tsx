'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { SearchBar } from '../../../components/forms/SearchBar';
import { FilterSidebar, FilterState } from '../../../components/property/FilterSidebar';
import { PropertyCard } from '../../../components/ui/PropertyCard';
import { ProjectCard } from '../../../components/ui/ProjectCard';

const individualProperties = [
  {
    id: '1', title: 'Modern Villa with Mountain Views', price: 450000,
    location: 'Wazir Akbar Khan, Kabul', beds: 6, baths: 5, area: 380,
    status: 'available' as const, type: 'Villa', listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2', title: 'Luxury Apartment in City Centre', price: 1200,
    location: 'Shahr-e-Naw, Kabul', beds: 3, baths: 2, area: 175,
    status: 'available' as const, type: 'Apartment', listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3', title: 'Executive Villa with Private Garden', price: 320000,
    location: 'Karte Seh, Kabul', beds: 5, baths: 4, area: 310,
    status: 'available' as const, type: 'Villa', listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4', title: 'Furnished Apartment Near Ministries', price: 800,
    location: 'Taimani, Kabul', beds: 2, baths: 1, area: 120,
    status: 'available' as const, type: 'Apartment', listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5', title: 'Spacious Family House', price: 280000,
    location: 'Karte Char, Kabul', beds: 4, baths: 3, area: 260,
    status: 'available' as const, type: 'House', listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6', title: 'Premium Office Space', price: 3500,
    location: 'Shahr-e-Naw, Kabul', area: 250,
    status: 'available' as const, type: 'Commercial', listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7', title: 'Corner Villa — Quiet Street', price: 195000,
    location: 'Karte Parwan, Kabul', beds: 4, baths: 3, area: 240,
    status: 'pending' as const, type: 'Villa', listingType: 'sale' as const,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8', title: 'Studio Apartment — New Build', price: 450,
    location: 'Macroyan, Kabul', beds: 1, baths: 1, area: 55,
    status: 'available' as const, type: 'Apartment', listingType: 'rent' as const,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
];

const projectListings = [
  {
    id: 'p1', name: 'Aria Residences', location: 'Macroyan, Kabul',
    deliveryDate: 'Q2 2027', status: 'Under Construction' as const, availableUnits: 32,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2', name: 'Kabul Heights', location: 'Karte Parwan, Kabul',
    status: 'Ready' as const, availableUnits: 12,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3', name: 'Green Valley Villas', location: 'Qala-e-Fatullah, Kabul',
    deliveryDate: 'Q4 2027', status: 'Under Construction' as const, availableUnits: 8,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4', name: 'Taimani Business Tower', location: 'Taimani, Kabul',
    deliveryDate: 'Q1 2026', status: 'Under Construction' as const, availableUnits: 18,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5', name: 'Shahr-e-Naw Luxury Flats', location: 'Shahr-e-Naw, Kabul',
    status: 'Ready' as const, availableUnits: 6,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p6', name: 'Paghman Garden Estates', location: 'Paghman, Kabul',
    deliveryDate: 'Q3 2027', status: 'Under Construction' as const, availableUnits: 24,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultFilters: FilterState = {
  purpose: 'buy',
  type: [],
  minPrice: 0,
  maxPrice: 2000000,
  minArea: 0,
  maxArea: 1000,
  beds: [],
  baths: [],
  status: []
};

function PropertiesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'individual';
  const isProjects = category === 'projects';

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-brand-navy pt-32 pb-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
              {isProjects ? 'Signature Projects' : 'Browse Properties'}
            </h1>
            <p className="text-neutral-400">Kabul, Afghanistan</p>
          </div>
          <SearchBar />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container-custom flex gap-1 py-2">
          <a
            href="/properties?category=individual"
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${!isProjects ? 'bg-brand-navy text-white' : 'text-neutral-500 hover:text-brand-navy'}`}
          >
            Individual Properties
          </a>
          <a
            href="/properties?category=projects"
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${isProjects ? 'bg-brand-navy text-white' : 'text-neutral-500 hover:text-brand-navy'}`}
          >
            Projects
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {!isProjects && (
            <aside className="w-full lg:w-72 shrink-0">
              <FilterSidebar filters={defaultFilters} onChange={() => {}} className="sticky top-24" />
            </aside>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-navy">
                {isProjects
                  ? `${projectListings.length} Projects Available`
                  : `${individualProperties.length} Properties Found`}
              </h2>
              {!isProjects && (
                <select className="px-4 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-gold">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Area: Largest First</option>
                </select>
              )}
            </div>

            {isProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projectListings.map((proj) => (
                  <ProjectCard key={proj.id} {...proj} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {individualProperties.map((prop) => (
                  <PropertyCard key={prop.id} {...prop} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <button className="px-8 py-3 border border-brand-gold text-brand-gold font-bold rounded-lg hover:bg-brand-gold hover:text-white transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesContent />
    </Suspense>
  );
}
