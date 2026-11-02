import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Home, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';

export interface ProjectCardProps {
  id: string;
  name: string;
  location: string;
  deliveryDate?: string;
  status: 'Under Construction' | 'Ready' | 'Sold Out';
  availableUnits?: number;
  image: string;
}

export const ProjectCard = ({ id, name, location, deliveryDate, status, availableUnits, image }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const statusColor = status === 'Ready' ? 'available' : status === 'Sold Out' ? 'sold' : 'pending';

  return (
    <motion.a
      href={`/projects/${id}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-md)' }}
      className="group block bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden transition-colors duration-300 border border-white/60 hover:border-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
    >
      {/* Image */}
      <motion.div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100" whileHover="hovered">
        <motion.img
          src={image}
          alt={`${name} — ${status} development in ${location}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          variants={{ hovered: { scale: 1.07, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
          initial={false}
          style={{ filter: imgLoaded ? 'none' : 'blur(8px)', transition: 'filter 0.4s ease' }}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge status={statusColor as 'available' | 'pending' | 'sold' | 'rented'} className="bg-white/90 backdrop-blur-sm shadow-md">
            {status}
          </Badge>
        </div>

        {/* Units available overlay */}
        {availableUnits !== undefined && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 bg-brand-gold/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
              <Home size={11} />
              {availableUnits} Units Available
            </span>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-brand-navy mb-1.5 group-hover:text-brand-gold transition-colors duration-200">
          {name}
        </h3>
        <div className="flex items-center text-neutral-500 mb-4 text-sm">
          <MapPin size={14} className="mr-1 text-brand-gold shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex flex-col gap-1.5">
            {deliveryDate && (
              <div className="flex items-center gap-2 text-neutral-600 text-sm">
                <Calendar size={14} className="text-brand-gold" />
                <span>Delivery: <span className="font-semibold text-brand-navy">{deliveryDate}</span></span>
              </div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.2, x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-9 h-9 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-300 shrink-0"
          >
            <ArrowRight size={15} className="text-brand-gold group-hover:text-white transition-colors duration-300" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};
