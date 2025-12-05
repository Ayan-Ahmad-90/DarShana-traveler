import {
  Activity,
  AlertCircle,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Layers3,
  MenuSquare,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: MenuSquare, target: 'section-dashboard' },
  { label: 'Guides', icon: Users, target: 'section-guides' },
  { label: 'Bookings', icon: BookOpenCheck, target: 'section-bookings' },
  { label: 'Payments', icon: Wallet, target: 'section-payments' },
  { label: 'Messaging', icon: MessageCircle, target: 'section-messaging' },
  { label: 'Reviews & Reports', icon: Layers3, target: 'section-reviews' },
  { label: 'Settings', icon: ShieldCheck, target: 'section-settings' }
];

type Kpi = { label: string; primary: string; secondary: string; delta?: string };
type StatusChip = { label: string; value: number; tone: string };
type GuideRow = { name: string; region: string; tags: string[]; docs: string; verification: string; status: string };
type BookingRow = { code: string; user: string; guide: string; category?: string; destination: string; date: string; status: string; payment: string };
type PaymentRow = { id: string; amount: string; person: string; type: string; gateway: string; status: string; mode: string };
type DestinationStat = { label: string; value: number };
type Coordinates = { lat: number; lon: number; label: string };
type LiveWeather = { label: string; tempC: number; wind: number; description: string; time: string; error?: string };

type DashboardData = {
  kpis: Kpi[];
  statusChips: StatusChip[];
  guides: GuideRow[];
  bookings: BookingRow[];
  payments: PaymentRow[];
  destinations: DestinationStat[];
  chartBars: number[];
};

