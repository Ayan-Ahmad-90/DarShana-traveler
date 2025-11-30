import { Heart, Users, Mountain, Compass, Umbrella, Globe2 } from 'lucide-react';

const categories = [
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: Heart, description: 'Kerala retreats, Himalayan yoga domes, Ayurveda doctors on-call.' },
  { id: 'family', label: 'Family Holidays', icon: Users, description: 'Tiger safaris, theme resorts, and heritage walks for every generation.' },
  { id: 'adventure', label: 'Adventure India', icon: Mountain, description: 'Himalayan treks, Northeast caving, Konkan scuba circuits.' },
  { id: 'workcation', label: 'Workcation & Solo', icon: Compass, description: 'Fiber-ready co-living stays across Goa, Rishikesh, Bir.' },
  { id: 'weekend', label: 'Weekend Drives', icon: Umbrella, description: 'Two-night micro itineraries from metro cities.' },
  { id: 'pilgrimage', label: 'Pilgrimage Trails', icon: Globe2, description: 'Char Dham, Jyotirlinga, and Sufi circuits with local experts.' },
];

const TravelCategoriesSection = () => (
  <section id="categories" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Choose your vibe</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Browse by travel categories</h2>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 flex items-start gap-4"
        >
          <div className="rounded-2xl bg-cyan-50 text-[#06b6d4] p-3">
            <category.icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">{category.label}</h3>
            <p className="text-sm text-slate-500">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TravelCategoriesSection;
