import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { InquiryForm } from '../components/forms/InquiryForm';
import { ImageGallery } from '../components/property/ImageGallery';
import { VideoPlayer } from '../components/property/VideoPlayer';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { MapPin, Bed, Bath, Maximize2, Building, ArrowLeft } from 'lucide-react';
import { getProperty, type Property } from '../lib/dbService';
import { ClickToCallButton } from '../components/ui/ClickToCallButton';
import { VisitRequestDialog } from '../components/forms/VisitRequestDialog';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [visitOpen, setVisitOpen] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    getProperty(propertyId)
      .then(setProperty)
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  // Build final images array: gallery_images takes precedence; image_url as fallback
  const allImages: string[] = property
    ? property.gallery_images.length > 0
      ? property.gallery_images
      : property.image_url
      ? [property.image_url]
      : []
    : [];

  const metaTitle = property
    ? `${property.title} — ${property.type} for ${property.listing_type === 'rent' ? 'Rent' : 'Sale'} in ${property.location} | Attaie Properties`
    : 'Property Details | Attaie Properties';
  const metaDesc = property
    ? property.description?.slice(0, 155) ??
      `${property.beds ? `${property.beds}-bed ` : ''}${property.type.toLowerCase()} for ${property.listing_type === 'rent' ? 'rent' : 'sale'} in ${property.location}, Kabul. Priced at $${property.price.toLocaleString()}.`
    : 'View property details on Attaie Properties.';
  const metaImage = property?.image_url ?? 'https://attaieproperties.com/logo.png';
  const metaUrl = `https://attaieproperties.com/properties/${id}`;

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={metaUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Navbar />

      {/* Gallery / hero */}
      <div className="mt-20">
        {loading ? (
          <div className="w-full h-[60vh] min-h-[420px] bg-neutral-200 animate-pulse" />
        ) : allImages.length > 0 ? (
          <div className="relative">
            <ImageGallery images={allImages} alt={property?.title ?? ''} />
            {/* Breadcrumb overlay on top of gallery */}
            <div className="absolute top-6 left-0 right-0 z-10 container-custom">
              <motion.a
                href="/properties"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 text-white/85 hover:text-brand-gold transition-colors text-sm font-medium bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft size={15} />
                Back to Properties
              </motion.a>
            </div>
          </div>
        ) : (
          <div className="w-full h-[60vh] min-h-[420px] bg-brand-navy flex items-center justify-center">
            <span className="text-white/30 text-sm">No images available</span>
          </div>
        )}
      </div>

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
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-4">
                <Badge status={property.status} />
                <Badge type={property.type} />
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-navy">
                {property.title}
              </h1>
              <motion.div
                className="h-[2px] bg-brand-gold rounded-full mt-2 mb-6"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />

              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                {property.listing_type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
              </p>
              <p className="text-4xl font-bold text-brand-gold mb-6">
                {property.listing_type === 'rent'
                  ? `$${property.price.toLocaleString()} / mo`
                  : `$${property.price.toLocaleString()}`}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <ClickToCallButton />
                <button onClick={() => setVisitOpen(true)} className="rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white hover:bg-brand-navy-light">Request a Visit</button>
              </div>

              {/* Spec badges */}
              <div className="flex flex-wrap gap-3 py-6 border-y border-neutral-200 mb-8">
                {property.beds != null && (
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl cursor-default"
                  >
                    <Bed size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.beds}</span> Beds
                  </motion.div>
                )}
                {property.baths != null && (
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl cursor-default"
                  >
                    <Bath size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.baths}</span> Baths
                  </motion.div>
                )}
                {property.area != null && (
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl cursor-default"
                  >
                    <Maximize2 size={20} className="text-brand-gold" />
                    <span className="font-bold">{property.area}</span> m²
                  </motion.div>
                )}
                {property.floor != null && (
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl cursor-default"
                  >
                    <Building size={20} className="text-brand-gold" />
                    Floor <span className="font-bold ml-1">{property.floor}</span>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="flex items-center gap-2 text-neutral-700 bg-brand-ivory px-4 py-2 rounded-xl cursor-default"
                >
                  <MapPin size={20} className="text-brand-gold" />
                  <span className="font-bold">{property.location}</span>
                </motion.div>
              </div>

              {/* Description */}
              {property.description && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white p-8 rounded-2xl border border-brand-gold/10 mb-8"
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-brand-gold rounded-full" />
                    <h2 className="text-xl font-bold text-brand-navy">Description</h2>
                  </div>
                  <p className="text-neutral-600 leading-relaxed text-lg">{property.description}</p>
                </motion.div>
              )}

              {/* Video player */}
              {property.video_url && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoPlayer url={property.video_url} title={property.title} />
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-96 shrink-0">
              <div className="sticky top-28">
                <InquiryForm propertyId={String(property.id)} propertyName={property.title} />
              </div>
            </aside>
          </div>
        )}
      </div>

      {property && visitOpen && <VisitRequestDialog target={{ label: property.title, propertyId: property.id }} onClose={() => setVisitOpen(false)} />}

      <Footer />
    </main>
  );
}
