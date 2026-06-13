import React from 'react';
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
  const statusColor = status === 'Ready' ? 'available' : status === 'Sold Out' ? 'sold' : 'pending';

  return (
    <a
      href={`/projects/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_40px_-8px_rgba(26,35,53,0.18)] border border-neutral-100 hover:border-brand-gold/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: 'scale(1)', transition: 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge status={statusColor as 'available' | 'pending' | 'sold' | 'rented'} className="bg-white/90 backdrop-blur-sm shadow-md">
            {status}
          </Badge>
        </div>

        {/* Units available overlay */}
        {availableUnits !== undefined && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-white font-bold text-sm drop-shadow-md">
              <span className="text-brand-gold">{availableUnits}</span> Units Available
            </span>
          </div>
        )}
      </div>

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
          <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
            <ArrowRight size={15} className="text-brand-gold group-hover:text-white" />
          </div>
        </div>
      </div>
    </a>
  );
};