const AdminDashboard: React.FC = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    kpis: [],
    statusChips: [],
    guides: [],
    bookings: [],
    payments: [],
    destinations: [],
    chartBars: [],
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [activeSection, setActiveSection] = useState('section-dashboard');
  const [userLocation, setUserLocation] = useState<Coordinates>({ lat: 28.6139, lon: 77.2090, label: 'Traveler (User)' });
  const [guideLocation, setGuideLocation] = useState<Coordinates>({ lat: 19.0760, lon: 72.8777, label: 'Local Guide' });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapQueryUser, setMapQueryUser] = useState('');
  const [mapQueryGuide, setMapQueryGuide] = useState('');
  const [weatherPair, setWeatherPair] = useState<{ user?: LiveWeather; guide?: LiveWeather }>({});
  const [banner, setBanner] = useState<{ title: string; body: string } | null>(null);
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const savedFlag = localStorage.getItem('adminSession');
    if (savedFlag === 'true') setIsAuthed(true);
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthed) {
      fetchDashboard();
      hydrateLocations();
    }
  }, [isAuthed]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const hydrateLocations = async () => {
    setLocationLoading(true);
    setLocationError('');

    try {
      const res = await fetch('/api/admin/locations');
      if (res.ok) {
        const payload = await res.json();
        if (payload?.user?.lat && payload?.user?.lon) {
          setUserLocation({ lat: payload.user.lat, lon: payload.user.lon, label: payload.user.label || 'Traveler (User)' });
        }
        if (payload?.guide?.lat && payload?.guide?.lon) {
          setGuideLocation({ lat: payload.guide.lat, lon: payload.guide.lon, label: payload.guide.label || 'Local Guide' });
        }
      }
    } catch (err) {
      setLocationError('Live locations unavailable; using defaults.');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation((prev) => ({ ...prev, lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'You (GPS)' }));
        },
        () => {
          // keep existing default if blocked
        }
      );
    }

    setLocationLoading(false);
  };

  useEffect(() => {
    setMapQueryUser(`${userLocation.lat}, ${userLocation.lon}`);
  }, [userLocation]);

  useEffect(() => {
    setMapQueryGuide(`${guideLocation.lat}, ${guideLocation.lon}`);
  }, [guideLocation]);

  const showBanner = (title: string, body: string) => {
    setBanner({ title, body });
    setTimeout(() => setBanner(null), 3200);
  };

  const openModal = (title: string, body: string) => setModal({ title, body });

  const downloadPaymentsReport = () => {
    const rows = [
      ['id', 'amount', 'person', 'type', 'gateway', 'status', 'mode'],
      ...data.payments.map((p) => [p.id, p.amount, p.person, p.type, p.gateway, p.status, p.mode]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payments-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    showBanner('Report download', 'Payments report CSV generated.');
  };

  useEffect(() => {
    if (!userLocation || !guideLocation) return;

    const fetchWeather = async (coords: Coordinates, label: string): Promise<LiveWeather> => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        const current = data?.current_weather;
        if (!current) throw new Error('No weather');
        return {
          label,
          tempC: current.temperature,
          wind: current.windspeed,
          description: 'Live weather',
          time: current.time,
        };
      } catch (err) {
        return { label, tempC: 0, wind: 0, description: 'Weather unavailable', time: new Date().toISOString(), error: 'Unable to load weather' };
      }
    };

    const load = async () => {
      const [userWx, guideWx] = await Promise.all([
        fetchWeather(userLocation, userLocation.label),
        fetchWeather(guideLocation, guideLocation.label),
      ]);
      setWeatherPair({ user: userWx, guide: guideWx });
    };

    load();
  }, [userLocation, guideLocation]);

  const notifyFailedLogin = async (attemptedEmail: string) => {
    try {
      await fetch('/api/admin/security/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptedEmail, at: new Date().toISOString() }),
      });
    } catch (err) {
      // swallow notify errors
    }
  };

  const fetchDashboard = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const payload = await res.json();
      setData({
        kpis: payload.kpis || [],
        statusChips: payload.statusChips || [],
        guides: payload.guides || [],
        bookings: payload.bookings || [],
        payments: payload.payments || [],
        destinations: payload.destinations || [],
        chartBars: payload.chartBars || [],
      });
    } catch (err: any) {
      setDataError(err?.message || 'Dashboard unavailable.');
      setData({
        kpis: [],
        statusChips: [],
        guides: [],
        bookings: [],
        payments: [],
        destinations: [],
        chartBars: [],
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    try {
      // Attempt backend auth if available
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        localStorage.setItem('adminSession', 'true');
        setIsAuthed(true);
        return;
      }

      setAuthError('Invalid credentials. Only authorized admin account can access.');
      notifyFailedLogin(email);
    } catch (err) {
      setAuthError('Login failed. Please try again.');
      notifyFailedLogin(email);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthed(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        Checking admin session...
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Admin Access</p>
            <h1 className="text-2xl font-semibold text-slate-900">Secure Login</h1>
            <p className="text-sm text-slate-500">Enter your admin email and password to open the dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
                required
              />
            </div>
            {authError && <p className="text-sm text-rose-600">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 text-white py-2.5 font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-slate-500">Tip: Hook this form to your real admin auth API. Alerts for invalid attempts are sent via /api/admin/security/notify.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {banner && (
          <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-emerald-700">{banner.title}</p>
            <p className="text-xs text-slate-600">{banner.body}</p>
          </div>
        )}
        {modal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{modal.title}</h3>
                <button className="text-slate-500 hover:text-slate-700" onClick={() => setModal(null)}>Close</button>
              </div>
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{modal.body}</p>
              <div className="mt-5 flex justify-end gap-2 text-sm font-semibold">
                <button className="rounded-xl border border-slate-200 px-3 py-2" onClick={() => setModal(null)}>Close</button>
                <button className="rounded-xl bg-blue-600 px-3 py-2 text-white" onClick={() => { showBanner('Action noted', modal.title); setModal(null); }}>OK</button>
              </div>
            </div>
          </div>
        )}

        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold">
              DT
            </div>
            <div>
              <p className="text-sm text-slate-500">DarShana Admin</p>
              <p className="text-lg font-semibold">Travel Ops Studio</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.target;
              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.target)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="px-4 pb-6 space-y-2">
            {data.statusChips.map((chip) => (
              <div key={chip.label} className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${chip.tone}`}>
                <span>{chip.label}</span>
                <span className="text-base">{chip.value}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <header id="section-dashboard" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Admin overview</p>
              <h1 className="text-3xl font-semibold">Operations Command Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => openModal('Switch environment', 'Hook this to your environment picker (prod/stage/dev).')}
              >
                Switch Env
              </button>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => openModal('Manual booking', 'Open the booking form to create a manual trip and assign a guide.')}
              >
                Manual Booking
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200"
                onClick={() => openModal('Broadcast alert', 'Launch a broadcast (email/SMS/push) to travelers or guides.')}
              >
                Broadcast Alert
              </button>
              <button onClick={handleLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-rose-500 hover:text-rose-600">
                Logout
              </button>
            </div>
          </header>

          {dataError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle size={18} className="text-amber-500" />
              <span>{dataError}</span>
            </div>
          )}

          <section className="mt-6 grid gap-4 lg:grid-cols-3" id="section-map">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live map</p>
                  <h3 className="text-lg font-semibold">Traveler vs Guide</h3>
                </div>
                {locationLoading && <span className="text-xs text-slate-500">Detecting locations…</span>}
              </div>
              {locationError && <p className="mt-2 text-xs text-amber-600">{locationError}</p>}
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
                    <span>{userLocation.label}</span>
                    <span className="text-slate-500">{userLocation.lat.toFixed(3)}, {userLocation.lon.toFixed(3)}</span>
                  </div>
                  <iframe
                    title={`Map of ${userLocation.label}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQueryUser)}&output=embed`}
                    className="h-64 w-full border-t border-slate-100"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
                    <span>{guideLocation.label}</span>
                    <span className="text-slate-500">{guideLocation.lat.toFixed(3)}, {guideLocation.lon.toFixed(3)}</span>
                  </div>
                  <iframe
                    title={`Map of ${guideLocation.label}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQueryGuide)}&output=embed`}
                    className="h-64 w-full border-t border-slate-100"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">Click nav tabs to jump</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">GPS auto-detects user when allowed</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">Guide location uses latest backend ping</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Weather</h3>
                <span className="text-xs text-slate-500">Open-Meteo</span>
              </div>
              <div className="space-y-3">
                {['user', 'guide'].map((key) => {
                  const wx = (weatherPair as any)[key] as LiveWeather | undefined;
                  if (!wx) return (
                    <div key={key} className="rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-500">Loading {key} weather…</div>
                  );
                  return (
                    <div key={key} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{wx.label}</span>
                        <span className="text-xs text-slate-500">{new Date(wx.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-2xl font-bold">{Math.round(wx.tempC)}°C</span>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>{wx.description}</p>
                          <p>Wind {Math.round(wx.wind)} km/h</p>
                          {wx.error && <p className="text-amber-600">{wx.error}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dataLoading && data.kpis.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full">Loading KPIs…</p>
            )}
            {data.kpis.length === 0 && !dataLoading && (
              <p className="text-sm text-slate-500 col-span-full">No KPI data yet.</p>
            )}
            {data.kpis.map((card) => (
              <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{card.primary}</p>
                <p className="mt-1 text-sm text-slate-500">{card.secondary}</p>
                {card.delta && <p className="mt-3 text-xs font-semibold text-emerald-600">{card.delta}</p>}
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Daily Bookings Trend</h3>
                <span className="text-xs text-slate-500">Last 7 days</span>
              </div>
              {data.chartBars.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No chart data yet.</p>
              ) : (
                <div className="mt-6 flex items-end gap-3">
                  {data.chartBars.map((bar, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-full bg-blue-50 p-1 text-center text-[10px] text-blue-600">{bar}</div>
                      <div className="w-full rounded-full bg-gradient-to-t from-blue-100 to-blue-500" style={{ height: `${bar * 1.2}px` }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Most Booked Destinations</h3>
                <Globe2 className="h-5 w-5 text-blue-500" />
              </div>
              {data.destinations.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No destination data.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.destinations.map((dest) => (
                    <div key={dest.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dest.label}</span>
                        <span className="text-slate-500">{dest.value}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${dest.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section id="section-guides" className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Guide Registration Queue</h3>
                <span className="text-xs text-amber-500">Avg approval 14h</span>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {data.guides.length === 0 && <p className="text-sm text-slate-500 py-4">No guide applications yet.</p>}
                {data.guides.map((guide) => (
                  <div key={guide.name} className="py-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{guide.name}</p>
                      <span className="text-xs font-semibold text-amber-600">{guide.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">{guide.region}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {guide.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{guide.docs} • {guide.verification}</p>
                    <div className="mt-3 flex gap-3 text-xs font-semibold">
                      <button
                        className="rounded-lg border border-emerald-600 px-3 py-1 text-emerald-600"
                        onClick={() => showBanner('Guide approved', `${guide.name} marked approved.`)}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-lg border border-rose-200 px-3 py-1 text-rose-500"
                        onClick={() => showBanner('Guide rejected', `${guide.name} moved to rejected.`)}
                      >
                        Reject
                      </button>
                      <button
                        className="rounded-lg border border-amber-200 px-3 py-1 text-amber-600"
                        onClick={() => openModal('Request documents', `Ask ${guide.name} for missing docs.`)}
                      >
                        Request Docs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Gateway Health</h3>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                  <p className="text-xs text-slate-500">Stripe Success</p>
                  <p className="text-2xl font-semibold">96.4%</p>
                  <p className="text-xs text-emerald-600">+1.2% vs avg</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50 to-white p-4">
                  <p className="text-xs text-slate-500">Razorpay Success</p>
                  <p className="text-2xl font-semibold">97.9%</p>
                  <p className="text-xs text-emerald-600">+0.4% vs avg</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
                <p className="font-semibold">Failed payment retry queue</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  <li>• 6 card declines awaiting OTP follow-up</li>
                  <li>• 3 UPI pending approvals</li>
                  <li>• 1 NetBanking session expired</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="section-bookings" className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bookings Management</h3>
                <button className="text-xs font-semibold text-blue-600" onClick={() => openModal('View all bookings', 'Navigate to the bookings list to manage assignments, payments, and documents.')}>View All</button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-2">Booking</th>
                      <th>User</th>
                      <th>Guide</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.bookings.length === 0 && <p className="text-sm text-slate-500 py-3">No bookings to show.</p>}
                    {data.bookings.map((row) => (
                      <tr key={row.code} className="text-sm">
                        <td className="py-3 font-semibold">{row.code}</td>
                        <td>{row.user}</td>
                        <td>{row.guide}</td>
                        <td>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {row.payment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="section-payments" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payments & Wallet</h3>
                <button className="text-xs font-semibold text-blue-600" onClick={downloadPaymentsReport}>Download report</button>
              </div>
              <div className="mt-4 space-y-4">
                {data.payments.length === 0 && <p className="text-sm text-slate-500">No payments yet.</p>}
                {data.payments.map((payment) => (
                  <div key={payment.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold">{payment.id}</p>
                      <span className="text-slate-500">{payment.gateway}</span>
                    </div>
                    <p className="text-xs text-slate-400">{payment.type}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-600">{payment.amount}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{payment.person}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{payment.mode}</span>
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${payment.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="section-messaging" className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Messaging Center</h3>
                <button className="text-xs font-semibold text-blue-600" onClick={() => openModal('Compose broadcast', 'Open the messaging composer to send email/SMS/push to your cohorts.')}>Compose</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3 text-xs">
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50 to-white p-4">
                  <p className="text-slate-500">Email queue</p>
                  <p className="text-2xl font-semibold">1,294</p>
                  <p className="text-emerald-600">98.6% delivered</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                  <p className="text-slate-500">SMS queue</p>
                  <p className="text-2xl font-semibold">842</p>
                  <p className="text-amber-600">12 retry awaiting DLT</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-white p-4">
                  <p className="text-slate-500">Push queue</p>
                  <p className="text-2xl font-semibold">3,210</p>
                  <p className="text-emerald-600">All realtime</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Broadcast templates</span>
                  <button className="text-xs font-semibold text-blue-600" onClick={() => openModal('Manage templates', 'Navigate to template manager for payment reminder, festival announcement, and approval notices.')}>Manage</button>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Payment reminder – ready</li>
                  <li>• Festival announcement – scheduled</li>
                  <li>• Guide approval notice – auto</li>
                </ul>
              </div>
            </div>

            <div id="section-reviews" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Reviews & Reports</h3>
                <button className="text-xs font-semibold text-blue-600" onClick={() => openModal('Export reports', 'Trigger export of ratings, complaints, and audit trail reports.')}>Export</button>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Avg guide rating</p>
                  <p className="text-2xl font-semibold">4.82</p>
                  <p className="text-xs text-emerald-600">+0.12 vs last month</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Complaint resolution stats</p>
                  <div className="flex gap-3 text-xs">
                    <div className="flex-1 rounded-lg bg-emerald-50 p-3">
                      <p className="text-slate-500">Resolved</p>
                      <p className="text-lg font-semibold">92%</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-amber-50 p-3">
                      <p className="text-slate-500">SLA risk</p>
                      <p className="text-lg font-semibold">8%</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold">Reports ready</p>
                  <p>• Daily revenue snapshot</p>
                  <p>• Monthly guide performance</p>
                  <p>• Security & audit trail</p>
                </div>
              </div>
            </div>
          </section>

          <section id="section-settings" className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Settings</h3>
                <button className="text-xs font-semibold text-blue-600" onClick={() => openModal('Open settings', 'Deep link to feature flags, destinations, roles, and backups.')}>Open settings</button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-slate-500">Feature flags</p>
                  <p className="mt-1 text-lg font-semibold">7 active</p>
                  <p className="text-emerald-600">All stable</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-slate-500">Allowed destinations</p>
                  <p className="mt-1 text-lg font-semibold">92 cities</p>
                  <p className="text-slate-500">PAN India</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-slate-500">Roles & permissions</p>
                  <p className="mt-1 text-lg font-semibold">3 admin roles</p>
                  <p className="text-amber-600">2 pending invites</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-slate-500">Backups</p>
                  <p className="mt-1 text-lg font-semibold">Last run 2h ago</p>
                  <p className="text-emerald-600">Auto restore ready</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Security & Access Control</h3>
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">JWT + HttpOnly cookies</p>
                  <p className="text-lg font-semibold">Active</p>
                  <p className="text-xs text-emerald-600">2FA enforced for Super Admin</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 text-xs text-slate-600">
                  <p className="font-semibold">Activity logs</p>
                  <p>• 38 admin decisions recorded today</p>
                  <p>• 0 suspicious logins</p>
                  <p>• Audit trail export ready</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="w-full border-l border-slate-200 bg-white/90 backdrop-blur px-5 py-6 lg:w-80">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
              <p className="text-sm text-blue-100">Ops Center</p>
              <h2 className="mt-2 text-2xl font-semibold">Live Operations</h2>
              <p className="mt-2 text-xs text-blue-100">Queue summary · Webhooks · Messaging health</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Queue Summary</h3>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Guides waiting</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bookings pending docs</span>
                  <span className="font-semibold">11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refund approvals</span>
                  <span className="font-semibold">7</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Payment Webhooks</h3>
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Stripe · BK-98314 captured
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Razorpay · BK-98277 retry scheduled
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Razorpay · Guide settlement released
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Messaging Queue</h3>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-xs text-slate-500">Email 98.6% · SMS 94.4% · Push 100%</p>
              <div className="mt-2 text-xs">
                <p className="text-emerald-600">• No delivery failures</p>
                <p className="text-amber-600">• 12 SMS pending DLT release</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Admin Notifications</h3>
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li>• Guide Rhea submitted docs</li>
                <li>• Booking BK-98255 marked completed</li>
                <li>• Refund request RF-221 escalated</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2 text-xs font-semibold">
              <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
              <button
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => showBanner('Approve next guide', 'Pulled next pending guide for approval flow.')}
              >
                Approve next guide <ChevronRight size={14} />
              </button>
              <button
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => showBanner('Payment settlement triggered', 'Queued settlement job for pending payouts.')}
              >
                Trigger payment settlement <ChevronRight size={14} />
              </button>
              <button
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover-border-blue-500 hover:text-blue-600"
                onClick={() => openModal('Broadcast reminder', 'Send reminder to travelers or guides for upcoming trips.')}
              >
                Broadcast reminder <ChevronRight size={14} />
              </button>
              <button
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => showBanner('Ticket escalated', 'Escalated the oldest SLA-risk support ticket.')}
              >
                Escalate support ticket <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
