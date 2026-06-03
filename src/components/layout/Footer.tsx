import React from 'react';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../../i18n/index';
import { MessageCircle, Camera, Briefcase, Video, Mail, MapPin, Phone, Globe } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="text-2xl font-display font-bold mb-6 block">
              ATTAIE <span className="text-brand-gold">PROPERTIES</span>
            </span>
            <p className="text-neutral-300 mb-8 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors"><Camera size={20} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors"><Briefcase size={20} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors"><Video size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">{t('footer.quickLinks')}</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="/" className="text-neutral-300 hover:text-brand-gold transition-colors">{t('nav.home')}</a></li>
              <li><a href="/about" className="text-neutral-300 hover:text-brand-gold transition-colors">{t('nav.about')}</a></li>
              <li><a href="/properties" className="text-neutral-300 hover:text-brand-gold transition-colors">{t('nav.properties')}</a></li>
              <li><a href="/properties?category=projects" className="text-neutral-300 hover:text-brand-gold transition-colors">{t('nav.projects')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">{t('footer.propertiesSection')}</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="/properties?purpose=buy" className="text-neutral-300 hover:text-brand-gold transition-colors">Buy Property</a></li>
              <li><a href="/properties?purpose=rent" className="text-neutral-300 hover:text-brand-gold transition-colors">Rent Property</a></li>
              <li><a href="/properties?type=Commercial" className="text-neutral-300 hover:text-brand-gold transition-colors">Commercial</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-brand-gold/30 pb-2 inline-block">{t('footer.contactUs')}</h4>
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
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-gold">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-brand-gold">{t('footer.terms')}</a>
            <button onClick={toggleLanguage} className="flex items-center gap-1 hover:text-brand-gold">
              <Globe size={14} /> {t('footer.langToggle')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
