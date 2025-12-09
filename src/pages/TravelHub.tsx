import { Calendar, DollarSign, MapPin, PhoneCall, PlaneTakeoff } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import BlogHighlightsSection from '../components/travelhub/BlogHighlightsSection';
import ContactSupportSection from '../components/travelhub/ContactSupportSection';
import DestinationsSection from '../components/travelhub/DestinationsSection';
import GallerySection from '../components/travelhub/GallerySection';
import type { HeroSearchPayload } from '../components/travelhub/HeroBanner';
import ReviewsSection from '../components/travelhub/ReviewsSection';
import RouteMapSection from '../components/travelhub/RouteMapSection';
import SpecialFeaturesSection from '../components/travelhub/SpecialFeaturesSection';
import TourPackagesSection from '../components/travelhub/TourPackagesSection';
import TravelCategoriesSection from '../components/travelhub/TravelCategoriesSection';
import { DESTINATIONS, type Destination } from '../data/destinations';

const seasonalOffers = [
  { id: 1, title: 'Himalayan Snow Trails', discount: '25% OFF', details: 'Gulmarg · Auli · Tawang' },
  { id: 2, title: 'Festive South Circuit', discount: '15% OFF', details: 'Kochi · Madurai · Mysuru' },
  { id: 3, title: 'Desert Glow Retreat', discount: '20% OFF', details: 'Jaisalmer · Bikaner · Rann of Kutch' },
];

