import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Home } from 'lucide-react';
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
    <a href={`/projects/${id}`} className="group block bg-white rounded-xl shadow-sm border border-neutral-300 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
        <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute top-4 left-4 z-10">
          <Badge status={statusColor as any} className="bg-white/90 backdrop-blur-sm">
            {status}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-brand-navy mb-2">{name}</h3>
        <div className="flex items-center text-neutral-500 mb-4 text-sm">
          <MapPin size={16} className="mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
          {deliveryDate && (
            <div className="flex items-center gap-2 text-neutral-700 text-sm">
              <Calendar size={16} className="text-brand-gold" />
              <span>Delivery: <span className="font-medium">{deliveryDate}</span></span>
            </div>
          )}
          {availableUnits !== undefined && (
            <div className="flex items-center gap-2 text-neutral-700 text-sm">
              <Home size={16} className="text-brand-gold" />
              <span><span className="font-bold text-brand-gold">{availableUnits}</span> Units Available</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
