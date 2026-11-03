import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPageContent } from '../components/sections/LandingPageContent';
import { SeoHead } from '../components/seo/SeoHead';
import { PAGE_SEO } from '../lib/seoConfig';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SeoHead seo={PAGE_SEO.home} />
      <Navbar />
      <LandingPageContent />
      <Footer />
    </main>
  );
}

