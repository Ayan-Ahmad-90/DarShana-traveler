import React, { useState } from 'react';
import { Leaf, Plane, Train, Bus, Car, Loader2, Gift, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Sustainable: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      setError('Please enter both origin and destination');
      return;
    }
    
    if (from.toLowerCase() === to.toLowerCase()) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteData(null);

    try {
      // Call backend API
      const response = await fetch(API_ENDPOINTS.ROUTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setRouteData(data.data);
      } else {
        setError(data.error || 'Failed to calculate routes');
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to calculate routes';
      const isProductionError = window.location.hostname.includes('vercel.app');
      const helpText = isProductionError 
        ? ' Backend server needs to be deployed. Check DEPLOYMENT.md for setup instructions.'
        : ' Make sure the backend server is running on port 5000.';
      setError(errorMsg + helpText);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={24} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={24} />;
    if (m.includes('bus')) return <Bus size={24} />;
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-10">
        <form onSubmit={handlePlan} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Origin</label>
            <input 
              type="text" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
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
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Destination</label>
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g., Jaipur"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Routes from {routeData.from} to {routeData.to}
          </h2>
          <p className="text-stone-600">
            Distance: <span className="font-semibold">{routeData.distance} km</span>
          </p>
        </div>
      )}

      {/* Results Grid */}
      {routeData && routeData.options && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {routeData.options.map((opt: any, idx: number) => (
            <div key={idx} className={`relative bg-white p-6 rounded-xl shadow-sm border-2 transition hover:shadow-md ${opt.greenScore >= 8 ? 'border-teal-500' : 'border-stone-200'}`}>
              {opt.greenScore >= 8 && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Leaf size={12} /> Eco Choice
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${opt.greenScore >= 8 ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-600'}`}>
                  {getIcon(opt.mode)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{opt.mode}</h3>
                  <p className="text-xs text-stone-500">{opt.time} • ₹{Math.round(opt.cost)}</p>
                </div>
              </div>

              <p className="text-stone-600 text-sm mb-4">{opt.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
                <div>
                    <span className="block text-xs text-stone-500 mb-1">CO₂ Emissions</span>
                    <span className={`font-bold text-lg ${opt.co2 < 50 ? 'text-teal-600' : 'text-orange-600'}`}>
                        {Math.round(opt.co2)} <span className="text-xs text-stone-500 font-normal">kg</span>
                    </span>
                </div>
                <div className="text-right">
                     <span className="block text-xs text-stone-500 mb-1">Reward Points</span>
                     <span className="font-bold text-lg text-orange-600 flex items-center justify-end gap-1">
                         <Gift size={16} /> {Math.round(opt.rewards)}
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