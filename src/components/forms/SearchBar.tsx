"use client";

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export const SearchBar = () => {
  const [purpose, setPurpose] = useState<'buy' | 'rent' | 'commercial'>('buy');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/properties?purpose=${purpose}&location=${encodeURIComponent(location)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-2">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Purpose Toggle */}
        <div className="flex bg-neutral-100 rounded-xl p-1 md:w-auto w-full shrink-0">
          {(['buy', 'rent', 'commercial'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPurpose(p)}
              className={`flex-1 md:flex-none px-6 py-3 text-sm font-bold rounded-lg transition-colors capitalize ${
                purpose === p ? 'bg-white text-brand-gold shadow-sm' : 'text-neutral-500 hover:text-brand-navy'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Location Input */}
        <div className="flex-1 relative flex items-center bg-neutral-50 rounded-xl px-4">
          <MapPin size={20} className="text-neutral-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search by location or project..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-brand-navy focus:outline-none focus:ring-0 placeholder:text-neutral-400"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full md:w-auto px-8 shrink-0 gap-2 rounded-xl">
          <Search size={20} />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
};
