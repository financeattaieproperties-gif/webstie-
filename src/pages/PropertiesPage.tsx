import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/forms/SearchBar';
import { FilterSidebar, FilterState } from '../components/property/FilterSidebar';
import { PropertyCard } from '../components/ui/PropertyCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { PropertyCardSkeleton } from '../components/ui/PropertyCardSkeleton';
import { getProperties, getProjects, type Property, type Project } from '../lib/dbService';

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
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'individual';
  const isProjects = category === 'projects';

  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [projects, setProjects]     = useState<Project[]>([]);
  const [filters, setFilters]       = useState<FilterState>(defaultFilters);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetcher = isProjects ? getProjects() : getProperties();
    fetcher
      .then((data) => {
        if (isProjects) setProjects(data as Project[]);
        else {
          setAllProperties(data as Property[]);
          setProperties(data as Property[]);
        }
      })
      .catch(() => setError('Failed to load. Please try again.'))
      .finally(() => setLoading(false));
  }, [isProjects]);

  useEffect(() => {
    if (isProjects) return;
    let filtered = allProperties;
    if (filters.type.length > 0)
      filtered = filtered.filter(p => filters.type.includes(p.type));
    if (filters.purpose !== 'buy' || filters.status.length > 0) {
      const listingMap: Record<string, string> = { buy: 'sale', rent: 'rent', commercial: 'sale' };
      filtered = filtered.filter(p => p.listing_type === listingMap[filters.purpose]);
    }
    if (filters.beds.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.beds) return false;
        return filters.beds.some(b => b === 'Studio' ? p.beds === 0 : b === '5+' ? (p.beds ?? 0) >= 5 : p.beds === Number(b));
      });
    }
    if (filters.status.length > 0)
      filtered = filtered.filter(p => filters.status.includes(p.status));
    setProperties(filtered);
  }, [filters, allProperties, isProjects]);

  return (
    <main className="min-h-screen bg-brand-ivory flex flex-col">
      <Navbar />

      <div className="relative bg-brand-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="container-custom relative z-10">
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-[1px] bg-brand-gold/50" />
            Kabul, Afghanistan
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            {isProjects ? 'Signature Projects' : 'Browse Properties'}
          </h1>
          <SearchBar />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-40 shadow-sm">
        <div className="container-custom flex gap-2 py-3">
          <a
            href="/properties?category=individual"
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              !isProjects
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-neutral-100'
            }`}
          >
            Individual Properties
          </a>
          <a
            href="/properties?category=projects"
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              isProjects
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-neutral-100'
            }`}
          >
            Signature Projects
          </a>
        </div>
      </div>

      <div className="container-custom py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {!isProjects && (
            <aside className="w-full lg:w-72 shrink-0">
              <FilterSidebar filters={filters} onChange={setFilters} className="sticky top-24" />
            </aside>
          )}

          <div className="flex-1">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-gold rounded-full" />
                <h2 className="text-lg font-bold text-brand-navy">
                  {loading
                    ? 'Loading…'
                    : isProjects
                    ? `${projects.length} Projects Available`
                    : `${properties.length} Properties Found`}
                </h2>
              </div>
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
