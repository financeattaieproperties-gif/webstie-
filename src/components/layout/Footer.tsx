import React from 'react';
import { MessageCircle, Camera, Briefcase, Video, Mail, MapPin, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-display font-bold mb-6 block">
              ATTAIE <span className="text-brand-gold">PROPERTIES</span>
            </span>
            <p className="text-neutral-300 mb-8 leading-relaxed">
              Kabul's trusted real estate partner. We connect buyers, renters, and investors with premium properties and signature projects across Afghanistan's capital.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                <Camera size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                <Briefcase size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                <Video size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="/" className="text-neutral-300 hover:text-brand-gold transition-colors">Home</a></li>
              <li><a href="/about" className="text-neutral-300 hover:text-brand-gold transition-colors">About Us</a></li>
              <li><a href="/properties" className="text-neutral-300 hover:text-brand-gold transition-colors">Browse Properties</a></li>
              <li><a href="/projects" className="text-neutral-300 hover:text-brand-gold transition-colors">Featured Projects</a></li>
              <li><a href="/blog" className="text-neutral-300 hover:text-brand-gold transition-colors">Latest News</a></li>
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Properties</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="/properties/buy" className="text-neutral-300 hover:text-brand-gold transition-colors">Buy Property</a></li>
              <li><a href="/properties/rent" className="text-neutral-300 hover:text-brand-gold transition-colors">Rent Property</a></li>
              <li><a href="/properties/commercial" className="text-neutral-300 hover:text-brand-gold transition-colors">Commercial</a></li>
              <li><a href="/properties/luxury" className="text-neutral-300 hover:text-brand-gold transition-colors">Luxury Listings</a></li>
              <li><a href="/agents" className="text-neutral-300 hover:text-brand-gold transition-colors">Find an Agent</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 text-neutral-300">
                <MapPin size={20} className="text-brand-gold shrink-0" />
                <span>Wazir Akbar Khan, Street 5, Kabul, Afghanistan</span>
              </li>
              <li className="flex gap-3 text-neutral-300">
                <Phone size={20} className="text-brand-gold shrink-0" />
                <span>+93 700 123 456</span>
              </li>
              <li className="flex gap-3 text-neutral-300">
                <Mail size={20} className="text-brand-gold shrink-0" />
                <span>info@attaieproperties.af</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>© 2026 ATTAIE PROPERTIES. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-gold">Privacy Policy</a>
            <a href="#" className="hover:text-brand-gold">Terms of Service</a>
            <button className="flex items-center gap-1 hover:text-brand-gold">
              <Globe size={14} /> English / العربية
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };