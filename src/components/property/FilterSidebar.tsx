import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
    <div className={`bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 ${className || ''}`}>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-gold/15">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-brand-gold rounded-full" />
          <h3 className="font-bold text-brand-navy text-base uppercase tracking-wide">Filters</h3>
        </div>
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
          <h4 className="uppercase tracking-wide text-xs font-bold text-neutral-500 mb-3">{t('purpose')}</h4>
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {(['buy', 'rent', 'commercial'] as const).map(p => (
              <button
                key={p}
                onClick={() => updateFilter('purpose', p)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize ${filters.purpose === p ? 'bg-white text-brand-navy shadow-sm' : 'text-neutral-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <h4 className="uppercase tracking-wide text-xs font-bold text-neutral-500 mb-3">{t('type')}</h4>
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
          <h4 className="uppercase tracking-wide text-xs font-bold text-neutral-500 mb-3">{t('beds')}</h4>
          <div className="flex flex-wrap gap-2">
            {['Studio', '1', '2', '3', '4', '5+'].map(bed => (
              <button
                key={bed}
                onClick={() => handleArrayToggle('beds', bed)}
                className={`px-3 py-1.5 text-sm rounded-md border ${filters.beds.includes(bed) ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-neutral-700 border-neutral-300 hover:border-brand-gold'}`}
              >
                {bed}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
