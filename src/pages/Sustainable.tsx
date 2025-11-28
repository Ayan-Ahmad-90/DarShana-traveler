import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Leaf,
  Plane,
  Train,
  Bus,
  Car,
  Loader2,
  Gift,
  AlertCircle,
  ArrowRightLeft,
  MapPin,
  Clock3,
  Sparkles,
  TrendingUp,
  Bike,
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
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

interface RouteSummary {
  distanceKm: number;
  durationMinutes: number;
  source: 'api' | 'cached' | 'calculated';
  emissions: {
    baseline: number;
    best: number;
    savings: number;
    savingsPercentage: number;
  };
  bestMode: RouteOption;
}

interface RouteResponse {
  from: string;
  to: string;
  distance: number;
  durationMinutes: number;
  options: RouteOption[];
  summary?: RouteSummary;
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
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  });
  return formatter.format(Math.round(value));
};

const Sustainable: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [searchingField, setSearchingField] = useState<'from' | 'to' | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

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

    setSearchingField(field);
    try {
      const results = await searchLocations(query);
      if (field === 'from') {
        setFromSuggestions(results);
      } else {
        setToSuggestions(results);
      }
    } catch (searchError) {
      console.error('Location search error:', searchError);
    } finally {
      setSearchingField((current) => (current === field ? null : current));
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

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = from.trim();
    const destination = to.trim();

    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }
    
    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteData(null);
    closeSuggestions();

    try {
      // Call backend API
      const response = await fetch(API_ENDPOINTS.ROUTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: origin, to: destination }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setRouteData(data.data as RouteResponse);
      } else {
        setError(data.error || 'Failed to calculate routes');
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to calculate routes';
      
      // Check if it's a connection refused error
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Connection refused')) {
        setError('⚠️ Backend server is not running. Please check: 1) Backend is started on port 3001, 2) MongoDB connection is configured, 3) API endpoint is accessible.');
      } else {
        const isProductionError = window.location.hostname.includes('vercel.app');
        const helpText = isProductionError 
          ? ' Backend server needs to be deployed. Check DEPLOYMENT.md for setup instructions.'
          : ' Make sure the backend server is running and MongoDB is connected.';
        setError(errorMsg + helpText);
      }
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={24} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={24} />;
    if (m.includes('bus')) return <Bus size={24} />;
    if (m.includes('bike')) return <Bike size={24} />;
    return <Car size={24} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 p-3 rounded-full text-teal-700">
          <Leaf size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Green Route Planner</h1>
          <p className="text-stone-500">Calculate your footprint, earn rewards, and travel sustainably.</p>
        </div>
      </div>

      {/* Search Form */}
      <div ref={plannerRef} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-10">
        <form onSubmit={handlePlan} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Origin</label>
            <input 
              type="text" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => {
                setActiveField('from');
                runSearch('from', from);
              }}
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
            {activeField === 'from' && (
              <div className="absolute z-30 mt-2 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-72 overflow-y-auto">
                {searchingField === 'from' && (
                  <div className="px-4 py-3 text-sm text-stone-500 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Searching...
                  </div>
                )}
                {searchingField !== 'from' && fromSuggestions.length === 0 && from.trim().length > 2 && (
                  <div className="px-4 py-3 text-sm text-stone-500">No matches found</div>
                )}
                {fromSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 flex items-start gap-3"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion('from', suggestion);
                    }}
                  >
                    <span className="mt-0.5 text-teal-600">
                      <MapPin size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-stone-800">{formatLocationLabel(suggestion)}</span>
                      <span className="block text-xs uppercase tracking-wide text-stone-400">{suggestion.type}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-stone-100 hover:bg-teal-100 text-stone-600 hover:text-teal-700 p-3 rounded-full transition border border-stone-200 hover:border-teal-300"
              title="Swap origin and destination"
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Destination</label>
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => {
                setActiveField('to');
                runSearch('to', to);
              }}
              placeholder="e.g., Jaipur"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
            {activeField === 'to' && (
              <div className="absolute z-30 mt-2 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-72 overflow-y-auto">
                {searchingField === 'to' && (
                  <div className="px-4 py-3 text-sm text-stone-500 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Searching...
                  </div>
                )}
                {searchingField !== 'to' && toSuggestions.length === 0 && to.trim().length > 2 && (
                  <div className="px-4 py-3 text-sm text-stone-500">No matches found</div>
                )}
                {toSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 flex items-start gap-3"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion('to', suggestion);
                    }}
                  >
                    <span className="mt-0.5 text-teal-600">
                      <MapPin size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-stone-800">{formatLocationLabel(suggestion)}</span>
                      <span className="block text-xs uppercase tracking-wide text-stone-400">{suggestion.type}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 disabled:bg-stone-400 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md w-full md:w-auto flex items-center justify-center gap-2 h-[50px]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Calculate Impact'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results Header */}
      {routeData && routeData.options && (
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Routes from {routeData.from} to {routeData.to}
            </h2>
            <p className="text-stone-600 flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="flex items-center gap-1"><MapPin size={16} /> {formatNumber(routeData.distance)} km</span>
              <span className="hidden md:inline text-stone-400">•</span>
              <span className="flex items-center gap-1"><Clock3 size={16} /> {formatDuration(routeData.durationMinutes)}</span>
            </p>
          </div>

          {routeData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-white text-teal-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-teal-900">Distance & Duration</p>
                  <p className="text-sm text-teal-700">{formatNumber(routeData.summary.distanceKm)} km</p>
                  <p className="text-xs text-teal-700">{formatDuration(routeData.summary.durationMinutes)} • Source: {routeData.summary.source}</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-white text-emerald-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Emission Savings</p>
                  <p className="text-sm text-emerald-700">Saves {formatNumber(routeData.summary.emissions.savings)} kg CO₂</p>
                  <p className="text-xs text-emerald-700">{formatNumber(routeData.summary.emissions.savingsPercentage)}% lower than baseline ({formatNumber(routeData.summary.emissions.baseline)} → {formatNumber(routeData.summary.emissions.best)} kg)</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-white text-amber-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Best Mode</p>
                  <p className="text-sm text-amber-700">{routeData.summary.bestMode.mode}</p>
                  <p className="text-xs text-amber-700">{formatDuration(routeData.summary.bestMode.durationMinutes)} • ₹{formatCurrency(routeData.summary.bestMode.cost)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Grid */}
      {routeData && routeData.options && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {routeData.options.map((opt: any, idx: number) => (
            <div
              key={idx}
              className={`relative bg-white p-6 rounded-xl shadow-sm border-2 transition hover:shadow-md ${
                routeData.summary?.bestMode?.mode?.toLowerCase() === opt.mode.toLowerCase()
                  ? 'border-amber-400'
                  : opt.greenScore >= 8
                  ? 'border-teal-500'
                  : 'border-stone-200'
              }`}
            >
              {routeData.summary?.bestMode?.mode?.toLowerCase() === opt.mode.toLowerCase() ? (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Sparkles size={12} /> Best Mode
                </div>
              ) : opt.greenScore >= 8 ? (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Leaf size={12} /> Eco Choice
                </div>
              ) : null}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${opt.greenScore >= 8 ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-600'}`}>
                  {getIcon(opt.mode)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{opt.mode}</h3>
                  <p className="text-xs text-stone-500 flex flex-wrap gap-2">
                    <span>{opt.time}</span>
                    <span>• {formatDuration(opt.durationMinutes)}</span>
                    <span>• ₹{formatCurrency(opt.cost)}</span>
                  </p>
                </div>
              </div>

              <p className="text-stone-600 text-sm mb-4">{opt.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
                <div>
                    <span className="block text-xs text-stone-500 mb-1">CO₂ Emissions</span>
                    <span className={`font-bold text-lg ${opt.co2 < 50 ? 'text-teal-600' : 'text-orange-600'}`}>
                        {formatNumber(opt.co2)} <span className="text-xs text-stone-500 font-normal">kg</span>
                    </span>
                </div>
                <div className="text-right">
                     <span className="block text-xs text-stone-500 mb-1">Reward Points</span>
                     <span className="font-bold text-lg text-orange-600 flex items-center justify-end gap-1">
                         <Gift size={16} /> {formatNumber(opt.rewards)}
                     </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-xs text-stone-500">Sustainability Score</span>
                    <div className="flex items-center gap-2">
                         <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${opt.greenScore >= 7 ? 'bg-teal-500' : opt.greenScore >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${(opt.greenScore / 10) * 100}%` }}
                             ></div>
                         </div>
                         <span className="font-bold text-stone-800 text-sm">{opt.greenScore.toFixed(1)}/10</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
          <p className="text-stone-600 font-semibold">Calculating sustainable routes...</p>
        </div>
      )}

      {/* No Results Message */}
      {!loading && !routeData && !error && from && to && (
        <div className="text-center py-12">
          <p className="text-stone-500">Enter locations and click "Calculate Impact" to see available routes</p>
        </div>
      )}
    </div>
  );
};

export default Sustainable;