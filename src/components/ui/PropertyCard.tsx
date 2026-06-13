import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react';
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
  const [saved, setSaved] = useState(false);

  const priceDisplay = listingType === 'rent'
    ? `$${price.toLocaleString()}/mo`
    : `$${price.toLocaleString()}`;

  return (
    <a
      href={`/properties/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_40px_-8px_rgba(26,35,53,0.18)] border border-neutral-100 hover:border-brand-gold/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transform: 'scale(1)', transition: 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Dark gradient at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

        {/* For Sale / For Rent badge */}
        {listingType && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
              listingType === 'rent'
                ? 'bg-blue-600 text-white'
                : 'bg-brand-gold text-white'
            }`}>
              {listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-12 z-10">
          <Badge status={status} className="bg-white/90 backdrop-blur-sm shadow-md" />
        </div>

        {/* Save button */}
        <button
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          onClick={e => {
            e.preventDefault();
            setSaved(s => !s);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform hover:scale-110"
        >
          <Heart
            size={15}
            className={saved ? 'text-red-500 fill-red-500' : 'text-neutral-400'}
          />
        </button>

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-white font-bold text-xl drop-shadow-md">{priceDisplay}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge type={type} />
        </div>
        <h3 className="font-heading text-lg font-bold text-brand-navy mt-2 mb-2 line-clamp-1 group-hover:text-brand-gold transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center text-neutral-500 mb-4 text-sm">
          <MapPin size={14} className="mr-1 text-brand-gold shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 text-neutral-600 text-sm">
          {beds !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bed size={16} className="text-brand-gold" />
              <span className="font-medium">{beds}</span>
              <span className="text-neutral-400">Beds</span>
            </div>
          )}
          {baths !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bath size={16} className="text-brand-gold" />
              <span className="font-medium">{baths}</span>
              <span className="text-neutral-400">Baths</span>
            </div>
          )}
          {area !== undefined && (
            <div className="flex items-center gap-1.5">
              <Maximize2 size={16} className="text-brand-gold" />
              <span className="font-medium">{area}</span>
              <span className="text-neutral-400">m²</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
