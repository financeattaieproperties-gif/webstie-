import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { InquiryForm } from '../components/forms/InquiryForm';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { MapPin, Bed, Bath, Maximize2, Building, ArrowLeft } from 'lucide-react';
import { getProperty, type Property } from '../lib/dbService';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    getProperty(propertyId)
      .then(setProperty)
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      {loading ? (
        <div className="w-full h-[60vh] min-h-[420px] bg-neutral-200 mt-20 animate-pulse" />
      ) : (
        <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden mt-20">
          {property?.image_url ? (
            <img
              src={property.image_url}
              alt={property?.title ?? ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/30 to-transparent" />
          <div className="absolute inset-0 islamic-pattern opacity-20" />
          {/* Breadcrumb overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <a
                href="/properties"
                className="inline-flex items-center gap-2 text-white/80 hover:text-brand-gold transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Back to Properties
              </a>
              {property && (
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mt-3 drop-shadow-md">
                  {property.title}
                </h1>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container-custom pt-8 pb-16 flex-grow">
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {property && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="flex gap-2 mb-4">
                <Badge status={property.status} />
                <Badge type={property.type} />
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-navy mb-4">
                {property.title}
              </h1>

              <p className="text-4xl font-bold text-brand-gold mb-6">
                {property.listing_type === 'rent'
                  ? `$${property.price.toLocaleString()} / mo`
                  : `$${property.price.toLocaleString()}`}
              </p>

              <div className="flex flex-wrap gap-3 py-6 border-y border-neutral-200 mb-8">
                {property.beds != null && (
                  <div className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl">
                    <Bed size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.beds}</span> Beds
                  </div>
                )}
                {property.baths != null && (
                  <div className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl">
                    <Bath size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.baths}</span> Baths
                  </div>
                )}
                {property.area != null && (
                  <div className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl">
                    <Maximize2 size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.area}</span> m²
                  </div>
                )}
                {property.floor != null && (
                  <div className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl">
                    <Building size={20} className="text-brand-gold" />
                    Floor <span className="font-bold ml-1">{property.floor}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl">
                  <MapPin size={20} className="text-brand-gold" />
                  <span className="font-bold">{property.location}</span>
                </div>
              </div>

              {property.description && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-gold/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-brand-gold rounded-full" />
                    <h2 className="text-xl font-bold text-brand-navy">Description</h2>
                  </div>
                  <p className="text-neutral-600 leading-relaxed text-lg">{property.description}</p>
                </div>
              )}
            </div>

            <aside className="w-full lg:w-96 shrink-0">
              <div className="sticky top-28">
                <InquiryForm propertyId={String(property.id)} propertyName={property.title} />
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
