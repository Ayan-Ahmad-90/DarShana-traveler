import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, Plane, Train, Bus, Car, Loader2, AlertCircle, Bike } from 'lucide-react';
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

interface RouteResponse {
  from: string;
  to: string;
  distance: number;
  durationMinutes: number;
  options: RouteOption[];
  summary?: any;
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

const useMouseTilt = (ref: React.RefObject<HTMLDivElement | null>, enabled = true) => {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ry = ((e.clientX - cx) / (r.width / 2)) * 6;
      const rx = -((e.clientY - cy) / (r.height / 2)) * 6;
      setRot({ x: rx, y: ry });
    };
    const onLeave = () => setRot({ x: 0, y: 0 });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, enabled]);
  return rot;
};

const SustainableFixed: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [searchingField, setSearchingField] = useState<'from' | 'to' | null>(null);
  const refRoot = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(async (field: 'from' | 'to', value: string) => {
    setSearchingField(field);
    const q = value.trim();
    if (!q) {
      field === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
      setSearchingField(null);
      return;
    }
    try {
      const res = await searchLocations(q);
      field === 'from' ? setFromSuggestions(res) : setToSuggestions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingField(null);
    }
  }, []);

  useEffect(() => {
    if (activeField !== 'from') return;
    const t = window.setTimeout(() => runSearch('from', from), 250);
    return () => clearTimeout(t);
  }, [from, activeField, runSearch]);

  useEffect(() => {
    if (activeField !== 'to') return;
    const t = window.setTimeout(() => runSearch('to', to), 250);
    return () => clearTimeout(t);
  }, [to, activeField, runSearch]);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return setError('Enter both origin and destination');
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(API_ENDPOINTS.ROUTES, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: from.trim(), to: to.trim() }) });
      if (!r.ok) throw new Error(r.statusText);
      const j = await r.json();
      setRouteData(j.data || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={18} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={18} />;
    if (m.includes('bus')) return <Bus size={18} />;
    if (m.includes('bike')) return <Bike size={18} />;
    return <Car size={18} />;
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-4xl mx-auto p-6" ref={refRoot}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-200 rounded"><Leaf size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold">Green Route Planner</h2>
            <p className="text-sm text-slate-600">Sustainable route comparisons</p>
          </div>
        </div>

        <form onSubmit={handlePlan} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold">Origin</label>
            <input value={from} onChange={(e) => setFrom(e.target.value)} onFocus={() => setActiveField('from')} className="mt-1 input input-bordered w-full" />
            {activeField === 'from' && (
              <div className="mt-1 bg-white border rounded shadow-sm">
                {searchingField === 'from' && <div className="px-3 py-2 text-sm">Searching...</div>}
                {fromSuggestions.map(s => (
                  <button key={s.id} type="button" onMouseDown={(e) => { e.preventDefault(); setFrom(s.value); setActiveField(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50">{formatLocationLabel(s)}</button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold">Destination</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} onFocus={() => setActiveField('to')} className="mt-1 input input-bordered w-full" />
            {activeField === 'to' && (
              <div className="mt-1 bg-white border rounded shadow-sm">
                {searchingField === 'to' && <div className="px-3 py-2 text-sm">Searching...</div>}
                {toSuggestions.map(s => (
                  <button key={s.id} type="button" onMouseDown={(e) => { e.preventDefault(); setTo(s.value); setActiveField(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-50">{formatLocationLabel(s)}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end">
            <button type="submit" className="ml-auto btn btn-primary" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Calculate Impact'}</button>
          </div>
        </form>

        {error && <div className="p-3 rounded bg-red-50 text-red-700 mb-4 flex items-center gap-2"><AlertCircle />{error}</div>}

        {routeData && routeData.options && (
          <div className="grid md:grid-cols-2 gap-4">
            {routeData.options.map((opt, i) => (
              <div key={i} className="border rounded p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded">{getIcon(opt.mode)}</div>
                    <div>
                      <div className="font-semibold">{opt.mode}</div>
                      <div className="text-sm text-slate-600">{opt.time} • {formatDuration(opt.durationMinutes)}</div>
                    </div>
                  </div>
                  <div className="font-bold">₹{Math.round(opt.cost)}</div>
                </div>
                <div className="text-sm text-slate-700 mb-2">CO₂: <span className="font-semibold text-green-600">{formatNumber(opt.co2)} kg</span></div>
                <div className="text-sm text-slate-600">{opt.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SustainableFixed;
