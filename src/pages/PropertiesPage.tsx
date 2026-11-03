import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/forms/SearchBar';
import { FilterSidebar, FilterState } from '../components/property/FilterSidebar';
import { PropertyCard } from '../components/ui/PropertyCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { PropertyCardSkeleton } from '../components/ui/PropertyCardSkeleton';
import { getProperties, getProjects, type Property, type Project } from '../lib/dbService';
import { SeoHead } from '../components/seo/SeoHead';
import { buildPropertiesListingSeo } from '../lib/seoConfig';

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
  const [serialSearch, setSerialSearch] = useState(searchParams.get('search') ?? searchParams.get('serial_number') ?? '');

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
    const term = (searchParams.get('search') ?? searchParams.get('serial_number') ?? '').trim();
    setSerialSearch(term);
    if (!term || isProjects) return;
    getProperties({ search: term }).then(setProperties).catch(() => setError('Search failed. Please try again.'));
  }, [searchParams, isProjects]);

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

  const seo = buildPropertiesListingSeo({ isProjects, search: serialSearch });

  return (
    <main className="min-h-screen bg-brand-ivory flex flex-col">
      <SeoHead seo={seo} />
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

      {/* Tab bar with sliding active indicator */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-40 shadow-sm">
        <div className="container-custom flex gap-1 py-3">
          {[
            { label: 'Individual Properties', href: '/properties?category=individual', active: !isProjects },
            { label: 'Signature Projects',   href: '/projects',    active: isProjects },
          ].map(tab => (
            <a
              key={tab.label}
              href={tab.href}
              className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
                tab.active ? 'text-white' : 'text-neutral-500 hover:text-brand-navy hover:bg-neutral-100'
              }`}
            >
              {tab.active && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-brand-navy rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </a>
          ))}
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
            {/* Error state with retry */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between gap-4">
                <span>{error}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-semibold underline shrink-0 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-gold rounded-full" />
                {/* Animated results count */}
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={loading ? 'loading' : isProjects ? projects.length : properties.length}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-brand-navy"
                  >
                    {loading ? 'Loading…' : isProjects ? `${projects.length} Projects Available` : `${properties.length} Properties Found`}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : isProjects ? (
              /* Projects grid with staggered entry */
              <motion.div
                key="projects"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              >
                {projects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.97 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <ProjectCard
                      id={String(proj.id)}
                      name={proj.name}
                      location={proj.location}
                      deliveryDate={proj.delivery_date ?? undefined}
                      status={proj.status}
                      availableUnits={proj.available_units}
                      image={proj.image_url}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <>
                {/* Empty state */}
                {!loading && properties.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                      <SlidersHorizontal size={32} className="text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy mb-2">No properties match your filters</h3>
                    <p className="text-neutral-500 mb-6 max-w-xs">Try adjusting your search criteria to see more results.</p>
                    <button
                      onClick={() => setFilters(defaultFilters)}
                      className="px-6 py-2.5 bg-brand-navy text-white rounded-lg font-semibold text-sm hover:bg-brand-navy-light transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}

                {/* Properties grid with staggered entry */}
                {properties.length > 0 && (
                  <motion.div
                    key="properties"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                  >
                    {properties.map((prop) => (
                      <motion.div
                        key={prop.id}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.97 },
                          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                        }}
                      >
                        <PropertyCard
                          id={String(prop.id)}
                          serialNumber={prop.serial_number}
                          title={prop.title}
                          price={prop.price}
                          location={prop.location}
                          beds={prop.beds ?? undefined}
                          baths={prop.baths ?? undefined}
                          area={prop.area ?? undefined}
                          status={prop.status}
                          type={prop.type}
                          listingType={prop.listing_type}
                          image={prop.image_url}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
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
