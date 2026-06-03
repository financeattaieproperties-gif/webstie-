import React from 'react';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Badge } from './Badge';

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  beds?: number;
  baths?: number;
  area?: number;
  status: 'available' | 'pending' | 'sold' | 'rented';
  type: string;
  image: string;
  listingType?: 'sale' | 'rent';
}

export const PropertyCard = ({ id, title, price, location, beds, baths, area, status, type, image, listingType }: PropertyCardProps) => {
  const priceDisplay = listingType === 'rent'
    ? `$${price.toLocaleString()}/mo`
    : `$${price.toLocaleString()}`;

  return (
    <a href={`/properties/${id}`} className="group block bg-white rounded-xl shadow-sm border border-neutral-300 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-brand-gold-lt/10">
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-10">
          {listingType && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${listingType === 'rent' ? 'bg-blue-600/90 text-white' : 'bg-brand-gold/90 text-white'}`}>
              {listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Badge status={status} className="bg-white/90 backdrop-blur-sm" />
        </div>
      </div>
      <div className="p-5">
        <Badge type={type} className="mb-3" />
        <h3 className="font-heading text-xl font-bold text-brand-navy mb-2 line-clamp-1">{title}</h3>
        <p className="text-2xl font-bold text-brand-gold mb-3">{priceDisplay}</p>
        <div className="flex items-center text-neutral-500 mb-4 text-sm">
          <MapPin size={16} className="mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 text-neutral-700 text-sm">
          {beds !== undefined && (
            <div className="flex items-center gap-1"><Bed size={18} className="text-brand-gold" /> {beds} Beds</div>
          )}
          {baths !== undefined && (
            <div className="flex items-center gap-1"><Bath size={18} className="text-brand-gold" /> {baths} Baths</div>
          )}
          {area !== undefined && (
            <div className="flex items-center gap-1"><Maximize2 size={18} className="text-brand-gold" /> {area} m²</div>
          )}
        </div>
      </div>
    </a>
  );
};
