import { Metadata } from 'next';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { LandingPageContent } from '../../components/sections/LandingPageContent';

export const metadata: Metadata = {
  title: 'Attaie Properties — Find Your Home in Kabul',
  description:
    "Browse premium homes, apartments & commercial spaces for sale and rent across Kabul's finest neighbourhoods. Trusted by local buyers and overseas Afghans.",
};

const HomePage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LandingPageContent />
      <Footer />
    </main>
  );
};

export default HomePage;
