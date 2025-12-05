import {
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CloudSun,
    Loader,
    MapPin,
    MessageCircle,
    PhoneCall,
    Send,
    Sparkles,
    Thermometer,
    Wind
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { festivalApi } from '../services/api';

interface Festival {
  _id: string;
  name: string;
  region: string;
  date: string;
  description: string;
  subscribers: string[];
}

interface GroupedFestivals {
  past: Festival[];
  current: Festival[];
  upcoming: Festival[];
}

type WeatherSnapshot = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
  description: string;
};

const FestivalAlerts: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [subscribedFestivals, setSubscribedFestivals] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    past: true,
    current: true,
    upcoming: true,
  });
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // Sample festivals data for demo (when API doesn't return data)
  const sampleFestivals: Festival[] = [
    // Past month (October 2025)
    {
      _id: 'durga-puja-2025',
      name: 'Durga Puja',
      region: 'East India',
      date: '2025-10-21',
      description: 'The grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community gatherings across Kolkata and Bengal.',
      subscribers: []
    },
    {
      _id: 'dussehra-2025',
      name: 'Dussehra / Vijayadashami',
      region: 'North India',
      date: '2025-10-23',
      description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies in Delhi, Varanasi, and across India.',
      subscribers: []
    },
    // This month (November 2025)
    {
      _id: 'diwali-2025',
      name: 'Diwali - Festival of Lights',
      region: 'North India',
      date: '2025-11-12',
      description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings. Best experienced in Jaipur, Varanasi, and Amritsar.',
      subscribers: []
    },
    {
      _id: 'bhai-dooj-2025',
      name: 'Bhai Dooj',
      region: 'North India',
      date: '2025-11-14',
      description: 'A celebration of the bond between brothers and sisters, with tilak ceremonies and gift exchanges.',
      subscribers: []
    },
    {
      _id: 'chhath-puja-2025',
      name: 'Chhath Puja',
      region: 'East India',
      date: '2025-11-16',
      description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks. Best seen in Bihar and Eastern UP.',
      subscribers: []
    },
    {
      _id: 'kartik-purnima-2025',
      name: 'Kartik Purnima',
      region: 'Central India',
      date: '2025-11-27',
      description: 'Sacred full moon day with Dev Deepawali celebrations in Varanasi. Thousands of diyas light up the ghats.',
      subscribers: []
    },
    // Next month (December 2025)
    {
      _id: 'hornbill-2025',
      name: 'Hornbill Festival',
      region: 'North-East India',
      date: '2025-12-01',
      description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, music, and local cuisine. A must-visit!',
      subscribers: []
    },
    {
      _id: 'rann-utsav-2025',
      name: 'Rann Utsav',
      region: 'West India',
      date: '2025-12-10',
      description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and luxury tent stays await.',
      subscribers: []
    },
    {
      _id: 'christmas-goa-2025',
      name: 'Christmas in Goa',
      region: 'West India',
      date: '2025-12-25',
      description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses at heritage churches, and beach parties.',
      subscribers: []
    },
    {
      _id: 'konark-dance-2025',
      name: 'Konark Dance Festival',
      region: 'East India',
      date: '2025-12-20',
      description: 'Classical dance performances against the backdrop of the magnificent Sun Temple. Odissi, Bharatanatyam, and more.',
      subscribers: []
    }
  ];

  const groupedFestivals = useMemo<GroupedFestivals>(() => {
    // Use sample data if API returns empty
    const dataToGroup = festivals.length > 0 ? festivals : sampleFestivals;
    
    const now = new Date();
    const currentIndex = now.getFullYear() * 12 + now.getMonth();
    return dataToGroup.reduce<GroupedFestivals>(
      (acc, fest) => {
        const festDate = new Date(fest.date);
        if (Number.isNaN(festDate.getTime())) {
          acc.upcoming.push(fest);
          return acc;
        }
        const festIndex = festDate.getFullYear() * 12 + festDate.getMonth();
        const diff = festIndex - currentIndex;
        if (diff === -1) acc.past.push(fest);
        else if (diff === 0) acc.current.push(fest);
        else if (diff === 1) acc.upcoming.push(fest);
        else if (diff < -1) acc.past.push(fest);
        else acc.upcoming.push(fest);
        return acc;
      },
      { past: [], current: [], upcoming: [] }
    );
  }, [festivals, sampleFestivals]);

  const regions = [
    'All',
    'North India',
    'South India',
    'East India',
    'West India',
    'Central India',
    'North-East India'
  ];

  useEffect(() => {
    fetchFestivals();
    fetchWeather();
  }, [selectedRegion]);

  const fetchFestivals = async () => {
    setIsLoading(true);
    setError('');
    const response = await festivalApi.getAlerts(selectedRegion);
    if (response.success && response.data) {
      const data = response.data as any;
      setFestivals(data.alerts || []);
    } else {
      setError('Live festival API not reachable. Showing sample alerts instead.');
    }
    setIsLoading(false);
  };

  const regionCoordinates: Record<string, { lat: number; lon: number }> = {
    '': { lat: 20.5937, lon: 78.9629 }, // All / India centroid
    'North India': { lat: 28.6139, lon: 77.209 },
    'South India': { lat: 12.9716, lon: 77.5946 },
    'East India': { lat: 22.5726, lon: 88.3639 },
    'West India': { lat: 19.076, lon: 72.8777 },
    'Central India': { lat: 23.2599, lon: 77.4126 },
    'North-East India': { lat: 25.5788, lon: 91.8933 },
  };

  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Slight rain',
    63: 'Rainy',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Heavy showers',
    82: 'Violent showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm + hail',
    99: 'Thunderstorm + heavy hail',
  };

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError('');
      const coords = regionCoordinates[selectedRegion] || regionCoordinates[''];
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Weather unavailable');
      }
      const data = await res.json();
      const current = data.current_weather;
      if (!current) {
        throw new Error('Weather unavailable');
      }
      setWeather({
        temperature: current.temperature,
        windspeed: current.windspeed,
        weathercode: current.weathercode,
        time: current.time,
        description: weatherCodes[current.weathercode] || 'Live weather',
      });
    } catch (err: any) {
      setWeather(null);
      setWeatherError(err?.message || 'Weather unavailable');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubscribe = async (festival: Festival) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const response = await festivalApi.subscribeToFestival(festival._id, selectedRegion);
    if (response.success) {
      setSubscribedFestivals([...subscribedFestivals, festival._id]);
    } else {
      setError((response as any).error || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async (festival: Festival) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const response = await festivalApi.unsubscribeFromFestival(festival._id);
    if (response.success) {
      setSubscribedFestivals(subscribedFestivals.filter(id => id !== festival._id));
    } else {
      setError((response as any).error || 'Failed to unsubscribe');
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            <Loader size={32} className="absolute inset-0 m-auto animate-spin text-white" />
          </div>
          <p className="text-purple-700 font-medium animate-pulse">Loading festivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-80">
        <div className="absolute -top-24 -left-10 h-72 w-72 bg-amber-200/40 blur-3xl" />
        <div className="absolute top-40 right-10 h-80 w-80 bg-orange-200/40 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10">
        {/* Hero */}
        <div className="bg-white/90 backdrop-blur-lg border border-amber-100 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-md">
                  <Sparkles className="text-white" size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600">DarShana Live</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Festival Alerts</h1>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                Upcoming, live, and next‑month festivals across India with maps, live weather, and instant alerts.
                Subscribe to the ones you care about and plan trips confidently.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ label: 'Regions', value: regions.length - 1 }, { label: 'Sample alerts', value: sampleFestivals.length }, { label: 'Live weather', value: weather ? `${Math.round(weather.temperature)}°C` : '—' }, { label: 'Delivery', value: 'Email + SMS*' }].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather snapshot */}
            <div className="bg-gradient-to-br from-amber-100 via-white to-rose-100 p-6 flex flex-col gap-3 border-l border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="text-amber-600" size={22} />
                  <p className="text-sm font-semibold text-slate-800">Weather snapshot</p>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-white text-amber-700 font-semibold border border-amber-200">
                  {selectedRegion || 'All regions'}
                </span>
              </div>

              {weatherLoading ? (
                <div className="flex items-center gap-3 text-amber-700 text-sm">
                  <Loader size={16} className="animate-spin" /> Fetching weather…
                </div>
              ) : weather ? (
                <div className="rounded-2xl bg-white/80 border border-white shadow-sm p-4 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{Math.round(weather.temperature)}°C</span>
                    <span className="text-slate-500 text-sm">{weather.description}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Wind size={16} className="text-amber-600" />
                      {Math.round(weather.windspeed)} km/h
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer size={16} className="text-amber-600" />
                      Updated {new Date(weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Live data from Open‑Meteo. Refreshes when you change region.</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/80 border border-white shadow-sm p-4 text-sm text-amber-700">
                  {weatherError || 'Weather unavailable for this region.'}
                </div>
              )}

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900 flex items-start gap-3">
                <Send size={16} className="mt-0.5 text-amber-700" />
                <div>
                  SMS & WhatsApp delivery uses your verified number in profile. Twilio/WhatsApp needs backend keys — ask your admin to enable.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info banner (API fallback note) */}
        {error && (
          <div className="backdrop-blur-xl bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-amber-100/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-amber-900">Using demo alerts</p>
              <p className="text-amber-800 text-sm">{error}</p>
              <p className="text-amber-700 text-xs mt-1">Hook your backend API to remove this notice and deliver live alerts.</p>
            </div>
          </div>
        )}

        {/* Region filter & actions */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-lg p-6 md:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Regions</p>
                <p className="text-lg font-semibold text-slate-900">Filter by location to personalize alerts</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-50 border">Live weather</span>
              <span className="px-3 py-1 rounded-full bg-slate-50 border">Google Maps</span>
              <span className="px-3 py-1 rounded-full bg-slate-50 border">Email & SMS*</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {regions.map((region) => {
              const isActive = (region === 'All' && selectedRegion === '') || selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region === 'All' ? '' : region)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-200'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts content */}
        {festivals.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl p-14 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full animate-pulse" />
              <Bell size={44} className="absolute inset-0 m-auto text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">No festivals found</p>
              <p className="text-slate-500 max-w-md mx-auto">
                Try another region or come back later. We will keep your alerts ready.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-left text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600 mb-1">Iconic festivals</p>
                <p>Holi (Mar), Diwali (Oct-Nov), Durga Puja (Oct), Hornbill (Dec), Rann Utsav (Dec-Feb), Onam (Aug-Sep).</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600 mb-1">Culture trails</p>
                <p>Old Delhi & Varanasi ghats; Pink City Jaipur; Kolkata art walk; Fort Kochi & Kathakali; Goa Latin quarters.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600 mb-1">Best months to explore</p>
                <p>Oct-Mar for forts and heritage (Rajasthan, Delhi, Agra). Apr-Jun for Himalaya retreats. Dec for Nagaland & Kutch.</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Tip: switch region chips above to see upcoming alerts.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {[{
              title: 'Live this month',
              subtitle: 'Happening right now — perfect for spontaneous plans',
              key: 'current' as const,
              gradient: 'from-emerald-500 to-teal-500',
            }, {
              title: 'Next month (plan ahead)',
              subtitle: 'Lock stays and travel before prices spike',
              key: 'upcoming' as const,
              gradient: 'from-amber-500 to-rose-500',
            }, {
              title: 'Last month recaps',
              subtitle: 'Highlights to inspire your next trip',
              key: 'past' as const,
              gradient: 'from-slate-500 to-slate-700',
            }].map((section) => {
              const list = groupedFestivals[section.key];
              const isExpanded = expandedSections[section.key];

              return (
                <div
                  key={section.key}
                  className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full p-6 md:p-7 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-md`}>
                        <Calendar size={22} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{section.title}</p>
                        <p className="text-sm text-slate-500">{section.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {list.length} {list.length === 1 ? 'festival' : 'festivals'}
                      </span>
                      {isExpanded ? <ChevronUp size={22} className="text-slate-400" /> : <ChevronDown size={22} className="text-slate-400" />}
                    </div>
                  </button>

                  <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 md:p-7 space-y-6">
                      {list.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-slate-500">
                          <Bell size={30} className="mx-auto mb-3 text-slate-300" />
                          No festivals in this window
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {list.map((festival) => {
                            const isSubscribed = subscribedFestivals.includes(festival._id);
                            const mapQuery = encodeURIComponent(festival.region || festival.name);
                            const formattedDate = new Date(festival.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            });

                            return (
                              <div
                                key={festival._id}
                                className="bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                              >
                                <div className="grid md:grid-cols-10">
                                  <div className="md:col-span-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0 z-10" />
                                    <iframe
                                      title={`Map of ${festival.name}`}
                                      src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                      loading="lazy"
                                      className="w-full h-64 md:h-80 lg:h-96"
                                      referrerPolicy="no-referrer-when-downgrade"
                                    />
                                    <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-slate-800 text-xs font-semibold border border-slate-200">
                                      <Bell size={14} className="text-amber-600" /> Travel alert
                                    </div>
                                  </div>

                                  <div className="md:col-span-4 p-6 bg-slate-50/70 flex flex-col justify-between gap-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-600">{festival.region}</p>
                                          <h3 className="text-xl font-bold text-slate-900 leading-snug">{festival.name}</h3>
                                        </div>
                                        {section.key === 'current' && (
                                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Live</span>
                                        )}
                                      </div>

                                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{festival.description}</p>

                                      <div className="space-y-2 text-sm text-slate-700">
                                        <div className="flex items-center gap-2">
                                          <MapPin size={16} className="text-amber-600" />
                                          {festival.region}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar size={16} className="text-amber-600" />
                                          {formattedDate}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                      <button
                                        onClick={() => {
                                          if (isSubscribed) {
                                            handleUnsubscribe(festival);
                                          } else {
                                            handleSubscribe(festival);
                                          }
                                        }}
                                        className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow ${
                                          isSubscribed
                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                            : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                                        }`}
                                      >
                                        {isSubscribed ? <CheckCircle2 size={16} /> : <Bell size={16} className="animate-pulse" />}
                                        {isSubscribed ? 'Subscribed' : 'Subscribe for alerts'}
                                      </button>

                                      <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <MessageCircle size={14} className="text-amber-600" />
                                        SMS/WhatsApp delivery requires phone verification (Profile → Phone). Backend Twilio key needed.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SMS + Ops card */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
            <PhoneCall size={20} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-lg font-semibold text-slate-900">Enable SMS / WhatsApp alerts</p>
            <p className="text-sm text-slate-600">Add and verify your phone number in your profile. Your backend needs a Twilio/WhatsApp key to dispatch messages after subscription.</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm font-semibold shadow hover:shadow-md"
          >
            Go to profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FestivalAlerts;
