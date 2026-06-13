import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../../i18n/index';
import { Button } from '../ui/Button';
import { Menu, X, Globe, Phone } from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.properties'), href: '/properties' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-display font-bold text-white">
            ATTAIE <span className="text-brand-gold">PROPERTIES</span>
          </a>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium text-white/75 transition-colors hover:text-brand-gold text-sm tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Phone size={16} className="text-brand-gold" />
            <span className="font-bold text-sm">+93 700 123 456</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 p-2 text-sm font-medium text-white/70 transition-colors hover:text-brand-gold"
            aria-label="Switch language"
          >
            <Globe size={16} />
            {t('nav.langToggle')}
          </button>
          <Button variant="primary">
            {t('nav.enquire')}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-brand-navy/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
          <div className="container-custom py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-bold text-white border-b border-white/10 pb-3 hover:text-brand-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3 text-white">
                <Phone size={18} className="text-brand-gold" />
                <span className="font-bold">+93 700 123 456</span>
              </div>
              <Button className="w-full">{t('nav.enquire')}</Button>
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/20 rounded-lg text-white font-medium hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <Globe size={16} /> {t('nav.langToggle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
