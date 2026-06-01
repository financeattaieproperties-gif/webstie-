import React from 'react';
import { Button } from '../ui/Button';
import { Search, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1920&q=80"
          alt="Kabul Real Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/40 to-brand-navy/80"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Find Your Dream <br />
          <span className="text-brand-gold">Property in Kabul</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-neutral-200 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Browse premium homes, apartments &amp; commercial spaces across Kabul's finest neighbourhoods — for sale and for rent.
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-700 delay-500">
          <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-neutral-100 py-2">
              <div className="flex items-center gap-3">
                <MapPin className="text-brand-gold" />
                <input
                  type="text"
                  placeholder="Search by district or project name..."
                  className="w-full bg-transparent border-none focus:ring-0 text-brand-navy font-medium placeholder:text-neutral-400"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 px-4 border-b md:border-b-0 md:border-r border-neutral-100 py-2">
              <select className="w-full bg-transparent border-none focus:ring-0 text-brand-navy font-bold appearance-none">
                <option>Buy</option>
                <option>Rent</option>
                <option>Commercial</option>
              </select>
            </div>

            <Button className="w-full md:w-auto px-10 gap-2">
              <Search size={20} />
              Search
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
