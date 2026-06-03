import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPageContent } from '../components/sections/LandingPageContent';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LandingPageContent />
      <Footer />
    </main>
  );
}
