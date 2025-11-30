import { useCallback, useState } from 'react';
import TransportTabs from '../components/TransportTabs';
import JourneyForm from '../components/JourneyForm';
import HeroBanner from '../components/travelhub/HeroBanner';
import type { HeroSearchPayload } from '../components/travelhub/HeroBanner';
import TravelCategoriesSection from '../components/travelhub/TravelCategoriesSection';
import DestinationsSection from '../components/travelhub/DestinationsSection';
import TourPackagesSection from '../components/travelhub/TourPackagesSection';
import GallerySection from '../components/travelhub/GallerySection';
import ReviewsSection from '../components/travelhub/ReviewsSection';
import BlogHighlightsSection from '../components/travelhub/BlogHighlightsSection';
import InteractiveMapSection from '../components/travelhub/InteractiveMapSection';
import ContactSupportSection from '../components/travelhub/ContactSupportSection';
import SpecialFeaturesSection from '../components/travelhub/SpecialFeaturesSection';
import RouteMapSection from '../components/travelhub/RouteMapSection';

const TravelHub = () => {
  const [selectedTransport, setSelectedTransport] = useState('flights');

  const handleJourneySearch = (data: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  }) => {
    console.log('Journey form search:', data, 'Transport:', selectedTransport);
  };

  const handleHeroSearch = (payload: HeroSearchPayload) => {
    console.log('Hero search:', payload);
  };

  const scrollToDestinations = useCallback(() => {
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="white-bg white-worldmap-overlay relative overflow-x-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16">
        <HeroBanner
          onSearch={handleHeroSearch}
          onExploreDestinations={scrollToDestinations}
          onContact={scrollToContact}
        />

        <section className="space-y-8">
          <TransportTabs selectedTransport={selectedTransport} onSelectTransport={setSelectedTransport} />
          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-4">
            <JourneyForm onSearch={handleJourneySearch} />
          </div>
        </section>

        <TravelCategoriesSection />
        <RouteMapSection />
        <DestinationsSection />
        <TourPackagesSection />
        <GallerySection />
        <SpecialFeaturesSection />
        <InteractiveMapSection />
        <ReviewsSection />
        <BlogHighlightsSection />
        <ContactSupportSection />
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#06b6d4]/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#06d6a0]/25 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#fb923c]/25 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#0ea5e9]/25 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default TravelHub;
