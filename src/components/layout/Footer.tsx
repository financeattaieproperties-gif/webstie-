import React from 'react';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../../i18n/index';
import { MessageCircle, Camera, Briefcase, Video, Mail, MapPin, Phone, Globe } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-brand-ivory border-t-2 border-brand-gold/20 pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="text-2xl font-display font-bold mb-6 block text-brand-navy">
              ATTAIE <span className="text-brand-gold">PROPERTIES</span>
            </span>
            <p className="text-neutral-600 mb-8 leading-relaxed text-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-brand-gold/10 rounded-full hover:bg-brand-gold hover:text-white text-brand-gold transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="p-2.5 bg-brand-gold/10 rounded-full hover:bg-brand-gold hover:text-white text-brand-gold transition-colors"><Camera size={18} /></a>
              <a href="#" className="p-2.5 bg-brand-gold/10 rounded-full hover:bg-brand-gold hover:text-white text-brand-gold transition-colors"><Briefcase size={18} /></a>
              <a href="#" className="p-2.5 bg-brand-gold/10 rounded-full hover:bg-brand-gold hover:text-white text-brand-gold transition-colors"><Video size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-brand-navy uppercase tracking-wider border-b-2 border-brand-gold/30 pb-2 inline-block">{t('footer.quickLinks')}</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="/" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">{t('nav.home')}</a></li>
              <li><a href="/about" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">{t('nav.about')}</a></li>
              <li><a href="/properties" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">{t('nav.properties')}</a></li>
              <li><a href="/properties?category=projects" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">{t('nav.projects')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-brand-navy uppercase tracking-wider border-b-2 border-brand-gold/30 pb-2 inline-block">{t('footer.propertiesSection')}</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="/properties?purpose=buy" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">Buy Property</a></li>
              <li><a href="/properties?purpose=rent" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">Rent Property</a></li>
              <li><a href="/properties?type=Commercial" className="text-neutral-600 hover:text-brand-gold transition-colors text-sm">Commercial</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-brand-navy uppercase tracking-wider border-b-2 border-brand-gold/30 pb-2 inline-block">{t('footer.contactUs')}</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 text-neutral-600 text-sm">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>Wazir Akbar Khan, Street 5, Kabul, Afghanistan</span>
              </li>
              <li className="flex gap-3 text-neutral-600 text-sm">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <span>+93 700 123 456</span>
              </li>
              <li className="flex gap-3 text-neutral-600 text-sm">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>info@attaieproperties.af</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-gold/15 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-gold transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-brand-gold transition-colors">{t('footer.terms')}</a>
            <button onClick={toggleLanguage} className="flex items-center gap-1 hover:text-brand-gold transition-colors">
              <Globe size={14} /> {t('footer.langToggle')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
