import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Leaf,
  Plane,
  Train,
  Bus,
  Car,
  Loader2,
  AlertCircle,
  MapPin,
  Compass,
  Calendar,
  Users,
  DollarSign,
  Share2,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import { getBackendUrl } from '../config/api';
import { searchLocations, formatLocationLabel } from '../services/locationApi';
import type { LocationSuggestion } from '../services/locationApi';

interface RouteOption {
  mode: string;
  time: string;
  durationMinutes: number;
  distance: number;
  cost: number;
  co2: number;
  greenScore: number;
  rewards: number;
  description: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  weather: WeatherInfo;
}

interface Activity {
  id: string;
  name: string;
  type: string;
  time: string;
  duration: number;
  cost: number;
  location: string;
  notes: string;
}

interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
}

interface TripBudget {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  misc: number;
  total: number;
}

interface TripPlan {
  id: string;
  title: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: TripBudget;
  itinerary: ItineraryDay[];
  transport: string;
  costEstimate: number;
}

const formatDuration = (minutes?: number): string => {
  if (!minutes || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hrs`;
  return `${hours}h ${mins}m`;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.abs(value) < 10 ? (Math.round(value * 10) / 10).toString() : Math.round(value).toString();
};

const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  return formatter.format(Math.round(value));
};

const TripPlanner: React.FC = () => {
  // Search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [activeTab, setActiveTab] = useState<'routes' | 'itinerary' | 'budget' | 'attractions'>('routes');
  
  // Trip data state
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  const plannerRef = useRef<HTMLDivElement>(null);

  const closeSuggestions = () => {
    setActiveField(null);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plannerRef.current && !plannerRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runSearch = useCallback(async (field: 'from' | 'to', value: string) => {
    const query = value.trim();

    if (!query) {
      if (field === 'from') {
        setFromSuggestions([]);
      } else {
        setToSuggestions([]);
      }
      return;
    }

    try {
      const results = await searchLocations(query);
      if (field === 'from') {
        setFromSuggestions(results);
      } else {
        setToSuggestions(results);
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  }, []);

  useEffect(() => {
    if (activeField !== 'from') return;
    const handle = window.setTimeout(() => runSearch('from', from), 250);
    return () => window.clearTimeout(handle);
  }, [from, activeField, runSearch]);

  useEffect(() => {
    if (activeField !== 'to') return;
    const handle = window.setTimeout(() => runSearch('to', to), 250);
    return () => window.clearTimeout(handle);
  }, [to, activeField, runSearch]);

  const handleSelectSuggestion = (field: 'from' | 'to', suggestion: LocationSuggestion) => {
    if (field === 'from') {
      setFrom(suggestion.value);
      setFromSuggestions([]);
    } else {
      setTo(suggestion.value);
      setToSuggestions([]);
    }
    setActiveField(null);
    setError(null);
  };

  const handleSearchTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = from.trim();
    const destination = to.trim();

    if (!origin || !destination || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    closeSuggestions();

    try {
      // Call route API
      const response = await fetch(`${getBackendUrl()}/api/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: origin, to: destination }),
      });

      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();

      if (data.success && data.data) {
        setRouteData(data.data);
        
        // Create trip plan
        const newTrip: TripPlan = {
          id: `trip_${Date.now()}`,
          title: `Trip to ${destination}`,
          from: origin,
          to: destination,
          startDate,
          endDate,
          travelers,
          budget: { accommodation: 0, food: 0, activities: 0, transport: 0, misc: 0, total: 0 },
          itinerary: [],
          transport: 'mixed',
          costEstimate: 50000,
        };
        
        setTripPlan(newTrip);
        setActiveTab('routes');
      } else {
        setError(data.error || 'Failed to fetch routes');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search trip');
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={20} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={20} />;
    if (m.includes('bus')) return <Bus size={20} />;
    if (m.includes('bike')) return <Car size={20} />;
    return <Car size={20} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-2 rounded-full text-white">
              <Compass size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trip Planner</h1>
              <p className="text-slate-300 text-sm">Plan your sustainable journey with ease</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchTrip} className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* From */}
              <div ref={plannerRef} className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">From</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => { setActiveField('from'); runSearch('from', from); }}
                  placeholder="Departure"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
                />
                {activeField === 'from' && fromSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {fromSuggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-teal-50 text-sm"
                        onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion('from', s); }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-teal-600" />
                          {formatLocationLabel(s)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">To</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onFocus={() => { setActiveField('to'); runSearch('to', to); }}
                  placeholder="Destination"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
                />
                {activeField === 'to' && toSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {toSuggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-teal-50 text-sm"
                        onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion('to', s); }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-teal-600" />
                          {formatLocationLabel(s)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Check-in</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Check-out</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
                />
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Travelers</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>)}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-400 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 h-10"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Compass size={18} />}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {tripPlan && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Trip Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{tripPlan.title}</h2>
                <p className="text-slate-600 flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} /> {tripPlan.startDate} to {tripPlan.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} /> {tripPlan.travelers} traveler{tripPlan.travelers > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} /> ₹{formatCurrency(tripPlan.costEstimate)}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Share2 size={18} />Share
                </button>
                <button className="flex-1 md:flex-none bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Download size={18} />Export
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {['routes', 'itinerary', 'budget', 'attractions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab === 'routes' && <Plane size={18} />}
                  {tab === 'itinerary' && <Calendar size={18} />}
                  {tab === 'budget' && <DollarSign size={18} />}
                  {tab === 'attractions' && <Compass size={18} />}
                  <span className="capitalize">{tab}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Routes Tab */}
          {activeTab === 'routes' && routeData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routeData.options?.map((opt: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRoute(opt)}
                  className={`cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-2 ${
                    selectedRoute?.mode === opt.mode ? 'border-teal-500 bg-teal-50/50' : 'border-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full text-teal-700">
                        {getTransportIcon(opt.mode)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{opt.mode}</h3>
                        <p className="text-slate-600 text-sm">{opt.description}</p>
                      </div>
                    </div>
                    {opt.greenScore >= 8 && <Leaf size={24} className="text-emerald-600" />}
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl mb-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Duration</p>
                      <p className="font-bold text-slate-900">{formatDuration(opt.durationMinutes)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Cost</p>
                      <p className="font-bold text-slate-900">₹{formatCurrency(opt.cost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">CO₂</p>
                      <p className="font-bold text-orange-600">{formatNumber(opt.co2)} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden w-24">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-600"
                          style={{ width: `${(opt.greenScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{opt.greenScore.toFixed(1)}/10</span>
                    </div>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Budget Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Accommodation', icon: '🏨', value: 15000, color: 'from-blue-400 to-blue-600' },
                  { label: 'Food', icon: '🍽️', value: 8000, color: 'from-orange-400 to-orange-600' },
                  { label: 'Activities', icon: '🎫', value: 10000, color: 'from-pink-400 to-pink-600' },
                  { label: 'Transport', icon: '🚗', value: 12000, color: 'from-green-400 to-green-600' },
                  { label: 'Misc', icon: '📦', value: 5000, color: 'from-purple-400 to-purple-600' },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white`}>
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="text-xs opacity-90">{item.label}</p>
                    <p className="text-lg font-bold">₹{formatCurrency(item.value)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-slate-900">Total Budget</span>
                  <span className="text-3xl font-bold text-teal-600">₹{formatCurrency(50000)}</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-600" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-slate-600 mt-2">₹{formatCurrency(37500)} spent • ₹{formatCurrency(12500)} remaining</p>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Calendar size={20} className="text-teal-600" />
                      Day {day}
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                      <Plus size={18} /> Add Activity
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2].map((act) => (
                      <div key={act} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏝️</div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">Beach Visit</p>
                          <p className="text-sm text-slate-600">9:00 AM - 12:00 PM</p>
                          <p className="text-xs text-slate-500 mt-1">Free admission • 3 km from hotel</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Attractions Tab */}
          {activeTab === 'attractions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '🏖️ Beach Park', dist: 2, rating: 4.5, cost: 'Free' },
                { name: '🏛️ Local Museum', dist: 3, rating: 4.8, cost: '₹100' },
                { name: '🍜 Food Market', dist: 1.5, rating: 4.6, cost: 'Free' },
                { name: '⛰️ Mountain Trek', dist: 10, rating: 4.7, cost: '₹500' },
                { name: '🎨 Art Gallery', dist: 2.5, rating: 4.4, cost: '₹200' },
                { name: '🌅 Sunset Point', dist: 5, rating: 4.9, cost: 'Free' },
              ].map((attr, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-4xl">
                    {attr.name.split(' ')[0]}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-slate-900">{attr.name}</p>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-slate-600">{attr.dist} km away</span>
                      <span className="text-yellow-500 font-semibold">⭐ {attr.rating}</span>
                    </div>
                    <button className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold transition text-sm">
                      Add to Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Loader2 className="animate-spin text-teal-400 mx-auto mb-4" size={48} />
          <p className="text-white font-semibold">Planning your sustainable journey...</p>
        </div>
      )}

      {/* Initial State */}
      {!tripPlan && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Compass size={64} className="mx-auto mb-6 text-teal-400 opacity-50" />
          <p className="text-white text-lg font-semibold">Start planning your next adventure</p>
          <p className="text-slate-300 mt-2">Fill in the search details above to get started</p>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
