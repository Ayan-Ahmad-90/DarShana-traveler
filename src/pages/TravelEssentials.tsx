import { Award, ChevronRight, Clock, DollarSign, Filter, MapPin, MapPinned, Search, Star, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// TypeScript Interfaces
interface Transport {
  id: string;
  type: 'bus' | 'train' | 'flight' | 'cab' | 'bike';
  from: string;
  to: string;
  price: number;
  timing: string;
  availability: number;
  duration: string;
  rating: number;
  image: string;
  company: string;
  amenities: string[];
  operatorRating: number;
}

interface Stay {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'homestay' | 'budget' | 'luxury';
  price: number;
  rating: number;
  facilities: string[];
  images: string[];
  location: string;
  city: string;
  reviews: number;
  cancellation: string;
  checkIn: string;
  checkOut: string;
  distance?: string;
}

interface LocalFood {
  id: string;
  dishName: string;
  shopName: string;
  city: string;
  priceRange: string;
  rating: number;
  cuisine: string;
  isVeg: boolean;
  reviews: number;
  authenticity: 'Authentic' | 'Modern' | 'Fusion';
  established?: number;
  address?: string;
  phone?: string;
  googleMapsUrl?: string;
  image: string;
}

// Comprehensive Local Food Data with all Indian cities
const localFoodDatabase: LocalFood[] = [
  // Delhi
  { id: 'd1', dishName: 'Chole Bhature', shopName: 'Sitaram Diwan Chand', city: 'Delhi', priceRange: '₹', rating: 4.8, cuisine: 'North Indian', isVeg: true, reviews: 2340, authenticity: 'Authentic', established: 1980, address: 'Old Delhi', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'd2', dishName: 'Butter Chicken', shopName: 'Moti Mahal', city: 'Delhi', priceRange: '₹₹', rating: 4.9, cuisine: 'Mughlai', isVeg: false, reviews: 3200, authenticity: 'Authentic', established: 1947, address: 'Daryaganj', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },
  { id: 'd3', dishName: 'Parathas', shopName: 'Paranthe Wali Gali', city: 'Delhi', priceRange: '₹', rating: 4.7, cuisine: 'North Indian', isVeg: true, reviews: 1890, authenticity: 'Authentic', established: 1886, address: 'Chandni Chowk', image: 'https://images.unsplash.com/photo-1618599810694-b5d8e3c8ceff?w=300' },

  // Agra
  { id: 'a1', dishName: 'Petha', shopName: 'Panchhi Petha', city: 'Agra', priceRange: '₹', rating: 4.6, cuisine: 'Dessert', isVeg: true, reviews: 1200, authenticity: 'Authentic', established: 1960, address: 'Kinari Bazar', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
  { id: 'a2', dishName: 'Mughlai Food', shopName: 'Pinch of Spice', city: 'Agra', priceRange: '₹₹', rating: 4.7, cuisine: 'Mughlai', isVeg: false, reviews: 1540, authenticity: 'Modern', established: 2005, address: 'Taj Ganj', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },

  // Lucknow
  { id: 'l1', dishName: 'Tunday Kabab', shopName: 'Tunday Kababi', city: 'Lucknow', priceRange: '₹₹', rating: 4.8, cuisine: 'Awadhi', isVeg: false, reviews: 2100, authenticity: 'Authentic', established: 1905, address: 'Aminabad', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },
  { id: 'l2', dishName: 'Awadhi Biryani', shopName: 'Idrees Biryani', city: 'Lucknow', priceRange: '₹₹', rating: 4.9, cuisine: 'Awadhi', isVeg: false, reviews: 2540, authenticity: 'Authentic', established: 1945, address: 'Chowk', image: 'https://images.unsplash.com/photo-1612874742237-415baab477b1?w=300' },

  // Varanasi
  { id: 'v1', dishName: 'Kachori Sabzi', shopName: 'Kachori Gali', city: 'Varanasi', priceRange: '₹', rating: 4.7, cuisine: 'North Indian', isVeg: true, reviews: 1450, authenticity: 'Authentic', established: 1920, address: 'Godaulia', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'v2', dishName: 'Banarasi Paan', shopName: 'Keshav Tambul Bhandar', city: 'Varanasi', priceRange: '₹', rating: 4.6, cuisine: 'Street Food', isVeg: true, reviews: 980, authenticity: 'Authentic', established: 1950, address: 'Dashashwamedh Ghat', image: 'https://images.unsplash.com/photo-1599599810694-b5d8e3c8ceff?w=300' },

  // Jaipur
  { id: 'j1', dishName: 'Dal Baati Churma', shopName: 'Chokhi Dhani', city: 'Jaipur', priceRange: '₹₹', rating: 4.8, cuisine: 'Rajasthani', isVeg: true, reviews: 1800, authenticity: 'Authentic', established: 1994, address: 'Tonk Road', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' },
  { id: 'j2', dishName: 'Pyaz Kachori', shopName: 'Rawat Mishthan Bhandar', city: 'Jaipur', priceRange: '₹', rating: 4.7, cuisine: 'Rajasthani', isVeg: true, reviews: 1320, authenticity: 'Authentic', established: 1957, address: 'Bapu Bazar', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },

  // Jodhpur
  { id: 'jo1', dishName: 'Mirchi Vada', shopName: 'Surya Namkeen', city: 'Jodhpur', priceRange: '₹', rating: 4.6, cuisine: 'Rajasthani', isVeg: true, reviews: 890, authenticity: 'Authentic', established: 1970, address: 'Clock Tower', image: 'https://images.unsplash.com/photo-1599599810694-b5d8e3c8ceff?w=300' },
  { id: 'jo2', dishName: 'Makhaniya Lassi', shopName: 'Mishrilal Hotel', city: 'Jodhpur', priceRange: '₹', rating: 4.8, cuisine: 'Dairy', isVeg: true, reviews: 1100, authenticity: 'Authentic', established: 1933, address: 'High Court Road', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },

  // Amritsar
  { id: 'am1', dishName: 'Amritsari Kulcha', shopName: 'Kesar Da Dhaba', city: 'Amritsar', priceRange: '₹', rating: 4.8, cuisine: 'Punjabi', isVeg: true, reviews: 1950, authenticity: 'Authentic', established: 1916, address: 'Near Golden Temple', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'am2', dishName: 'Lassi', shopName: 'Ahuja Milk Bhandar', city: 'Amritsar', priceRange: '₹', rating: 4.7, cuisine: 'Dairy', isVeg: true, reviews: 1340, authenticity: 'Authentic', established: 1895, address: 'Hall Bazaar', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },

  // Kolkata
  { id: 'k1', dishName: 'Rosogolla', shopName: 'Balaram Mullick & Radharaman Mullick', city: 'Kolkata', priceRange: '₹', rating: 4.9, cuisine: 'Bengali', isVeg: true, reviews: 2200, authenticity: 'Authentic', established: 1868, address: 'Bowbazar', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
  { id: 'k2', dishName: 'Kathi Roll', shopName: 'Nizam\'s', city: 'Kolkata', priceRange: '₹', rating: 4.7, cuisine: 'Street Food', isVeg: false, reviews: 1650, authenticity: 'Authentic', established: 1932, address: 'Chitpur Road', image: 'https://images.unsplash.com/photo-1600565193915-f71f6ad2d4be?w=300' },

  // Mumbai
  { id: 'm1', dishName: 'Vada Pav', shopName: 'Ashok Vada Pav', city: 'Mumbai', priceRange: '₹', rating: 4.6, cuisine: 'Marathi', isVeg: true, reviews: 1400, authenticity: 'Authentic', established: 1966, address: 'Dadar', image: 'https://images.unsplash.com/photo-1599599810694-b5d8e3c8ceff?w=300' },
  { id: 'm2', dishName: 'Pav Bhaji', shopName: 'Sardar Pav Bhaji', city: 'Mumbai', priceRange: '₹', rating: 4.7, cuisine: 'Marathi', isVeg: true, reviews: 1520, authenticity: 'Authentic', established: 1980, address: 'Fort', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },

  // Pune
  { id: 'p1', dishName: 'Misal Pav', shopName: 'Katakirr Misal', city: 'Pune', priceRange: '₹', rating: 4.7, cuisine: 'Marathi', isVeg: true, reviews: 1300, authenticity: 'Authentic', established: 2000, address: 'Camp', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'p2', dishName: 'Bhakri-Pithla', shopName: 'Shree Upahar Gruha', city: 'Pune', priceRange: '₹', rating: 4.6, cuisine: 'Marathi', isVeg: true, reviews: 890, authenticity: 'Authentic', established: 1995, address: 'Deccan', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' },

  // Hyderabad
  { id: 'h1', dishName: 'Biryani', shopName: 'Paradise Biryani', city: 'Hyderabad', priceRange: '₹₹', rating: 4.9, cuisine: 'Hyderabadi', isVeg: false, reviews: 2800, authenticity: 'Authentic', established: 1953, address: 'Secunderabad', image: 'https://images.unsplash.com/photo-1612874742237-415baab477b1?w=300' },
  { id: 'h2', dishName: 'Haleem', shopName: 'Pista House', city: 'Hyderabad', priceRange: '₹₹', rating: 4.8, cuisine: 'Hyderabadi', isVeg: false, reviews: 1900, authenticity: 'Authentic', established: 1999, address: 'Secunderabad', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },

  // Chennai
  { id: 'ch1', dishName: 'Dosa', shopName: 'Murugan Idli Shop', city: 'Chennai', priceRange: '₹', rating: 4.8, cuisine: 'South Indian', isVeg: true, reviews: 1700, authenticity: 'Authentic', established: 1965, address: 'T. Nagar', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'ch2', dishName: 'Filter Coffee', shopName: 'Sangeetha Veg Restaurant', city: 'Chennai', priceRange: '₹', rating: 4.7, cuisine: 'South Indian', isVeg: true, reviews: 1280, authenticity: 'Authentic', established: 1985, address: 'Mylapore', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },

  // Indore
  { id: 'i1', dishName: 'Poha Jalebi', shopName: 'Chappan Dukan', city: 'Indore', priceRange: '₹', rating: 4.7, cuisine: 'Malwi', isVeg: true, reviews: 1100, authenticity: 'Authentic', established: 1985, address: 'Chappan Dukan Street', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'i2', dishName: 'Bhutte ka Kees', shopName: 'Guru Kripa', city: 'Indore', priceRange: '₹', rating: 4.6, cuisine: 'Malwi', isVeg: true, reviews: 890, authenticity: 'Authentic', established: 1992, address: 'Rajwada', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' },

  // Ahmedabad
  { id: 'ah1', dishName: 'Dhokla', shopName: 'Iscon Thal', city: 'Ahmedabad', priceRange: '₹', rating: 4.8, cuisine: 'Gujarati', isVeg: true, reviews: 1450, authenticity: 'Authentic', established: 1993, address: 'Vastrapur', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'ah2', dishName: 'Fafda Jalebi', shopName: 'Chandravilas Restaurant', city: 'Ahmedabad', priceRange: '₹', rating: 4.7, cuisine: 'Gujarati', isVeg: true, reviews: 1200, authenticity: 'Authentic', established: 1982, address: 'Lal Darwaza', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },

  // Patna
  { id: 'pa1', dishName: 'Litti Chokha', shopName: 'Litti Chokha Junction', city: 'Patna', priceRange: '₹', rating: 4.6, cuisine: 'Bihari', isVeg: true, reviews: 920, authenticity: 'Authentic', established: 2008, address: 'Ashok Rajpath', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'pa2', dishName: 'Khaja', shopName: 'Hari Om Khaja Bhandar', city: 'Patna', priceRange: '₹', rating: 4.7, cuisine: 'Bihari', isVeg: true, reviews: 750, authenticity: 'Authentic', established: 1975, address: 'Frazer Road', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' }
];

// Reusable Search Bar Component
interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const UnifiedSearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-2xl border-2 border-gray-200 mb-6 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-blue-600" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 transition font-semibold"
          />
        </div>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-bold"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t-2 border-gray-200">
          <input type="text" placeholder="Location" className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold" />
          <input type="date" className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold" />
          <select className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold">
            <option>Price: All</option>
            <option>₹ (Budget)</option>
            <option>₹₹ (Moderate)</option>
            <option>₹₹₹ (Premium)</option>
          </select>
          <select className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold">
            <option>Rating: All</option>
            <option>4.5+</option>
            <option>4.0+</option>
            <option>3.5+</option>
          </select>
        </div>
      )}
    </div>
  );
};

// Professional Transport Card
const TransportCard: React.FC<{ transport: Transport; onBook: (id: string) => void }> = ({ transport, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeIcon = () => {
    const icons: Record<string, string> = {
      bus: '🚌', train: '🚆', flight: '✈️', cab: '🚕', bike: '🏍️'
    };
    return icons[transport.type] || '🚗';
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-400">
      <div className="flex gap-4 p-5">
        <div className="relative">
          <img src={transport.image} alt={transport.type} className="w-24 h-24 object-cover rounded-xl shadow-md" />
          <span className="absolute -top-2 -right-2 text-3xl">{getTypeIcon()}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{transport.company}</p>
              <p className="text-lg font-black text-gray-900">
                {transport.from} <ChevronRight className="w-5 h-5 inline text-orange-600 mx-1" /> {transport.to}
              </p>
              <p className="text-xs text-gray-600 mt-1 font-semibold">⏱️ {transport.duration}</p>
            </div>
            <button onClick={() => setIsFavorite(!isFavorite)} className="text-2xl hover:scale-125 transition">
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg mb-3">
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="text-xs font-bold text-gray-700">{transport.timing}</span>
            </div>
            <div className="text-center">
              <DollarSign className="w-4 h-4 mx-auto text-green-600 mb-1" />
              <span className="text-xs font-bold text-green-600">₹{transport.price}</span>
            </div>
            <div className="text-center">
              <Users className="w-4 h-4 mx-auto text-purple-600 mb-1" />
              <span className="text-xs font-bold text-gray-700">{transport.availability} seats</span>
            </div>
            <div className="text-center">
              <Star className="w-4 h-4 mx-auto text-yellow-500 fill-yellow-500 mb-1" />
              <span className="text-xs font-bold text-gray-700">{transport.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {transport.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
                {amenity}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${transport.availability > 5 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {transport.availability > 5 ? '✅ High Availability' : '⚠️ Limited Seats'}
            </span>
            <button onClick={() => onBook(transport.id)} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg text-xs font-bold transition-all transform hover:scale-105">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Stay Card
const StayCard: React.FC<{ stay: Stay; onBook: (id: string) => void }> = ({ stay, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      hotel: '🏨 Hotel',
      resort: '🏖️ Resort',
      homestay: '🏠 Homestay',
      budget: '💰 Budget',
      luxury: '✨ Luxury'
    };
    return labels[stay.type] || 'Stay';
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-green-400">
      <div className="relative h-48 bg-gray-300 group">
        <img src={stay.images[currentImageIndex]} alt={stay.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-3 right-3 text-2xl hover:scale-125 transition bg-white/90 backdrop-blur rounded-full p-2 shadow-lg">
          {isFavorite ? '❤️' : '🤍'}
        </button>
        {stay.images.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex gap-1">
            {stay.images.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-2 flex-1 rounded-full transition ${idx === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur text-xs font-bold text-gray-800 rounded-full">
          {getTypeLabel()}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-black text-lg text-gray-900">{stay.name}</h3>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {stay.location}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-sm">{stay.rating}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{stay.reviews} reviews</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg mb-3 border-2 border-green-200">
          <p className="text-xs text-gray-700 mb-1 font-bold">✅ Check-in: {stay.checkIn} | Check-out: {stay.checkOut}</p>
          <p className="text-xs text-green-700 font-bold">{stay.cancellation}</p>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-700 mb-2 font-bold">Facilities:</p>
          <div className="flex flex-wrap gap-1">
            {stay.facilities.slice(0, 4).map((facility, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
                {facility}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-gray-200 pt-3">
          <p className="text-2xl font-black text-green-600">₹{stay.price} <span className="text-xs text-gray-600 font-bold">/night</span></p>
          <button onClick={() => onBook(stay.id)} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg text-xs font-bold transition-all transform hover:scale-105">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Professional Local Food Card with Shop Info
const LocalFoodCard: React.FC<{ food: LocalFood; onBook: (id: string) => void }> = ({ food, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getAuthenticityColor = () => {
    const colors: Record<string, string> = {
      'Authentic': 'bg-amber-100 text-amber-800',
      'Modern': 'bg-blue-100 text-blue-800',
      'Fusion': 'bg-purple-100 text-purple-800'
    };
    return colors[food.authenticity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-orange-400">
      <div className="relative h-56 bg-gray-300 group">
        <img src={food.image} alt={food.dishName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all"></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onBook(food.id)} className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-50 shadow-lg">
            Visit & Order
          </button>
        </div>

        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getAuthenticityColor()}`}>
            🏛️ {food.authenticity}
          </span>
          <button onClick={() => setIsFavorite(!isFavorite)} className="text-2xl hover:scale-125 transition">
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <span className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`}>
          {food.isVeg ? '🌱 Vegetarian' : '🍖 Non-Veg'}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm font-black text-gray-900">{food.dishName}</p>
          <p className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
            <MapPinned className="w-4 h-4" />
            {food.shopName}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-orange-50 to-amber-50 p-2 rounded-lg mb-3 border-2 border-orange-200">
          <div className="text-center">
            <Star className="w-4 h-4 mx-auto text-yellow-500 fill-yellow-500 mb-1" />
            <span className="text-xs font-bold text-gray-700">{food.rating}</span>
          </div>
          <div className="text-center">
            <Users className="w-4 h-4 mx-auto text-purple-600 mb-1" />
            <span className="text-xs font-bold text-gray-700">{food.reviews}</span>
          </div>
          <div className="text-center">
            <DollarSign className="w-4 h-4 mx-auto text-green-600 mb-1" />
            <span className="text-xs font-bold text-green-600">{food.priceRange}</span>
          </div>
        </div>

        <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border-2 border-blue-200">
          <p className="text-xs font-bold text-gray-800">
            {food.established && `✨ Established ${food.established}`}
          </p>
        </div>

        {food.address && (
          <div className="text-xs text-gray-600 mb-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{food.address}</span>
          </div>
        )}

        <button onClick={() => onBook(food.id)} className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2 rounded-lg hover:shadow-lg text-xs font-bold transition-all transform hover:scale-105">
          🗺️ View on Map & Order
        </button>
      </div>
    </div>
  );
};

// Main Component
const TravelEssentials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transport' | 'stay' | 'food'>('food');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredFood, setFilteredFood] = useState<LocalFood[]>(localFoodDatabase);

  const cities = [...new Set(localFoodDatabase.map(f => f.city))].sort();

  useEffect(() => {
    if (activeTab === 'food') {
      setFilteredFood(localFoodDatabase);
      if (selectedCity) {
        setFilteredFood(localFoodDatabase.filter(f => f.city === selectedCity));
      }
    }
  }, [activeTab, selectedCity]);

  const handleSearch = (query: string) => {
    if (activeTab === 'food') {
      const results = localFoodDatabase.filter(f =>
        f.dishName.toLowerCase().includes(query.toLowerCase()) ||
        f.shopName.toLowerCase().includes(query.toLowerCase()) ||
        f.city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFood(results);
    }
  };

  const handleBook = (id: string) => {
    alert(`Booking initiated for ${activeTab} item: ${id}`);
  };

  // Sample data for Transport and Stay
  const sampleTransport: Transport[] = [
    { id: '1', type: 'bus', from: 'Delhi', to: 'Agra', price: 500, timing: '06:00 AM', availability: 12, duration: '4 hours', rating: 4.5, image: 'https://images.unsplash.com/photo-1464219414232-588def7b9b12?w=300', company: 'RedBus Express', amenities: ['WiFi', 'AC', 'USB Charging'], operatorRating: 4.6 },
    { id: '2', type: 'train', from: 'Delhi', to: 'Jaipur', price: 450, timing: '08:30 AM', availability: 25, duration: '5 hours', rating: 4.7, image: 'https://images.unsplash.com/photo-1570125909519-c90900bc6012?w=300', company: 'Indian Railways', amenities: ['Meals', 'Bedding', 'Toilet'], operatorRating: 4.8 },
    { id: '3', type: 'flight', from: 'Delhi', to: 'Mumbai', price: 3500, timing: '10:00 AM', availability: 8, duration: '2 hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1552886290-24a98155ffed?w=300', company: 'Air India', amenities: ['Meals', 'Entertainment', 'WiFi'], operatorRating: 4.9 }
  ];

  const sampleStay: Stay[] = [
    { id: '1', name: 'The Grand Palace Hotel', type: 'hotel', price: 3500, rating: 4.6, facilities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'], location: 'Jaipur', city: 'Jaipur', reviews: 328, cancellation: 'Free cancellation till 48 hrs', checkIn: '2:00 PM', checkOut: '12:00 PM' },
    { id: '2', name: 'Mountain View Resort', type: 'resort', price: 5000, rating: 4.8, facilities: ['Pool', 'Spa', 'Yoga', 'WiFi', 'Restaurant'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'], location: 'Himachal Pradesh', city: 'Shimla', reviews: 542, cancellation: 'Free cancellation till 72 hrs', checkIn: '1:00 PM', checkOut: '11:00 AM' },
    { id: '3', name: 'Cozy Homestay', type: 'homestay', price: 1200, rating: 4.4, facilities: ['WiFi', 'Kitchen', 'Parking', 'AC'], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'], location: 'Varanasi', city: 'Varanasi', reviews: 156, cancellation: 'Free cancellation till 24 hrs', checkIn: '3:00 PM', checkOut: '1:00 PM' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-black mb-2 drop-shadow-lg">🌍 Travel Essentials</h1>
          <p className="text-xl text-indigo-100 flex items-center gap-2 font-bold">
            <Award className="w-6 h-6" />
            Everything you need - Transport, Stay & Authentic Local Food
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mt-8 px-4 mb-8">
        <div className="flex gap-2 bg-white p-3 rounded-2xl shadow-lg border-2 border-gray-200">
          {[
            { id: 'transport', label: '🚗 Transport', color: 'text-blue-600 border-blue-600 shadow-blue-200' },
            { id: 'stay', label: '🏨 Stay', color: 'text-green-600 border-green-600 shadow-green-200' },
            { id: 'food', label: '🍽️ Authentic Food', color: 'text-orange-600 border-orange-600 shadow-orange-200' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-3 font-black border-b-4 transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? `${tab.color} bg-gradient-to-br from-white to-gray-50 shadow-xl`
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Transport Tab */}
        {activeTab === 'transport' && (
          <div>
            <UnifiedSearchBar
              placeholder="Search from, to, or transport type..."
              onSearch={handleSearch}
            />
            <div className="space-y-5">
              {sampleTransport.map(transport => (
                <TransportCard key={transport.id} transport={transport} onBook={handleBook} />
              ))}
            </div>
          </div>
        )}

        {/* Stay Tab */}
        {activeTab === 'stay' && (
          <div>
            <UnifiedSearchBar
              placeholder="Search location, hotel name, or city..."
              onSearch={handleSearch}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleStay.map(stay => (
                <StayCard key={stay.id} stay={stay} onBook={handleBook} />
              ))}
            </div>
          </div>
        )}

        {/* Food Tab - With City Selection */}
        {activeTab === 'food' && (
          <div>
            <UnifiedSearchBar
              placeholder="Search dish name, shop, or city..."
              onSearch={handleSearch}
            />

            {/* City Filter */}
            <div className="mb-6">
              <p className="font-black text-gray-900 mb-3 text-lg">📍 Browse by City:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <button
                  onClick={() => setSelectedCity('')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                    selectedCity === '' ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg' : 'bg-white border-2 border-gray-300 text-gray-800 hover:border-orange-500'
                  }`}
                >
                  All Cities
                </button>
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                      selectedCity === city ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg' : 'bg-white border-2 border-gray-300 text-gray-800 hover:border-orange-500'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFood.length > 0 ? (
                filteredFood.map(food => (
                  <LocalFoodCard key={food.id} food={food} onBook={handleBook} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg font-bold">No food options found for "{selectedCity}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-black mb-2">Authentic Experiences</h3>
            <p className="text-indigo-100 font-semibold">Verified local shops & authentic cuisine from across India</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="text-xl font-black mb-2">Top Rated</h3>
            <p className="text-indigo-100 font-semibold">All options verified and rated by real travelers</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-xl font-black mb-2">Instant Booking</h3>
            <p className="text-indigo-100 font-semibold">Quick & hassle-free booking with 24/7 support</p>
          </div>
        </div>
      </div>

      {/* Heritage Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12 mb-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🏛️</span>
            <h3 className="text-2xl font-black text-gray-900">Experience India's Heritage & Culture</h3>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed font-semibold">
            DarShana celebrates India's rich culinary heritage by connecting travelers with authentic local shops and dishes that have been perfected over generations. When you dine at these establishments, you're supporting local vendors, preserving cultural traditions, and experiencing genuine Indian hospitality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelEssentials;