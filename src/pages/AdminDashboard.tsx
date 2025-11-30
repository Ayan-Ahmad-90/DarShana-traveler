import React from 'react';
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
  Wallet
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: MenuSquare },
  { label: 'Guides', icon: Users },
  { label: 'Bookings', icon: BookOpenCheck },
  { label: 'Payments', icon: Wallet },
  { label: 'Messaging', icon: MessageCircle },
  { label: 'Reviews & Reports', icon: Layers3 },
  { label: 'Settings', icon: ShieldCheck }
];

const statusChips = [
  { label: 'Pending Guide Approvals', value: 18, tone: 'bg-amber-100 text-amber-700' },
  { label: 'Payment Alerts', value: 5, tone: 'bg-rose-100 text-rose-700' },
  { label: 'Messaging Failures', value: 2, tone: 'bg-blue-100 text-blue-700' }
];

const kpiCards = [
  { label: 'Total Guides', primary: '1,248', secondary: '82 pending', delta: '+4.3% vs last week' },
  { label: 'Bookings Today', primary: '176', secondary: '3,942 this month', delta: '+12% vs last month' },
  { label: 'Revenue', primary: '₹14.2L', secondary: '₹3.1Cr MTD', delta: '+8.1% MoM' },
  { label: 'Pending Refunds', primary: '24', secondary: '₹4.6L value', delta: '4 overdue cases' },
  { label: 'Payment Success', primary: '97.2%', secondary: '1.8% retry queue', delta: '+0.6% vs avg' },
  { label: 'User Growth', primary: '+1,126', secondary: 'in last 7 days', delta: '+18% QoQ' }
];

const guideApplications = [
  {
    name: 'Aditi Sharma',
    region: 'Rajasthan · Jaipur',
    tags: ['Heritage', 'Food Tours'],
    docs: 'ID ✓ · Address ✓ · License —',
    verification: 'Video pending',
    status: 'Pending'
  },
  {
    name: 'Manoj Kulkarni',
    region: 'Maharashtra · Pune',
    tags: ['Trekking', 'Temple Walks'],
    docs: 'All ✓',
    verification: 'Verified',
    status: 'Approved'
  },
  {
    name: 'Rhea Dsouza',
    region: 'Goa · Panjim',
    tags: ['Water Sports', 'Culture'],
    docs: 'ID ✓ · Address — · License ✓',
    verification: 'Docs pending',
    status: 'Needs Info'
  }
];

const bookingRows = [
  {
    code: 'BK-98314',
    user: 'Divya Menon',
    guide: 'S. Pathak',
    category: 'Heritage',
    destination: 'Varanasi',
    date: '30 Nov 2025',
    status: 'Confirmed',
    payment: 'Paid'
  },
  {
    code: 'BK-98277',
    user: 'Rahul Jain',
    guide: 'Aditi Sharma',
    category: 'Food Tour',
    destination: 'Delhi',
    date: '02 Dec 2025',
    status: 'Quote',
    payment: 'Pending'
  },
  {
    code: 'BK-98255',
    user: 'Nisha Roy',
    guide: 'Tsering Norbu',
    category: 'Trekking',
    destination: 'Ladakh',
    date: '12 Dec 2025',
    status: 'In-progress',
    payment: 'Paid'
  }
];

const paymentRows = [
  {
    id: 'RZP_ORDER_895121',
    amount: '₹22,400',
    person: 'Nikhil Rao',
    type: 'Guide booking',
    gateway: 'Razorpay',
    status: 'Success',
    mode: 'UPI'
  },
  {
    id: 'STP_ORDER_774312',
    amount: '₹18,999',
    person: 'Sonal Singh',
    type: 'Trip package',
    gateway: 'Stripe',
    status: 'Failed',
    mode: 'Card'
  },
  {
    id: 'RZP_ORDER_895089',
    amount: '₹9,200',
    person: 'Guide Wallet',
    type: 'Settlement',
    gateway: 'Razorpay',
    status: 'Pending',
    mode: 'Bank'
  }
];

const chartBars = [64, 80, 92, 74, 102, 96, 88];
const destinationChart = [
  { label: 'Jaipur', value: 24 },
  { label: 'Varanasi', value: 19 },
  { label: 'Coorg', value: 15 },
  { label: 'Ladakh', value: 13 },
  { label: 'Goa', value: 11 }
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
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
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="px-4 pb-6 space-y-2">
            {statusChips.map((chip) => (
              <div key={chip.label} className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${chip.tone}`}>
                <span>{chip.label}</span>
                <span className="text-base">{chip.value}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Admin overview</p>
              <h1 className="text-3xl font-semibold">Operations Command Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Switch Env
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Manual Booking
              </button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200">
                Broadcast Alert
              </button>
            </div>
          </header>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kpiCards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{card.primary}</p>
                <p className="mt-1 text-sm text-slate-500">{card.secondary}</p>
                <p className="mt-3 text-xs font-semibold text-emerald-600">{card.delta}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Daily Bookings Trend</h3>
                <span className="text-xs text-slate-500">Last 7 days</span>
              </div>
              <div className="mt-6 flex items-end gap-3">
                {chartBars.map((bar, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-full bg-blue-50 p-1 text-center text-[10px] text-blue-600">{bar}</div>
                    <div className="w-full rounded-full bg-gradient-to-t from-blue-100 to-blue-500" style={{ height: `${bar * 1.2}px` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Most Booked Destinations</h3>
                <Globe2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 space-y-3">
                {destinationChart.map((dest) => (
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
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Guide Registration Queue</h3>
                <span className="text-xs text-amber-500">Avg approval 14h</span>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {guideApplications.map((guide) => (
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
                      <button className="rounded-lg border border-emerald-600 px-3 py-1 text-emerald-600">Approve</button>
                      <button className="rounded-lg border border-rose-200 px-3 py-1 text-rose-500">Reject</button>
                      <button className="rounded-lg border border-amber-200 px-3 py-1 text-amber-600">Request Docs</button>
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

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Bookings Management</h3>
                <button className="text-xs font-semibold text-blue-600">View All</button>
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
                    {bookingRows.map((row) => (
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

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payments & Wallet</h3>
                <button className="text-xs font-semibold text-blue-600">Download report</button>
              </div>
              <div className="mt-4 space-y-4">
                {paymentRows.map((payment) => (
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

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Messaging Center</h3>
                <button className="text-xs font-semibold text-blue-600">Compose</button>
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
                  <button className="text-xs font-semibold text-blue-600">Manage</button>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Payment reminder – ready</li>
                  <li>• Festival announcement – scheduled</li>
                  <li>• Guide approval notice – auto</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Reviews & Reports</h3>
                <button className="text-xs font-semibold text-blue-600">Export</button>
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

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Settings</h3>
                <button className="text-xs font-semibold text-blue-600">Open settings</button>
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
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Approve next guide <ChevronRight size={14} />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Trigger payment settlement <ChevronRight size={14} />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600">
                Broadcast reminder <ChevronRight size={14} />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left text-slate-600 hover:border-blue-500 hover:text-blue-600">
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
