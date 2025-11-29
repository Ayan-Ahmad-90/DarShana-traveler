import React from 'react';
import { ArrowRight, Users, Leaf, Map, Star, ShieldCheck, CreditCard, Train, Anchor, Mountain,Home as HomeIcon, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import HighlightSlider from '../components/HighlightSlider';

const destinations = [
  {
    id: '1',
    name: 'Taj Mahal, Agra',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'The epitome of love and architectural magnificence.',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Varanasi Ghats',
    img: 'https://wallpaperaccess.com/full/4459823.jpg',
    desc: 'The spiritual capital of India on the banks of the Ganges.',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Kerala Backwaters',
    img: 'https://img.freepik.com/premium-photo/boat-with-hut-water-with-palm-trees-background_1028782-348284.jpg',
    desc: 'Serene waterways lined with lush palms and houseboats.',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Jaipur Palaces',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'The Pink City known for its royal heritage and colors.',
    rating: 4.7
  }
];

const services = [
  { title: 'Adventure Tours', icon: Mountain, desc: 'Trekking in Himalayas, Rafting in Rishikesh, & Desert Safaris.' },
  { title: 'Luxury Trains', icon: Train, desc: 'Experience royalty on wheels like The Maharajas Express.' },
  { title: 'Cruises', icon: Anchor, desc: 'River cruises on the Brahmaputra and backwater houseboats in Kerala.' },
  { title: 'Villas & Stays', icon: HomeIcon, desc: 'Heritage havelis, eco-resorts, and luxury private villas.' },
  { title: 'Monuments', icon: Camera, desc: 'Guided tours of UNESCO World Heritage sites and ancient temples.' },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Highlight Slider */}
      <HighlightSlider />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80")' }}
        >
          {/* Enhanced gradient overlay: 40% top, fades to 20% bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/30"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-serif mb-2 drop-shadow-xl leading-tight tracking-tight">
              Experience India's Wonders
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto font-light drop-shadow-lg">
              Discover a land of vibrant cultures, spiritual depths, and breathtaking landscapes tailored to your mood.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <Link 
              to="/mood" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 group/btn"
            >
              <span>Find My Vibe</span>
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/festivals" 
              className="bg-white/15 backdrop-blur-md border-2 border-white/40 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/25 hover:border-white/60 transition-all duration-300 shadow-lg hover:scale-105 transform"
            >
              Explore Festivals
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-400/30 transition-all duration-300 group">
            <Users className="w-10 h-10 mx-auto mb-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black">50k+</h3>
            <p className="text-slate-300 text-sm mt-2 font-semibold">Happy Travelers</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
            <Map className="w-10 h-10 mx-auto mb-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black">120+</h3>
            <p className="text-slate-300 text-sm mt-2 font-semibold">Destinations</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-green-400/30 transition-all duration-300 group">
            <Leaf className="w-10 h-10 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black">2.5T</h3>
            <p className="text-slate-300 text-sm mt-2 font-semibold">CO₂ Offset</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 group">
            <Star className="w-10 h-10 mx-auto mb-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black">4.9/5</h3>
            <p className="text-slate-300 text-sm mt-2 font-semibold">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif font-black text-slate-900 mb-4">Top Destinations</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-4 text-lg">Explore the most enchanting places in India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => (
            <div key={dest.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Card Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-1"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Star size={14} className="text-orange-500 fill-orange-500 group-hover:text-white group-hover:fill-white" />
                  {dest.rating}
                </div>
              </div>
              
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{dest.name}</h3>
                <p className="text-slate-600 text-sm mb-5 line-clamp-2">{dest.desc}</p>
                <Link to="/register" className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-2 group/link">
                  Plan Trip <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-black text-slate-900 mb-4">Curated Experiences</h2>
            <p className="text-slate-600 text-lg">Tailored services for every kind of traveler</p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-emerald-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-white/40 hover:border-orange-300 hover:shadow-xl hover:bg-white/90 transition-all duration-500 transform hover:-translate-y-1 text-center flex flex-col items-center">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10"></div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <service.icon className="text-orange-600 group-hover:text-emerald-600 transition-colors" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 group-hover:text-slate-700">{service.desc}</p>
                <Link to="/register" className="mt-auto px-5 py-2.5 border-2 border-orange-400 text-orange-600 font-bold rounded-full text-sm hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 transform hover:scale-105">
                  Plan my trip
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Safety */}
      <section className="py-16 bg-gradient-to-r from-white via-slate-50 to-white border-t-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
              <ShieldCheck size={28} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg">100% Secure Payments</h4>
              <p className="text-xs text-slate-600 font-medium">We use encrypted SSL connections.</p>
            </div>
          </div>
          <div className="flex items-center gap-8 opacity-70 hover:opacity-100 transition-opacity">
             {/* Placeholder icons for cards */}
             <div className="flex gap-2 items-center text-slate-700 font-bold">
                <CreditCard size={32} className="text-orange-500" />
                <span className="text-sm">VISA</span>
             </div>
             <div className="flex gap-2 items-center text-slate-700 font-bold">
                <CreditCard size={32} className="text-blue-500" />
                <span className="text-sm">MasterCard</span>
             </div>
             <div className="flex gap-2 items-center text-slate-700 font-bold">
                <CreditCard size={32} className="text-emerald-500" />
                <span className="text-sm">UPI</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
