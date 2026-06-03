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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className={`text-2xl font-display font-bold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            ATTAIE <span className="text-brand-gold">PROPERTIES</span>
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors hover:text-brand-gold ${
                isScrolled ? 'text-brand-navy' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className={`flex items-center gap-2 ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            <Phone size={18} />
            <span className="font-bold">+93 700 123 456</span>
          </div>
          <div className="h-6 w-[1px] bg-neutral-300" />
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 p-2 text-sm font-medium transition-colors hover:text-brand-gold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}
            aria-label="Switch language"
          >
            <Globe size={18} />
            {t('nav.langToggle')}
          </button>
          <Button variant={isScrolled ? 'primary' : 'outline'} className={!isScrolled ? 'border-white text-white hover:bg-white hover:text-brand-navy' : ''}>
            {t('nav.enquire')}
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-brand-gold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl">
          <div className="container-custom py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-bold text-brand-navy border-b border-neutral-100 pb-3"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3 text-brand-navy">
                <Phone size={20} />
                <span className="font-bold">+93 700 123 456</span>
              </div>
              <Button className="w-full">{t('nav.enquire')}</Button>
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-lg text-brand-navy font-medium"
              >
                <Globe size={18} /> {t('nav.langToggle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
