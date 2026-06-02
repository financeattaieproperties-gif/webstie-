'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { SearchBar } from '../../../components/forms/SearchBar';
import { FilterSidebar, FilterState } from '../../../components/property/FilterSidebar';
import { PropertyCard } from '../../../components/ui/PropertyCard';
import { ProjectCard } from '../../../components/ui/ProjectCard';
import { PropertyCardSkeleton } from '../../../components/ui/PropertyCardSkeleton';
import { getProperties, getProjects, type Property, type Project } from '../../../lib/dbService';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80';

const defaultFilters: FilterState = {
  purpose: 'buy',
  type: [],
  minPrice: 0,
  maxPrice: 2000000,
  minArea: 0,
  maxArea: 1000,
  beds: [],
  baths: [],
  status: [],
};

function PropertiesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'individual';
  const isProjects = category === 'projects';

  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects]     = useState<Project[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetcher = isProjects ? getProjects() : getProperties();
    fetcher
      .then((data) => {
        if (isProjects) setProjects(data as Project[]);
        else setProperties(data as Property[]);
      })
      .catch(() => setError('Failed to load. Please try again.'))
      .finally(() => setLoading(false));
  }, [isProjects]);

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

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

      <div className="container-custom py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {!isProjects && (
            <aside className="w-full lg:w-72 shrink-0">
              <FilterSidebar filters={defaultFilters} onChange={() => {}} className="sticky top-24" />
            </aside>
          )}

          <div className="flex-1">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-navy">
                {loading
                  ? 'Loading…'
                  : isProjects
                  ? `${projects.length} Projects Available`
                  : `${properties.length} Properties Found`}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : isProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    id={String(proj.id)}
                    name={proj.name}
                    location={proj.location}
                    deliveryDate={proj.delivery_date ?? undefined}
                    status={proj.status}
                    availableUnits={proj.available_units}
                    image={proj.image_url ?? FALLBACK_IMG}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    id={String(prop.id)}
                    title={prop.title}
                    price={prop.price}
                    location={prop.location}
                    beds={prop.beds ?? undefined}
                    baths={prop.baths ?? undefined}
                    area={prop.area ?? undefined}
                    status={prop.status}
                    type={prop.type}
                    listingType={prop.listing_type}
                    image={prop.image_url ?? FALLBACK_IMG}
                  />
                ))}
              </div>
            )}
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
