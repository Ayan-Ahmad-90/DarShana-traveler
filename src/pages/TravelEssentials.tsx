import axios from 'axios';
import { AlertCircle, ChevronRight, Clock, DollarSign, Filter, MapPin, Search, Star, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  reviews: number;
  cancellation: string;
  checkIn: string;
  checkOut: string;
}

interface Food {
  id: string;
  name: string;
  type: 'restaurant' | 'streetfood' | 'cuisine' | 'dish';
  priceRange: string;
  rating: number;
  cuisine: string;
  location: string;
  recommendedItems: string[];
  image: string;
  isVeg: boolean;
  reviews: number;
  deliveryTime: string;
  established?: string;
}

// Enhanced Transport Card Component
const TransportCard: React.FC<{ transport: Transport; onBook: (id: string) => void }> = ({ transport, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeColor = () => {
    const colors: Record<string, string> = {
      bus: 'from-blue-50 to-blue-100 border-blue-200',
      train: 'from-green-50 to-green-100 border-green-200',
      flight: 'from-purple-50 to-purple-100 border-purple-200',
      cab: 'from-yellow-50 to-yellow-100 border-yellow-200',
      bike: 'from-orange-50 to-orange-100 border-orange-200'
    };
    return colors[transport.type] || 'from-gray-50 to-gray-100 border-gray-200';
  };

  const getTypeIcon = () => {
    const icons: Record<string, string> = {
      bus: '🚌',
      train: '🚆',
      flight: '✈️',
      cab: '🚕',
      bike: '🏍️'
    };
    return icons[transport.type] || '🚗';
  };

  return (
    <div className={`bg-gradient-to-br ${getTypeColor()} border-2 rounded-xl p-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex gap-4">
        <div className="relative">
          <img src={transport.image} alt={transport.type} className="w-28 h-28 object-cover rounded-lg shadow-md" />
          <span className="absolute -top-2 -right-2 text-3xl">{getTypeIcon()}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">{transport.company}</p>
              <p className="text-lg font-bold text-gray-800">
                <span className="font-extrabold">{transport.from}</span> 
                <ChevronRight className="w-5 h-5 inline text-orange-600" />
                <span className="font-extrabold">{transport.to}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">{transport.duration}</p>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-2xl hover:scale-125 transition"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3 text-sm bg-white/60 p-2 rounded-lg">
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="text-gray-700 font-semibold block text-xs">{transport.timing}</span>
            </div>
            <div className="text-center">
              <DollarSign className="w-4 h-4 mx-auto text-green-600 mb-1" />
              <span className="text-green-600 font-bold block text-xs">₹{transport.price}</span>
            </div>
            <div className="text-center">
              <Users className="w-4 h-4 mx-auto text-purple-600 mb-1" />
              <span className="text-gray-700 font-semibold block text-xs">{transport.availability} seats</span>
            </div>
            <div className="text-center">
              <Star className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
              <span className="text-gray-700 font-semibold block text-xs">{transport.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {transport.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-semibold">
                {amenity}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className={`text-xs font-bold px-2 py-1 rounded ${transport.availability > 5 ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                {transport.availability > 5 ? 'High Availability' : 'Limited Seats'}
              </span>
            </div>
            <button 
              onClick={() => onBook(transport.id)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg text-sm font-bold transition-all transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stay Card Component
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
    <div className="border-2 border-gray-300 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      <div className="relative h-56 bg-gray-200 group">
        <img
          src={stay.images[currentImageIndex]}
          alt={stay.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 text-2xl hover:scale-125 transition bg-white/90 backdrop-blur rounded-full p-2 shadow-lg"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {stay.images.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex gap-1">
            {stay.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 flex-1 rounded-full transition ${idx === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/50'}`}
              />
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
            <h3 className="font-bold text-lg text-gray-900">{stay.name}</h3>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {stay.location}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end bg-yellow-100 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-sm">{stay.rating}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{stay.reviews} reviews</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <div className="text-xs text-gray-600 mb-2 font-semibold">Check-in: {stay.checkIn} | Check-out: {stay.checkOut}</div>
          <div className="text-xs text-green-700 font-semibold">{stay.cancellation}</div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Facilities:</p>
          <div className="flex flex-wrap gap-2">
            {stay.facilities.map((facility, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                {facility}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-2xl font-bold text-green-600">₹{stay.price} <span className="text-xs text-gray-600 font-normal">/night</span></p>
          <button 
            onClick={() => onBook(stay.id)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg text-sm font-bold transition-all transform hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Food Card Component
const FoodCard: React.FC<{ food: Food; onBook: (id: string) => void }> = ({ food, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeIcon = () => {
    const icons: Record<string, string> = {
      restaurant: '🍽️',
      streetfood: '🍢',
      cuisine: '🌮',
      dish: '🍜'
    };
    return icons[food.type] || '🍽️';
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      <div className="relative h-48 bg-gray-200 group">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onBook(food.id)}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-50 shadow-lg"
          >
            Order Now
          </button>
        </div>

        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className="text-3xl">{getTypeIcon()}</span>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-2xl hover:scale-125 transition"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <span className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`}>
          {food.isVeg ? '🌱 Vegetarian' : '🍖 Non-Veg'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{food.name}</h3>
            <p className="text-sm text-gray-600">{food.cuisine}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-sm">{food.rating}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{food.reviews} reviews</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {food.location}
        </p>

        <div className="bg-blue-50 p-2 rounded-lg mb-3">
          <p className="text-xs text-gray-700 font-semibold">
            🔥 Must Try: {food.recommendedItems.slice(0, 2).join(', ')}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">{food.priceRange}</span>
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
            ⏱️ {food.deliveryTime}
          </span>
        </div>

        <button 
          onClick={() => onBook(food.id)}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2 rounded-lg hover:shadow-lg text-sm font-bold transition-all transform hover:scale-105"
        >
          View Menu
        </button>
      </div>
    </div>
  );
};

// Advanced Filter Component
const FilterBar: React.FC<{
  activeTab: 'transport' | 'stay' | 'food';
  onFilterChange: (filters: any) => void;
  onSearch: (query: string) => void;
}> = ({ activeTab, onFilterChange, onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 p-5 rounded-xl border-2 border-gray-200 mb-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder={activeTab === 'transport' ? 'Search from, to, company...' : activeTab === 'stay' ? 'Search location, hotel name...' : 'Search restaurant, cuisine...'}
            className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-blue-600 font-bold ml-4 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? 'Hide' : 'Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 border-t-2 border-gray-200">
          {activeTab === 'transport' && (
            <>
              <input type="text" placeholder="From" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="To" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>All Transport</option>
                <option>Bus</option>
                <option>Train</option>
                <option>Flight</option>
                <option>Cab</option>
              </select>
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>Price: All</option>
                <option>₹ (0-500)</option>
                <option>₹₹ (500-2000)</option>
                <option>₹₹₹ (2000+)</option>
              </select>
            </>
          )}

          {activeTab === 'stay' && (
            <>
              <input type="text" placeholder="Location" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Check-in" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Check-out" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>All Types</option>
                <option>Hotel</option>
                <option>Resort</option>
                <option>Homestay</option>
              </select>
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>Rating: All</option>
                <option>4.5+</option>
                <option>4.0+</option>
                <option>3.5+</option>
              </select>
            </>
          )}

          {activeTab === 'food' && (
            <>
              <input type="text" placeholder="Location" className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>All Cuisines</option>
                <option>Indian</option>
                <option>Chinese</option>
                <option>Continental</option>
                <option>Street Food</option>
                <option>South Indian</option>
              </select>
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>All Types</option>
                <option>Veg</option>
                <option>Non-Veg</option>
              </select>
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>Price Range</option>
                <option>₹ (Budget)</option>
                <option>₹₹ (Moderate)</option>
                <option>₹₹₹ (Premium)</option>
              </select>
              <select className="border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option>Rating: All</option>
                <option>4.5+</option>
                <option>4.0+</option>
                <option>3.5+</option>
              </select>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Main Travel Essentials Page
const TravelEssentials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transport' | 'stay' | 'food'>('transport');
  const [transportData, setTransportData] = useState<Transport[]>([]);
  const [stayData, setStayData] = useState<Stay[]>([]);
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'transport') {
        const response = await axios.get(`${API_URL}/api/transport`, { timeout: 5000 }).catch(() => null);
        setTransportData(response?.data || sampleTransportData);
      } else if (activeTab === 'stay') {
        const response = await axios.get(`${API_URL}/api/stays`, { timeout: 5000 }).catch(() => null);
        setStayData(response?.data || sampleStayData);
      } else if (activeTab === 'food') {
        const response = await axios.get(`${API_URL}/api/food`, { timeout: 5000 }).catch(() => null);
        setFoodData(response?.data || sampleFoodData);
      }
    } catch (err) {
      setError('Failed to load data. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (id: string) => {
    alert(`Booking initiated for ${activeTab} item: ${id}`);
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  // Sample data
  const sampleTransportData: Transport[] = [
    {
      id: '1',
      type: 'bus',
      from: 'Delhi',
      to: 'Agra',
      price: 500,
      timing: '06:00 AM',
      availability: 12,
      duration: '4 hours',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1464219414232-588def7b9b12?w=300',
      company: 'RedBus Express',
      amenities: ['WiFi', 'AC', 'USB Charging'],
      operatorRating: 4.6
    },
    {
      id: '2',
      type: 'train',
      from: 'Delhi',
      to: 'Jaipur',
      price: 450,
      timing: '08:30 AM',
      availability: 25,
      duration: '5 hours',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1570125909519-c90900bc6012?w=300',
      company: 'Indian Railways',
      amenities: ['Meals', 'Bedding', 'Toilet'],
      operatorRating: 4.8
    },
    {
      id: '3',
      type: 'flight',
      from: 'Delhi',
      to: 'Mumbai',
      price: 3500,
      timing: '10:00 AM',
      availability: 8,
      duration: '2 hours',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1552886290-24a98155ffed?w=300',
      company: 'Air India',
      amenities: ['Meals', 'Entertainment', 'WiFi'],
      operatorRating: 4.9
    },
  ];

  const sampleStayData: Stay[] = [
    {
      id: '1',
      name: 'The Grand Palace Hotel',
      type: 'hotel',
      price: 3500,
      rating: 4.6,
      facilities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'],
      location: 'Jaipur',
      reviews: 328,
      cancellation: 'Free cancellation till 48 hrs',
      checkIn: '2:00 PM',
      checkOut: '12:00 PM'
    },
    {
      id: '2',
      name: 'Mountain View Resort',
      type: 'resort',
      price: 5000,
      rating: 4.8,
      facilities: ['Pool', 'Spa', 'Yoga', 'WiFi', 'Restaurant'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'],
      location: 'Himachal Pradesh',
      reviews: 542,
      cancellation: 'Free cancellation till 72 hrs',
      checkIn: '1:00 PM',
      checkOut: '11:00 AM'
    },
    {
      id: '3',
      name: 'Cozy Homestay',
      type: 'homestay',
      price: 1200,
      rating: 4.4,
      facilities: ['WiFi', 'Kitchen', 'Parking', 'AC'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'],
      location: 'Varanasi',
      reviews: 156,
      cancellation: 'Free cancellation till 24 hrs',
      checkIn: '3:00 PM',
      checkOut: '1:00 PM'
    },
  ];

  const sampleFoodData: Food[] = [
    {
      id: '1',
      name: 'Agra Petha House',
      type: 'restaurant',
      priceRange: '₹₹',
      rating: 4.7,
      cuisine: 'North Indian',
      location: 'Agra',
      recommendedItems: ['Petha', 'Biryani', 'Kulfi'],
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
      isVeg: true,
      reviews: 234,
      deliveryTime: '30-40 mins',
      established: '2010'
    },
    {
      id: '2',
      name: 'Street Food Corner',
      type: 'streetfood',
      priceRange: '₹',
      rating: 4.5,
      cuisine: 'Indian Street Food',
      location: 'Jaipur',
      recommendedItems: ['Chaat', 'Samosa', 'Jalebi'],
      image: 'https://images.unsplash.com/photo-1603043283882-f0c63bae66f3?w=300',
      isVeg: true,
      reviews: 189,
      deliveryTime: '15-20 mins'
    },
    {
      id: '3',
      name: 'The Mughal Kitchen',
      type: 'restaurant',
      priceRange: '₹₹₹',
      rating: 4.8,
      cuisine: 'Mughlai',
      location: 'Delhi',
      recommendedItems: ['Butter Chicken', 'Biryani', 'Naan'],
      image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300',
      isVeg: false,
      reviews: 521,
      deliveryTime: '35-45 mins',
      established: '2005'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-black mb-2 drop-shadow-lg">🌍 Travel Essentials</h1>
          <p className="text-xl text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Everything you need for your perfect journey - Transport, Stay & Food
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex gap-2 mb-6 border-b-4 border-gray-300 bg-white p-2 rounded-xl shadow-md">
          {[
            { id: 'transport', label: '🚗 Transport', color: 'text-blue-600 border-blue-600' },
            { id: 'stay', label: '🏨 Stay', color: 'text-green-600 border-green-600' },
            { id: 'food', label: '🍽️ Food & Dining', color: 'text-orange-600 border-orange-600' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold border-b-4 transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? `${tab.color} shadow-lg`
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar activeTab={activeTab} onFilterChange={() => {}} onSearch={handleSearch} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4 font-semibold">Loading options...</p>
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          {!loading && activeTab === 'transport' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl font-black text-gray-800">Book Your Transport</h2>
              </div>
              <div className="space-y-5">
                {transportData.length > 0 ? (
                  transportData.map(transport => (
                    <TransportCard key={transport.id} transport={transport} onBook={handleBook} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No transport options available</p>
                )}
              </div>
            </div>
          )}

          {!loading && activeTab === 'stay' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h2 className="text-3xl font-black text-gray-800">Find Your Perfect Stay</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stayData.length > 0 ? (
                  stayData.map(stay => (
                    <StayCard key={stay.id} stay={stay} onBook={handleBook} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8 col-span-full">No stay options available</p>
                )}
              </div>
            </div>
          )}

          {!loading && activeTab === 'food' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h2 className="text-3xl font-black text-gray-800">Discover Local Food & Restaurants</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodData.length > 0 ? (
                  foodData.map(food => (
                    <FoodCard key={food.id} food={food} onBook={handleBook} />
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8 col-span-full">No food options available</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-2">Best Prices Guaranteed</h3>
            <p className="text-blue-100">Get the best deals on transport, stays, and food across India</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-2">Top Rated Options</h3>
            <p className="text-green-100">All options verified and rated by real travelers like you</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
            <p className="text-orange-100">Quick & hassle-free booking with 24/7 customer support</p>
          </div>
        </div>

        {/* Heritage & Sustainability Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-200 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏛️</span>
            <h3 className="text-2xl font-black text-gray-900">Experience India's Heritage & Culture</h3>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            DarShana is committed to promoting Indian heritage, local culture, and sustainable tourism. When you book through us, you're supporting local vendors, guides, and businesses across India.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-2xl mb-2">🏛️</p>
              <p className="font-bold text-gray-900">Heritage First</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-2xl mb-2">🍜</p>
              <p className="font-bold text-gray-900">Local Food</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-2xl mb-2">♻️</p>
              <p className="font-bold text-gray-900">Eco-Friendly</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-2xl mb-2">🇮🇳</p>
              <p className="font-bold text-gray-900">Made for India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelEssentials;