const TravelHub = () => {
  const [heroForm, setHeroForm] = useState<HeroSearchPayload>({
    destination: '',
    checkIn: '',
    checkOut: '',
    budget: '',
  });
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [searchContext, setSearchContext] = useState<{ destination?: string; budget?: number } | null>(null);

  const scrollToDestinations = useCallback(() => {
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const updateHeroField = useCallback((key: keyof HeroSearchPayload, value: string) => {
    setHeroForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleHeroSearch = useCallback((payload: HeroSearchPayload) => {
    const term = payload.destination.trim().toLowerCase();
    const budgetValue = parseInt(payload.budget.replace(/[^0-9]/g, ''), 10);

    const filtered = DESTINATIONS.filter((destination) => {
      const matchesDestination = term
        ? destination.title.toLowerCase().includes(term) ||
          (destination.state?.toLowerCase().includes(term) ?? false) ||
          destination.tags.some((tag) => tag.toLowerCase().includes(term))
        : true;

      const withinBudget = Number.isFinite(budgetValue)
        ? (destination.pricePerDay ?? Number.MAX_SAFE_INTEGER) <= budgetValue
        : true;

      return matchesDestination && withinBudget;
    })
      .sort((a, b) => (a.pricePerDay ?? Number.MAX_SAFE_INTEGER) - (b.pricePerDay ?? Number.MAX_SAFE_INTEGER))
      .slice(0, 6);

    setRecommendations(filtered);
    setSearchContext({ destination: payload.destination || undefined, budget: Number.isFinite(budgetValue) ? budgetValue : undefined });

    document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const recommendationTitle = useMemo(() => {
    if (!searchContext) return null;
    const destinationText = searchContext.destination ? `for “${searchContext.destination}”` : 'for you';
    const budgetText = searchContext.budget ? `within ₹${searchContext.budget.toLocaleString('en-IN')}` : '';
    return `Budget-friendly picks ${destinationText} ${budgetText}`.trim();
  }, [searchContext]);

  const handleHeroSubmit = useCallback(() => {
    handleHeroSearch(heroForm);
  }, [handleHeroSearch, heroForm]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Soft World Map Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* World Map Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%230ea5e9' d='M170 120c20-10 45-5 60 15 10 15 5 35-10 45-20 15-50 10-65-10-10-20 0-40 15-50zm100 50c15-5 35 5 40 25 5 15-5 30-20 35-20 5-40-10-40-30 0-15 10-25 20-30zm-80 100c25-15 55-5 70 20 10 20 0 45-25 55-30 15-65-5-70-35-5-20 10-30 25-40zm200-80c30 0 55 25 55 55 0 25-20 50-50 50-35 0-60-30-55-60 5-25 25-45 50-45zm150 30c20 10 30 35 20 55-15 25-45 30-65 15-25-20-20-55 5-70 15-10 30-5 40 0zM450 250c35-10 70 15 75 50 5 30-20 60-55 65-40 5-75-25-70-65 5-30 30-45 50-50zm100-100c25 5 45 30 40 55-5 30-35 50-65 40-25-10-40-40-30-65 10-20 35-35 55-30zm-350 200c20-5 45 10 50 35 5 20-10 40-35 45-30 5-55-20-50-50 5-15 20-25 35-30zm500-50c30 10 50 40 40 70-10 35-50 50-80 35-25-15-35-50-20-75 15-20 40-35 60-30zm-200 100c25 0 50 20 50 50 0 25-20 50-50 50-35 0-55-30-50-60 5-25 30-40 50-40zm300-150c20 15 25 45 10 65-20 25-55 25-75 5-15-20-10-50 15-65 15-10 35-15 50-5z'/%3E%3Cpath fill='%2306b6d4' d='M600 80c25-5 50 15 55 40 5 30-20 55-50 55-35 0-60-30-50-60 5-20 25-30 45-35zm150 120c30 5 55 35 45 65-10 35-50 55-85 40-30-15-40-55-20-80 15-20 40-30 60-25zM100 350c20 0 40 20 40 45 0 20-15 40-40 40-30 0-50-25-45-50 5-20 25-35 45-35zm750-100c25 10 40 40 30 65-15 30-50 40-75 20-20-15-25-45-10-65 15-15 35-25 55-20zm-600 150c30-5 60 20 60 55 0 30-25 55-60 55-40 0-70-35-60-70 10-25 35-35 60-40zm400 50c20 5 35 25 30 50-10 30-45 45-70 30-20-15-25-45-5-65 15-15 30-20 45-15z'/%3E%3Cpath fill='%23fb923c' opacity='0.6' d='M300 50c15 0 30 15 30 35 0 15-15 30-30 30-20 0-35-20-30-40 5-15 15-25 30-25zm500 350c20-5 40 10 45 35 5 20-10 40-35 45-30 5-55-20-50-50 5-20 25-30 40-30zm-400 50c15 5 25 20 20 40-5 20-30 30-50 20-15-10-20-30-10-45 10-15 25-20 40-15z'/%3E%3C/svg%3E")`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(251,146,60,0.06),_transparent_50%)]" />

        {/* Floating Travel Elements */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-[#06b6d4]/20 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-2 h-2 bg-[#06d6a0]/25 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[60%] left-[20%] w-2.5 h-2.5 bg-[#fb923c]/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[25%] w-2 h-2 bg-[#0ea5e9]/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 bg-[#a855f7]/15 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-2 h-2 bg-[#06b6d4]/15 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2.5s' }} />

        {/* Dotted Route Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
          <path d="M100,200 Q300,100 500,250 T900,150" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="8,8" />
          <path d="M50,400 Q250,300 450,350 T850,300" stroke="#fb923c" strokeWidth="2" fill="none" strokeDasharray="8,8" />
          <path d="M200,100 Q400,200 600,150 T1000,250" stroke="#06d6a0" strokeWidth="1.5" fill="none" strokeDasharray="6,6" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16">
        <section className="relative overflow-hidden rounded-[32px] bg-[#0a1625] text-white shadow-2xl">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.45),_transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-soft-light"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1625] via-[#0a1625]/70 to-[#0f1d30]"></div>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-2 p-8 md:p-12">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.5em] text-white/70">
                <PlaneTakeoff size={16} /> Your personalized travel studio
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Feel India through curated journeys <span className="text-[#06d6a0]">crafted for you</span>
              </h1>
              <p className="text-lg text-white/80 max-w-xl">
                Single hub for Indian hotels, trains, flights, guides, and AI-powered planners. Compare in real time and confirm with one click.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleHeroSubmit}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] font-semibold shadow-lg shadow-cyan-500/30"
                >
                  Book Now
                </button>
                <button
                  onClick={scrollToDestinations}
                  className="px-6 py-3 rounded-2xl border border-white/30 text-white/90 hover:border-white"
                >
                  Explore Destinations
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-6 py-3 rounded-2xl border border-transparent bg-white/10 hover:bg-white/20 flex items-center gap-2"
                >
                  <PhoneCall size={18} /> Contact
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-4">
                {seasonalOffers.map((offer) => (
                  <div key={offer.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm uppercase tracking-wide text-white/70">{offer.title}</p>
                    <p className="text-2xl font-semibold text-[#fb923c]">{offer.discount}</p>
                    <p className="text-xs text-white/60">{offer.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
              <p className="text-white/80 text-sm">Search across hotels, flights, tours</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                  <MapPin className="text-[#06b6d4]" size={18} />
                  <input
                    className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                    placeholder="Destination"
                    value={heroForm.destination}
                    onChange={(e) => updateHeroField('destination', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                    <Calendar className="text-[#06b6d4]" size={18} />
                    <input
                      type="date"
                      className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                      value={heroForm.checkIn}
                      onChange={(e) => updateHeroField('checkIn', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                    <Calendar className="text-[#06b6d4]" size={18} />
                    <input
                      type="date"
                      className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                      value={heroForm.checkOut}
                      onChange={(e) => updateHeroField('checkOut', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                  <DollarSign className="text-[#06b6d4]" size={18} />
                  <input
                    className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                    placeholder="Budget (₹)"
                    value={heroForm.budget}
                    onChange={(e) => updateHeroField('budget', e.target.value)}
                  />
                </div>
                <button
                  onClick={handleHeroSubmit}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] py-3 font-semibold shadow-lg shadow-cyan-500/30"
                >
                  Search availability
                </button>
              </div>
            </div>
          </div>
        </section>

        {searchContext && (
          <section id="recommendations" className="rounded-3xl border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm px-6 py-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Smart suggestions</p>
                <h2 className="text-2xl font-semibold text-[#0f172a]">{recommendationTitle}</h2>
              </div>
              <button
                className="text-sm font-semibold text-[#0ea5e9] hover:text-[#0284c7]"
                onClick={scrollToDestinations}
              >
                View all destinations
              </button>
            </div>

            {recommendations.length === 0 ? (
              <p className="text-slate-600">No matches yet — try a different destination or a higher budget.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((destination) => (
                  <div
                    key={destination.id}
                    className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0f172a]">{destination.title}</p>
                      {destination.pricePerDay && (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          ₹{destination.pricePerDay.toLocaleString('en-IN')}/day
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{destination.state}</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <TravelCategoriesSection />
        <RouteMapSection />
        <DestinationsSection />
        <TourPackagesSection />
        <GallerySection />
        <SpecialFeaturesSection />

        <section id="map" className="pt-16">
          <div className="text-center space-y-3 mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Interactive map</p>
            <h2 className="text-3xl font-semibold text-[#0f172a]">Explore India on hover</h2>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <iframe
              title="TravelHub Destinations Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30711283.003947686!2d64.43760646358283!3d20.01140817566828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1689612345678!5m2!1sen!2sin"
              className="h-[420px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <ReviewsSection />
        <BlogHighlightsSection />
        <ContactSupportSection />
      </div>
    </div>
  );
};

export default TravelHub;
