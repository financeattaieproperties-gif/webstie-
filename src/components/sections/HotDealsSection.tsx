import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { HorizontalCarousel } from '../ui/HorizontalCarousel';
import { PropertyCard, type PropertyCardProps } from '../ui/PropertyCard';

const HOT_DEALS: PropertyCardProps[] = [
  {
    id: '7',
    title: 'Discounted Villa with Pool',
    price: 385000,
    location: 'Wazir Akbar Khan, Kabul',
    beds: 5,
    baths: 4,
    area: 330,
    status: 'available',
    type: 'Villa',
    listingType: 'sale',
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    title: 'Below-Market Apartment',
    price: 950,
    location: 'Shahr-e-Naw, Kabul',
    beds: 2,
    baths: 2,
    area: 140,
    status: 'available',
    type: 'Apartment',
    listingType: 'rent',
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '9',
    title: 'Corner Retail Unit — Reduced',
    price: 260000,
    location: 'Karte Parwan, Kabul',
    area: 190,
    status: 'available',
    type: 'Commercial',
    listingType: 'sale',
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
];

export const HotDealsSection = () => (
  <section className="section-padding" style={{ background: 'var(--color-brand-cream)' }}>
    <div className="container-custom">
      <SectionHeader
        eyebrow="Limited Time"
        title="Hot Deals"
        subtitle="Priced to move — verified listings with the best value on the market right now."
        cta={{ label: 'View all deals', href: '/properties' }}
      />

      <HorizontalCarousel
        items={HOT_DEALS}
        cardWidth={340}
        gap={24}
        renderItem={(prop) => <PropertyCard {...prop} />}
      />
    </div>
  </section>
);
