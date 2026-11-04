import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Bed, Bath, Maximize2, MapPin, CalendarDays, Building2, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/forms/SearchBar';
import { FilterSidebar, FilterState } from '../components/property/FilterSidebar';
import { PropertyCard } from '../components/ui/PropertyCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { PropertyCardSkeleton } from '../components/ui/PropertyCardSkeleton';
import { VisitRequestDialog, type VisitTarget } from '../components/forms/VisitRequestDialog';
import {
  getProperties,
  getProjects,
  getAllProjectUnits,
  type Property,
  type Project,
  type ProjectUnit,
} from '../lib/dbService';
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

function ProjectUnitInventoryCard({
  unit,
  onRequestVisit,
}: {
  unit: ProjectUnit;
  onRequestVisit: (target: VisitTarget) => void;
}) {
  const { t } = useTranslation();
  const projectLabel = unit.project_name || `Project #${unit.project_id}`;
  const unitHref = `/projects/${unit.project_id}#unit-${unit.id}`;
  const bookable = !['sold', 'rented'].includes(unit.status);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-navy/8 shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 flex flex-col h-full">
      <Link to={unitHref} className="relative block aspect-[16/10] overflow-hidden bg-brand-navy">
        {unit.image_url ? (
          <img
            src={unit.image_url}
            alt={`${projectLabel} — ${unit.unit_number}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
            <Building2 size={36} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-navy/90 text-white backdrop-blur-xs">
            {t('projectUnits.projectApartmentBadge')}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold capitalize bg-brand-gold text-white">
            {unit.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-bold bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            {projectLabel} · {t('projectUnits.unitPrefix', { number: unit.unit_number })}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            {projectLabel}
          </p>
          <Link to={unitHref} className="block group-hover:text-brand-gold transition-colors">
            <h3 className="text-lg font-bold text-brand-navy line-clamp-1">
              {unit.title || `${projectLabel} — ${t('projectUnits.unitPrefix', { number: unit.unit_number })}`}
            </h3>
          </Link>
          {unit.project_location && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin size={13} className="text-brand-gold shrink-0" />
              <span className="truncate">{unit.project_location}</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-neutral-600 pt-3 border-t border-neutral-100">
            {unit.beds !== null && (
              <span className="flex items-center gap-1">
                <Bed size={14} className="text-brand-gold" />
                {t('projectUnits.beds', { count: unit.beds })}
              </span>
            )}
            {unit.baths !== null && (
              <span className="flex items-center gap-1">
                <Bath size={14} className="text-brand-gold" />
                {t('projectUnits.baths', { count: unit.baths })}
              </span>
            )}
            {unit.area !== null && (
              <span className="flex items-center gap-1">
                <Maximize2 size={14} className="text-brand-gold" />
                {unit.area} m²
              </span>
            )}
            {unit.floor !== null && (
              <span className="flex items-center gap-1">
                {t('projectUnits.floor', { floor: unit.floor })}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
          <div>
            {unit.price !== null ? (
              <p className="text-lg font-bold text-brand-gold">
                ${Number(unit.price).toLocaleString()}
              </p>
            ) : (
              <p className="text-sm font-semibold text-neutral-500">Price on request</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {bookable && (
              <button
                type="button"
                onClick={() =>
                  onRequestVisit({
                    label: `${projectLabel} — ${t('projectUnits.unitPrefix', { number: unit.unit_number })}`,
                    projectId: unit.project_id,
                    projectUnitId: unit.id,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold px-3 py-1.5 text-xs font-bold text-brand-gold hover:bg-brand-gold hover:text-white transition-colors"
              >
                <CalendarDays size={13} />
                {t('projectUnits.requestVisit')}
              </button>
            )}
            <Link
              to={unitHref}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-navy-light transition-colors"
            >
              {t('projectUnits.viewInProject', { project: projectLabel })}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertiesContent() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'individual';
  const isProjects = category === 'projects';
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [projectUnits, setProjectUnits] = useState<ProjectUnit[]>([]);
  const [allProjectUnits, setAllProjectUnits] = useState<ProjectUnit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitTarget, setVisitTarget] = useState<VisitTarget | null>(null);
  const [serialSearch, setSerialSearch] = useState(
    searchParams.get('search') ?? searchParams.get('serial_number') ?? ''
  );

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    if (isProjects) {
      getProjects()
        .then((data) => setProjects(data))
        .catch(() => setError('Failed to load. Please try again.'))
        .finally(() => setLoading(false));
    } else {
      Promise.all([getProperties(), getAllProjectUnits()])
        .then(([propsData, unitsResp]) => {
          setAllProperties(propsData);
          setProperties(propsData);
          setAllProjectUnits(unitsResp.items);
          setProjectUnits(unitsResp.items);
        })
        .catch(() => setError('Failed to load. Please try again.'))
        .finally(() => setLoading(false));
    }
  }, [isProjects]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const term = (searchParams.get('search') ?? searchParams.get('serial_number') ?? '').trim();
    setSerialSearch(term);
    if (!term || isProjects) return;
    getProperties({ search: term })
      .then(setProperties)
      .catch(() => setError('Search failed. Please try again.'));
    const lower = term.toLowerCase();
    setProjectUnits(
      allProjectUnits.filter(
        (u) =>
          u.unit_number.toLowerCase().includes(lower) ||
          (u.title ?? '').toLowerCase().includes(lower) ||
          (u.project_name ?? '').toLowerCase().includes(lower) ||
          (u.project_location ?? '').toLowerCase().includes(lower)
      )
    );
  }, [searchParams, isProjects, allProjectUnits]);

  useEffect(() => {
    if (isProjects) return;
    let filtered = allProperties;
    if (filters.type.length > 0) {
      filtered = filtered.filter((p) => filters.type.includes(p.type));
    }
    if (filters.purpose !== 'buy' || filters.status.length > 0) {
      const listingMap: Record<string, string> = { buy: 'sale', rent: 'rent', commercial: 'sale' };
      filtered = filtered.filter((p) => p.listing_type === listingMap[filters.purpose]);
    }
    if (filters.beds.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.beds) return false;
        return filters.beds.some((b) =>
          b === 'Studio' ? p.beds === 0 : b === '5+' ? (p.beds ?? 0) >= 5 : p.beds === Number(b)
        );
      });
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter((p) => filters.status.includes(p.status));
    }
    setProperties(filtered);

    // Filter project apartments alongside standalone properties
    let filteredUnits = allProjectUnits;
    if (filters.type.length > 0 && !filters.type.includes('Apartment')) {
      filteredUnits = [];
    }
    if (filters.purpose === 'rent' || filters.purpose === 'commercial') {
      filteredUnits = [];
    }
    if (filters.beds.length > 0) {
      filteredUnits = filteredUnits.filter((u) => {
        if (u.beds === null) return false;
        return filters.beds.some((b) =>
          b === 'Studio' ? u.beds === 0 : b === '5+' ? (u.beds ?? 0) >= 5 : u.beds === Number(b)
        );
      });
    }
    if (filters.status.length > 0) {
      filteredUnits = filteredUnits.filter((u) => {
        const mappedStatus = u.status === 'reserved' ? 'pending' : u.status;
        return filters.status.includes(mappedStatus);
      });
    }
    setProjectUnits(filteredUnits);
  }, [filters, allProperties, allProjectUnits, isProjects]);

  const totalInventoryCount = properties.length + projectUnits.length;
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
            { label: 'Signature Projects', href: '/projects', active: isProjects },
          ].map((tab) => (
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
                  type="button"
                  onClick={loadData}
                  className="text-sm font-semibold underline shrink-0 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-gold rounded-full" />
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={loading ? 'loading' : isProjects ? projects.length : totalInventoryCount}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-brand-navy"
                  >
                    {loading
                      ? 'Loading…'
                      : isProjects
                      ? `${projects.length} Projects Available`
                      : `${totalInventoryCount} Properties Found`}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : isProjects ? (
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
                {!loading && totalInventoryCount === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                      <SlidersHorizontal size={32} className="text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy mb-2">No properties match your filters</h3>
                    <p className="text-neutral-500 mb-6 max-w-xs">
                      Try adjusting your search criteria to see more results.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFilters(defaultFilters)}
                      className="px-6 py-2.5 bg-brand-navy text-white rounded-lg font-semibold text-sm hover:bg-brand-navy-light transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}

                {totalInventoryCount > 0 && (
                  <motion.div
                    key="properties"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                  >
                    {properties.map((prop) => (
                      <motion.div
                        key={`prop-${prop.id}`}
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
                    {projectUnits.map((unit) => (
                      <motion.div
                        key={`unit-${unit.id}`}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.97 },
                          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                        }}
                      >
                        <ProjectUnitInventoryCard
                          unit={unit}
                          onRequestVisit={setVisitTarget}
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

      {visitTarget && (
        <VisitRequestDialog
          target={visitTarget}
          onClose={() => setVisitTarget(null)}
        />
      )}

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

