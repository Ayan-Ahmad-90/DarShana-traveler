import { Clock, Hotel, Plane, CheckCircle2, XCircle } from 'lucide-react';

type Package = {
  id: string;
  title: string;
  duration: string;
  hotel: string;
  transport: string;
  price: string;
  includes: string[];
  excludes: string[];
  itinerary: string[];
};

const packages: Package[] = [
  {
    id: 'kashmir6',
    title: 'Kashmir Silk Route · 6 days',
    duration: '6 days / 5 nights',
    hotel: 'Boutique houseboats & Srinagar villas',
    transport: 'Flight + dedicated SUV',
    price: '₹82,500 per person',
    includes: ['Breakfast & dinner', 'Shikara cruise', 'Inner line permits'],
    excludes: ['Personal shopping', 'Travel insurance'],
    itinerary: [
      'Day 1: Srinagar arrival, sunset shikara ride on Dal Lake',
      'Day 2: Gulmarg gondola + curated kahwa tasting',
      'Day 3: Sonamarg glacier meadows & picnic',
      'Day 4: Pahalgam valley hike + saffron farm visit',
      'Day 5: Old Srinagar heritage walk & craft studio',
      'Day 6: Leisure morning and airport drop',
    ],
  },
  {
    id: 'kerala7',
    title: 'Kerala Backwater & Wellness · 7 days',
    duration: '7 days / 6 nights',
    hotel: 'Lakefront eco resorts + Ayurveda retreat',
    transport: 'Flight + private cab + houseboat',
    price: '₹74,000 per person',
    includes: ['All meals on houseboat', 'Daily Ayurveda consult', 'Cultural evenings'],
    excludes: ['Flights to Kochi', 'Optional scuba session'],
    itinerary: [
      'Day 1: Kochi fort heritage trail & sunset cruise',
      'Day 2: Munnar tea estates + Kolukkumalai sunrise',
      'Day 3: Spice plantation & Kathakali backstage pass',
      'Day 4: Alleppey premium houseboat sail',
      'Day 5: Kumarakom birding + canoe ride',
      'Day 6: Marari beach Ayurveda sessions',
      'Day 7: Local market walk & departure',
    ],
  },
];

const TourPackagesSection = () => (
  <section id="packages" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Tailored bundles</p>
      <h2 className="text-3xl md:text-4xl font-semibold text-[#0f172a]">Tour packages with clarity</h2>
      <p className="text-slate-500 max-w-3xl mx-auto">
        Every package spells out duration, hotels, transport, inclusions/exclusions, and a day-wise narrative so clients know exactly what to expect.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {packages.map((pkg) => (
        <article key={pkg.id} className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#0f172a]">{pkg.title}</h3>
            <p className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
              <span className="inline-flex items-center gap-2"><Clock size={16} /> {pkg.duration}</span>
              <span className="inline-flex items-center gap-2"><Hotel size={16} /> {pkg.hotel}</span>
              <span className="inline-flex items-center gap-2"><Plane size={16} /> {pkg.transport}</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-[#06b6d4]">{pkg.price}</p>
            <button className="px-4 py-2 rounded-xl border border-[#06b6d4] text-[#06b6d4] font-semibold hover:bg-[#06b6d4]/10">
              View details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="uppercase text-xs text-slate-400 mb-2">Included</p>
              <ul className="space-y-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 size={16} className="text-[#06d6a0]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="uppercase text-xs text-slate-400 mb-2">Excluded</p>
              <ul className="space-y-1">
                {pkg.excludes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600">
                    <XCircle size={16} className="text-rose-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="uppercase text-xs text-slate-400 mb-2">Day-wise itinerary</p>
            <div className="space-y-2 text-sm text-slate-600">
              {pkg.itinerary.map((day) => (
                <p key={day} className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">{day}</p>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default TourPackagesSection;
