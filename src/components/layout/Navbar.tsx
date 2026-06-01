"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, Globe, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className={`text-2xl font-display font-bold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            ATTAIE <span className="text-brand-gold">PROPERTIES</span>
          </span>
        </div>

        {/* Desktop Nav */}
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className={`flex items-center gap-2 ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            <Phone size={18} />
            <span className="font-bold">+93 700 123 456</span>
          </div>
          <div className="h-6 w-[1px] bg-neutral-300"></div>
          <button className={`p-2 transition-colors hover:text-brand-gold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            <Globe size={20} />
          </button>
          <Button variant={isScrolled ? 'primary' : 'outline'} className={!isScrolled ? 'border-white text-white hover:bg-white hover:text-brand-navy' : ''}>
            Enquire Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-brand-gold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="container-custom py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-bold text-brand-navy border-b border-neutral-100 pb-3"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3 text-brand-navy">
                <Phone size={20} />
                <span className="font-bold">+93 700 123 456</span>
              </div>
              <Button className="w-full">Enquire Now</Button>
              <Button variant="ghost" className="w-full gap-2">
                <Globe size={18} /> English / العربية
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
