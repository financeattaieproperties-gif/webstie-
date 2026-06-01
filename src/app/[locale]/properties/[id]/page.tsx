import React from 'react';
import Image from 'next/image';
import { Navbar } from '../../../../components/layout/Navbar';
import { Footer } from '../../../../components/layout/Footer';
import { InquiryForm } from '../../../../components/forms/InquiryForm';
import { Badge } from '../../../../components/ui/Badge';
import { MapPin, Bed, Bath, Maximize2, Building } from 'lucide-react';

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => ({ id }));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  
  // Dummy property data
  const property = {
    id,
    title: 'Luxury Villa in Palm Jumeirah',
    price: 12500000,
    location: 'Palm Jumeirah, Dubai',
    beds: 5,
    baths: 6,
    area: 450,
    floor: 2,
    status: 'available' as const,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80',
    description: 'Experience unparalleled luxury in this exquisite 5-bedroom villa located on the prestigious Palm Jumeirah. Boasting panoramic sea views, private beach access, and state-of-the-art amenities, this property represents the pinnacle of Dubai living.'
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      
      {/* Gallery Placeholder */}
      <div className="w-full h-[50vh] md:h-[70vh] relative bg-neutral-900 mt-20">
        <Image src={property.image} alt={property.title} fill className="object-cover opacity-80" />
      </div>

      <div className="container-custom py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              <Badge status={property.status} />
              <Badge type={property.type} />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-navy mb-4">
              {property.title}
            </h1>
            
            <p className="text-4xl font-bold text-brand-gold mb-6">
              AED {property.price.toLocaleString()}
            </p>
            
            <div className="flex flex-wrap gap-6 py-6 border-y border-neutral-200 mb-8">
              <div className="flex items-center gap-2 text-neutral-700">
                <Bed size={24} className="text-brand-gold" />
                <span className="font-bold">{property.beds}</span> Beds
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Bath size={24} className="text-brand-gold" />
                <span className="font-bold">{property.baths}</span> Baths
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Maximize2 size={24} className="text-brand-gold" />
                <span className="font-bold">{property.area}</span> m²
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Building size={24} className="text-brand-gold" />
                <span>Floor <span className="font-bold">{property.floor}</span></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <MapPin size={24} className="text-brand-gold" />
                <span className="font-bold">{property.location}</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <h2 className="text-2xl font-bold text-brand-navy mb-4 border-b border-neutral-100 pb-4">Description</h2>
              <p className="text-neutral-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Agent Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-full shrink-0"></div>
                <div>
                  <p className="text-sm text-neutral-500">Listed by</p>
                  <p className="font-bold text-brand-navy text-lg">Sarah Jenkins</p>
                  <p className="text-sm text-brand-gold">+971 50 123 4567</p>
                </div>
              </div>
              
              <InquiryForm propertyId={property.id} propertyName={property.title} />
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
