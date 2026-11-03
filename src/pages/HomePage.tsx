import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPageContent } from '../components/sections/LandingPageContent';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Attaie Properties — Find Your Home in Kabul</title>
        <meta name="description" content="Browse premium homes, apartments & commercial spaces for sale and rent across Kabul's finest neighbourhoods. Trusted by the Afghan diaspora." />
        <link rel="canonical" href="https://attaieproperties.com/" />
        <meta property="og:url" content="https://attaieproperties.com/" />
        <meta property="og:title" content="Attaie Properties — Find Your Home in Kabul" />
        <meta property="og:description" content="Browse premium homes, apartments & commercial spaces for sale and rent across Kabul's finest neighbourhoods." />
      </Helmet>
      <Navbar />
      <LandingPageContent />
      <Footer />
    </main>
  );
}
