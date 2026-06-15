import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

export const PropertyCard = ({
  id,
  title,
  price,
  location,
  beds,
  baths,
  area,
  status,
  type,
  image,
  listingType,
}: PropertyCardProps) => {
  const [saved, setSaved] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const priceDisplay =
    listingType === 'rent'
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;

  return (
    <motion.a
      href={`/properties/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-colors duration-300 border border-neutral-100 hover:border-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        boxShadow: isHovered
          ? '0 20px 60px -12px rgba(26,35,53,0.22), 0 8px 24px -8px rgba(26,35,53,0.12)'
          : '0 1px 4px 0 rgba(26,35,53,0.07), 0 2px 8px -2px rgba(26,35,53,0.06)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image */}
      <motion.div
        className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100"
        whileHover="hovered"
      >
        <motion.img
          src={image}
          alt={`${title} — ${type} for ${listingType === 'rent' ? 'rent' : 'sale'} in ${location}`}
          className="w-full h-full object-cover"
          variants={{
            hovered: {
              scale: 1.07,
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          initial={false}
          style={{
            filter: imgLoaded ? 'none' : 'blur(8px)',
            transition: 'filter 0.4s ease',
          }}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Dark gradient at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* For Sale / For Rent badge */}
        {listingType && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
                listingType === 'rent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-brand-gold text-white'
              }`}
            >
              {listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-12 z-10">
          <Badge status={status} className="bg-white/90 backdrop-blur-sm shadow-md" />
        </div>

        {/* Save button */}
        <motion.button
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
            setHeartAnim(true);
            setTimeout(() => setHeartAnim(false), 400);
          }}
          animate={heartAnim ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={saved ? 'text-red-500 fill-red-500' : 'text-neutral-400'}
          />
        </motion.button>

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-white font-bold text-xl drop-shadow-lg">
            {priceDisplay}
          </span>
        </div>
      </motion.div>

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
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 pt-4 border-t border-neutral-100 text-neutral-600 text-sm">
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
    </motion.a>
  );
};
