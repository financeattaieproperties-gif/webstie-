import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/Button';

export interface FilterState {
  purpose: 'buy' | 'rent' | 'commercial';
  type: string[];
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  beds: string[];
  baths: string[];
  status: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

export const FilterSidebar = ({ filters, onChange, className }: FilterSidebarProps) => {
  const t = useTranslations('filters');

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const handleArrayToggle = (key: 'type' | 'beds' | 'baths' | 'status', item: string) => {
    const current = filters[key];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFilter(key, updated);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-300 p-6 ${className || ''}`}>
      <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
        <h3 className="font-bold text-lg text-brand-navy">Filters</h3>
        <button 
          onClick={() => onChange({
            purpose: 'buy', type: [], minPrice: 0, maxPrice: 2000000, minArea: 0, maxArea: 1000, beds: [], baths: [], status: []
          })}
          className="text-sm text-brand-gold hover:underline"
        >
          {t('clearAll')}
        </button>
      </div>

      <div className="space-y-6">
        {/* Purpose */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">{t('purpose')}</h4>
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {(['buy', 'rent', 'commercial'] as const).map(p => (
              <button
                key={p}
                onClick={() => updateFilter('purpose', p)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize ${filters.purpose === p ? 'bg-white text-brand-gold shadow-sm' : 'text-neutral-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">{t('type')}</h4>
          <div className="space-y-2">
            {['Apartment', 'Villa', 'House', 'Townhouse', 'Commercial', 'Land'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes(type)}
                  onChange={() => handleArrayToggle('type', type)}
                  className="rounded border-neutral-300 text-brand-gold focus:ring-brand-gold" 
                />
                <span className="text-sm text-neutral-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Beds */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">{t('beds')}</h4>
          <div className="flex flex-wrap gap-2">
            {['Studio', '1', '2', '3', '4', '5+'].map(bed => (
              <button
                key={bed}
                onClick={() => handleArrayToggle('beds', bed)}
                className={`px-3 py-1.5 text-sm rounded-md border ${filters.beds.includes(bed) ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white text-neutral-700 border-neutral-300 hover:border-brand-gold'}`}
              >
                {bed}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full mt-4">Apply Filters</Button>
      </div>
    </div>
  );
};
